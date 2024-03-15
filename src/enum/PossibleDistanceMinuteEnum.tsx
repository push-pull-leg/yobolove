/**
 * 도보기준 출퇴근시 가능한 이동시간 Enum
 *
 * @category Enum
 * @enum
 */
const enum PossibleDistanceMinuteEnum {
    /**
     * 도보 10분 이내
     */
    // @ts-ignore
    "10" = "10",
    /**
     * 도보 30분 이내
     */
    // @ts-ignore
    "30" = "30",
    /**
     * 도보 +60분 이내
     */
    // @ts-ignore
    "60" = "60",
}

/**
 * @category EnumLabel
 */
export const PossibleDistanceMinuteLabel: Map<PossibleDistanceMinuteEnum, string> = new Map([
    [PossibleDistanceMinuteEnum["10"], "도보 10분 이내"],
    [PossibleDistanceMinuteEnum["30"], "도보 30분 이내"],
    [PossibleDistanceMinuteEnum["60"], "도보 1시간 이내"],
]);

export default PossibleDistanceMinuteEnum;
