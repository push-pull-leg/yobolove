/**
 * sns 로그인 response interface
 *
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CaregiverAuthInterface from "../CaregiverAuthInterface";

export default interface PostCaregiverAuthSnsCallbackResponseInterface extends ResponseInterface {
    data: CaregiverAuthInterface;
}
