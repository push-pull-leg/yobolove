import SubmitToConfirmCenterRecruitingContentInterface from "./SubmitToConfirmCenterRecruitingContentInterface";
import RecipientType from "../type/RecipientType";
import RecipientServiceType from "../type/RecipientServiceType";
import { TimeRangeInterface } from "./TimeRangeInterface";
import HolidayType from "../type/HolidayType";

type UselessPropsType = "recipient" | "recipientService" | "workTime" | "holiday";

export default interface RawCenterRecruitingContentInterface
    extends Omit<SubmitToConfirmCenterRecruitingContentInterface, UselessPropsType>,
        Partial<RecipientType>,
        Partial<RecipientServiceType>,
        Partial<HolidayType> {
    /**
     * '요일/시간 직접 입력' 인가?
     */
    isDirectVisitTime?: boolean;
    /**
     * workTime에 들어갈 props들
     */
    timeRange?: TimeRangeInterface;
    directWriteWorkHourMemo?: string;
    weeklyWorkHours?: number;
}
