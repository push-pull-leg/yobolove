import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";

import { Box, Button, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PersonIcon from "@mui/icons-material/Person";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useSetRecoilState } from "recoil";
import Form from "../../../components/form/Form";
import sectionStyle from "../../../styles/sectionStyle";
import Checkbox from "../../../components/form/Checkbox";
import { CenterBasicChannelOptionEnum, CenterOneTouchChannelOptionEnum } from "../../../enum/CenterOneTouchChannelOptionsEnum";
import usePopup from "../../../hook/UsePopup";
import { toRem } from "../../../styles/options/Function";
import UseCenterService from "../../../hook/UseCenterService";
import UseOneTouch from "../../../hook/UseOneTouch";
import RecruitingSessionStorageKeys from "../../../enum/RecruitingSessionStorageKeys";
import RecruitingRegistrationPassBox from "../../../components/RecruitingRegistrationPassBox";
import UsePassCount from "../../../hook/UsePassCount";
import SelectedChannelsType from "../../../type/SelectedChannelsType";
import ConverterUtil from "../../../util/ConverterUtil";
import { dialogRecoilState } from "../../../recoil/DialogRecoil";
import EventUtil from "../../../util/EventUtil";

interface PostOneTouchChannelInterface {
    centerBasicChannelOption: CenterBasicChannelOptionEnum[];
    centerOneTouchChannelOption: CenterOneTouchChannelOptionEnum[];
}

const POPUP_TEXT_STYLES = {
    display: "flex",
    flexDirection: "column",
    gap: toRem(8),
};

const POPUP_CONTENTS: { title: string; desc: string; imgSrc?: { xs: string; sm: string } }[] = [
    {
        title: "요보사랑 구인게시판",
        desc: "요보사랑 자체 구인게시판에 공고가 노출됩니다.",
        imgSrc: {
            xs: `${process.env.NEXT_PUBLIC_CDN_HOST}/assets/images/img-boardscreenshot-xsr.png`,
            sm: `${process.env.NEXT_PUBLIC_CDN_HOST}/assets/images/img-boardscreenshot-smr.png`,
        },
    },
    {
        title: "구직자에게 알림톡 발송",
        desc: "요보사랑이 자체적으로 보유한 인력풀에서 공고 조건에 맞는 요양보호사님만 선별하여 공고를 직접 발송해드립니다.",
        imgSrc: {
            xs: `${process.env.NEXT_PUBLIC_CDN_HOST}/assets/images/img-yobotalk-contents-xsr.png`,
            sm: `${process.env.NEXT_PUBLIC_CDN_HOST}/assets/images/img-yobotalk-contents-smr.png`,
        },
    },
    {
        title: "요양나라·네이버 카페",
        desc: "요보사랑에 등록하신 공고 내용을 바탕으로, 요양나라 · 장기요양기관 실무카페 등 인터넷 게시판에 공고를 게시해드립니다.",
    },
    { title: "일자리센터·워크넷", desc: "요보사랑에 등록하신 공고 내용을 바탕으로, 일자리센터 구인신청서 팩스를 대신 발송해드립니다." },
];

const ONETOUCH_CHANNEL = [CenterOneTouchChannelOptionEnum.YOYANGNARA_NAVERCAFE, CenterOneTouchChannelOptionEnum.JOBCENTER_WORKNET];

const DEFAULT_SELECTED_CHANNEL: Exclude<SelectedChannelsType, null> = {
    basicChannelSet: [CenterBasicChannelOptionEnum.YOBOLOVE_RECRUITINGS, CenterBasicChannelOptionEnum.SEND_ALIMTALK_TO_JOBSEEKR],
    oneTouchChannelSet: [],
};

