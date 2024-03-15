/**
 * 일자리 알림 - 중단 선택지 Enum
 *
 * @category Enum
 * @enum
 */
const enum NotificationOffReasonEnum {
    /**
     * 이미 근무 중이어서
     */
    ALREADY_WORKING = "ALREADY_WORKING",
    /**
     * 요양보호사 일을 그만둠
     */
    QUIT_JOB = "QUIT_JOB",
    /**
     * 나에게 맞는 공고가 없어서
     */
    UNMATCHED_RECRUITING = "UNMATCHED_RECRUITING",
    /**
     * 직접 입력
     */
    DIRECTLY_WRITING = "DIRECTLY_WRITING",
}

/**
 * @category EnumLabel
 */
export const NotificationOffReasonLabel: Map<NotificationOffReasonEnum, string> = new Map([
    [NotificationOffReasonEnum.ALREADY_WORKING, "이미 근무 중이어서"],
    [NotificationOffReasonEnum.QUIT_JOB, "요양보호사 일을 그만둠"],
    [NotificationOffReasonEnum.UNMATCHED_RECRUITING, "나에게 맞는 공고가 없어서"],
    [NotificationOffReasonEnum.DIRECTLY_WRITING, "직접 입력"],
]);

export default NotificationOffReasonEnum;
