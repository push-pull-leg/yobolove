import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { useSetRecoilState } from "recoil";
import dayjs from "dayjs";
import AddressType from "../../../../type/AddressType";
import UseTitle from "../../../../hook/UseTitle";
import { dialogRecoilState } from "../../../../recoil/DialogRecoil";
import UseCenterService from "../../../../hook/UseCenterService";
import RawCenterRecruitingContentInterface from "../../../../interface/RawCenterRecruitingContentInterface";
import ConverterUtil from "../../../../util/ConverterUtil";
import WithCenterAuth from "../../../../hoc/WithCenterAuth";
import UseRecruiting from "../../../../hook/UseRecruiting";
import RecruitingForm from "../../../../components/RecruitingForm";
import EventUtil from "../../../../util/EventUtil";

const USELESS_ADDRESS_PROPS: (keyof AddressType)[] = ["regionFirstDepth", "regionSecondDepth", "regionThirdDepth", "regionAdminThirdDepth", "zipCode", "lng", "lat"];

/**
 * 기관용 서비스 - 구인공고 재등록 페이지
 * [피그마 시안](https://www.figma.com/file/vPPC16VClh27zfb1E9CiCN/%5B프로덕트%5D원터치-구인-공고-등록-서비스-기획%2F230103?type=design&node-id=1167-29255&t=IEOl2XKSTgSw7yba-0)
 * @category Page
 * @Center
 */
const Repost: NextPage = function Repost() {
    UseTitle("구인공고 수정", "구인공고 수정");

    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    const { reformatRecruitingRequest } = UseCenterService();

    const recruitingProps = UseRecruiting();
    const {
        centerInfo,
        setJobInfoAndAllowMove,
        writtenRecruitingContent,
        setSessionDataToForm,
        recruitingUuid,
        onMount,
        UUID_REGEX,
        moveToSelectChannelPage,
        isPageRenderable,
        setAllowMove,
    } = recruitingProps;
    const { isPublishedJobCenterWithInfo, jobCenterName, jobCenterPhoneNumber } = centerInfo;

    const init = async () => {
        if (writtenRecruitingContent) {
            setSessionDataToForm();
        }
        if (UUID_REGEX.test(recruitingUuid.toString())) {
            await onMount();
        }
    };

    useEffect(() => {
        init();
    }, [recruitingUuid, writtenRecruitingContent]);

    const handleSubmit = async (request: RawCenterRecruitingContentInterface): Promise<void> => {
        EventUtil.gtmEvent("click", "save", "cenRecruitingsRepost", "0");

        /**
         * 마감일자가 현재 날짜보다 이전인지 확인
         */
        const isExpiredDatePass = dayjs().isAfter(request.expiredDate, "date");
        if (isExpiredDatePass) {
            setDialogRecoil({
                open: true,
                title: "마감일자를 수정해주세요.",
                content: <Typography>마감일자는 오늘 이후의 날짜여야 합니다.</Typography>,
                confirmButtonText: "확인",
                onConfirm: () => {},
            });
            return;
        }

        const currentRequest = setJobInfoAndAllowMove(request);
        const formattedRequest = {
            ...reformatRecruitingRequest(currentRequest),
            address: ConverterUtil.removeUselessProps(request.address, USELESS_ADDRESS_PROPS),
            uuid: recruitingUuid.toString(),
        };
        /**
         * 일자리센터·워크넷에 등록한 공고인가?
         */
        if (isPublishedJobCenterWithInfo) {
            setDialogRecoil({
                open: true,
                title: "잠깐! 일자리센터에서 마감된 공고가 맞는지 확인해주세요.",
                content: (
                    <>
                        <Typography>
                            일자리센터 공고의 마감일이 지나지 않았거나, 전화로 마감 요청을 하지 않은 상태로 재등록을 진행하면, 재등록되지 않거나 일자리센터에서 확인 연락이 올 수
                            있어요.
                            <br />
                            <br />
                            마감 여부를 확인하거나 공고 내용을 수정하고 싶다면 아래 연락처로 문의해주세요.
                        </Typography>
                        <Typography variant="body1" color="primary">
                            <strong>{`${jobCenterName} (${jobCenterPhoneNumber})`}</strong>
                        </Typography>
                    </>
                ),
                confirmButtonText: "재등록 진행",
                hasCancelButton: true,
                onConfirm: async () => {
                    setAllowMove(true);
                    moveToSelectChannelPage(formattedRequest);
                },
            });
        } else {
            moveToSelectChannelPage(formattedRequest);
        }
    };

    if (!isPageRenderable) return null;
    return <RecruitingForm onSubmit={handleSubmit} {...recruitingProps} />;
};
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true, ["recruitingUuid"]);
export default Repost;
