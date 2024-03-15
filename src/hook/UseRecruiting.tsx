import React, { ReactElement, useMemo, useRef, useState } from "react";
import { Button, DialogActions } from "@mui/material";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import deepcopy from "deepcopy";
import CenterContactInterface from "../interface/CenterContactInterface";
import SubmitToConfirmCenterRecruitingContentInterface from "../interface/SubmitToConfirmCenterRecruitingContentInterface";
import RecruitingIncludesOneTouchChannelInterface from "../interface/RecruitingIncludesOneTouchChannelInterface";
import JobEnum, { JobLabel } from "../enum/JobEnum";
import { TimeRangeInnerRefType } from "../components/form/TimeRange";
import Agree from "../components/form/Agree";
import Radio from "../components/form/Radio";
import UseOneTouch from "./UseOneTouch";
import { InputInterface } from "../components/RecruitingsFilterDialog";
import StorageUtil from "../util/StorageUtil";
import RecruitingSessionStorageKeys from "../enum/RecruitingSessionStorageKeys";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import useCenterService from "./UseCenterService";
import SelectedChannelsAPIType from "../type/SelectedChannelsAPIType";
import usePreventMove from "./UsePreventMove";
import RawCenterRecruitingContentInterface from "../interface/RawCenterRecruitingContentInterface";
import ConverterUtil from "../util/ConverterUtil";
import { CenterOneTouchChannelOptionsAPIEnum } from "../enum/CenterOneTouchChannelOptionsEnum";

const RECIPIENT_INFO_AND_STATUS_SHOW_CASE = [JobEnum.VISIT_CARE, JobEnum.HOME_CARE, JobEnum.VISIT_BATH];
const RECIPIENT_SERVICES_SHOW_CASE = [JobEnum.VISIT_CARE, JobEnum.HOME_CARE];

const WORKNET_JOBCENTER_CASE = [CenterOneTouchChannelOptionsAPIEnum.ONE_TOUCH_WORKNET];
const CANT_REVISE_RECRUITING_CASE = [CenterOneTouchChannelOptionsAPIEnum.ONE_TOUCH_BASIC];

const UUID_REGEX = /^[0-9a-f]{8}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{12}$/;

interface JobCenterInfo {
    isPublishedJobCenterWithInfo: boolean;
    jobCenterName: string;
    jobCenterPhoneNumber: string;
    canReviseRecruiting: boolean;
}

interface JobSelectionDomProps {
    job: JobEnum | undefined;
    isTemporary: boolean;
    onJobConfirmButtonClick: (jobSelected: JobEnum, isTemporarySelected: boolean) => void;
}

function JobSelectionDom({ job, isTemporary, onJobConfirmButtonClick }: JobSelectionDomProps) {
    const [jobSelected, setJobSelected] = useState<JobEnum | undefined>(job);
    const [isTemporarySelected, setIsTemporarySelected] = useState<boolean>(isTemporary);

    const clickConfirmButton = () => {
        if (!jobSelected) return;

        onJobConfirmButtonClick(jobSelected, isTemporarySelected);
    };

    return (
        <>
            <br />
            <Radio<JobEnum>
                title=""
                name="job"
                onChange={(_name: string, value: JobEnum) => setJobSelected(value)}
                defaultValue={jobSelected}
                data={JobLabel}
                required
                iconStyle="radio"
            />
            <br />
            <Agree name="isTemporary" title="임시대근이라면 체크" onChange={(_name: string, value: boolean) => setIsTemporarySelected(value)} defaultValue={isTemporarySelected} />
            <DialogActions sx={{ mt: 7, p: 0, width: "100%", flexDirection: "row" }}>
                <Button variant="contained" fullWidth onClick={clickConfirmButton} autoFocus size="large" role="button" data-cy="confirm" disabled={!jobSelected}>
                    확인
                </Button>
            </DialogActions>
        </>
    );
}

