/**
 * 구인공고에서 사용하는 수급자 필요서비스 - 가사지원
 *
 * @category Enum
 * @enum
 */
enum RecipientServiceHomeEnum {
    /**
     * 청소
     */
    CLEAN = "CLEAN",
    /**
     * 빨래
     */
    LAUNDRY = "LAUNDRY",
}

/**
 * @category EnumLabel
 */
export const RecipientServiceHomeLabel: Map<RecipientServiceHomeEnum, string> = new Map([
    [RecipientServiceHomeEnum.CLEAN, "청소"],
    [RecipientServiceHomeEnum.LAUNDRY, "빨래"],
]);

export default RecipientServiceHomeEnum;
