/**
 * @param data 연락처 리스트[]
 * @interface
 */
import ResponseInterface from "./ResponseInterface";

export default interface PostCenterContactsExtraResponseInterface extends ResponseInterface {
    data: string[];
}
