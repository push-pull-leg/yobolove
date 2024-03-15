/**
 * jwt refresh request 입니다. jwt token 이 만료되기 전에 해당 api 를 호출해서 만료를 방지합니다.
 * 특별한 parameter 는 없고, 그냥 header 에 jwt 정보를 넘기면 됩니다.
 *
 * @interface
 */
import UtmInterface from "../UtmInterface";

export default interface PostCaregiverSignupRequestInterface extends UtmInterface {
    phoneNum: string;
    codeAuthToken: string;
    termsUuidList: string[];
    agreedDate: string;
}
