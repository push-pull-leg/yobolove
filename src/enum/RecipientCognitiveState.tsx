/**
 * 구인공고에서 사용하는 수급자 인지상태 Enum
 *
 * @category Enum
 * @enum
 */
const enum RecipientCognitiveStateEnum {
    /**
     * 치매 증상 전혀 없음
     */
    GOOD = "GOOD",
    /**
     * 치매 초기 혹은 의심 증상 보임
     */
    MILD = "MILD",
    /**
     * 치매로 병원 진단 받음
     */
    SEVERE = "SEVERE",
}

/**
 * @category EnumLabel
 */
export const RecipientCognitiveStateLabel: Map<RecipientCognitiveStateEnum, string> = new Map([
    [RecipientCognitiveStateEnum.GOOD, "치매 증상 전혀 없음"],
    [RecipientCognitiveStateEnum.MILD, "치매 초기 혹은 의심 증상 보임"],
    [RecipientCognitiveStateEnum.SEVERE, "치매로 병원 진단 받음"],
]);

export default RecipientCognitiveStateEnum;
