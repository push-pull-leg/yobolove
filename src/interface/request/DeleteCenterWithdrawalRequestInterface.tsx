/**
 * @param phoneNum 핸드폰 번호
 * @param authCode 인증번호
 * @param reasonList 탈퇴사유(리스트)
 * @interface
 */

export default interface DeleteCenterWithdrawalRequestInterface {
    phoneNum: string;
    codeAuthToken: string;
    reasonList: string[];
}
