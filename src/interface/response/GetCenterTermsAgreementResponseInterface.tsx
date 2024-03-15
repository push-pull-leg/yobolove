/**
 * 요양보호사
 *
 * @interface GetCenterTermsAgreementResponseInterface
 */
import ResponseInterface from "./ResponseInterface";
import TermsAgreementInterface from "../TermsAgreementInterface";

export default interface GetCenterTermsAgreementResponseInterface extends ResponseInterface {
    data: TermsAgreementInterface[];
}
