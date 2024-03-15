/**
 * 요양보호사
 *
 * @interface GetCaregiverTermsAgreementResponseInterface
 */
import ResponseInterface from "./ResponseInterface";
import TermsAgreementInterface from "../TermsAgreementInterface";

export default interface GetCaregiverTermsAgreementResponseInterface extends ResponseInterface {
    data: TermsAgreementInterface[];
}
