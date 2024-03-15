import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { useSetRecoilState } from "recoil";
import UseTitle from "../../../../hook/UseTitle";
import { dialogRecoilState } from "../../../../recoil/DialogRecoil";
import UseCenterService from "../../../../hook/UseCenterService";
import RawCenterRecruitingContentInterface from "../../../../interface/RawCenterRecruitingContentInterface";
import UseRecruiting from "../../../../hook/UseRecruiting";
import RecruitingForm from "../../../../components/RecruitingForm";
import WithCenterAuth from "../../../../hoc/WithCenterAuth";
import EventUtil from "../../../../util/EventUtil";

/**
 * 기관용 서비스 - 구인공고 수정 페이지
 * [피그마 시안](https://www.figma.com/file/vPPC16VClh27zfb1E9CiCN/%5B프로덕트%5D원터치-구인-공고-등록-서비스-기획%2F230103?type=design&node-id=1167-29255&t=IEOl2XKSTgSw7yba-0)
 * @category Page
 * @Center
 */
const Edit: NextPage = function Edit() {
    UseTitle("구인공고 수정", "구인공고 수정");

    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    const { updateRecruiting } = UseCenterService();

    const recruitingProps = UseRecruiting();
    const { centerInfo, setJobInfoAndAllowMove, setAllowMove, UUID_REGEX, recruitingUuid, onMount, isPageRenderable } = recruitingProps;
    const { isPublishedJobCenterWithInfo, jobCenterName, jobCenterPhoneNumber, canReviseRecruiting } = centerInfo;

    const handleSubmit = async (request: RawCenterRecruitingContentInterface): Promise<void> => {
        EventUtil.gtmEvent("click", "save", "cenRecruitingsEdit", "0");

        const currentRequest = setJobInfoAndAllowMove(request);

        /**
         * 공고를 수정할 수 있는 채널들을 선택했나?
         */
        const isNeedNotice = isPublishedJobCenterWithInfo || !canReviseRecruiting;

        if (!isNeedNotice) {
            updateRecruiting(currentRequest, recruitingUuid.toString());
            return;
        }

        setDialogRecoil({
            open: true,
            title: "잠깐! 요보사랑 외 채널에 등록된 공고는 수정/마감이 어려워요",
            content: (
                <Box sx={{ gap: 4, display: "flex", flexDirection: "column" }}>
                    {isPublishedJobCenterWithInfo && (
                        <div>
                            <Typography variant="body1" color="text.primary">
                                <strong>일자리센터</strong>에 제출된 공고 내용은 센터로 수정/마감을 직접 문의해주세요.
                            </Typography>
                            <Typography variant="body1" color="primary">
                                <strong>{`${jobCenterName} (${jobCenterPhoneNumber})`}</strong>
                            </Typography>
                        </div>
                    )}

                    {!canReviseRecruiting && (
                        <Typography variant="body1" color="text.primary">
                            <strong>요양나라·네이버 카페·요보사랑 알림톡</strong>으로 등록된 공고 내용은 수정/마감 처리할 수 없어요.
                        </Typography>
                    )}
                </Box>
            ),
            onConfirm: async () => {
                setDialogRecoil({
                    open: false,
                });
                setAllowMove(true);
                await updateRecruiting(currentRequest, recruitingUuid.toString());
            },
        });
    };
    const init = async () => {
        if (UUID_REGEX.test(recruitingUuid.toString())) {
            await onMount();
        }
    };

    useEffect(() => {
        init();
    }, [recruitingUuid]);

    if (!isPageRenderable) return null;
    return <RecruitingForm onSubmit={handleSubmit} {...recruitingProps} />;
};
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true, ["recruitingUuid"]);
export default Edit;
