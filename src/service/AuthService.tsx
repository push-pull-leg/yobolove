import dayjs from "dayjs";
import jwtDecode from "jwt-decode";
import { sha512 } from "crypto-hash";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Cookies from "universal-cookie";
import UserType from "../type/UserType";
import JwtAccessTokenDataInterface from "../interface/JwtAccessTokenDataInterface";
import JwtRefreshTokenDataInterface from "../interface/JwtRefreshTokenDataInterface";
import HttpUtil from "../util/HttpUtil";
import EndpointEnum from "../enum/EndpointEnum";
import ResponseInterface from "../interface/response/ResponseInterface";
import SessionInterface from "../interface/SessionInterface";
import ServerEndpointEnum from "../enum/ServerEndpointEnum";

dayjs.locale("ko");
dayjs.extend(utc);
dayjs.extend(timezone);

const cookies = new Cookies();
const REFRESH_TOKEN_COOKIE_NAME_POSTFIX = "_REFRESH_TOKEN";
const CREDENTIALS_COOKIE_NAME_POSTFIX = "_CREDENTIALS";

/**
 * Client-Side 인증 관련 서비스.
 * JWT 토큰 관련된 서비스로, 로그인, 로그아웃, 토큰관리등의 기능을 한다.
 * @category Service
 */
abstract class AuthService {
    /**
     * 인증이 필요한 UserType
     * @private
     */
    private readonly userType: UserType = "CAREGIVER";

    /**
     * 리프레시 쿠키 토큰 명. {@link userType}+"_"+{@link REFRESH_TOKEN_COOKIE_NAME_POSTFIX} 형태로 이루어진다.
     * @private
     */
    private readonly refreshTokenCookieName: string;

    /**
     * 검증 쿠키 토큰 명. {@link userType}+"_"+{@link CREDENTIALS_COOKIE_NAME_POSTFIX} 형태로 이루어진다.
     * @private
     */
    private readonly credentialsCookieName: string;

    /**
     * 리프레시 토큰발급받는 EndpointEnum.
     * @private
     */
    private readonly refreshEndpointEnum: EndpointEnum;

    /**
     * access 토큰
     * @private
     */
    private accessToken?: string;

    /**
     * access token parsing 데이터
     * @private
     */
    private accessTokenData?: JwtAccessTokenDataInterface;

    /**
     * 리프레시 토큰
     * @private
     */
    private refreshToken?: string;

    /**
     * 리프레시 토큰 파싱 데이터
     * @private
     */
    private refreshTokenData?: JwtRefreshTokenDataInterface;

    /**
     * access token 만료 몇 초전에 다시 refresh 할건지 결정
     * @private
     */
    private beforeExpiredRefreshSeconds: number = 600;

    /**
     * 로그인 시점기준으로 refresh 할 최소 시간(seconds). 너무 짧으면 무한루프를 돌면서 로그인 시도를 하게됨.
     * @private
     */
    private minimumRefreshSeconds: number = 60;

    /**
     * 로그인 재시도할 timer 정보
     * @private
     */
    private timer: NodeJS.Timeout | undefined;

    /**
     * abstract class 이기 때문에, 상속받은 자식 class 에서만 선언할 수 있도록 protected 제한.
     * readonly member properties 를 설정하고 리프레시 토큰이 쿠키에 저장되어있으므로 쿠키에서 초기화 함.
     * @param userType 유저타입
     * @param refreshEndpointEnum 리프레시토큰 재발급 주소
     * @protected
     * @constructor
     */
    protected constructor(userType: UserType, refreshEndpointEnum: EndpointEnum) {
        this.userType = userType;
        this.refreshTokenCookieName = this.userType + REFRESH_TOKEN_COOKIE_NAME_POSTFIX;
        this.credentialsCookieName = this.userType + CREDENTIALS_COOKIE_NAME_POSTFIX;
        this.refreshEndpointEnum = refreshEndpointEnum;

        this.updateRefreshToken = this.updateRefreshToken.bind(this);
        this.setRefreshToken(cookies.get(this.refreshTokenCookieName));
    }

    /**
     * access token 가져오기
     */
    public getAccessToken(): string | undefined {
        return this.accessToken;
    }

