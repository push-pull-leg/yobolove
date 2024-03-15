/**
 * @param uuid uuid
 */
import RecruitingStatusUpdateEnum from "../../enum/RecruitingStatusUpdateEnum";

export default interface PatchCenterRecruitingRequestInterface {
    uuid: string;
    status: RecruitingStatusUpdateEnum;
}
