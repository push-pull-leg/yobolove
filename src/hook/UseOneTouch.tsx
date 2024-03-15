import { useEffect, useState } from "react";
import deepcopy from "deepcopy";
import {
    CenterBasicChannelOptionEnum,
    CenterBasicChannelOptionLabel,
    CenterOneTouchChannelOptionEnum,
    convertCenterOneTouchChannelOptionLabel,
} from "../enum/CenterOneTouchChannelOptionsEnum";
import JobEnum from "../enum/JobEnum";
import { CheckBoxType } from "../type/CheckBoxType";
import UseCenterService from "./UseCenterService";
import SubmitToConfirmCenterRecruitingContentInterface from "../interface/SubmitToConfirmCenterRecruitingContentInterface";
import RecruitingSessionStorageKeys from "../enum/RecruitingSessionStorageKeys";
import StorageUtil from "../util/StorageUtil";
import SelectedChannelsType from "../type/SelectedChannelsType";
import ConverterUtil from "../util/ConverterUtil";

type WrittenRecruitingJobType = JobEnum | undefined;

type SessionStorageDataType = {
    /**
     * 선택했던 채널들
     */
    selectedChannels: SelectedChannelsType;
    /**
     * 구인공고에 입력해둔 데이터들
     */
    writtenRecruitingContent: SubmitToConfirmCenterRecruitingContentInterface | null;
    /**
     * 구인공고에서 선택했던 근무형태들
     */
    writtenRecruitingJob: WrittenRecruitingJobType;
};

type OneTouchChannelOptionLabelType = Map<CenterOneTouchChannelOptionEnum, CheckBoxType>;

type ChannelOptionLabelType = {
    /**
     * 기본 채널 옵션 라벨
     */
    basic: Map<CenterBasicChannelOptionEnum, CheckBoxType>;
    /**
     * 원터치 채널 옵션 라벨
     */
    oneTouch: OneTouchChannelOptionLabelType;
};

/**
 * 원터치 관련 페이지들
 */
type ONE_TOUCH_PAGE_TYPE = "RECRUITING" | "SELECT_CHANNEL" | "MORE_INFO" | "FINAL_CHECK";

interface UseOneTouchProps {
    pageType: ONE_TOUCH_PAGE_TYPE;
}

const MORE_INFO_NEED_CHANNELS = [CenterOneTouchChannelOptionEnum.YOYANGNARA_NAVERCAFE, CenterOneTouchChannelOptionEnum.JOBCENTER_WORKNET];
const WORKNET_SELECTABLE_JOB_CASE = [JobEnum.VISIT_CARE, JobEnum.HOME_CARE, JobEnum.VISIT_BATH];

