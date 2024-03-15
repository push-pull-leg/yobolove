import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import sectionStyle from "../../styles/sectionStyle";
import Form from "../../components/form/Form";
import Radio from "../../components/form/Radio";
import TermsAgreementEnum, { TermsAgreementLabel } from "../../enum/TermsAgreementEnum";
import PostCaregiverTermAgreementRequestInterface from "../../interface/request/PostCaregiverTermAgreementRequestInterface";
import DateUtil from "../../util/DateUtil";
import WithCaregiverAuth from "../../hoc/WithCaregiverAuth";
import TermsAgreementInterface from "../../interface/TermsAgreementInterface";
import UseCaregiverService from "../../hook/UseCaregiverService";
import ErrorException from "../../exception/ErrorException";
import Skeleton from "../../components/skeleton/ListSkeleton";
import UsePopup from "../../hook/UsePopup";
import UseTitle from "../../hook/UseTitle";
import HeadMeta, { HeadMetaDataType } from "../../components/Head";
import ErrorCodeEnum from "../../enum/ErrorCodeEnum";
import { Nullable } from "../../type/NullableType";

/**
 * 구직자서비스 - 이용약관 동의페이지
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=2563%3A113087)
 * @category Page
 * @Caregiver
 */
const Terms: NextPage = function Recruit() {
    const { setTitle } = UseTitle();
    const { openPopup } = UsePopup();
    const { isLoading, getTermsAgreement, setTermsAgreement } = UseCaregiverService();
    const router = useRouter();
    const { termsUuid } = router.query;
    const agreedDate = useRef<Nullable>(null);
    const [caregiverTermsAgreement, setCaregiverTermsAgreement] = useState<TermsAgreementInterface | undefined>(undefined);

    if (!termsUuid) {
        throw new ErrorException(ErrorCodeEnum.INVALID_QUERY_PARAMETER, "유효하지 않은 parameter 입니다.");
    }
    const getCaregiverTermsAgreement = async (): Promise<void> => {
        const termsAgreementResponse = await getTermsAgreement({
            uuid: termsUuid.toString(),
        });
        setTitle(termsAgreementResponse?.terms.title, termsAgreementResponse?.terms.title);
        setCaregiverTermsAgreement(termsAgreementResponse);
    };

    const metaData = useMemo<HeadMetaDataType | {}>(() => {
        if (caregiverTermsAgreement?.terms.title === "광고성 정보 수신 동의") {
            return {
                title: "요양보호사 광고성 정보 수신 동의-요보사랑",
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/내정보/광고수신동의`,
                description: "광고성 정보 수신에 동의하시면 요보사랑 서비스에서 제공하는 다양한 마케팅 정보를 받으실 수 있습니다.",
            };
        }
        if (caregiverTermsAgreement?.terms.title === "마케팅 활용 동의") {
            return {
                title: "요양보호사 마케팅 활용 동의-요보사랑",
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/내정보/마케팅동의`,
                description: "마케팅 활용에 동의하시면 요보사랑 서비스에 진행하는 다양한 마케팅 이벤트에 참여하실 수 있습니다.",
            };
        }
        return {};
    }, [caregiverTermsAgreement?.terms]);

    const onSubmit = async (request: PostCaregiverTermAgreementRequestInterface): Promise<void> => {
        if (request.agreedDate === "AGREE") {
            agreedDate.current = DateUtil.now("YYYY-MM-DD HH:mm:ss");
        } else {
            agreedDate.current = null;
        }
        await setTermsAgreement({ agreedDate: agreedDate.current, uuid: termsUuid.toString() }, caregiverTermsAgreement);
        await router.push("/account");
    };

    useEffect(() => {
        getCaregiverTermsAgreement();
    }, []);

    if (isLoading || !caregiverTermsAgreement) {
        return <Skeleton />;
    }

    const handleValidate = (currentValue: TermsAgreementEnum | undefined): boolean => {
        if (!currentValue) return false;

        const value = caregiverTermsAgreement.agreedDate ? TermsAgreementEnum.AGREE : TermsAgreementEnum.DISAGREE;
        return currentValue !== value;
    };

    return (
        <>
            <HeadMeta {...metaData} />
            <Box display="flex" height="100%" alignItems="left" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
                <Typography variant="h3">{caregiverTermsAgreement.terms.title}</Typography>
                {caregiverTermsAgreement.agreedDate && (
                    <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                        동의일자: {dayjs(caregiverTermsAgreement.agreedDate, "YYYY-MM-DD HH:mm:Ss").format("YYYY-MM-DD")}
                    </Typography>
                )}
                {caregiverTermsAgreement.terms.description && (
                    <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                        {caregiverTermsAgreement.terms.description}
                    </Typography>
                )}
                {caregiverTermsAgreement.terms.url && (
                    <Typography
                        variant="h5"
                        color="text.primary"
                        sx={{ mt: 2, mb: 9, textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => openPopup(caregiverTermsAgreement.terms.title, caregiverTermsAgreement.terms.url)}
                    >
                        약관 상세내용 보기
                    </Typography>
                )}
                <Form<PostCaregiverTermAgreementRequestInterface> buttonText="변경내용 저장" onSubmit={onSubmit} parameter={{ uuid: termsUuid, agreedDate: agreedDate.current }}>
                    <Radio<TermsAgreementEnum>
                        title=""
                        name="agreedDate"
                        defaultValue={caregiverTermsAgreement.agreedDate ? TermsAgreementEnum.AGREE : TermsAgreementEnum.DISAGREE}
                        data={TermsAgreementLabel}
                        onValidate={handleValidate}
                        required
                    />
                </Form>
            </Box>
        </>
    );
};

export default Terms;

export const getServerSideProps: GetServerSideProps = WithCaregiverAuth(undefined, true, ["termsUuid"]);
