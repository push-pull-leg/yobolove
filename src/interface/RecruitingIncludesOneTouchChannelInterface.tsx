import { GetCenterRecruitingResponseDataInterface } from "./response/GetCenterRecruitingResponseInterface";
import SelectedChannelsAPIType from "../type/SelectedChannelsAPIType";

export default interface RecruitingIncludesOneTouchChannelInterface extends GetCenterRecruitingResponseDataInterface {
    channels: SelectedChannelsAPIType;
}
