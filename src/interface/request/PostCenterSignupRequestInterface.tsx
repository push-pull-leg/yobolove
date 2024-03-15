/**
 * @param termsUuidList 이용약관 동의 uuid 목록
 * @param agreedDate 동의일시
 * @param codeAuthToken 승인코드 토큰
 * @param certFile 인증서 파일
 */
import CenterSignupInterface from "../CenterSignupInterface";

export default interface PostCenterSignupRequestInterface {
    centerSignupDto: CenterSignupInterface;
    certFile: File;
}
