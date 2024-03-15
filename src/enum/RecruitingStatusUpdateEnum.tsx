/**
 * 구인공고 상태변경 선택지 Enum
 *
 * @category Enum
 * @enum
 */
const enum RecruitingStatusUpdateEnum {
    /**
     * 구인 성공상태로 변경
     */
    SUCCESS = "SUCCESS",
    /**
     * 구인 취소상태로 변경
     */
    CANCEL = "CANCEL",
}

/**
 * @category EnumLabel
 */
export const RecruitingStatusUpdateLabel: Map<RecruitingStatusUpdateEnum, string> = new Map([
    [RecruitingStatusUpdateEnum.SUCCESS, "구인에 성공했어요"],
    [RecruitingStatusUpdateEnum.CANCEL, "구인을 취소할래요"],
]);

export default RecruitingStatusUpdateEnum;
