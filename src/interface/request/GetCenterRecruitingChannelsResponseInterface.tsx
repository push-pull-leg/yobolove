import ResponseInterface from "../response/ResponseInterface";
import SelectedChannelsAPIType from "../../type/SelectedChannelsAPIType";

export interface GetCenterRecruitingChannelsResponseDataInterface {
    channels: SelectedChannelsAPIType;
}

export default interface GetCenterRecruitingChannelsResponseInterface extends ResponseInterface<GetCenterRecruitingChannelsResponseDataInterface> {}
