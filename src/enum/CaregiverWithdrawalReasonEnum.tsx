import { CheckBoxType } from "../type/CheckBoxType";

/**
 * 구직자용 > 회원탈퇴 이유 Enum
 *
 * @category Enum
 * @enum
 */
const enum CaregiverWithdrawalReasonEnum {
    /**
     * 장기간 구직을 하지 않아서
     */
    NO_NEED = "NO_NEED",
    /**
     * 일자리 개수가 많지 않아서
     */
    NOT_ENOUGH_RECRUITINGS = "NOT_ENOUGH_RECRUITINGS",
    /**
     * 일자리를 확인하기 불편해서
     */
    UNFAMILIAR_UI = "UNFAMILIAR_UI",
    /**
     * 조건에 맞는 일자리가 오지 않아서
     */
    MISS_MATCHING_RECRUITING = "MISS_MATCHING_RECRUITING",
    /**
     * 직접입력
     */
    DIRECTLY_WRITING = "DIRECTLY_WRITING",
}

/**
 * @category EnumLabel
 */
export const CaregiverWithdrawalReasonLabel: Map<CaregiverWithdrawalReasonEnum, CheckBoxType> = new Map([
    [CaregiverWithdrawalReasonEnum.NO_NEED, { title: "장기간 구직을 하지 않아서" }],
    [CaregiverWithdrawalReasonEnum.NOT_ENOUGH_RECRUITINGS, { title: "일자리 개수가 많지 않아서" }],
    [CaregiverWithdrawalReasonEnum.UNFAMILIAR_UI, { title: "일자리를 확인하기 불편해서" }],
    [CaregiverWithdrawalReasonEnum.MISS_MATCHING_RECRUITING, { title: "조건에 맞는 일자리가 오지 않아서" }],
    [CaregiverWithdrawalReasonEnum.DIRECTLY_WRITING, { title: "직접입력" }],
]);

export default CaregiverWithdrawalReasonEnum;
