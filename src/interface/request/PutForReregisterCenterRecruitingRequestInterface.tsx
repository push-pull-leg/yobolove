import RecruitingInterface from "../RecrutingInterface";

type UselessPropsType = "certType" | "openedDate" | "status" | "distance" | "safetyNumber" | "centerName";

export default interface PutForReregisterCenterRecruitingRequestInterface extends Omit<RecruitingInterface, UselessPropsType> {}
