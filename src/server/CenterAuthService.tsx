import dayjs from "dayjs";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import { AppContext } from "next/app";
import { IncomingMessage, ServerResponse } from "http";
import SessionInterface from "../interface/SessionInterface";
import HttpUtil from "../util/HttpUtil";
import EndpointEnum from "../enum/EndpointEnum";
import JwtAccessTokenDataInterface from "../interface/JwtAccessTokenDataInterface";
import AuthService from "./AuthService";
import PostCenterAuthRefreshResponseInterface from "../interface/response/PostCenterAuthRefreshResponseInterface";

const REFRESH_TOKEN_COOKIE_NAME = "CENTER_REFRESH_TOKEN";
const CREDENTIALS_COOKIE_NAME = "CENTER_CREDENTIALS";
const SESSION_NAME = "YBSR_CENTER_SESSION";

/**
 * Server-Side 기관 인증 관련 서비스
 * @category Service
 * @Center
 */
class CenterAuthService extends AuthService {
    /**
     * 현재 인증되어있는지 확인 > 세션 정보에 기관 관련 세션이 있는지 확인.
     * 리프레시 토큰이 없으면 false
     *
     * @param req http request
     * @param res http response
     */
    public static async isAuthorized(req: IncomingMessage | Request, res: ServerResponse | Response): Promise<{ isAuthorized: boolean; center: SessionInterface | null }> {
        if ("cookie" in req.headers) {
            const cookies = new Cookies(req.headers?.cookie);
            if (!cookies.get(REFRESH_TOKEN_COOKIE_NAME)) {
                return { isAuthorized: false, center: null };
            }
        }
        const session = await this.getSession(req, res, SESSION_NAME);
        const { center } = session;

        return { isAuthorized: Boolean(center), center: center || null };
    }

    /**
     * 로그아웃. 기관 세션정보 삭제
     * @param req http request
     * @param res http response
     */
    public static async logout(req: IncomingMessage, res: ServerResponse): Promise<void> {
        if (!req || !res) return;

        await this.destroySessionData(req, res, SESSION_NAME, "center");
    }

    /**
     * 로그인. 기관 세션정보 저장.
     * @param centerSession 구직자 세션정보
     * @param req http request
     * @param res http response
     */
    public static async login(centerSession: SessionInterface, req: IncomingMessage, res: ServerResponse): Promise<void> {
        if (!req || !res) return;

        await this.storeSessionData(req, res, SESSION_NAME, "center", centerSession);
    }

    /**
     * 인증받은 세션 정보 가져오기
     * 쿠키 정보가 이용가능할 시, needTokenRefresh 를 통해 현재 토큰을 재발급 받아야 한다면 {@link EndpointEnum.POST_CAREGIVER_JWT_REFRESH} 를 통해 토큰을 재발급 받는다.
     * 추가적으로 현재 세션에 있는 만료일자가 현재 시간을 넘겼으면, 삭제한다.
     *
     * @param context
     */
    public static async getAuthorizedSession(context: AppContext): Promise<SessionInterface | undefined> {
        const { ctx } = context;

        if (!ctx.req || !ctx.res) return undefined;

        let center: SessionInterface | undefined;
        const session = await this.getSession(ctx.req, ctx.res, SESSION_NAME);

        center = session.center;
        if (typeof ctx.req.headers.cookie !== "undefined") {
            const cookies = new Cookies(ctx.req.headers.cookie);
            const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE_NAME);
            const credentials = cookies.get(CREDENTIALS_COOKIE_NAME);
            if (await this.needTokenRefresh(center, refreshToken, credentials)) {
                try {
                    const authRefreshResponse = await HttpUtil.request<PostCenterAuthRefreshResponseInterface>(
                        EndpointEnum.POST_CENTER_JWT_REFRESH,
                        {},
                        { Refresh: `Bearer ${refreshToken}` },
                    );
                    if (authRefreshResponse.data) {
                        const accessTokenData: JwtAccessTokenDataInterface = jwtDecode(authRefreshResponse.data.accessToken);
                        center = {
                            accessToken: authRefreshResponse.data.accessToken,
                            refreshToken: authRefreshResponse.headers?.refresh,
                            exp: accessTokenData.exp,
                            accessTokenData,
                        };
                        session.center = center;
                    }
                    // eslint-disable-next-line no-empty
                } catch (e) {}
            } else if (!refreshToken && center) {
                center = undefined;
            }
        }
        if (center && center.exp < dayjs().unix()) {
            session.center = undefined;
            center = undefined;
        }
        await session.save();
        return center;
    }
}

export default CenterAuthService;
