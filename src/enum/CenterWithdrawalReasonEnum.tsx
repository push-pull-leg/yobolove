import { CheckBoxType } from "../type/CheckBoxType";

/**
 * 기관용 > 회원탈퇴 이유 Enum
 *
 * @category Enum
 * @enum
 */
const enum CenterWithdrawalReasonEnum {
    /**
     * 공고 등록이 어렵고 불편해서
     */
    DIFFICULT_AND_UNCOMFORTABLE = "DIFFICULT_AND_UNCOMFORTABLE",
    /**
     * 공고를 등록해도 연락이 오지 않아서
     */
    NO_CONTACTS = "NO_CONTACTS",
    /**
     * 조건에 맞는 요양보호사가 없어서
     */
    NOT_ENOUGH_CAREGIVERS = "NOT_ENOUGH_CAREGIVERS",
    /**
     * 장기간 구인을 하지 않아서
     */
    NO_NEED_RECRUITING = "NO_NEED_RECRUITING",
    /**
     * 직접입력
     */
    DIRECTLY_WRITING = "DIRECTLY_WRITING",
}

export default CenterWithdrawalReasonEnum;

/**
 * @category EnumLabel
 */
export const CenterWithdrawalReasonLabel: Map<CenterWithdrawalReasonEnum, CheckBoxType> = new Map([
    [CenterWithdrawalReasonEnum.DIFFICULT_AND_UNCOMFORTABLE, { title: "공고 등록이 어렵고 불편해서" }],
    [CenterWithdrawalReasonEnum.NO_CONTACTS, { title: "공고를 등록해도 연락이 오지 않아서" }],
    [CenterWithdrawalReasonEnum.NOT_ENOUGH_CAREGIVERS, { title: "조건에 맞는 요양보호사가 없어서" }],
    [CenterWithdrawalReasonEnum.NO_NEED_RECRUITING, { title: "장기간 구인을 하지 않아서" }],
    [CenterWithdrawalReasonEnum.DIRECTLY_WRITING, { title: "직접입력" }],
]);
