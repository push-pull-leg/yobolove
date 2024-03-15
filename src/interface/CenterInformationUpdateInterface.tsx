/**
 * @param codeAuthToken 인증토큰
 * @param certFile 파일
 */
import CenterInterface from "./CenterInterface";
import CenterInformationInterface from "./CenterInformationInterface";

export default interface CenterInformationUpdateInterface extends Pick<CenterInterface, "name" | "adminPhoneNum" | "adminEmail"> {
    codeAuthToken?: string;
    centerMoreInfo: Pick<CenterInformationInterface, "adminName" | "recruiterName" | "address" | "workerCount" | "severancePayType">;
}
