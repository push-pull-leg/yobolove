/**
 * @interface
 */
import RecruitingInterface from "../RecrutingInterface";

type UselessPropsType = "uuid" | "certType" | "openedDate" | "status" | "distance" | "safetyNumber" | "centerName";

export default interface PostCenterRecruitingRequestInterface extends Omit<RecruitingInterface, UselessPropsType> {}
