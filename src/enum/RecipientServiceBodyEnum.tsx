/**
 * 구인공고에서 사용하는 수급자 필요서비스 - 신체지원
 *
 * @category Enum
 * @enum
 */
const enum RecipientServiceBodyEnum {
    /**
     * 병원 이동
     */
    HOSPITAL = "HOSPITAL",
    /**
     * 산책 보조
     */
    WALK = "WALK",
    /**
     * 재활/운동
     */
    EXERCISE = "EXERCISE",
    /**
     * 부축도움
     */
    SUPPORT = "SUPPORT",
}

/**
 * @category EnumLabel
 */
export const RecipientServiceBodyLabel: Map<RecipientServiceBodyEnum, string> = new Map([
    [RecipientServiceBodyEnum.HOSPITAL, "병원 이동"],
    [RecipientServiceBodyEnum.WALK, "산책보조"],
    [RecipientServiceBodyEnum.EXERCISE, "재활/운동"],
    [RecipientServiceBodyEnum.SUPPORT, "부축도움"],
]);

export default RecipientServiceBodyEnum;
