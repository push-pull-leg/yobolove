import RecruitingInterface from "./RecrutingInterface";
import RecruitingCertTypeEnum from "../enum/RececruitingCertTypeEnum";

type RecruitingSimpleKeyInterface = "certType" | "preferCaregiverGender" | "recipientService" | "memo" | "contactNumber" | "channels" | "safetyNumber" | "centerName";

/**
 * 리스트형 구인공고 Interface
 * {@link RecruitingInterface}에서 {@link RecruitingSimpleKeyInterface} 데이터를 제외한 나머지 데이터를 사용함.
 * 관리 측면에서 {@link RecruitingInterface} 에서 필드를 빼는게 좋으면 Omit 사용. {@link RecruitingInterface}에 있는 데이터를 더하는게 좋으면 Pick 사용.
 * @category Main
 */

export default interface RecruitingSimpleInterface extends Omit<RecruitingInterface, RecruitingSimpleKeyInterface> {
    certType?: RecruitingCertTypeEnum;
}
