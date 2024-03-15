/**
 * @param codeAuthToken 인증토큰
 * @param phoneNum 핸드폰 번호
 * @interface
 */

export default interface AuthCodeRequestInterface {
    codeAuthToken: string;
    phoneNum: string;
}
