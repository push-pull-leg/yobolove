/**
 * @param accountId 기관 아이디
 * @param accountPwd 기관 패스워드
 * @param adminPhoneNum 관리자 핸드폰 번호
 * @param adminEmail 관리자 이메일
 * @param idNum 기관기호
 * @param name 기관 이름
 * @param phoneNum 핸드폰 번호
 * @interface
 */
import CenterMoreInfoInterface from "./CenterMoreInfoInterface";

export default interface CenterInterface {
    accountId: string;
    accountPwd: string;
    adminPhoneNum: string;
    adminEmail: string;
    idNum: string;
    name: string;
    phoneNum: string;
    uuid: string;
    centerMoreInfo?: CenterMoreInfoInterface;
}
