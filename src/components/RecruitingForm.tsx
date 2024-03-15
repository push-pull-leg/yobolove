import { Box, List, ListItem, ListItemText, Skeleton, Typography } from "@mui/material";
import { ArrowForwardIos, HelpOutline } from "@mui/icons-material";
import React, { ReactElement, useMemo } from "react";
import dayjs from "dayjs";
import sectionStyle from "../styles/sectionStyle";
import ConverterUtil from "../util/ConverterUtil";
import RecruitingService from "../service/RecruitingService";
import RecruitingIncludesOneTouchChannelInterface from "../interface/RecruitingIncludesOneTouchChannelInterface";
import Form from "./form/Form";
import RecruitingInterface from "../interface/RecrutingInterface";
import Text from "./form/Text";
import Address from "./form/Address";
import IconTypography from "./IconTypography";
import Spacer from "./Spacer";
import Select from "./form/Select";
import PayTypeEnum, { PayTypeLabel } from "../enum/PayTypeEnum";
import NumberInput from "./form/NumberInput";
import PreferCaregiverGenderEnum, { PreferCaregiverGenderLabel } from "../enum/PreferCaregiverGenderEnum";
import GenderEnum, { GenderLabel } from "../enum/GenderEnum";
import Radio from "./form/Radio";
import GradeEnum, { GradeLabel } from "../enum/GradeEnum";
import RecipientMotionStateEnum, { RecipientMotionStateLabel } from "../enum/RecipientMotionStateEnum";
import RecipientCognitiveStateEnum, { RecipientCognitiveStateLabel } from "../enum/RecipientCognitiveState";
import MultipleSelect from "./form/MultipleSelect";
import RecipientServiceLifeEnum, { RecipientServiceLifeLabel } from "../enum/RecipientServiceLifeEnum";
import RecipientServiceHomeEnum, { RecipientServiceHomeLabel } from "../enum/RecipientServiceHomeEnum";
import RecipientServiceCognitiveEnum, { RecipientServiceCognitiveLabel } from "../enum/RecipientServiceCognitiveEnum";
import RecipientServiceBodyEnum, { RecipientServiceBodyLabel } from "../enum/RecipientServiceBodyEnum";
import Date from "./form/Date";
import DirectWriteWorkHour from "./form/DirectWriteWorkHour";
import JobEnum from "../enum/JobEnum";
import MoveJobOffUnitEnum, { MoveJobOffUnitLabel } from "../enum/MoveJobOffUnitEnum";
import Label from "./form/Label";
import TimeRange, { TimeRangeInnerRefType } from "./form/TimeRange";
import Agree from "./form/Agree";
import SubmitToConfirmCenterRecruitingContentInterface from "../interface/SubmitToConfirmCenterRecruitingContentInterface";
import RawCenterRecruitingContentInterface from "../interface/RawCenterRecruitingContentInterface";
import { InputInterface } from "./RecruitingsFilterDialog";
import CenterContactInterface from "../interface/CenterContactInterface";

interface RecruitingFormProps {
    timeRangeRef: React.MutableRefObject<TimeRangeInnerRefType>;
    isDirectlyWriteVisitTime: boolean;
    recruiting: SubmitToConfirmCenterRecruitingContentInterface | RecruitingIncludesOneTouchChannelInterface | undefined;
    onSubmit: (request: RawCenterRecruitingContentInterface) => Promise<void>;
    isTemporary: boolean;
    job: JobEnum;
    setAllowMove: (currentAllowMove: boolean) => void;
    jobInput: React.MutableRefObject<InputInterface<string>>;
    isShowRecipientInfoStatus: boolean;
    setIsDirectlyWriteVisitTime: React.Dispatch<React.SetStateAction<boolean>>;
    setRecruiting: React.Dispatch<React.SetStateAction<SubmitToConfirmCenterRecruitingContentInterface | RecruitingIncludesOneTouchChannelInterface>>;
    contactsData: Map<string, string | React.ReactElement<any, string | React.JSXElementConstructor<any>>>;
    contactInputRef: React.MutableRefObject<InputInterface<string>>;
    recruitingUuid: string | string[];
    isShowRecipientServices: boolean;
    openSelectJob: () => void;
    getJobText: (currentJob?: JobEnum, currentIsTemporary?: boolean) => string;
    writtenRecruitingContent: SubmitToConfirmCenterRecruitingContentInterface;
    isLoading?: boolean;
    contacts: CenterContactInterface;
}

