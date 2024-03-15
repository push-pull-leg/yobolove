/**
 * 성별 Enum
 *
 * @category Enum
 * @enum
 */
const enum GenderEnum {
    /**
     * 여성
     */
    FEMALE = "FEMALE",
    /**
     * 남성
     */
    MALE = "MALE",
}

/**
 * @category EnumLabel
 */
export const GenderLabel: Map<GenderEnum, string> = new Map([
    [GenderEnum.FEMALE, "여성"],
    [GenderEnum.MALE, "남성"],
]);

export default GenderEnum;