    /**
     * 로그인시도. accessToken 및 refreshToken 으로 로그인시도함.
     * [JWT 작동원리](https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-Access-Token-Refresh-Token-%EC%9B%90%EB%A6%AC-feat-JWT)
     * access token 은 필수적으로 존재해야하지만 refresh token 은 없어도 로그인 가능. 다만 이후에 만료시간이 지나면 로그인 풀림.
     * currentHasDesiredWork 는 현재 희망근무조건을 설정했는지 여부인데, 구직자용 서비스에서만 쓰이며, 유일하게 로그인시에 토큰정보에 없으면서 로그인 한 순간 필요한 정보이기 때문에 따로 설정.
     * 추후에 로그인시 바로 가져와야되는 정보가 추가되면 interface 로 구성해서 object 형태로 묶어주는게 좋음.
     *
     * access token 을 내부 멤버 변수로 저장하고, 리프레시 토큰도 마찬가지로 멤버 내부변수로 저장한다.
     * 새로운 로그인 시도일때는 saveSession 을 통해 서버사이드에도 저장해둔다.
     *
     * 이후에는 타이머를 걸어서 로그인 토큰을 리프레시해주는 로직
     * #### 1. 토큰 데이터가 없으면 종료
     * #### 2. 토큰 재발급일경우(새로운로그인이 아니고, 타이머가 예약되어 있을 경우) 기존 토큰 데이터를 return 하면서 종료.
     * #### 3. 타이머가 이미 예약이 걸링경우, 해당 타이머를 clear
     * #### 4. 만료 {@link beforeExpiredRefreshSeconds} 초 전, 현재시간 보다 최소 {@link minimumRefreshSeconds} 후에 리프레시 토큰을 요청
     *
     * @param accessToken
     * @param refreshToken
     * @param currentHasDesiredWork 현재 희망근무조건을 설정했는지 여부(구직자용)
     */
    public async login(accessToken: string, refreshToken?: string | null, currentHasDesiredWork?: boolean): Promise<JwtAccessTokenDataInterface | undefined> {
        let isNewLogin = false;
        if (!this.accessToken || this.accessToken !== accessToken) {
            isNewLogin = true;
        }

        await this.setAccessToken(accessToken);

        if (refreshToken) this.setRefreshToken(refreshToken);

        if (isNewLogin) await this.saveSession(accessToken, refreshToken, currentHasDesiredWork);

        if (!this.accessTokenData || !this.accessTokenData.exp || !this.refreshToken) return undefined;

        if (!isNewLogin && this.timer) return this.accessTokenData;

        if (this.timer) clearTimeout(this.timer);

        const nowTimestamp = dayjs().unix();
        const expiredTimestamp = this.accessTokenData.exp;
        const remainTimestamp = expiredTimestamp - nowTimestamp;
        const afterTimestamp = Math.max(remainTimestamp - this.beforeExpiredRefreshSeconds, this.minimumRefreshSeconds);

        this.timer = setTimeout(async () => this.updateRefreshToken(), afterTimestamp * 1000);

        return this.accessTokenData;
    }

    /**
     * 로그아웃. logout Http 요청을 한후 accessToken, accessTokenData 및 쿠키 데이터하고, session 을 destroy 함.
     */
    public async logout(): Promise<void> {
        try {
            await HttpUtil.request(this.userType === "CAREGIVER" ? EndpointEnum.POST_CAREGIVER_LOGOUT : EndpointEnum.POST_CENTER_LOGOUT, {}, this.getHeaders());
            // eslint-disable-next-line no-empty
        } catch (e) {}

        this.accessToken = undefined;
        this.accessTokenData = undefined;
        if (this.refreshToken) {
            this.refreshToken = undefined;
        }
        cookies.remove(this.refreshTokenCookieName, { path: "/" });
        cookies.remove(this.credentialsCookieName, { path: "/" });
        if (this.timer) clearTimeout(this.timer);
        await this.destroySession();
    }

    /**
     * 로그인이 되어있으면 Authorization 이 포함된 헤더정보 return
     */
    public getHeaders(): object {
        return this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {};
    }

