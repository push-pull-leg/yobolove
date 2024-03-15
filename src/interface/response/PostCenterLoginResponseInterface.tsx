/**
 * @param data.token jwt token
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CenterAuthInterface from "../CenterAuthInterface";

export default interface PostCenterLoginResponseInterface extends ResponseInterface {
    data: CenterAuthInterface;
}
