/**
 * @param accountId 아이디
 * @param uuid uuid
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CenterAccountInterface from "../CenterAccountInterface";

export default interface GetCenterMeResponseInterface extends ResponseInterface {
    data: CenterAccountInterface;
}
