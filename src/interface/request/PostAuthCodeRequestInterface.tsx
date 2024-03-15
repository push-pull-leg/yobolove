/**
 * 문자인증 요청 api 에 대한 request 정의입니다.
 *
 * @param phoneNum 인증을 요청할 핸드폰 번호
 * @interface
 */
import AuthCodeProcessEnum from "../../enum/AuthCodeProcessEnum";

export default interface PostAuthCodeRequestInterface {
    phoneNum: string;
    process?: AuthCodeProcessEnum;
}
