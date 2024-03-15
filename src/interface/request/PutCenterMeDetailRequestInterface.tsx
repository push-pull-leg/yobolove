/**
 * @param codeAuthToken 인증토큰
 * @param certFile 파일
 * @interface
 */
import CenterInformationUpdateInterface from "../CenterInformationUpdateInterface";

export default interface PutCenterMeDetailRequestInterface {
    centerInformationUpdateDto: CenterInformationUpdateInterface;
    certFile?: File;
    recruiterSignatureFile: File;
}