function UseOneTouch({ pageType }: UseOneTouchProps) {
    /**
     * 해당 페이지가 렌더 가능한 상태인가
     */
    const [isPageRenderable, setIsPageRenderable] = useState<boolean>(false);
    /**
     * isPageRenderable를 확인하는 것이 끝났는가
     */
    const [isPageRenderableCheckDone, setIsPageRenderableCheckDone] = useState<boolean>(false);
    /**
     * sessionStorage 관련 데이터
     */
    const [sessionStorageData, setSessionStorageData] = useState<SessionStorageDataType>({
        selectedChannels: null,
        writtenRecruitingContent: null,
        writtenRecruitingJob: undefined,
    });
    /**
     * [채널 선택 페이지] 채널 옵션 라벨
     */
    const [channelOptionLabel, setChannelOptionLabel] = useState<ChannelOptionLabelType>({
        basic: new Map<CenterBasicChannelOptionEnum, CheckBoxType>(),
        oneTouch: new Map<CenterOneTouchChannelOptionEnum, CheckBoxType>(),
    });

    const { getIsExistedCenterMoreInfo } = UseCenterService();

    /**
     * 페이지에 접근 가능한지 여부를 판단
     */
    const checkPageRenderable = async (selectedChannels: SelectedChannelsType, writtenRecruitingContent: SubmitToConfirmCenterRecruitingContentInterface | null) => {
        if (pageType === "SELECT_CHANNEL") {
            return !!writtenRecruitingContent;
        }

        if (pageType === "MORE_INFO" || pageType === "FINAL_CHECK") {
            if (!writtenRecruitingContent || !selectedChannels) return false;

            /**
             * 이미 추가 정보를 등록했었는지 판별
             */
            const isAlreadyRegisteredMoreInfo = await getIsExistedCenterMoreInfo();

            /**
             * 추가 정보가 필요한지 판별
             */
            const isMoreInfoNeeded = ConverterUtil.isTargetSomeInArr(MORE_INFO_NEED_CHANNELS, selectedChannels.oneTouchChannelSet);

            if (pageType === "MORE_INFO") {
                const canAccessMoreInfoPage = !isAlreadyRegisteredMoreInfo && isMoreInfoNeeded;
                return canAccessMoreInfoPage;
            }

            const canAccessFinalCheckPage = isMoreInfoNeeded ? !!isAlreadyRegisteredMoreInfo : true;
            return canAccessFinalCheckPage;
        }

        return false;
    };

    /**
     * '채널 선택' 페이지에서 업데이트 해줘야 하는 로직들이 들어있는 함수
     * @param selectedChannels
     * @param isWorknetSelectable
     */
    const updateSelectChannelPage = (selectedChannels: SelectedChannelsType, writtenRecruitingJob: WrittenRecruitingJobType) => {
        /**
         * 워크넷 채널이 선택 가능한지 여부
         */
        const isWorknetSelectable = WORKNET_SELECTABLE_JOB_CASE.includes(writtenRecruitingJob);

        /**
         * 원터치 채널 라벨 convert 후, setState
         */
        const centerOneTouchChannelOptionLabel = convertCenterOneTouchChannelOptionLabel(isWorknetSelectable);
        setChannelOptionLabel({ basic: CenterBasicChannelOptionLabel, oneTouch: centerOneTouchChannelOptionLabel });

        /**
         * 워크넷 옵션이 세션스토리지에 (선택 되어) 있는지 여부
         */
        const isWorknetSelectedInSessionStorage = selectedChannels?.oneTouchChannelSet?.includes(CenterOneTouchChannelOptionEnum.JOBCENTER_WORKNET);

        /**
         * 워크넷 옵션이 선택 불가한데, 세션스토리지에 이미 선택되어져 있는 경우 -> 워크넷 옵션 제거 (위치: 세션 스토리지, useState)
         */
        if (!isWorknetSelectable && isWorknetSelectedInSessionStorage) {
            /**
             * (워크넷이 제거된) 선택된 채널을 만듦.
             */
            const filteredWorknet = selectedChannels.oneTouchChannelSet.filter(channel => channel !== CenterOneTouchChannelOptionEnum.JOBCENTER_WORKNET);
            const selectedChannelsFilteredWorknet = { ...selectedChannels, oneTouchChannelSet: filteredWorknet };

            StorageUtil.setItem(RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL, selectedChannelsFilteredWorknet);
            setSessionStorageData(prevState => ({ ...prevState, selectedChannels: selectedChannelsFilteredWorknet }));
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const selectedChannels: SelectedChannelsType = JSON.parse(sessionStorage.getItem(RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL) || "null");
            const writtenRecruitingContent = JSON.parse(sessionStorage.getItem(RecruitingSessionStorageKeys.WRITTEN_RECRUITING_CONTENT) || "null");
            const writtenRecruitingJob = writtenRecruitingContent?.job;

            /**
             * 페이지별로 렌더가 가능한지를 조건에 따라 판별
             */
            const checkedPageRenderable = await checkPageRenderable(selectedChannels, writtenRecruitingContent);

            setSessionStorageData({ selectedChannels, writtenRecruitingContent, writtenRecruitingJob });

            if (checkedPageRenderable && pageType === "SELECT_CHANNEL") updateSelectChannelPage(selectedChannels, writtenRecruitingJob);

            setIsPageRenderable(checkedPageRenderable);
            setIsPageRenderableCheckDone(true);
        };

        loadData();
    }, []);

    /**
     * 모든 원터치 채널이 선택 불가하게 만드는 함수
     * @param oneTouchChannelOptionLabel
     */
    const convertOneTouchChannelOptionLabelDisable = (oneTouchChannelOptionLabel: OneTouchChannelOptionLabelType) => {
        const copiedOneTouchChannelOptionLabel = deepcopy(oneTouchChannelOptionLabel);

        copiedOneTouchChannelOptionLabel.forEach((checkBoxData, key) => {
            const copiedCheckBoxData = { ...checkBoxData };

            copiedCheckBoxData.isSelectable = false;
            if (copiedCheckBoxData.desc) delete copiedCheckBoxData.desc;

            copiedOneTouchChannelOptionLabel.set(key, copiedCheckBoxData);
        });
        return copiedOneTouchChannelOptionLabel;
    };

    return {
        sessionStorageData,
        channelOptionLabel,
        isPageRenderable,
        isPageRenderableCheckDone,
        convertOneTouchChannelOptionLabelDisable,
    };
}

export default UseOneTouch;
