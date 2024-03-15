/**
 * sns 로그인 request interface
 *
 * @interface
 */
import UtmInterface from "../UtmInterface";

export default interface PostCaregiverAuthSnsCallbackRequestInterface extends UtmInterface {
    providerType: string;
    code: string;
    redirectUri: string;
}
