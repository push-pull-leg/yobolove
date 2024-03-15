/**
 * 회원탈퇴 api 에 대한 request 구조. 문자나 알림톡으로 받은 인증번호를 핸드폰번호와 탈퇴사유와 같이 넘긴다.
 *
 * @param phoneNum 핸드폰번호
 * @param authCode 유저가 입력한 인증번호
 * @interface DeleteCaregiverWithdrawalRequestInterface
 */

export default interface DeleteCaregiverWithdrawalRequestInterface {
    phoneNum: string;
    codeAuthToken: string;
    reasonList: string[];
}
