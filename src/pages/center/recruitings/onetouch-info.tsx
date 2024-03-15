import { NextPage } from "next";
import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Form from "../../../components/form/Form";
import sectionStyle from "../../../styles/sectionStyle";
import Address from "../../../components/form/Address";
import Text from "../../../components/form/Text";
import SeverancePayTypeEnum, { SeverancePayTypeLabel } from "../../../enum/SeverancePayTypeEnum";
import usePreventMove from "../../../hook/UsePreventMove";
import Select from "../../../components/form/Select";
import UseCenterService from "../../../hook/UseCenterService";
import CenterMoreInfoInterface from "../../../interface/CenterMoreInfoInterface";
import SignInputButton from "../../../components/SignInputButton";
import PostCenterMoreInfoRequestInterface from "../../../interface/request/PostCenterMoreInfoRequestInterface";
import UseOneTouch from "../../../hook/UseOneTouch";
import UseTitle from "../../../hook/UseTitle";
import ConverterUtil from "../../../util/ConverterUtil";
import EventUtil from "../../../util/EventUtil";

const OneTouchInfo: NextPage = function OneTouchInfo() {
    const { setAllowMove } = usePreventMove("작성을 그만두시겠어요?", "정보를 작성하지 않으면 원하는 구인채널에 공고를 올릴 수 없어요", "계속 작성");
    const { createCenterMoreInfo } = UseCenterService();
    const { isPageRenderable, isPageRenderableCheckDone } = UseOneTouch({ pageType: "MORE_INFO" });
    const router = useRouter();
    const { setTitle } = UseTitle();
    useEffect(() => {
        if (isPageRenderableCheckDone && !isPageRenderable) router.replace("/");
        else setTitle("구인공고 등록", "구인공고 등록");
    }, [isPageRenderableCheckDone, isPageRenderable]);
    const reformatData = (data: CenterMoreInfoInterface): PostCenterMoreInfoRequestInterface => {
        const { lotAddressName } = data.address;
        const formatData = {
            ...data,
            address: { lotAddressName, addressDetail: data.addressDetail },
            workerCount: +data.workerCount,
        };

        const requestDto = ConverterUtil.removeUselessProps(formatData, ["addressDetail", "recruiterSignatureFile"]);
        return { requestDto, recruiterSignatureFile: ConverterUtil.convertToFile(data.recruiterSignatureFile, "sign.png") };
    };

    const onSubmit = async (data: CenterMoreInfoInterface) => {
        EventUtil.gtmEvent("click", "save", "cenRecruitingsOnetouchInfo", "0");

        setAllowMove(true);
        await createCenterMoreInfo(reformatData(data));
    };

    if (isPageRenderableCheckDone && !isPageRenderable) return null;

    return (
        <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ py: 5, pl: 4, mb: 13.5 }, "sm", true)}>
            <Box display="flex" flexDirection="column" alignItems="start">
                <Typography variant="h3" align="left" sx={{ mb: 2 }}>
                    기관 추가정보 등록
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>딱 한 번만 </strong>
                    작성하면 공고 등록 시 자동으로 기입돼요!
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(0, 0, 0, 0.5)", mb: 9 }}>
                    아래 정보는 요양나라·일자리센터 등록 외의 목적으로는 일절 사용되지 않습니다
                </Typography>
            </Box>
            <Form<CenterMoreInfoInterface> buttonText="등록하기" onSubmit={onSubmit} onChange={() => setAllowMove(false)}>
                <Text title="기관 대표자 이름" name="adminName" placeholder="기관 대표자 이름" required maxLength={20} data-cy="admin-name" autoSubmit={false} />
                <Text title="구인 담당자 이름" name="recruiterName" placeholder="구인 담당자 이름" required maxLength={20} data-cy="recruiter-name" autoSubmit={false} />
                <SignInputButton title="구인 담당자 서명" required name="recruiterSignatureFile" />
                <Box sx={{ gap: "6px" }} display="flex" flexDirection="column">
                    <Address title="기관 주소" required name="address" placeholder="주소 검색" data-cy="address" />
                    <Text name="addressDetail" placeholder="기관 상세주소" maxLength={50} data-cy="addressDetail" autoSubmit={false} />
                </Box>
                <Text title="기관 근로자 수" name="workerCount" placeholder="기관 근로자 수" required regExp={/^\d{0,3}$/} data-cy="worker-count" />
                <Select<SeverancePayTypeEnum>
                    title="퇴직급여 형태"
                    name="severancePayType"
                    required
                    data={SeverancePayTypeLabel}
                    defaultValue={SeverancePayTypeEnum.SEVERANCE_PAY}
                    data-cy="severance-pay-type"
                />
            </Form>
        </Box>
    );
};

export default OneTouchInfo;
