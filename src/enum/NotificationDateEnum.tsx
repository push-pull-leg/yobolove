/**
 * 일자리 알림 받기 - 수신 선택지 Enum
 *
 * @category Enum
 * @enum
 */
const enum NotificationDateEnum {
    /**
     * 1개월 후
     */
    ONE_MONTH = "ONE_MONTH",
    /**
     * 직접 입력
     */
    DIRECTLY_WRITING = "DIRECTLY_WRITING",
}

/**
 * @category EnumLabel
 */
export const NotificationDateLabel: Map<NotificationDateEnum, string> = new Map([
    [NotificationDateEnum.ONE_MONTH, "1개월 후"],
    [NotificationDateEnum.DIRECTLY_WRITING, "직접 입력"],
]);

export default NotificationDateEnum;