const NOW = dayjs();
const MIN_DATE_DEFAULT = NOW.format("YYYY-MM-DD");
const MAX_DATE = NOW.add(29, "day").format("YYYY-MM-DD");

function RecruitingForm({
    timeRangeRef,
    isDirectlyWriteVisitTime,
    recruiting,
    onSubmit,
    isTemporary,
    job,
    setAllowMove,
    jobInput,
    openSelectJob,
    getJobText,
    isShowRecipientInfoStatus,
    setIsDirectlyWriteVisitTime,
    setRecruiting,
    contactsData,
    contactInputRef,
    recruitingUuid,
    isShowRecipientServices,
    writtenRecruitingContent,
    isLoading,
    contacts,
}: RecruitingFormProps) {
    /**
     * 근무 요일/시간 관련 DOM
     */
    const dateDom = useMemo<ReactElement>(() => {
        const doms: ReactElement[] = [];

        if (isTemporary) {
            doms.push(
                <DirectWriteWorkHour
                    weeklyWorkHoursDefaultValue={recruiting?.workTime?.weeklyWorkHours}
                    workDayHourDefaultValue={recruiting?.workTime?.memo}
                    workDayHourTitle="근무 요일/시간"
                    workDayHourPlaceholder="근무일자, 요일, 시간 등을 상세히 입력해주세요."
                    isRequiredWeeklyWorkHours={false}
                    key="working-datetime-textarea"
                />,
            );
        } else if (job === JobEnum.HOME_CARE) {
            doms.push(
                <Box key="holidays" gap={3} display="flex" flexDirection="row" alignItems="flex-end">
                    <Select<MoveJobOffUnitEnum>
                        title="휴무일"
                        name="unit"
                        defaultValue={recruiting?.holiday?.unit || MoveJobOffUnitEnum.MONTH}
                        data={MoveJobOffUnitLabel}
                        required
                    />
                    <Select<string>
                        title=""
                        name="days"
                        defaultValue={recruiting?.holiday?.unit ? recruiting?.holiday?.days.toString() : "1"}
                        data={ConverterUtil.getNumberMap(1, 8, "", "회")}
                        required
                        parsing={parseInt}
                    />
                </Box>,
            );
        } else {
            const formatedTimeRangeDefaultValue = {
                days: recruiting?.workTime?.days,
                startAt: recruiting?.workTime?.startAt,
                endAt: recruiting?.workTime?.endAt,
            };

            doms.push(
                <Box key="working-datetime">
                    <Label required title="근무 요일/시간" id="working-datetime-title" />
                    <TimeRange
                        title=""
                        name="timeRange"
                        placeholder="요일/시간 선택"
                        defaultValue={recruiting?.workTime?.days ? formatedTimeRangeDefaultValue : undefined}
                        titlePrefix="근무"
                        showWeek
                        required={!isDirectlyWriteVisitTime}
                        disabled={isDirectlyWriteVisitTime}
                        innerRef={timeRangeRef}
                    />
                    <Agree
                        name="isDirectVisitTime"
                        title="요일/시간 직접 입력"
                        onChange={(_name: string, _value: boolean): void => {
                            timeRangeRef.current?.reset();
                            setIsDirectlyWriteVisitTime(_value);
                            setRecruiting({ ...recruiting, workTime: undefined });
                        }}
                        defaultValue={isDirectlyWriteVisitTime}
                    />
                    {isDirectlyWriteVisitTime && (
                        <DirectWriteWorkHour
                            workDayHourDefaultValue={recruiting?.workTime?.memo}
                            weeklyWorkHoursDefaultValue={recruiting?.workTime?.weeklyWorkHours}
                            workDayHourPlaceholder="요일/시간의 상세 설명이 필요하면 직접 입력해주세요. (오전/오후 중 선택 가능, 월 2회 주말 근무 등)"
                        />
                    )}
                </Box>,
            );
        }
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{doms}</>;
    }, [job, isTemporary, recruiting, isDirectlyWriteVisitTime]);

    const LoadingDom = useMemo<ReactElement>(
        () => (
            <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
                <List sx={{ width: "100%" }}>
                    <ListItem divider>
                        <ListItemText primary={<Skeleton variant="text" />} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Skeleton variant="text" />} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={<Skeleton variant="text" />} />
                    </ListItem>
                </List>
            </Box>
        ),
        [],
    );

    if (!contacts || isLoading) return LoadingDom;
    return (
        <Box
            display="flex"
            height="100%"
            alignItems="center"
            flexDirection="column"
            gap={6}
            {...sectionStyle(
                {
                    pt: 8,
                    textAlign: "left",
                },
                "sm",
                true,
            )}
        >
            {recruitingUuid && (
                <Typography variant="h3">{`[${ConverterUtil.convertSimpleAddress(recruiting?.address, false)}]${RecruitingService.getSubTitle(
                    recruiting as RecruitingIncludesOneTouchChannelInterface,
                )}`}</Typography>
            )}
            <Form<RecruitingInterface>
                buttonText="작성 완료"
                onSubmit={onSubmit}
                parameter={{ isTemporary, job }}
                onChange={(name: string, value: any) => {
                    if (name !== "contactNumber" && value !== "add" && value) {
                        setAllowMove(false);
                    }
                }}
            >
                {!recruitingUuid && (
                    <Text
                        title="근무 형태"
                        name="job"
                        placeholder="근무 형태"
                        endAdornment={<ArrowForwardIos />}
                        onClick={() => openSelectJob()}
                        innerRef={jobInput}
                        required
                        defaultValue={writtenRecruitingContent ? getJobText(writtenRecruitingContent?.job, writtenRecruitingContent?.isTemporary) : undefined}
                    />
                )}

                <Address
                    title="근무지 주소"
                    name="address"
                    placeholder="근무지 주소를 선택해주세요"
                    helperText={
                        <IconTypography
                            icon={<HelpOutline fontSize="small" color="inherit" />}
                            labelColor="inherit"
                            label="한번 등록한 주소는 변경할 수 없어요. 어르신의 개인정보 보호를 위해, 정확한 주소가 아닌 인근 주소로 등록하길 권장 드려요."
                        />
                    }
                    required
                    disabled={!!recruitingUuid}
                    defaultValue={recruiting?.address}
                />
                {dateDom}
                <Spacer />
                <Select<PayTypeEnum> title="급여 정보" name="payType" placeholder="급여 종류 선택" defaultValue={recruiting?.payType} data={PayTypeLabel} required />
                <NumberInput title="급여 액수" name="pay" placeholder="급여 액수" required labelStyle="input" defaultValue={recruiting?.pay} max={999999999} endAdornment="원" />
                <Spacer />
                <Select<PreferCaregiverGenderEnum>
                    title="선호 요양보호사님 성별"
                    name="preferCaregiverGender"
                    defaultValue={
                        recruiting?.preferCaregiverGender ? (recruiting?.preferCaregiverGender.toString() as PreferCaregiverGenderEnum) : PreferCaregiverGenderEnum.DONT_CARE
                    }
                    data={PreferCaregiverGenderLabel}
                    required
                    parsing={(value: PreferCaregiverGenderEnum) => (value === PreferCaregiverGenderEnum.DONT_CARE ? null : (value.toString() as GenderEnum))}
                />
                <Spacer />
                {isShowRecipientInfoStatus && (
                    <>
                        <Radio<GenderEnum>
                            title="어르신 정보"
                            name="gender"
                            placeholder="요양보호사님 성별"
                            defaultValue={recruiting?.recipient?.gender}
                            data={GenderLabel}
                            labelStyle="form"
                            labelVariant="subtitle1"
                            required
                            row
                        />
                        <Select<GradeEnum>
                            title=""
                            name="grade"
                            placeholder="등급"
                            defaultValue={recruiting?.recipient?.grade.toString() as GradeEnum}
                            data={GradeLabel}
                            parsing={parseInt}
                            required
                        />

                        <NumberInput title="연세" name="age" placeholder="연세" required labelStyle="input" defaultValue={recruiting?.recipient?.age} max={127} />

                        <Spacer />
                        <Select<RecipientMotionStateEnum>
                            title="어르신 거동상태"
                            name="motionState"
                            placeholder="어르신 거동상태"
                            defaultValue={recruiting?.recipient?.motionState}
                            data={RecipientMotionStateLabel}
                            required
                        />
                        <Spacer />
                        <Select<RecipientCognitiveStateEnum>
                            title="어르신 인지상태"
                            name="cognitiveState"
                            placeholder="어르신 인지상태"
                            defaultValue={recruiting?.recipient?.cognitiveState}
                            data={RecipientCognitiveStateLabel}
                            required
                        />
                        <Spacer />
                    </>
                )}

                {isShowRecipientServices && (
                    <>
                        <Typography variant="subtitle1">필요 서비스</Typography>
                        <MultipleSelect<RecipientServiceLifeEnum>
                            title="일상지원"
                            name="lifeSet"
                            placeholder="일상지원"
                            defaultValue={recruiting?.recipientService?.lifeSet}
                            data={RecipientServiceLifeLabel}
                            labelStyle="input"
                        />
                        <MultipleSelect<RecipientServiceHomeEnum>
                            title="가사지원"
                            name="homeSet"
                            placeholder="가사지원"
                            defaultValue={recruiting?.recipientService?.homeSet}
                            data={RecipientServiceHomeLabel}
                            labelStyle="input"
                        />
                        <MultipleSelect<RecipientServiceCognitiveEnum>
                            title="인지활동지원"
                            name="cognitiveSet"
                            placeholder="인지활동지원"
                            defaultValue={recruiting?.recipientService?.cognitiveSet}
                            data={RecipientServiceCognitiveLabel}
                            labelStyle="input"
                        />
                        <MultipleSelect<RecipientServiceBodyEnum>
                            title="신체활동지원"
                            name="bodySet"
                            placeholder="신체활동지원"
                            defaultValue={recruiting?.recipientService?.bodySet}
                            data={RecipientServiceBodyLabel}
                            labelStyle="input"
                        />
                    </>
                )}

                <Text
                    type="text"
                    title={
                        <>
                            특이사항&nbsp;
                            <Typography component="small" color="text.secondary">
                                (선택)
                            </Typography>
                        </>
                    }
                    name="memo"
                    placeholder="특이사항"
                    defaultValue={recruiting?.memo?.toString()}
                    rows={3}
                    maxLength={150}
                    autoSubmit={false}
                    showMaxLengthHelperText
                />
                <Date
                    required
                    title="마감일자"
                    name="expiredDate"
                    placeholder="마감일자 선택"
                    minDate={MIN_DATE_DEFAULT}
                    maxDate={MAX_DATE}
                    defaultValue={recruiting?.expiredDate}
                />
                <Select<string>
                    title="담당자 연락처"
                    name="contactNumber"
                    placeholder="담당자 연락처"
                    required
                    defaultValue={recruiting?.contactNumber || undefined}
                    data={contactsData}
                    innerRef={contactInputRef}
                />
            </Form>
        </Box>
    );
}

export default RecruitingForm;

RecruitingForm.defaultProps = {
    isLoading: false,
};
