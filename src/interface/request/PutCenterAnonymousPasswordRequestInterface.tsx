/**
 * @param newAccountPwd 새로운 패스워드
 * @param codeAuthToken 인증 토큰
 * @interface
 */

export default interface PutCenterAnonymousPasswordRequestInterface {
    newAccountPwd: string;
    codeAuthToken: string;
}
