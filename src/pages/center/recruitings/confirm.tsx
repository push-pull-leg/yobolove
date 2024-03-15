import React, { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Box, Button, Divider, List, Typography } from "@mui/material";
import dayjs from "dayjs";
import nl2br from "react-nl2br";
import UseOneTouch from "../../../hook/UseOneTouch";
import sectionStyle from "../../../styles/sectionStyle";
import UseCenterService from "../../../hook/UseCenterService";
import CenterOneTouchChannelOptionsEnum, {
    CenterBasicChannelOptionEnum,
    CenterOneTouchChannelOptionEnum,
    CenterOneTouchChannelOptionsLabel,
} from "../../../enum/CenterOneTouchChannelOptionsEnum";
import RecruitingRegistrationPassBox from "../../../components/RecruitingRegistrationPassBox";
import JobEnum, { JobLabel } from "../../../enum/JobEnum";
import RecruitingService from "../../../service/RecruitingService";
import UsePassCount from "../../../hook/UsePassCount";
import UseTitle from "../../../hook/UseTitle";
import EventUtil from "../../../util/EventUtil";

interface TypographyFlexProps {
    label: string;
    content: string;
    flexDirection?: "column" | "row";
    sx?: object;
}

const RENDER_ALMOST_ALL_INPUT_JOB_TYPES = [JobEnum.VISIT_CARE, JobEnum.HOME_CARE, JobEnum.VISIT_BATH];

