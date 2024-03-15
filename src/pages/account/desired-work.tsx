import type { GetServerSideProps, NextPage } from "next";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Add, HelpOutline, Remove } from "@mui/icons-material";
import { css } from "@emotion/css";
import Script from "next/script";
import sectionStyle from "../../styles/sectionStyle";
import Form from "../../components/form/Form";
import EndpointEnum from "../../enum/EndpointEnum";
import MultipleSelect from "../../components/form/MultipleSelect";
import JobEnum, { JobLabel } from "../../enum/JobEnum";
import CaregiverDesiredWorkInterface from "../../interface/CaregiverDesiredWorkInterface";
import Address from "../../components/form/Address";
import Radio from "../../components/form/Radio";
import GenderEnum, { GenderLabel } from "../../enum/GenderEnum";
import CompleteDementiaEnum, { CompleteDementiaLabel } from "../../enum/CompleteDementiaEnum";
import PossibleCareBedriddenEnum, { PossibleCareBedriddenLabel } from "../../enum/PossibleCareBedriddenEnum";
import TimeRange from "../../components/form/TimeRange";
import Select from "../../components/form/Select";
import PossibleDistanceMinuteEnum, { PossibleDistanceMinuteLabel } from "../../enum/PossibleDistanceMinuteEnum";
import usePreventMove from "../../hook/UsePreventMove";
import WithCaregiverAuth from "../../hoc/WithCaregiverAuth";
import PostCaregiverDesiredWorkRequestInterface from "../../interface/request/PostCaregiverDesiredWorkRequestInterface";
import UseCaregiverService from "../../hook/UseCaregiverService";
import IconTypography from "../../components/IconTypography";
import Spacer from "../../components/Spacer";
import PreferCaregiverGenderEnum, { PreferCaregiverGenderLabel } from "../../enum/PreferCaregiverGenderEnum";
import Skeleton from "../../components/skeleton/ListSkeleton";
import UseTitle from "../../hook/UseTitle";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";
import EventUtil from "../../util/EventUtil";
import ConverterUtil from "../../util/ConverterUtil";

const accordionStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    margin: 0 auto;
    padding: 0;
