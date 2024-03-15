import dayjs from "dayjs";
import { sha512 } from "crypto-hash";
import { IncomingMessage, ServerResponse } from "http";
import { getIronSession, IronSession, IronSessionData } from "iron-session";
import SessionInterface from "../interface/SessionInterface";

/**
 * Server-Side 인증 관련 서비스. 주로 getServerSideProps/getInitialProps 혹은 api 에서 불러온다.
 * 세션정보 가져오기, 로그인 정보가져오기 등을 담당함.
 * @category Service
 */
abstract class AuthService {
    /**
     * 세션정보 삭제
     * @param req http request
     * @param res http response
     * @param sessionName 세션이름
     * @param sessionKey 세션키
     */
    public static async destroySessionData(req: IncomingMessage, res: ServerResponse, sessionName: string, sessionKey: keyof IronSessionData): Promise<void> {
        const session = await this.getSession(req, res, sessionName);
        if (!session) return;

        session[sessionKey] = undefined;
        await session.save();
    }

    /**
     * 세션정보 저장.
     * @param req http request
     * @param res http response
     * @param sessionName 세션이름
     * @param sessionKey 세션키
     * @param sessionData 세션 데이터
     */
    public static async storeSessionData(
        req: IncomingMessage,
        res: ServerResponse,
        sessionName: string,
        sessionKey: keyof IronSessionData,
        sessionData: SessionInterface,
    ): Promise<void> {
        const session = await this.getSession(req, res, sessionName);
        if (!session) return;

        session[sessionKey] = sessionData;
        await session.save();
    }

    /**
     * 세션 정보 가져오기.
     * client-side only 인 react 와는 다르게 server-side 작업이 가능한 next-js 에서는 서버사이드에서 보안/인증관련 작업을위해 server-client 에서 매칭되는 세션을 사용할 수 있다.
     * 주로 http only(secured) cookie 를 사용하며 현재는 iron-session 을 사용함. client-side 에서 최대로 지속되는 리프레시토큰이 일주일 지속되므로 세션은 일주일 지속으로 설정
     * @param req http request
     * @param res http response
     * @param sessionName 세션이름. 구직자/기관용이 각각 고정된 값으로 들어갈 예정
     * @protected
     */
    protected static async getSession(req: IncomingMessage | Request, res: ServerResponse | Response, sessionName: string): Promise<IronSession> {
        return getIronSession(req, res, {
            cookieName: sessionName,
            password: process.env.NEXT_PUBLIC_SESSION_PW || "ALTERNATIVE_SECURED_YBPR_PW",
            cookieOptions: {
                secure: true,
                expires: dayjs().add(7, "day").toDate(),
            },
        });
    }

    /**
     * 리프레시 토큰을 가져오는 통신이 필요한지 확인
     *
     * #### case 1. 리프레시 토큰이 없으면 refresh 어차피 못함.
     * #### case 2. credentials 정보가 없으면 현재 access token 정보가 없다는 뜻이므로 refresh 해야함
     * #### case 3. session 정보가 없고, credentials 정보가 있다면, 데이터 손실이므로(이 두가지는 세트로 설정됨) refresh 해야함
     * #### case 4. session 정보가 있고, credentials 정보가 있는데, access token 의 암호화 값이랑 credentials 정보가 다를때 refresh 해야함
     * #### case 5. 그 외의 경우 refresh 필요 없음.
     *
     * @param session 세션 정보
     * @param refreshToken 리프레시 토큰 정보
     * @param credentials 암호화된 인증 정보
     * @protected
     */
    protected static async needTokenRefresh(session: SessionInterface | undefined, refreshToken?: string | null, credentials?: string | null): Promise<boolean> {
        if (!refreshToken) {
            return false;
        }

        if (!credentials) {
            return true;
        }

        if (!session) {
            return true;
        }

        return credentials !== (await sha512(session.accessToken));
    }
}

export default AuthService;
