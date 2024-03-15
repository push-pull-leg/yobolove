/**
 * 구인공고에서 사용하는 수급자 필요서비스 - 인지지원
 *
 * @category Enum
 * @enum
 */
const enum RecipientServiceCognitiveEnum {
    /**
     * 인지 프로그램 준비
     */
    PROGRAM_PREPARE = "PROGRAM_PREPARE",
    /**
     * 인지 프로그램 실행
     */
    PROGRAM_RUN = "PROGRAM_RUN",
}

/**
 * @category EnumLabel
 */
export const RecipientServiceCognitiveLabel: Map<RecipientServiceCognitiveEnum, string> = new Map([
    [RecipientServiceCognitiveEnum.PROGRAM_PREPARE, "인지 프로그램 준비"],
    [RecipientServiceCognitiveEnum.PROGRAM_RUN, "인지 프로그램 실행"],
]);

export default RecipientServiceCognitiveEnum;