`;

/**
 * 구직자서비스 - 희망근무조건 설정
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1502%3A74619)
 * @category Page
 * @Caregiver
 */
// TODO: [제대로 동작하는지 여부 확인 필요] TimeRange 컴포넌트 수정
const DesiredWork: NextPage = function DesiredWork() {
    UseTitle("희망 근무조건", "희망 근무조건");
    const { setAllowMove, setPreventMoveDialogData } = usePreventMove("근무조건 수정을 그만두시겠어요?", "나가면 입력했던 내용이 사라집니다", "계속 작성");
    const { setDesiredWork, getDesiredWork } = UseCaregiverService();
    const [isNew, setIsNew] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<boolean>(false);

    // TODO: [잘 동작하는지 확인] 이유: CaregiverDesiredWorkInterface 수정
    const [caregiverDesiredWork, setCaregiverDesiredWork] = useState<CaregiverDesiredWorkInterface | "loading" | undefined>("loading");

    /**
     * useCaregiverService 에서 희망근무조건 불러오기.
     * desiredWork 정보가 있으면 새로등록 여부 false / 초기 선택사항 accordion 열어둠
     */
    // TODO: [잘 동작하는지 확인] getDesiredWork 인터페이스 수정
    const getCaregiverDesiredWork = async () => {
        const desiredWork = await getDesiredWork();
        setCaregiverDesiredWork(desiredWork);
        if (desiredWork) {
            setIsNew(false);
            setExpanded(true);
            setPreventMoveDialogData("근무조건 수정을 그만두시겠어요?", "나가면 입력했던 내용이 사라집니다", "계속 작성");
        } else {
            setAllowMove(false);
            setIsNew(true);
            setExpanded(false);
            setPreventMoveDialogData("작성을 그만두시겠어요?", "근무조건을 작성하지 않으면 일자리 알림을 받을 수 없어요.", "계속 작성");
        }
    };
    const onSubmit = useCallback(
        /**
         * form 에서 받은 데이터를 useCaregiverService 에 희망근무 조건 저장하기
         */
        async (request: PostCaregiverDesiredWorkRequestInterface): Promise<void> => {
            const requestReformmated = { ...request, address: ConverterUtil.removeUselessProps(request.address, ["roadAddressName"]) };
            setAllowMove(true);
            await setDesiredWork(requestReformmated, isNew ? EndpointEnum.POST_CAREGIVER_DESIRED_WORK : EndpointEnum.PUT_CAREGIVER_DESIRED_WORK);
        },
        [isNew],
    );

    const handleExpand = useCallback(
        /**
         * 추가선택사항 클릭. expanded 열기/닫기
         * gtm 등록
         * @param _e 사용안함
         * @param currentExpanded Accordion 확장 여부
         * @gtm
         */
        (_e: React.SyntheticEvent, currentExpanded: boolean) => {
            setExpanded(currentExpanded);
            if (currentExpanded) {
                EventUtil.gtmEvent("click", "openAdditional", "work", "0");
            } else {
                EventUtil.gtmEvent("click", "closeAdditional", "work", "0");
            }
        },
        [],
    );

    const onLoad = useCallback(
        /**
         * 카카오 스크립트 onLoad 시 init
         */
        () => {
            if (!window) return;
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_CLIENT_KEY);
        },
        [],
    );
    useEffect(() => {
        getCaregiverDesiredWork();
    }, []);

    if (caregiverDesiredWork === "loading") {
        return <Skeleton />;
    }

    return (
        <>
            <Script
                src="https://t1.kakaocdn.net/kakao_js_sdk/2.0.0/kakao.min.js"
                onLoad={onLoad}
                strategy="afterInteractive"
                integrity="sha384-PFHeU/4gvSH8kpvhrigAPfZGBDPs372JceJq3jAXce11bVA6rMvGWzvP4fMQuBGL"
                crossOrigin="anonymous"
            />
            <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, pb: 8, textAlign: "left" }, "sm")}>
                {isNew ? (
                    <Typography variant="h3" sx={{ mb: 7, width: "100%" }}>
                        조건 5개만 등록하고
                        <br />
                        쉽고 빠르게 일자리 알림 받으세요
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            등록하신 근무조건에 맞는 일자리가 생기면
                            <br />
                            카톡 / 문자로 알림을 드려요.
                        </Typography>
                    </Typography>
                ) : (
                    <Typography variant="h3" sx={{ mb: 7, width: "100%" }}>
                        꼭 맞는 일자리만 알려드릴 수 있게 희망 근무조건을 작성해주세요
                    </Typography>
                )}
                <Form<PostCaregiverDesiredWorkRequestInterface> buttonText="근무조건 저장" onSubmit={onSubmit} onChange={() => setAllowMove(false)}>
                    <MultipleSelect<JobEnum>
                        title="희망 직종"
                        name="caregiverDesiredJobSet"
                        placeholder="희망 직종 선택"
                        defaultValue={caregiverDesiredWork?.caregiverDesiredJobSet}
                        data={JobLabel}
                        required
                    />
                    <Spacer />
                    <Address
                        title="주 근무지역"
                        name="address"
                        placeholder="주소 검색"
                        defaultValue={caregiverDesiredWork?.address}
                        required
                        helperText={
                            <IconTypography
                                iconColor="text.secondary"
                                icon={<HelpOutline fontSize="small" color="inherit" />}
                                label="근무지까지의 이동 시간을 알려드리기 위한 목적으로만 사용돼요!"
                                labelColor="inherit"
                            />
                        }
                    />
                    <Spacer />
                    <Radio<GenderEnum>
                        title="요양보호사님의 성별"
                        name="gender"
                        placeholder="요양보호사님의 성별"
                        defaultValue={caregiverDesiredWork?.gender}
                        data={GenderLabel}
                        required
                        row
                    />
                    <Spacer />
                    <Select<PreferCaregiverGenderEnum>
                        title="케어 가능한 어르신 성별"
                        name="preferCareGender"
                        placeholder="케어 가능한 어르신 성별 선택"
                        defaultValue={
                            caregiverDesiredWork?.preferCareGender
                                ? (caregiverDesiredWork?.preferCareGender.toString() as PreferCaregiverGenderEnum)
                                : PreferCaregiverGenderEnum.DONT_CARE
                        }
                        data={PreferCaregiverGenderLabel}
                        required
                        parsing={(value: PreferCaregiverGenderEnum) => (value === PreferCaregiverGenderEnum.DONT_CARE ? undefined : (value.toString() as GenderEnum))}
                    />
                    <Spacer />
                    <Radio<CompleteDementiaEnum>
                        title="치매교육 이수 여부"
                        name="isCompleteDementia"
                        placeholder="치매교육 이수 여부를 입력해주세요"
                        defaultValue={
                            caregiverDesiredWork?.isCompleteDementia ? (caregiverDesiredWork?.isCompleteDementia?.toString() as CompleteDementiaEnum) : CompleteDementiaEnum.false
                        }
                        data={CompleteDementiaLabel}
                        row
                        required
                        parsing={(value: string) => value !== "false"}
                    />
                    {!isNew && (
                        <>
                            <Spacer />
                            <Box sx={{ mx: { xs: -4, sm: -6, md: -8, lg: -8 } }}>
                                <Accordion
                                    elevation={0}
                                    square
                                    sx={{ backgroundColor: "#FAFAFA", width: "100%", px: { xs: 4, sm: 6, md: 8, lg: 8 } }}
                                    title="추가 정보(선택사항)"
                                    defaultExpanded={!isNew}
                                    onChange={handleExpand}
                                >
                                    <AccordionSummary expandIcon={expanded ? <Remove /> : <Add />}>
                                        <div>
                                            <Typography display="block" variant="h3">
                                                추가 정보(선택사항)
                                            </Typography>
                                            <Typography display="block" variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                작성해주시면 조건에 꼭 맞는 일자리 정보를 받는 데 도움이 돼요.
                                            </Typography>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails className={accordionStyle}>
                                        <Spacer />
                                        <Radio<PossibleCareBedriddenEnum>
                                            title="와상환자(1~2등급) 케어 가능 여부"
                                            name="isPossibleCareBedridden"
                                            placeholder="요양보호사 시험에 합격여부를 입력해주세요"
                                            defaultValue={
                                                caregiverDesiredWork && typeof caregiverDesiredWork?.isPossibleCareBedridden === "boolean"
                                                    ? (caregiverDesiredWork?.isPossibleCareBedridden.toString() as PossibleCareBedriddenEnum)
                                                    : undefined
                                            }
                                            data={PossibleCareBedriddenLabel}
                                            row
                                            parsing={(value: PossibleCareBedriddenEnum) => (value === undefined ? undefined : value !== "false")}
                                        />
                                        <Spacer />
                                        <Select<PossibleDistanceMinuteEnum>
                                            title="출퇴근 시 최대 이동 가능 시간"
                                            name="possibleDistanceMinute"
                                            placeholder="출퇴근 시 최대 이동 가능 시간"
                                            defaultValue={
                                                caregiverDesiredWork &&
                                                typeof caregiverDesiredWork?.possibleDistanceMinute === "number" &&
                                                caregiverDesiredWork?.possibleDistanceMinute !== 0
                                                    ? (caregiverDesiredWork?.possibleDistanceMinute.toString() as PossibleDistanceMinuteEnum)
                                                    : undefined
                                            }
                                            data={PossibleDistanceMinuteLabel}
                                            parsing={(value: PossibleDistanceMinuteEnum) => (value === undefined ? undefined : parseInt(value, 10))}
                                        />
                                        <Spacer />
                                        <TimeRange
                                            title="근무 가능 시간대"
                                            name="desiredWorkTime"
                                            defaultValue={caregiverDesiredWork?.desiredWorkTime}
                                            placeholder="시간대 선택"
                                            titlePrefix="근무 가능"
                                            helperText="희망직종에 “방문요양”을 고른 경우만 근무 시간대를 선택할 수 있어요."
                                        />
                                        <Spacer />
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </>
                    )}
                </Form>
            </Box>
        </>
    );
};
export default WithHeadMetaData(DesiredWork);

export const getServerSideProps: GetServerSideProps = WithCaregiverAuth(undefined, true);