function LabelAndContent({ label, content, flexDirection, sx }: TypographyFlexProps) {
    return (
        <Box display="flex" sx={{ mb: 4 }} flexDirection={flexDirection}>
            <Typography variant="h6" sx={{ ...sx, minWidth: "100px", fontWeight: 700, mr: 2 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {content}
            </Typography>
        </Box>
    );
}

function Confirm() {
    const { sessionStorageData, isPageRenderable, isPageRenderableCheckDone } = UseOneTouch({ pageType: "FINAL_CHECK" });
    const { selectedChannels, writtenRecruitingContent } = sessionStorageData;

    const { passCount, isPassCountLoading } = UsePassCount();

    const router = useRouter();

    const { createOrReregisterRecruiting } = UseCenterService();
    const { setTitle } = UseTitle();

    /**
     * isPageRenderableCheckDone 이 되고 isPageRenderable 하면 타이틀 설정
     * 그게 아니면 replace 처리
     */
    useEffect(() => {
        if (isPageRenderableCheckDone && !isPageRenderable) router.replace("/");
        else if (isPageRenderable) setTitle("구인공고 수정", "구인공고 수정");
    }, [isPageRenderable, isPageRenderableCheckDone]);

    /**
     * 선택한 채널 표시
     */
    const channelDom = useCallback((channels: CenterBasicChannelOptionEnum[] | CenterOneTouchChannelOptionEnum[] | null) => {
        if (!channels || channels?.length === 0) {
            return null;
        }
        return channels?.map(
            channel =>
                CenterOneTouchChannelOptionsLabel.get(channel as unknown as CenterOneTouchChannelOptionsEnum) && (
                    <Typography key={channel} sx={{ display: "list-item", ml: 2, mb: 1 }}>
                        {CenterOneTouchChannelOptionsLabel.get(channel as unknown as CenterOneTouchChannelOptionsEnum)}
                    </Typography>
                ),
        );
    }, []);

    /**
     * basicChannelDom - 무료 선택 채널 표시
     * onetouchChannelDom - 원터치 채널(유료 채널) 표시
     */
    const { basicChannelDom, onetouchChannelDom } = useMemo(
        () => ({
            basicChannelDom: channelDom(selectedChannels?.basicChannelSet),
            onetouchChannelDom: channelDom(selectedChannels?.oneTouchChannelSet),
        }),
        [selectedChannels?.oneTouchChannelSet, channelDom],
    );

    /**
     * 공고 등록 입력 항목에서 표시가 되지 않은 Input Field 를 여기서도 표시 하지 않음
     */
    const inputFieldDom = useMemo(() => {
        if (RENDER_ALMOST_ALL_INPUT_JOB_TYPES.includes(writtenRecruitingContent?.job)) {
            return (
                <>
                    <LabelAndContent label="어르신 정보" content={RecruitingService.getRecipientInfo(writtenRecruitingContent)} />
                    <LabelAndContent label="어르신 상태" content={RecruitingService.getRecipientState(writtenRecruitingContent)} />
                    {writtenRecruitingContent.job !== JobEnum.VISIT_BATH && (
                        <LabelAndContent label="필요 서비스" content={RecruitingService.getNeedServiceText(writtenRecruitingContent) || "-"} />
                    )}
                </>
            );
        }
        return null;
    }, [writtenRecruitingContent?.job]);

    const handleMoveToPrevPageButtonClick = () => {
        EventUtil.gtmEvent("click", "before", "cenRecruitingsConfirm", "0");

        router.push("/center/recruitings/onetouch-channel", "/공고등록/채널선택");
    };

    const handlePostButtonClick = () => {
        EventUtil.gtmEvent("click", "complete", "cenRecruitingsConfirm", "0");

        createOrReregisterRecruiting(writtenRecruitingContent, selectedChannels);
    };

    if (isPageRenderableCheckDone && !isPageRenderable) return null;
    if (!writtenRecruitingContent) return null;
    return (
        <Box display="flex" height="100%" alignItems="left" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
            <Typography variant="h3" align="left" sx={{ mb: 6 }}>
                구인공고를 등록하시겠어요?
            </Typography>
            <LabelAndContent label="근무 형태" content={JobLabel.get(writtenRecruitingContent.job)} />
            <LabelAndContent label="근무지 주소" content={writtenRecruitingContent.address?.roadAddressName || writtenRecruitingContent.address.lotAddressName} />
            {writtenRecruitingContent.job === "HOME_CARE" ? (
                <LabelAndContent label={writtenRecruitingContent.isTemporary ? "요일/시간" : "휴무일"} content={RecruitingService.getHolidayInfo(writtenRecruitingContent)} />
            ) : (
                <LabelAndContent label="요일/시간" content={RecruitingService.getVisitTimeText(writtenRecruitingContent)} />
            )}

            <LabelAndContent label="급여 정보" content={RecruitingService.getPayInfo(writtenRecruitingContent)} />
            <LabelAndContent label="선호 성별" content={RecruitingService.getPreferGenderText(writtenRecruitingContent.preferCaregiverGender)} />
            {inputFieldDom}
            <LabelAndContent
                label="특이사항"
                content={writtenRecruitingContent.memo ? nl2br<string>(writtenRecruitingContent.memo) : "-"}
                flexDirection={writtenRecruitingContent.memo ? "column" : "row"}
                sx={{ mb: 2 }}
            />
            <LabelAndContent label="마감일자" content={dayjs(writtenRecruitingContent.expiredDate).format("YYYY년 M월 D일").toString()} />
            <LabelAndContent label="담당자 연락처" content={writtenRecruitingContent.contactNumber} />
            <Divider sx={{ borderWidth: 4, m: "0 -24px 20px -24px", borderColor: "rgba(44, 44, 44, 0.1)" }} variant="middle" />
            <Typography variant="h3" align="left" sx={{ mb: 4 }}>
                공고 게시 채널
            </Typography>
            <List
                sx={{
                    listStyleType: "disc",
                    listStylePosition: "inside",
                    p: 0,
                    mb: 8,
                }}
            >
                <Typography variant="h5" fontWeight={600} mb={2}>
                    무료 채널
                </Typography>
                <Typography sx={{ display: "list-item", ml: 2, mb: 1 }}>요보사랑 구인 게시판</Typography>
                {basicChannelDom}
                {onetouchChannelDom && (
                    <>
                        <Typography variant="h5" fontWeight={600} mt={3} mb={2}>
                            원터치 채널
                        </Typography>
                        {onetouchChannelDom}
                    </>
                )}
            </List>
            {selectedChannels.oneTouchChannelSet.length > 0 && !isPassCountLoading && <RecruitingRegistrationPassBox passCount={passCount} isCountingPassIntendedToUseNowShow />}
            <Box display="flex" width="100%" mt={8}>
                <Button sx={{ minWidth: 120, mr: 3 }} variant="outlined" onClick={handleMoveToPrevPageButtonClick}>
                    이전
                </Button>
                <Button fullWidth type="submit" variant="contained" data-cy="submit-button" size="large" role="button" onClick={handlePostButtonClick}>
                    등록하기
                </Button>
            </Box>
        </Box>
    );
}

export default Confirm;

LabelAndContent.defaultProps = {
    flexDirection: "row",
    sx: null,
};
