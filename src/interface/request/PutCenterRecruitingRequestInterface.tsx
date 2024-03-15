/**
 * @param uuid uuid
 */
import RecruitingInterface from "../RecrutingInterface";

type UselessPropsType = "certType" | "openedDate" | "channels" | "status" | "distance" | "safetyNumber" | "centerName";

export default interface PutCenterRecruitingRequestInterface extends Omit<RecruitingInterface, UselessPropsType> {}
