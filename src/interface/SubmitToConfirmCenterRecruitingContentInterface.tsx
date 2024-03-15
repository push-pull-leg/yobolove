import RecruitingInterface from "./RecrutingInterface";

type UselessTypes = "uuid" | "certType" | "openedDate" | "status" | "distance" | "safetyNumber" | "centerName" | "channels";

export default interface SubmitToConfirmCenterRecruitingContentInterface extends Omit<RecruitingInterface, UselessTypes> {
    uuid?: string;
}
