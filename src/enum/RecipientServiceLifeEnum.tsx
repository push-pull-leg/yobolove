/**
 * 구인공고에서 사용하는 수급자 필요서비스 - 일상지원
 *
 * @category Enum
 * @enum
 */
const enum RecipientServiceLifeEnum {
    /**
     * 샤워/목욕 도움
     */
    BATH = "BATH",
    /**
     * 기저귀 케어
     */
    DIAPER = "DIAPER",
    /**
     * 식사준비
     */
    MEAL = "MEAL",
    /**
     * 요리하기
     */
    COOK = "COOK",
    /**
     * 복약도움
     */
    MEDICINE = "MEDICINE",
    /**
     * 말벗
     */
    TALK = "TALK",
}

/**
 * @category EnumLabel
 */
export const RecipientServiceLifeLabel: Map<RecipientServiceLifeEnum, string> = new Map([
    [RecipientServiceLifeEnum.BATH, "샤워/목욕 도움"],
    [RecipientServiceLifeEnum.DIAPER, "기저귀 케어"],
    [RecipientServiceLifeEnum.MEAL, "식사준비"],
    [RecipientServiceLifeEnum.COOK, "요리하기"],
    [RecipientServiceLifeEnum.MEDICINE, "복약도움"],
    [RecipientServiceLifeEnum.TALK, "말벗"],
]);

export default RecipientServiceLifeEnum;
