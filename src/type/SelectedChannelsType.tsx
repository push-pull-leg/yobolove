import { CenterBasicChannelOptionEnum, CenterOneTouchChannelOptionEnum } from "../enum/CenterOneTouchChannelOptionsEnum";

type SelectedChannelsType = { basicChannelSet: CenterBasicChannelOptionEnum[]; oneTouchChannelSet: CenterOneTouchChannelOptionEnum[] } | null;
export default SelectedChannelsType;
