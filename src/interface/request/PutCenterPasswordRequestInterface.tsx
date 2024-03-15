/**
 * @param accountPwd 기존 패스워드
 * @param newAccountPwd 새로운 패스워드
 * @interface
 */

export default interface PutCenterPasswordRequestInterface {
    accountPwd: string;
    newAccountPwd: string;
}
