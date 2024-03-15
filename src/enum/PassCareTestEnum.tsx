/**
 * 요양보호사 시험 합격 여부 Enum
 *
 * @category Enum
 * @enum
 */
const enum PassCareTestEnum {
    /**
     * 시험 합격함
     */
    true = "true",
    /**
     * 시험 함격하지 않음
     */
    false = "false",
}

/**
 * @category EnumLabel
 */
export const PassCareTestLabel: Map<PassCareTestEnum, string> = new Map([
    [PassCareTestEnum.true, "네"],
    [PassCareTestEnum.false, "아니오"],
]);

export default PassCareTestEnum;
