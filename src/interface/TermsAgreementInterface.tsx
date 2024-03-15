import TermsInterface from "./TermsInterface";

/**
 * 이용약관 동의 Interface. 이용약관 구조 + 동의일시
 * @category Main
 */
interface TermsAgreementInterface {
    terms: TermsInterface;
    agreedDate: string;
}

export default TermsAgreementInterface;
