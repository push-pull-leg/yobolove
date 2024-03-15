/**
 * 요양보호사가 케어 가능한 어르신 성별 선택지 Enum
 *
 * @category Enum
 * @enum
 */
const enum PreferCaregiverGenderEnum {
    /**
     * 상관없음
     */
    DONT_CARE = "DONT_CARE",
    /**
     * 여자만 가능
     */
    FEMALE = "FEMALE",
    /**
     * 남자만 가능
     */
    MALE = "MALE",
}

/**
 * @category EnumLabel
 */
export const PreferCaregiverGenderLabel: Map<PreferCaregiverGenderEnum, string> = new Map([
    [PreferCaregiverGenderEnum.DONT_CARE, "상관 없음"],
    [PreferCaregiverGenderEnum.FEMALE, "여자만 가능"],
    [PreferCaregiverGenderEnum.MALE, "남자만 가능"],
]);

export default PreferCaregiverGenderEnum;
