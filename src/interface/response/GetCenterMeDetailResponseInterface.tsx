/**
 * @param codeAuthToken 인증토큰
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CenterInterface from "../CenterInterface";

interface CenterInformation extends CenterInterface {
    codeAuthToken: string;
}

export default interface GetCenterMeDetailResponseInterface extends ResponseInterface<CenterInformation> {
    data: CenterInformation;
}
