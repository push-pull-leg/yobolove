/**
 * 수급자 등급 Enum
 *
 * @category Enum
 * @enum
 */
const enum GradeEnum {
    /**
     * 무등급
     */
    // @ts-ignore4
    "0" = "0",
    /**
     * 1등급
     */
    // @ts-ignore4
    "1" = "1",
    /**
     * 2등급
     */
    // @ts-ignore
    "2" = "2",
    /**
     * 3등급
     */
    // @ts-ignore
    "3" = "3",
    /**
     * 4등급
     */
    // @ts-ignore
    "4" = "4",
    /**
     * 5등급
     */
    // @ts-ignore
    "5" = "5",
}

/**
 * 수급자 등급 Label
 *
 * @category EnumLabel
 * @enum
 */
export const GradeLabel: Map<GradeEnum, string> = new Map([
    [GradeEnum["0"], "무등급"],
    [GradeEnum["1"], "1등급"],
    [GradeEnum["2"], "2등급"],
    [GradeEnum["3"], "3등급"],
    [GradeEnum["4"], "4등급"],
    [GradeEnum["5"], "5등급"],
]);

export default GradeEnum;
