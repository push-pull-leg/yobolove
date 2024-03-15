/**
 * 이용약관 동의 선택지 Enum
 *
 * @category Enum
 * @enum
 */
const enum TermsAgreementEnum {
    /**
     * 동의
     */
    AGREE = "AGREE",
    /**
     * 비동의
     */
    DISAGREE = "DISAGREE",
}

/**
 * @category EnumLabel
 */
export const TermsAgreementLabel: Map<TermsAgreementEnum, string> = new Map([
    [TermsAgreementEnum.AGREE, "동의합니다."],
    [TermsAgreementEnum.DISAGREE, "동의하지 않습니다."],
]);

export default TermsAgreementEnum;
