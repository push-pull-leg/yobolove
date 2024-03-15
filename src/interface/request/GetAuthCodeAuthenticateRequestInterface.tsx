/**
 * @param phoneNum 핸드폰 번호
 * @param authCode 인증코드
 * @param process 프로세스
 * @interface
 */
import AuthCodeProcessEnum from "../../enum/AuthCodeProcessEnum";

export default interface GetAuthCodeAuthenticateRequestInterface {
    phoneNum: string;
    authCode: string;
    process: AuthCodeProcessEnum;
}
