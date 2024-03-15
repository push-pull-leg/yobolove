/**
 * 구인공고에서 사용하는 수급자 거동상태 Enum
 *
 * @category Enum
 * @enum
 */
const enum RecipientMotionStateEnum {
    /**
     * 스스로 보행 및 활동 가능
     */
    POSSIBLE = "POSSIBLE",
    /**
     * 지팡이나 보행기의 도움으로 보행
     */
    CANE = "CANE",
    /**
     * 옆에서 가족들의 부축 혹은 도움 필요
     */
    HELP = "HELP",
    /**
     * 신채 기능 저하로 거의 누워 계심
     */
    IMPOSSIBLE = "IMPOSSIBLE",
}

/**
 * @category EnumLabel
 */
export const RecipientMotionStateLabel: Map<RecipientMotionStateEnum, string> = new Map([
    [RecipientMotionStateEnum.POSSIBLE, "스스로 보행 및 활동 가능"],
    [RecipientMotionStateEnum.CANE, "지팡이나 보행기의 도움으로 보행"],
    [RecipientMotionStateEnum.HELP, "옆에서 가족들의 부축 혹은 도움 필요"],
    [RecipientMotionStateEnum.IMPOSSIBLE, "신체 기능 저하로 거의 누워 계심"],
]);

export default RecipientMotionStateEnum;
