/**
 * @param accountId 아이디
 * @param uuid uuid
 */
import CenterInterface from "./CenterInterface";

export default interface CenterSignupInterface extends CenterInterface {
    termsUuidList: string[];
    agreedDate: string;
    codeAuthToken: string;
    certFile: File;
}
