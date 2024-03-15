/* eslint-disable prefer-const */
import { useRecoilState, useSetRecoilState } from "recoil";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { css } from "@emotion/css";
import queryString from "query-string";
import { toRem } from "../styles/options/Function";
import LongSwiper from "./LongSwiper";
import Address from "./form/Address";
import MultipleSelect from "./form/MultipleSelect";
import filterService, { initFilterData } from "../service/RecruitingsFilterService";
import AddressType from "../type/AddressType";
import Agree from "./form/Agree";
import JobEnum, { JobLabel } from "../enum/JobEnum";
import { recruitingsFilterDataRecoilState } from "../recoil/RecruitingsFilteDatarRecoil";
import RecruitingsFilterDataInterface from "../interface/RecruitingsFilterDataInterface";
import TimeRange from "./form/TimeRange";
import breakpoints from "../styles/options/Breakpoints";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import RecruitingsFilterUtil from "../util/RecruitingsFilterUtil";
import { WorkTimeType } from "../type/WorkTimeType";
import EventUtil from "../util/EventUtil";
import UsePreventBack from "../hook/UsePreventBack";
import { zRecruitingsFilterDialogJobSelect } from "../styles/options/ZIndex";
import { TimeRangeInterface } from "../interface/TimeRangeInterface";

const titleWrapper = css`
    padding-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    @media (min-width: ${Number(breakpoints.values?.md)}px) {
        padding-top: 2rem;
        margin-bottom: 1.5rem;
    }
`;

const helperIcon = css`
    vertical-align: sub;
`;

const formInput = css`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    @media (min-width: ${Number(breakpoints.values?.md)}px) {
        gap: 1.5rem;
    }
`;

const jobSelect = css`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: ${zRecruitingsFilterDialogJobSelect};
    background: white;
`;

const form = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export interface InputInterface<T> {
    setValue: (value: T) => void;
}

/**
 * {@link RecruitingsFilterDialog} props
 * @category PropsType
 */
type RecruitingsFilterDialogPropsType = {
    /**
     * 필터 오픈 여부
     */
    open: boolean;
    /**
     * 필터 닫을때 이벤트 핸들러
     */
    onClose: () => void;
    /**
     * 필터 데이터 변경될때 이벤트 핸들러
     */
    onChange: (filterData: RecruitingsFilterDataInterface) => Promise<void>;

    /**
     * 컴포넌트가 mount 되고 나서 parent 에게 filter data를 전달해준다.
     */
    onLoad: (filterData: RecruitingsFilterDataInterface) => void;
    /**
     * 초기 filter data
     */
    initialFilterData?: RecruitingsFilterDataInterface;
};

/**
 * 근무 가능 시간대 보이는 경우
 */
const WORK_AVAILABLE_TIME_SHOW_CASE = [JobEnum.VISIT_CARE, JobEnum.VISIT_BATH];

/**
 * 구인게시판 필터
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A90730)
 * @category Component
 */
