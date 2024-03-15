/**
 * 인증 코드
 *
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CenterMeCertFileInterface from "../CenterMeCertFileInterface";

export default interface GetCenterMeCertFileResponseInterface extends ResponseInterface {
    data: CenterMeCertFileInterface;
}