function OnetouchChannel() {
    const [isSelectedOnetouchChannel, setIsSelectedOnetouchChannel] = useState<boolean>(false);

    const {
        sessionStorageData: { selectedChannels },
        isPageRenderable,
        isPageRenderableCheckDone,
        channelOptionLabel,
        convertOneTouchChannelOptionLabelDisable,
    } = UseOneTouch({ pageType: "SELECT_CHANNEL" });
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    const { openPopup, closePopup } = usePopup();
    const { getIsExistedCenterMoreInfo } = UseCenterService();
    const { passCount, isPassCountLoading } = UsePassCount();

    const {
        push,
        query: { isCameBackCauseRunOutOfPass },
    } = useRouter();

    useEffect(() => {
        if (isPageRenderableCheckDone) {
            if (isPageRenderable) {
                if (isCameBackCauseRunOutOfPass) {
                    setDialogRecoil({
                        open: true,
                        title: "원터치 등록권이 없습니다. 등록권을 구매한 후 진행해주세요.",
                        hasCancelButton: false,
                    });
                }
            } else {
                push("/center");
            }
        }
    }, [isPageRenderableCheckDone, isPageRenderable]);

    /**
     * 선택된 상태의 채널
     */
    const selectedChannel: SelectedChannelsType = useMemo(
        () => ({
            ...(selectedChannels || DEFAULT_SELECTED_CHANNEL),
            ...(!isPassCountLoading && !passCount ? { oneTouchChannelSet: [] } : {}),
        }),
        [selectedChannels, passCount, isPassCountLoading],
    );

    useEffect(() => {
        /**
         * 원터치 채널 선택 여부 state 업데이트
         */
        setIsSelectedOnetouchChannel(!!selectedChannel.oneTouchChannelSet.length);
    }, [selectedChannel]);

    const handleChannelExplationButtonClick = () => {
        EventUtil.gtmEvent("click", "guide", "cenRecruitingsOnetouchChannel", "0");

        openPopup(
            "구인채널 설명",
            "",
            <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ p: "20px 16px", gap: toRem(40) }}>
                <Box sx={{ ...POPUP_TEXT_STYLES, gap: toRem(12) }}>
                    <Typography variant="h2">요보사랑 원터치 공고 등록</Typography>
                    <Typography variant="h3">
                        <>
                            요보사랑 등록 한번이면
                            <br /> 아래의 구인채널에 함께 등록돼요!
                        </>
                    </Typography>
                </Box>
                {POPUP_CONTENTS.map(({ title, desc, imgSrc }) => (
                    <Box key={title} sx={{ ...POPUP_TEXT_STYLES }}>
                        <Typography variant="h3">{title}</Typography>
                        <Typography variant="body1">{desc}</Typography>
                        {imgSrc && (
                            <picture>
                                <source media="(min-width: 441px)" srcSet={imgSrc.sm} />
                                <img src={imgSrc.xs} alt={title} style={{ width: "100%", height: "auto" }} />
                            </picture>
                        )}
                    </Box>
                ))}
                <Button variant="contained" size="large" color="primary" onClick={() => closePopup()} sx={{ width: "100%" }}>
                    닫기
                </Button>
            </Box>,
        );
    };

    const handleBasicChannelChange = (name: string, currentValue: CenterBasicChannelOptionEnum[], { target: { value, checked } }: ChangeEvent<HTMLInputElement>) =>
        EventUtil.gtmEvent("click", "channel", "cenRecruitingsOnetouchChannel", `${`${checked}`.toUpperCase()}_${value}`);

    const handleChangeOnetouchChannel = (name: string, currentValue: CenterOneTouchChannelOptionEnum[], { target: { value, checked } }: ChangeEvent<HTMLInputElement>) => {
        EventUtil.gtmEvent("click", "channel", "cenRecruitingsOnetouchChannel", `${`${checked}`.toUpperCase()}_${value}`);

        setIsSelectedOnetouchChannel(!!currentValue.length);
    };

    const handleChannelFormSubmit = async ({
        centerBasicChannelOption: selectedBasicChannel,
        centerOneTouchChannelOption: selectedOneTouchChannel,
    }: PostOneTouchChannelInterface) => {
        EventUtil.gtmEvent("click", "next", "cenRecruitingsOnetouchChannel", "0");

        const channelRequest = { basicChannelSet: selectedBasicChannel, oneTouchChannelSet: selectedOneTouchChannel };
        sessionStorage.setItem(RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL, JSON.stringify(channelRequest));

        const isSelectedJobCenterOrYoyangNara = ConverterUtil.isTargetSomeInArr(selectedOneTouchChannel, ONETOUCH_CHANNEL);

        if (isSelectedJobCenterOrYoyangNara) {
            const isAlreadyRegisteredMoreInfo = await getIsExistedCenterMoreInfo();

            if (!isAlreadyRegisteredMoreInfo) {
                push("/center/recruitings/onetouch-info", "/구인공고등록/추가정보");
                return;
            }
        }

        push("/center/recruitings/confirm", "/구인공고등록/최종확인");
    };

    if (!isPageRenderableCheckDone || (isPageRenderableCheckDone && !isPageRenderable)) return null;

    return (
        <Box
            display="block"
            height="100%"
            {...sectionStyle(
                {
                    textAlign: "left",
                },
                "sm",
                true,
            )}
        >
            <Form<PostOneTouchChannelInterface> buttonText="다음" onSubmit={handleChannelFormSubmit}>
                <Typography variant="h3">공고를 어디에 올릴까요?</Typography>
                <Typography variant="body1">원하는 채널을 선택하면 공고를 여러 곳에 동시에 올릴 수 있어요</Typography>
                <Button onClick={handleChannelExplationButtonClick} variant="text" startIcon={<HelpOutlineIcon />} sx={{ width: "fit-content" }}>
                    구인채널 설명
                </Button>
                <Box display="flex" alignItems="center">
                    <PersonIcon />
                    <Typography variant="h4" fontWeight={600} marginLeft={toRem(6)}>
                        기본 채널
                    </Typography>
                </Box>
                <Checkbox<CenterBasicChannelOptionEnum>
                    defaultValue={selectedChannel.basicChannelSet}
                    name="centerBasicChannelOption"
                    data={channelOptionLabel.basic}
                    onChange={handleBasicChannelChange}
                />
                {!isPassCountLoading && (
                    <>
                        <Box display="flex" alignItems="center">
                            <GroupAddIcon />
                            <Typography variant="h4" fontWeight={600} marginLeft={toRem(6)}>
                                원터치 채널 {!!passCount && `(등록권 1개 차감)`}
                            </Typography>
                        </Box>
                        <Checkbox<CenterOneTouchChannelOptionEnum>
                            defaultValue={selectedChannel.oneTouchChannelSet}
                            name="centerOneTouchChannelOption"
                            data={passCount ? channelOptionLabel.oneTouch : convertOneTouchChannelOptionLabelDisable(channelOptionLabel.oneTouch)}
                            onChange={handleChangeOnetouchChannel}
                        />
                    </>
                )}
                {!isPassCountLoading && (
                    <RecruitingRegistrationPassBox
                        passPurchaseButtonPosition={passCount ? "TOP" : "BOTTOM"}
                        isCountingPassIntendedToUseNowShow={!!passCount}
                        isPassPrPhraseShow={!passCount}
                        passCount={passCount}
                        numPassToUse={isSelectedOnetouchChannel ? 1 : 0}
                    />
                )}
            </Form>
        </Box>
    );
}

export default OnetouchChannel;