function RecruitingsFilterDialog({ open, onClose, onChange, onLoad, initialFilterData }: RecruitingsFilterDialogPropsType) {
    const router = useRouter();
    UsePreventBack("recruitings-filter-dialog", open, onClose);
    /**
     * filter data recoil : 데이터가 변경될때마다 global state 로 넣어둠. > 최종변경될때만 사용
     */
    const [recruitingsFilterDataRecoil, setRecruitingsFilterDataRecoil] = useRecoilState(recruitingsFilterDataRecoilState);
    /**
     * filter data : 로컬환경에서 변경될때마다 바로바로 적용
     */
    const [filterData, setFilterData] = useState<RecruitingsFilterDataInterface>(filterService.init(recruitingsFilterDataRecoil || initFilterData, initialFilterData));
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    /**
     * useRef 활용한 자식 컴포넌트 setState 접근
     */
    const addressInputValue = useRef<InputInterface<AddressType | undefined>>(null);
    const multipleSelectInputValue = useRef<InputInterface<JobEnum[] | undefined>>(null);
    const agreeCheckBoxValue = useRef<InputInterface<boolean>>(null);
    const timeRangeInputValue = useRef<InputInterface<WorkTimeType | undefined>>(null);

    const onAddressChange = (_name: string, value: AddressType | undefined) => {
        if (!value) {
            setFilterData(prevState => ({ ...prevState, address: undefined }));
        } else {
            setFilterData(prevState => ({ ...prevState, address: { lotAddressName: value?.lotAddressName || "" } }));
        }
    };

    /**
     * 급여유형변경 value change event handler. 방문요양이 없으면 workTime 은 초기화
     * @param _name
     * @param value
     */
    const onJobsChange = (_name: string, value: JobEnum[]) => {
        if (!value?.includes(JobEnum.VISIT_CARE)) {
            setFilterData(prevState => ({ ...prevState, jobs: value, workTime: undefined }));
            timeRangeInputValue?.current?.setValue(undefined);
        } else {
            setFilterData(prevState => ({ ...prevState, jobs: value }));
        }
    };

    /**
     * 임시대근 value change event handler
     * @param _name
     * @param value
     */
    const onIsTemporaryChange = (_name: string, value: boolean) => {
        setFilterData(prevState => ({ ...prevState, isTemporary: value }));
    };

    /**
     * 근무시간 value change event handler
     * @param _name
     * @param value
     */
    const onVisitTimesChange = (_name: string, value: TimeRangeInterface | undefined) => {
        setFilterData(prevState => ({ ...prevState, workTime: value ? { ...prevState.workTime, startAt: value.startAt, endAt: value.endAt, days: value.days } : undefined }));
    };

    /**
     * 모든 값 초기화. 어디서도 먼저 입력한 값이 없기 때문에 모든 데이터를 초기화 해줘야된다.
     */
    const reset = async () => {
        // 각 input 초기화
        addressInputValue?.current?.setValue(undefined);
        multipleSelectInputValue?.current?.setValue([]);
        agreeCheckBoxValue?.current?.setValue(false);
        timeRangeInputValue?.current?.setValue(undefined);

        // state data 초기화
        setFilterData(initFilterData);

        // Service 초기화
        filterService.setData(initFilterData);

        // recoil 초기화
        setRecruitingsFilterDataRecoil(initFilterData);

        await onChange(initFilterData);
        EventUtil.gtmEvent("click", "filterReset", "board", "0");
        // query params 초기화
        await router.replace("/recruitings", `/${encodeURI("게시판")}`);
        onClose();
    };

    /**
     * 확인 버튼 눌렀을 때는 input 값과 state 값은 변경시켜줄 필요 없음
     */
    const confirm = async () => {
        filterService.setData(filterData);
        setRecruitingsFilterDataRecoil(filterData);
        if (Object.keys(RecruitingsFilterUtil.getQueryParamsByFilterData(filterData)).length > 0) {
            router.push(
                { query: RecruitingsFilterUtil.getQueryParamsByFilterData(filterData) },
                `/${encodeURI("게시판")}?${queryString.stringify(RecruitingsFilterUtil.getQueryParamsByFilterData(filterData))}`,
            );
        }
        await onChange(filterData);
        EventUtil.gtmEvent("click", "filterComplete", "board", "0");
        onClose();
    };

    const openResetDialog = () => {
        setDialogRecoil({
            open: true,
            title: "입력했던 조건들을 모두 없앨까요?",
            hasCancelButton: true,
            cancelButtonText: "유지하기",
            confirmButtonText: "없애기",
            confirmButtonStyle: "outlined",
            onConfirm: () => {
                reset();
            },
        });
    };

    /**
     * 초기설정
     */
    useEffect(() => {
        if (router.query) {
            setRecruitingsFilterDataRecoil(filterService.getData());
        }
        onLoad(filterData);
    }, []);

    /**
     * 근무 가능 시간대 필드 보이는 조건 판별
     */
    const isWorkAvailableTimeShow = useMemo(
        () => filterData?.jobs?.some(job => WORK_AVAILABLE_TIME_SHOW_CASE.includes(job)) && !filterData?.isTemporary,
        [filterData?.jobs, filterData?.isTemporary],
    );

    return (
        <LongSwiper onClose={onClose} open={open} title="근무조건" padding={{ md: 8, sm: 4 }}>
            <div className={form}>
                <div>
                    <div className={titleWrapper}>
                        <Typography variant="caption" sx={{ color: "rgba(0, 0, 0, 0.54)", maxWidth: "70%" }}>
                            근무조건 입력 시 조건에 맞는 공고만 볼 수 있어요
                        </Typography>
                        <Button
                            size="small"
                            sx={{ padding: "5px 10px 3px", fontWeight: 500, fontSize: toRem(18), lineHeight: "1.2" }}
                            variant="unselected"
                            onClick={openResetDialog}
                        >
                            초기화
                        </Button>
                    </div>
                    <div className={formInput}>
                        <Address
                            title="주 근무지역"
                            helperText={
                                <>
                                    <HelpOutlineIcon className={helperIcon} sx={{ fontSize: toRem(18) }} /> 근무지까지의 이동 시간을 알려드리기 위해 사용돼요!
                                </>
                            }
                            name="bcode"
                            defaultValue={recruitingsFilterDataRecoil?.address}
                            placeholder="주소 검색"
                            onChange={onAddressChange}
                            innerRef={addressInputValue}
                        />
                        <div className={jobSelect}>
                            <MultipleSelect<JobEnum>
                                title="근무 형태"
                                name="jobs"
                                defaultValue={recruitingsFilterDataRecoil?.jobs}
                                placeholder="근무 형태 선택"
                                data={JobLabel}
                                onChange={onJobsChange}
                                innerRef={multipleSelectInputValue}
                            />
                            <Agree
                                name="isTemporary"
                                defaultValue={recruitingsFilterDataRecoil?.isTemporary}
                                title="임시대근만 보기"
                                onChange={onIsTemporaryChange}
                                innerRef={agreeCheckBoxValue}
                            />
                        </div>
                        {isWorkAvailableTimeShow && (
                            <TimeRange
                                title="근무 가능 시간대(방문요양·목욕)"
                                titlePrefix="근무"
                                name="visitTimes"
                                innerRef={timeRangeInputValue}
                                onChange={onVisitTimesChange}
                                defaultValue={recruitingsFilterDataRecoil?.workTime}
                            />
                        )}
                    </div>
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    role="button"
                    sx={{ height: toRem(52), mt: { lg: toRem(80), md: toRem(80), xs: toRem(32) }, sm: toRem(32) }}
                    fullWidth
                    onClick={confirm}
                >
                    조건 설정 완료
                </Button>
            </div>
        </LongSwiper>
    );
}

RecruitingsFilterDialog.defaultProps = {
    initialFilterData: undefined,
};
export default React.memo(RecruitingsFilterDialog);