function UseRecruiting() {
    const contactInputRef = useRef<InputInterface<string>>(null);
    const timeRangeRef = useRef<TimeRangeInnerRefType>(null);
    const [recruiting, setRecruiting] = useState<SubmitToConfirmCenterRecruitingContentInterface | RecruitingIncludesOneTouchChannelInterface | undefined>(undefined);
    const [isDirectlyWriteVisitTime, setIsDirectlyWriteVisitTime] = useState<boolean>(false);
    const [contacts, setContacts] = useState<CenterContactInterface | undefined>(undefined);
    const [job, setJob] = useState<JobEnum | undefined>(undefined);
    const jobInput = useRef<InputInterface<string>>(null);
    const [isTemporary, setIsTemporary] = useState<boolean>(false);
    const [centerInfo, setCenterInfo] = useState<JobCenterInfo>({
        isPublishedJobCenterWithInfo: false,
        canReviseRecruiting: false,
        jobCenterName: "",
        jobCenterPhoneNumber: "",
    });

    const { sessionStorageData } = UseOneTouch({ pageType: "RECRUITING" });
    const { writtenRecruitingContent } = sessionStorageData;

    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    const isPageRenderable = !!recruiting;

    const { setAllowMove } = usePreventMove("구인공고 작성을 그만두시겠어요?", "이전으로 돌아가면 작성했던 내용이 사라집니다.");

    const router = useRouter();
    const { recruitingUuid } = router.query;

    const isShowRecipientInfoStatus = useMemo(() => (job ? RECIPIENT_INFO_AND_STATUS_SHOW_CASE.includes(job) : false), [job]);
    const isShowRecipientServices = useMemo(() => (job ? RECIPIENT_SERVICES_SHOW_CASE.includes(job) : false), [job]);

    const { getContacts, getRecruiting, getRecruitingChannels, getJobCenterInfo } = useCenterService();

    const updateJobCenterInfo = async (oneTouchChannelSet: CenterOneTouchChannelOptionsAPIEnum[]) => {
        /**
         * 일자리센터·워크넷에 등록했던 공고인가?
         */
        const isPublishedWorknetJobCenter = ConverterUtil.isTargetSomeInArr(oneTouchChannelSet, WORKNET_JOBCENTER_CASE);
        /**
         * 공고를 수정할 수 있는 채널들을 선택했나?
         */
        const canReviseRecruiting = !ConverterUtil.isTargetSomeInArr(oneTouchChannelSet, CANT_REVISE_RECRUITING_CASE);
        /**
         * 일자리센터 정보 가져오기
         */
        const { name: jobCenterName, phoneNum: jobCenterPhoneNumber } = await getJobCenterInfo({ uuid: recruitingUuid.toString() });
        /**
         * 일자리센터·워크넷 채널 선택 && 일자리센터가 있는 공고인지 여부
         */
        const isPublishedJobCenterWithInfo = isPublishedWorknetJobCenter && !!jobCenterName;

        return { isPublishedJobCenterWithInfo, jobCenterName, jobCenterPhoneNumber, canReviseRecruiting };
    };
    const onMount = async () => {
        setContacts(await getContacts());
        /**
         * 공고 등록일때
         */
        if (!recruitingUuid) {
            return;
        }
        /**
         * 공고 수정 혹은 재등록일때
         */
        const currentRecruiting = await getRecruiting({ uuid: recruitingUuid.toString() });
        const selectedChannels: SelectedChannelsAPIType = await getRecruitingChannels(recruitingUuid.toString());
        setRecruiting({ ...currentRecruiting, channels: selectedChannels });
        setJob(currentRecruiting?.job);
        setIsTemporary(Boolean(currentRecruiting?.isTemporary));
        setIsDirectlyWriteVisitTime(Boolean(currentRecruiting?.workTime?.memo));
        setCenterInfo(await updateJobCenterInfo(selectedChannels.oneTouchChannelSet));
    };

    const getJobText = (currentJob?: JobEnum, currentIsTemporary?: boolean): string => {
        if (!currentJob) return "";
        const text = JobLabel.get(currentJob) || "";
        return currentIsTemporary ? `${text} (대근)` : text;
    };
    /**
     * 근무 형태 Dialog 에서 근무 형태 선택시 실행 되는 함수
     * @param jobSelected
     * @param isTemporarySelected
     */
    const updateJobSelect = (jobSelected: JobEnum, isTemporarySelected: boolean) => {
        setJob(jobSelected);
        setIsTemporary(isTemporarySelected);
        jobInput?.current?.setValue?.(getJobText(jobSelected, isTemporarySelected));
    };
    const handleJobConfirmButton = (jobSelected: JobEnum, isTemporarySelected: boolean) => {
        updateJobSelect(jobSelected, isTemporarySelected);
        setDialogRecoil({
            open: false,
        });
    };
    const openSelectJob = (): void => {
        setDialogRecoil({
            open: true,
            title: "근무 형태",
            content: <JobSelectionDom onJobConfirmButtonClick={handleJobConfirmButton} job={job} isTemporary={isTemporary} />,
            hasCancelButton: false,
            hasConfirmButton: false,
            isCloseWhenBackDropClick: false,
        });
    };

    /**
     * 원터치 채널 선택 페이지로 이동 및 request(공고 관련)를 session storage에 저장 후 채널선택 페이지로 이동
     */
    const moveToSelectChannelPage = (convertedRequest: SubmitToConfirmCenterRecruitingContentInterface) => {
        StorageUtil.setItem(RecruitingSessionStorageKeys.WRITTEN_RECRUITING_CONTENT, convertedRequest);
        router.push("/center/recruitings/onetouch-channel", "/공고등록/채널선택");
    };
    /**
     * 근무 형태 정보와 페이지이동(setAllowMove) 설정 함수
     * @param request
     */
    const setJobInfoAndAllowMove = (request: RawCenterRecruitingContentInterface) => {
        setAllowMove(true);
        const currentRequest = deepcopy(request);
        if (job) currentRequest.job = job;
        currentRequest.isTemporary = isTemporary;
        return currentRequest;
    };

    /**
     * 공고 작성 중일 경우 세션에 저장된 정보를 가져와서 Form 에 저장
     */
    const setSessionDataToForm = () => {
        updateJobSelect(writtenRecruitingContent.job, writtenRecruitingContent.isTemporary);
        setRecruiting(writtenRecruitingContent);
        setIsDirectlyWriteVisitTime(Boolean(writtenRecruitingContent?.workTime?.memo));
    };

    const contactsData = useMemo<Map<string, string | ReactElement>>(() => {
        const data: Map<string, string | ReactElement> = new Map();
        if (!contacts) {
            if (recruiting?.contactNumber && !data.has(recruiting.contactNumber)) {
                data.set(recruiting.contactNumber, recruiting.contactNumber);
            }
            return data;
        }

        if (contacts.phoneNum) {
            data.set(contacts.phoneNum, contacts.phoneNum);
        }
        if (contacts.adminPhoneNum) {
            data.set(contacts.adminPhoneNum, contacts.adminPhoneNum);
        }
        contacts.extraPhoneNum.forEach((value: string) => {
            data.set(value, value);
        });
        if (recruiting?.contactNumber && !data.has(recruiting.contactNumber)) {
            data.set(recruiting.contactNumber, recruiting.contactNumber);
        }
        return data;
    }, [contacts, recruiting]);

    return {
        centerInfo,
        contactsData,
        isShowRecipientInfoStatus,
        isShowRecipientServices,
        openSelectJob,
        job,
        jobInput,
        getJobText,
        isTemporary,
        updateJobSelect,
        setIsDirectlyWriteVisitTime,
        setRecruiting,
        recruiting,
        setJob,
        setIsTemporary,
        isPageRenderable,
        writtenRecruitingContent,
        moveToSelectChannelPage,
        UUID_REGEX,
        onMount,
        contacts,
        timeRangeRef,
        isDirectlyWriteVisitTime,
        contactInputRef,
        recruitingUuid,
        setAllowMove,
        setSessionDataToForm,
        setJobInfoAndAllowMove,
    };
}

export default UseRecruiting;
