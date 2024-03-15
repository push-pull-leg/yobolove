const enum SeverancePayTypeEnum {
    /**
     * 퇴직금
     */
    SEVERANCE_PAY = "SEVERANCE_PAY",
    /**
     * 퇴직연금
     */
    RETIREMENT_PENSION = "RETIREMENT_PENSION",
    /**
     * 해당사항 없음
     */
    NONE = "NONE",
}

export const SeverancePayTypeLabel: Map<SeverancePayTypeEnum, string> = new Map([
    [SeverancePayTypeEnum.SEVERANCE_PAY, "퇴직금"],
    [SeverancePayTypeEnum.RETIREMENT_PENSION, "퇴직연금"],
    [SeverancePayTypeEnum.NONE, "해당사항 없음(1년 미만 계약 등)"],
]);

export default SeverancePayTypeEnum;
