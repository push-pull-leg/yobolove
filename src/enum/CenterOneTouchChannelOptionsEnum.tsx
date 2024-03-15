import { CheckBoxType } from "../type/CheckBoxType";

export const enum CenterBasicChannelOptionEnum {
    /**
     *요보사랑 구인게시판(필수)
     */
    YOBOLOVE_RECRUITINGS = "YOBOLOVE_RECRUITINGS",
    /**
     *구직자에게 알림톡 발송
     */
    SEND_ALIMTALK_TO_JOBSEEKR = "SEND_ALIMTALK_TO_JOBSEEKR",
}

export const enum CenterOneTouchChannelOptionEnum {
    /**
     *요양나라·네이버 카페
     */
    YOYANGNARA_NAVERCAFE = "YOYANGNARA_NAVERCAFE",
    /**
     *일자리센터·워크넷
     */
    JOBCENTER_WORKNET = "JOBCENTER_WORKNET",
}

/**
 *기관용>채널 선택 옵션Enum
 *
 *@categoryEnum
 *@enum
 */
const enum CenterOneTouchChannelOptionsEnum {
    /**
     *요보사랑 구인게시판(필수)
     */
    YOBOLOVE_RECRUITINGS = "YOBOLOVE_RECRUITINGS",
    /**
     *구직자에게 알림톡 발송
     */
    SEND_ALIMTALK_TO_JOBSEEKR = "SEND_ALIMTALK_TO_JOBSEEKR",
    /**
     *요양나라·네이버 카페
     */
    YOYANGNARA_NAVERCAFE = "YOYANGNARA_NAVERCAFE",
    /**
     *일자리센터·워크넷
     */
    JOBCENTER_WORKNET = "JOBCENTER_WORKNET",
}

export default CenterOneTouchChannelOptionsEnum;

export const enum CenterBasicChannelOptionAPIEnum {
    ALIMTALK = "ALIMTALK",
}

/**
 * 기관용>채널 선택 옵션 (API 통신용) Enum
 */
export const enum CenterOneTouchChannelOptionsAPIEnum {
    ONE_TOUCH_BASIC = "ONE_TOUCH_BASIC",
    ONE_TOUCH_WORKNET = "ONE_TOUCH_WORKNET",
}

/**
 * 기본 채널 라벨
 */
export const CenterBasicChannelOptionLabel: Map<CenterBasicChannelOptionEnum, CheckBoxType> = new Map([
    [CenterBasicChannelOptionEnum.YOBOLOVE_RECRUITINGS, { title: "요보사랑 구인게시판 (필수)", isSelectable: false }],
    [CenterBasicChannelOptionEnum.SEND_ALIMTALK_TO_JOBSEEKR, { title: "구직자에게 알림톡 발송" }],
]);

/**
 * 원터치 채널 라벨 converter
 * @param isWorknetSelectable
 */
export const convertCenterOneTouchChannelOptionLabel = (isWorknetSelectable: boolean): Map<CenterOneTouchChannelOptionEnum, CheckBoxType> => {
    const result = new Map<CenterOneTouchChannelOptionEnum, CheckBoxType>([[CenterOneTouchChannelOptionEnum.YOYANGNARA_NAVERCAFE, { title: "요양나라·네이버 카페" }]]);

    if (isWorknetSelectable) {
        result.set(CenterOneTouchChannelOptionEnum.JOBCENTER_WORKNET, {
            title: "일자리센터·워크넷",
            desc: (
                <>
                    <strong>*주 15시간 미만, 3개월 미만</strong>의 근무 공고는 등록되지 않을 수 있어요
                </>
            ),
        });
    }

    return result;
};

/**
 * 채널 관련 텍스트 표시할 때 사용할 Map
 */
export const CenterOneTouchChannelOptionsLabel: Map<CenterOneTouchChannelOptionsEnum, string> = new Map([
    [CenterOneTouchChannelOptionsEnum.SEND_ALIMTALK_TO_JOBSEEKR, "구직자에게 알림톡 발송"],
    [CenterOneTouchChannelOptionsEnum.YOYANGNARA_NAVERCAFE, "요양나라·네이버 카페"],
    [CenterOneTouchChannelOptionsEnum.JOBCENTER_WORKNET, "일자리센터·워크넷"],
]);

export const CenterOneTouchChannelAPIOptions: Map<CenterOneTouchChannelOptionEnum, CenterOneTouchChannelOptionsAPIEnum[]> = new Map([
    [CenterOneTouchChannelOptionEnum.YOYANGNARA_NAVERCAFE, [CenterOneTouchChannelOptionsAPIEnum.ONE_TOUCH_BASIC]],
    [CenterOneTouchChannelOptionEnum.JOBCENTER_WORKNET, [CenterOneTouchChannelOptionsAPIEnum.ONE_TOUCH_WORKNET]],
]);
