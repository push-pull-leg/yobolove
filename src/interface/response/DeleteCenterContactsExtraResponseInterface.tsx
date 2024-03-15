/**
 * @param data 연락처 리스트[]
 * @interface
 */
import ResponseInterface from "./ResponseInterface";

export default interface DeleteCenterContactsExtraResponseInterface extends ResponseInterface {
    data: string[];
}
