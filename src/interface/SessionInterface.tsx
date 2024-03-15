/**
 * 문자인증 response 에 대한 interface
 * @interface SessionInterface
 */
import JwtAccessTokenDataInterface from "./JwtAccessTokenDataInterface";

interface SessionInterface {
    accessToken: string;
    refreshToken?: string | null;
    exp: number;
    accessTokenData: JwtAccessTokenDataInterface;
    /**
     * 최초 회원가입인지 여부
     */
    signUp?: boolean;
    hasDesiredWork?: boolean;
}

export default SessionInterface;