    /**
     * 세션정보 그대로 저장. 현재 토큰 인증은 Server Side / Client Side 2가지로 존재함.
     * Server Side 는 초기 접속때 해당 정보가 있는지 확인해서 정보있으면 Client Side 로 Session 정보를 넘기고 해당 정보로 Client Side 에서 로그인하기 때문에 Client side 정보가 가장 원천 정보임.
     * 다만, client side 에서 로그인 할 경우, 이후에 페이지 이동시 server side 에서는 로그인 정보가 없기 때문에 따로 로그인을 시켜줌
     * 추후 server side 에서만 로그인 정보를 저장하는 로직이 필요 할 듯함.
     * @param accessToken
     * @param refreshToken
     * @param hasDesiredWork
     * @private
     */
    private async saveSession(accessToken: string, refreshToken?: string | null, hasDesiredWork?: boolean) {
        if (typeof window === "undefined" || !this.accessTokenData) return;

        let session: SessionInterface;
        let serverEndpoint: ServerEndpointEnum;
        if (this.userType === "CAREGIVER") {
            session = {
                accessToken,
                refreshToken,
                exp: this.accessTokenData?.exp || 0,
                accessTokenData: this.accessTokenData,
                hasDesiredWork,
            };
            serverEndpoint = ServerEndpointEnum.POST_CAREGIVER_LOGIN;
        } else {
            session = {
                accessToken,
                refreshToken,
                exp: this.accessTokenData?.exp || 0,
                accessTokenData: this.accessTokenData,
            };
            serverEndpoint = ServerEndpointEnum.POST_CENTER_LOGIN;
        }
        await HttpUtil.serverRequest(serverEndpoint, JSON.stringify(session));
    }

    /**
     * 로그아웃
     * @private
     */
    private async destroySession() {
        await HttpUtil.serverRequest(this.userType === "CAREGIVER" ? ServerEndpointEnum.DELETE_CAREGIVER_LOGOUT : ServerEndpointEnum.DELETE_CENTER_LOGOUT);
    }

    /**
     * 리프레시 토큰 저장. 만료시간을 계산해서 해당 만료시간을 기점으로 쿠키로 저장함.
     * @param refreshToken
     * @private
     */
    private setRefreshToken(refreshToken: string | undefined): void {
        if (!refreshToken) {
            this.refreshToken = undefined;
            return;
        }
        this.refreshToken = refreshToken;
        this.refreshTokenData = jwtDecode(this.refreshToken);
        const expiredDate: Date = dayjs(this.refreshTokenData.exp * 1000)
            .tz("Asia/Seoul")
            .local()
            .toDate();
        cookies.set(this.refreshTokenCookieName, this.refreshToken, { expires: expiredDate, path: "/" });
    }

    /**
     * access token 저장. access token 의경우, 보안문제로 쿠키에 직접저장하진 않음. 다만 server side 에 해당 쿠키정보가 최신 로그인 정보가 맞는지 확인하기 위해 암호화된 access token 값을 저장
     * @param accessToken
     * @private
     */
    private async setAccessToken(accessToken: string | undefined): Promise<void> {
        if (!accessToken) return;
        this.accessToken = accessToken;

        this.accessTokenData = jwtDecode(this.accessToken);

        const encryptedAccessToken = await sha512(accessToken);
        const expiredDate: Date = dayjs(this.accessTokenData.exp * 1000)
            .tz("Asia/Seoul")
            .local()
            .toDate();
        cookies.set(this.credentialsCookieName, encryptedAccessToken, { expires: expiredDate, path: "/" });
    }

    /**
     * 리프레시 토큰 업데이트해주는 함수. 만료시간 쯤에 해당 함수를 요청함.
     * constructor 할 때 설정했던 {@link refreshEndpointEnum} 를 요청함. 이때 헤더는 Authorization 이 아니라 Refresh 라는 항목으로 넘겨주게됨.
     * @private
     */
    private async updateRefreshToken(): Promise<void> {
        clearTimeout(this.timer);
        this.timer = undefined;
        if (!this.accessTokenData || !this.accessTokenData.exp || !this.refreshToken) {
            return;
        }
        // 만료시간이 1시간 이내면 재발급
        try {
            const authRefreshResponse = await HttpUtil.request<ResponseInterface>(
                this.refreshEndpointEnum,
                {},
                {
                    Refresh: `Bearer ${this.refreshToken}`,
                },
            );
            await this.login(authRefreshResponse.data.accessToken, authRefreshResponse.headers?.refresh, true);
            // eslint-disable-next-line no-empty
        } catch (e) {
            this.logout();
        }
    }
}

export default AuthService;
