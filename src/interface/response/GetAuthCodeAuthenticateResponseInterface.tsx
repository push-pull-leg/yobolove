/**
 * 인증 코드
 *
 * @interface
 */
import ResponseInterface from "./ResponseInterface";

export default interface GetAuthCodeAuthenticateResponseInterface extends ResponseInterface {
    data: {
        token: string;
    };
}
