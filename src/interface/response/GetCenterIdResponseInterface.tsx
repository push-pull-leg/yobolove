/**
 * @param data.accountId 아이디
 * @param data.createdDate 생성일
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CenterAccountInterface from "../CenterAccountInterface";

export default interface GetCenterIdResponseInterface extends ResponseInterface {
    data: CenterAccountInterface;
}
