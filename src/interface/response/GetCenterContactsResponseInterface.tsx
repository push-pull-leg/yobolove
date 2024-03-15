/**
 * @param adminPhoneNum 관리자 전화번호
 * @param phoneNum 전화번호
 * @param extraPhoneNum 추가 전화 번호 리스트
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CenterContactInterface from "../CenterContactInterface";

export default interface GetCenterContactsResponseInterface extends ResponseInterface {
    data: CenterContactInterface;
}
