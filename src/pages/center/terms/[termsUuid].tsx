import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Box, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import UseCenterService from "../../../hook/UseCenterService";
import TermsAgreementInterface from "../../../interface/TermsAgreementInterface";
import ErrorException from "../../../exception/ErrorException";
import PostCaregiverTermAgreementRequestInterface from "../../../interface/request/PostCaregiverTermAgreementRequestInterface";
import DateUtil from "../../../util/DateUtil";
import PostCenterTermAgreementRequestInterface from "../../../interface/request/PostCenterTermAgreementRequestInterface";
import sectionStyle from "../../../styles/sectionStyle";
import Form from "../../../components/form/Form";
import TermsAgreementEnum, { TermsAgreementLabel } from "../../../enum/TermsAgreementEnum";
import Radio from "../../../components/form/Radio";
import WithCenterAuth from "../../../hoc/WithCenterAuth";
import UsePopup from "../../../hook/UsePopup";
import UseTitle from "../../../hook/UseTitle";
import HeadMeta, { HeadMetaDataType } from "../../../components/Head";
import ErrorCodeEnum from "../../../enum/ErrorCodeEnum";
import { Nullable } from "../../../type/NullableType";

/**
 * 기관용 서비스 - 선택 동의 항목
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=3864%3A120587)
 * @category Page
 * @Center
 */
const Terms: NextPage = function Recruit() {
    const { setTitle } = UseTitle();
    const { openPopup } = UsePopup();
    const { isLoading, getTermsAgreement, setTermsAgreement } = UseCenterService();
    const router = useRouter();
    const { termsUuid } = router.query;
    const agreedDate = useRef<Nullable>(null);
    const [centerTermsAgreement, setCenterTermsAgreement] = useState<TermsAgreementInterface | undefined>(undefined);

    if (!termsUuid) {
        throw new ErrorException(ErrorCodeEnum.INVALID_QUERY_PARAMETER, "유효하지 않은 parameter 입니다.");
    }
    const getCenterTermsAgreement = async (): Promise<void> => {
        const termsAgreementResponse = await getTermsAgreement({
            uuid: termsUuid.toString(),
        });
        setTitle(termsAgreementResponse?.terms.title, termsAgreementResponse?.terms.title);
        setCenterTermsAgreement(termsAgreementResponse);
    };

    const metaData = useMemo<HeadMetaDataType | {}>(() => {
        if (centerTermsAgreement?.terms.title === "광고성 정보 수신 동의") {
            return {
                title: "기관 회원 광고성 정보 수신 동의-요보사랑",
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/기관/계정정보/광고수신동의`,
                description: "광고성 정보 수신에 동의하시면 요보사랑 서비스에서 제공하는 다양한 마케팅 정보를 받으실 수 있습니다.",
            };
        }
        if (centerTermsAgreement?.terms.title === "마케팅 활용 동의") {
            return {
                title: "기관 회원 마케팅 활용 동의-요보사랑",
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/기관/계정정보/마케팅동의`,
                description: "마케팅 활용에 동의하시면 요보사랑 서비스에 진행하는 다양한 마케팅 이벤트에 참여하실 수 있습니다.",
            };
        }
        return {};
    }, [centerTermsAgreement?.terms]);

    const onSubmit = async (request: PostCenterTermAgreementRequestInterface): Promise<void> => {
        if (request.agreedDate === "AGREE") {
            agreedDate.current = DateUtil.now("YYYY-MM-DD HH:mm:ss");
        } else {
            agreedDate.current = null;
        }
        await setTermsAgreement({ agreedDate: agreedDate.current, uuid: termsUuid.toString() }, centerTermsAgreement);
        await router.push("/center/account");
    };

    useEffect(() => {
        getCenterTermsAgreement();
    }, []);

    if (isLoading || !centerTermsAgreement) {
        return <Skeleton />;
    }
    const handleValidate = (currentValue: TermsAgreementEnum | undefined): boolean => {
        if (!currentValue) return false;

        const value = centerTermsAgreement.agreedDate ? TermsAgreementEnum.AGREE : TermsAgreementEnum.DISAGREE;
        return currentValue !== value;
    };

    return (
        <>
            <HeadMeta {...metaData} />
            <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
                <Form<PostCaregiverTermAgreementRequestInterface> buttonText="변경내용 저장" onSubmit={onSubmit} parameter={{ uuid: termsUuid, agreedDate: agreedDate.current }}>
                    <Typography variant="h3">{centerTermsAgreement.terms.title}</Typography>
                    {centerTermsAgreement.agreedDate && (
                        <Typography variant="h5" color="primary">
                            동의일자: {dayjs(centerTermsAgreement.agreedDate, "YYYY-MM-DD HH:mm:Ss").format("YYYY-MM-DD")}
                        </Typography>
                    )}
                    {centerTermsAgreement.terms.subTitle && (
                        <Typography variant="h5" color="text.secondary" sx={{ mt: 1 }}>
                            {centerTermsAgreement.terms.subTitle}
                        </Typography>
                    )}
                    {centerTermsAgreement.terms.url && (
                        <Typography
                            variant="h5"
                            color="text.primary"
                            sx={{ mt: 1, textDecoration: "underline", cursor: "pointer" }}
                            onClick={() => openPopup(centerTermsAgreement.terms.title, centerTermsAgreement.terms.url)}
                        >
                            약관 상세내용 보기
                        </Typography>
                    )}
                    <Radio<TermsAgreementEnum>
                        title=""
                        name="agreedDate"
                        onValidate={handleValidate}
                        defaultValue={centerTermsAgreement.agreedDate ? TermsAgreementEnum.AGREE : TermsAgreementEnum.DISAGREE}
                        data={TermsAgreementLabel}
                        required
                    />
                </Form>
            </Box>
        </>
    );
};
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true, ["termsUuid"]);
export default Terms;
