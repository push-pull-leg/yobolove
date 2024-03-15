import dayjs from "dayjs";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import { AppContext } from "next/app";
import { IncomingMessage, ServerResponse } from "http";
import SessionInterface from "../interface/SessionInterface";
import HttpUtil from "../util/HttpUtil";
import PostCaregiverAuthRefreshResponseInterface from "../interface/response/PostCaregiverAuthRefreshResponseInterface";
import EndpointEnum from "../enum/EndpointEnum";
import JwtAccessTokenDataInterface from "../interface/JwtAccessTokenDataInterface";
import PostCaregiverAuthSnsCallbackResponseInterface from "../interface/response/PostCaregiverAuthSnsCallbackResponseInterface";
import PostCaregiverAuthSnsCallbackRequestInterface from "../interface/request/PostCaregiverAuthSnsCallbackRequestInterface";
import AuthService from "./AuthService";
import UtmInterface from "../interface/UtmInterface";

const REFRESH_TOKEN_COOKIE_NAME = "CAREGIVER_REFRESH_TOKEN";
const CREDENTIALS_COOKIE_NAME = "CAREGIVER_CREDENTIALS";
const SESSION_NAME = "YBSR_CAREGIVER_SESSION";

/**
 * Server-Side 구직자 인증 관련 서비스
 * @category Service
 * @Caregiver
 */
class CaregiverAuthService extends AuthService {
    /**
     * 현재 인증되어있는지 확인 > 세션 정보에 구직자 관련 세션이 있는지 확인.
     * 리프레시 토큰이 없으면 false
     *
     * @param req http request
     * @param res http response
     */
    public static async isAuthorized(req: IncomingMessage | Request, res: ServerResponse | Response): Promise<{ isAuthorized: boolean; caregiver: SessionInterface | null }> {
        if ("cookie" in req.headers) {
            const cookies = new Cookies(req.headers?.cookie);
            if (!cookies.get(REFRESH_TOKEN_COOKIE_NAME)) {
                return { isAuthorized: false, caregiver: null };
            }
        }

        const session = await this.getSession(req, res, SESSION_NAME);
        const { caregiver } = session;

        return { isAuthorized: Boolean(caregiver), caregiver: caregiver || null };
    }

    /**
     * 로그아웃. 구직자 세션정보 삭제
     * @param req http request
     * @param res http response
     */
    public static async logout(req: IncomingMessage, res: ServerResponse): Promise<void> {
        if (!req || !res) return;

        await AuthService.destroySessionData(req, res, SESSION_NAME, "caregiver");
    }

    /**
     * 로그인. 구직자 세션정보 저장.
     * @param caregiverSession 구직자 세션정보
     * @param req http request
     * @param res http response
     */
    public static async login(caregiverSession: SessionInterface, req: IncomingMessage, res: ServerResponse): Promise<void> {
        if (!req || !res) return;

        await AuthService.storeSessionData(req, res, SESSION_NAME, "caregiver", caregiverSession);
    }

    /**
     * utm 정보 저장. 카카오톡 로그인 때문에 redirect 에도 저장할 수 있는 session 이용함.
     * @param utm utm 정보
     * @param req http request
     * @param res http response
     */
    public static async setUtm(utm: UtmInterface, req: IncomingMessage, res: ServerResponse): Promise<void> {
        const session = await this.getSession(req, res, SESSION_NAME);
        session.utm = utm;
        await session.save();
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

        if (ctx.req.url?.includes("/oauth/redirect")) {
            return undefined;
        }
        let caregiver: SessionInterface | undefined;
        const session = await this.getSession(ctx.req, ctx.res, SESSION_NAME);

        caregiver = session.caregiver;
        if (typeof ctx.req.headers.cookie !== "undefined") {
            const cookies = new Cookies(ctx.req.headers.cookie);
            const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE_NAME);
            const credentials = cookies.get(CREDENTIALS_COOKIE_NAME);

            if (await this.needTokenRefresh(caregiver, refreshToken, credentials)) {
                try {
                    const authRefreshResponse = await HttpUtil.request<PostCaregiverAuthRefreshResponseInterface>(
                        EndpointEnum.POST_CAREGIVER_JWT_REFRESH,
                        {},
                        { Refresh: `Bearer ${refreshToken}` },
                    );
                    if (authRefreshResponse.data) {
                        const accessTokenData: JwtAccessTokenDataInterface = jwtDecode(authRefreshResponse.data.accessToken);
                        caregiver = {
                            accessToken: authRefreshResponse.data.accessToken,
                            refreshToken: authRefreshResponse.headers?.refresh,
                            exp: accessTokenData.exp,
                            accessTokenData,
                            hasDesiredWork: authRefreshResponse.data.hasDesiredWork,
                        };
                    }
                    // eslint-disable-next-line no-empty
                } catch (e) {}
            } else if (!refreshToken && caregiver) {
                caregiver = undefined;
            } else if (!caregiver?.refreshToken && refreshToken && caregiver) {
                caregiver.refreshToken = refreshToken;
            }
        }
        if (caregiver && caregiver.exp < dayjs().unix()) {
            caregiver = undefined;
        }
        session.caregiver = caregiver;
        await session.save();
        return caregiver;
    }

    /**
     * 카카오톡을 통해 로그인한 유저의 세션정보를 저장.
     * 리다이렉팅을 통해서 카카오한테 받은 code 를 서버에 보내서 유저정보를 요청.
     * 마찬가지로 만료시간 넘겼을 때는 삭제
     * @param ctx
     * @param code
     */
    public static async getAuthorizedSessionByCode(ctx: any, code: string): Promise<SessionInterface | undefined> {
        if (!ctx.req || !ctx.res) return undefined;
        let caregiver: SessionInterface | undefined;

        const session = await this.getSession(ctx.req, ctx.res, SESSION_NAME);
        try {
            const utm: UtmInterface = session.utm || {};
            const snsCallbackResponse = await HttpUtil.request<PostCaregiverAuthSnsCallbackResponseInterface, PostCaregiverAuthSnsCallbackRequestInterface>(
                EndpointEnum.POST_CAREGIVER_SNS_CALLBACK,
                { providerType: "kakao", redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}` || "", code, ...utm },
            );
            if (snsCallbackResponse.data) {
                const accessTokenData: JwtAccessTokenDataInterface = jwtDecode(snsCallbackResponse.data.accessToken);
                caregiver = {
                    accessToken: snsCallbackResponse.data.accessToken,
                    refreshToken: snsCallbackResponse.headers?.refresh,
                    exp: accessTokenData.exp,
                    accessTokenData,
                    hasDesiredWork: snsCallbackResponse.data.hasDesiredWork,
                    signUp: snsCallbackResponse.data.signUp,
                };
                session.caregiver = caregiver;
                session.utm = undefined;
            }
            // eslint-disable-next-line no-empty
        } catch (httpError) {
            console.log(httpError);
        }

        if (caregiver && caregiver.exp < dayjs().unix()) {
            session.caregiver = undefined;
            caregiver = undefined;
        }
        await session.save();
        return caregiver;
    }
}

export default CaregiverAuthService;
