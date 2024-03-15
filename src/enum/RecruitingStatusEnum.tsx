/**
 * 구인공고 현재 상태 Enum
 *
 * @category Enum
 * @enum
 */
const enum RecruitingStatusEnum {
    /**
     * 현재 진행중인 구인 공고
     */
    IN_PROGRESS = "IN_PROGRESS",
    /**
     * 구인이 성공하여 완료된 구인 공고
     */
    SUCCESS = "SUCCESS",
    /**
     * 구인이 취소된 구인 공고
     */
    CANCEL = "CANCEL",
    /**
     * 기간이 만료된 구인 공고
     */
    EXPIRED = "EXPIRED",
}

/**
 * @category EnumLabel
 */
export const RecruitingStatusLabel: Map<RecruitingStatusEnum, string> = new Map([
    [RecruitingStatusEnum.IN_PROGRESS, "구인 중"],
    [RecruitingStatusEnum.SUCCESS, "구인 성공"],
    [RecruitingStatusEnum.CANCEL, "구인 취소"],
    [RecruitingStatusEnum.EXPIRED, "기간 만료"],
]);

export default RecruitingStatusEnum;
