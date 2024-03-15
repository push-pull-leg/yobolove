/**
 * 근무기간 형태 Enum
 *
 * @category Enum
 * @enum
 */
const enum MoveJobOffUnitEnum {
    /**
     * 주간
     */
    WEEK = "WEEK",
    /**
     * 월간
     */
    MONTH = "MONTH",
}

/**
 * @category EnumLabel
 */
export const MoveJobOffUnitLabel: Map<MoveJobOffUnitEnum, string> = new Map([
    [MoveJobOffUnitEnum.MONTH, "월"],
    [MoveJobOffUnitEnum.WEEK, "주"],
]);

export default MoveJobOffUnitEnum;
