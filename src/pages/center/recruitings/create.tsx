import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { useSetRecoilState } from "recoil";
import Cookies from "universal-cookie";
import dayjs from "dayjs";
import UseCenterService from "../../../hook/UseCenterService";
import { dialogRecoilState } from "../../../recoil/DialogRecoil";
import WithCenterAuth from "../../../hoc/WithCenterAuth";
import UseTitle from "../../../hook/UseTitle";
import WithHeadMetaData from "../../../hoc/WithHeadMetaData";
import RawCenterRecruitingContentInterface from "../../../interface/RawCenterRecruitingContentInterface";
import StorageUtil from "../../../util/StorageUtil";
import UseRecruiting from "../../../hook/UseRecruiting";
import RecruitingForm from "../../../components/RecruitingForm";
import EventUtil from "../../../util/EventUtil";

const cookies = new Cookies();

/**
 * 기관용 서비스 - 구인등록 페이지
 * [피그마 시안](https://www.figma.com/file/vPPC16VClh27zfb1E9CiCN/%5B프로덕트%5D원터치-구인-공고-등록-서비스-기획%2F230103?type=design&node-id=413-10955&t=IEOl2XKSTgSw7yba-0)
 * @category Page
 * @Center
 */
const Recruiting: NextPage = function Recruiting() {
    UseTitle("구인공고 등록", "구인공고 등록");
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);
    const { setIsLoading, reformatRecruitingRequest } = UseCenterService();

    const recruitingProps = UseRecruiting();
    const { openSelectJob, writtenRecruitingContent, moveToSelectChannelPage, onMount, setSessionDataToForm, setJobInfoAndAllowMove } = recruitingProps;

    const closeGuide = (): void => {
        setDialogRecoil({
            open: false,
        });
        cookies.set("AGREE_RECRUITING_CREATE", true, { expires: dayjs("2099-12-31", "YYYY-MM-DD").toDate() });
        openSelectJob();
    };

    const openGuide = (): void => {
        setDialogRecoil({
            open: true,
            title: "이용 안내",
            content: (
                <>
                    <br />
                    <Typography variant="subtitle1" component="div">
                        구인공고 등록 이용방법
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ mt: 2 }}>
                        근무조건에 맞게 공고 내용을 작성해주세요. 등록해주신 공고는 요보사랑 게시판에 노출되고, 조건에 맞는 요양보호사님들께 알림톡으로도 발송돼요.
                    </Typography>
                    <Typography variant="subtitle1" component="div" sx={{ mt: 5 }}>
                        이용 정책
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ mt: 2 }}>
                        -동일한 구인정보로 반복 등록하면 이전 게시글이 자동으로 삭제됩니다.
                        <br />
                        -허위정보 기재로 피해를 입힐 시 책임을 물을 수 있습니다.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        <Button variant="text" onClick={closeGuide} size="small" color="inherit" sx={{ mt: 5, textDecoration: "underline" }}>
                            다시 보지 않기
                        </Button>
                    </Typography>
                </>
            ),
            hasCancelButton: false,
            hasCloseButton: false,
            onConfirm: openSelectJob,
            onClose: openSelectJob,
            isCloseWhenBackDropClick: false,
        });
    };

    const handleSubmit = async (request: RawCenterRecruitingContentInterface): Promise<void> => {
        EventUtil.gtmEvent("click", "save", "cenRecruitingsCreate", "0");

        const currentRequest = setJobInfoAndAllowMove(request);
        moveToSelectChannelPage(reformatRecruitingRequest(currentRequest));
    };
    const init = async () => {
        setIsLoading(false);
        /**
         * 작성중이던 정보가 sessionStorage에 있으면 작성중이던 정보 불러오기
         */
        if (writtenRecruitingContent) {
            setSessionDataToForm();
        }
        await onMount();
        /**
         * 작성중이던 공고 정보가 없을때만 openGuide 실행
         *
         * 만약 다시 보지 않기를 누른적이 있다면 SelectJob 바로 실행
         */
        if (!StorageUtil.getItem("writtenRecruitingContent")) {
            const isAgreedGuide = cookies.get("AGREE_RECRUITING_CREATE");
            if (isAgreedGuide) {
                openSelectJob();
                return;
            }
            openGuide();
        }
    };

    useEffect(() => {
        init();
    }, [writtenRecruitingContent]);

    return <RecruitingForm onSubmit={handleSubmit} {...recruitingProps} />;
};
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true);
export default WithHeadMetaData(Recruiting);
