/**
 * 급여 단위 유형 Enum
 *
 * @category Enum
 * @enum
 */
const enum PayTypeEnum {
    /**
     * 시급
     */
    HOURLY = "HOURLY",
    /**
     * 월급
     */
    MONTHLY = "MONTHLY",
    /**
     * 일급
     */
    DAILY = "DAILY",
}

/**
 * @category EnumLabel
 */
export const PayTypeLabel: Map<PayTypeEnum, string> = new Map([
    [PayTypeEnum.HOURLY, "시급"],
    [PayTypeEnum.DAILY, "일급"],
    [PayTypeEnum.MONTHLY, "월급"],
]);

export default PayTypeEnum;
