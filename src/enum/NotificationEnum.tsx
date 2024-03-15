/**
 * 일자리 알림 받기 선택지 Enum
 *
 * @category Enum
 * @enum
 */
const enum NotificationValueEnum {
    /**
     * 수신 상태
     */
    SUBSCRIBED = "SUBSCRIBED",
    /**
     * 예약 상태
     */
    RESERVED = "RESERVED",
    /**
     * 알림 중단 상태
     */
    ABORTED = "ABORTED",
}

/**
 * @category EnumLabel
 */
export const NotificationValueLabel: Map<NotificationValueEnum, string> = new Map([
    [NotificationValueEnum.SUBSCRIBED, "수신-일자리 알림을 받을래요"],
    [NotificationValueEnum.RESERVED, "예약-나중에 받을래요"],
    [NotificationValueEnum.ABORTED, "중단-그만 받을래요"],
]);

export default NotificationValueEnum;
