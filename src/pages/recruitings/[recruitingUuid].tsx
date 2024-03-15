/* eslint-disable react/no-danger */
import type { GetServerSideProps, NextPage } from "next";
import { Box, Container, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { css } from "@emotion/css";
import JobEnum, { JobLabel } from "../../enum/JobEnum";
import { toRem } from "../../styles/options/Function";
import GetRecruitingResponseInterface, { GetRecruitingResponseDataInterface } from "../../interface/response/GetRecruitingResponseInterface";
import EndpointEnum from "../../enum/EndpointEnum";
import { RecipientMotionStateLabel } from "../../enum/RecipientMotionStateEnum";
import { RecipientCognitiveStateLabel } from "../../enum/RecipientCognitiveState";
import { PayTypeLabel } from "../../enum/PayTypeEnum";
import HttpUtil from "../../util/HttpUtil";
import { HeadMetaDataType } from "../../components/Head";
import GetRecruitingRequestInterface from "../../interface/request/GetRecruitingRequestInterface";
import RecruitingContent from "../../components/RecruitingContent";
import breakpoints from "../../styles/options/Breakpoints";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";
import UseTitle from "../../hook/UseTitle";
import RecruitingService from "../../service/RecruitingService";
import UseCenterService from "../../hook/UseCenterService";
import DateUtil from "../../util/DateUtil";
import ConverterUtil from "../../util/ConverterUtil";

const contents = css`
    @media (min-width: ${Number(breakpoints.values?.md)}px) {
        min-height: calc(100vh - 277px);
    }
`;

const UUID_REGEX = /^[0-9a-f]{8}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{12}$/;

/**
 *  공고 형태가 입주요양 일때는 24시간 입주 표시
 *  근무시간을 직접 작성했을시에는 memo 리턴
 *  그 이외에는 해당 날짜 시간 리턴
 * @param data
 */
const getWorkTimeInfo = (data: GetRecruitingResponseDataInterface) => {
    if (data.job === "HOME_CARE") {
        return "24시간 입주";
    }

    const memo = ConverterUtil.newLineToBr(data.workTime?.memo);
    if (memo) {
        return memo;
    }

    if (data.workTime?.days && data.workTime?.startAt && data.workTime?.endAt) {
        return `${DateUtil.toDayFromWeekNumber(data.workTime.days)} ${data.workTime.startAt}~${data.workTime.endAt}`;
    }

    return "";
};
/**
 * {@link Recruiting} props
 * @category PropsType
 */
type RecruitingPropsType = {
    /**
     * gssp 에서 받은 recruiting response 데이터. 없으면 data:loading 으로옴
     */
    response?: GetRecruitingResponseInterface | { data: "loading" };
};

/**
 * 구직자서비스 - 구인공고 상세페이지
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=4527%3A121320)
 * @category Page
 * @Caregiver
 */
const Recruiting: NextPage = function Recruiting(props: RecruitingPropsType) {
    const { response } = props;
    UseTitle("구인공고 상세");
    const theme = useTheme();
    const router = useRouter();
    const { from, recruitingUuid } = router.query;
    const [recruiting, setRecruiting] = useState<GetRecruitingResponseDataInterface | undefined | "loading">(response?.data);
    const { getRecruitingDetail } = UseCenterService();
    const getRecruiting = async (id: string, address?: string): Promise<void> => {
        setRecruiting("loading");
        let params: GetRecruitingRequestInterface = { uuid: id };
        if (address) {
            params = { lotAddressName: address, ...params };
        }
        try {
            const dataResponse = await getRecruitingDetail(params);
            if (!dataResponse) return;
            setRecruiting(dataResponse);
        } catch (e) {
            setRecruiting(undefined);
        }
    };

    useEffect(() => {
        if (response && response.data !== "loading") return;

        if (typeof recruitingUuid === "string" && UUID_REGEX.test(recruitingUuid)) {
            if (typeof from === "string") {
                getRecruiting(recruitingUuid, from);
            } else {
                getRecruiting(recruitingUuid);
            }
        }
    }, [recruitingUuid]);

    return (
        <Container component="section" maxWidth={false} sx={{ backgroundColor: "#FAFAFA", width: "100%" }}>
            <Box
                className={contents}
                component="article"
                sx={{
                    backgroundColor: theme.palette.primary.contrastText,
                    width: {
                        md: toRem(440),
                        xs: "100%",
                    },
                    margin: "0 auto",
                    p: 5,
                }}
            >
                <RecruitingContent recruiting={recruiting} />
            </Box>
        </Container>
    );
};

/**
 * 받은 구인공고내용으로 SEO 를 위한 head Meta tag 설정
 * @param context
 */
export const getServerSideProps: GetServerSideProps = async context => {
    const { recruitingUuid } = context.params;
    const { to, from } = context.query;

    const { res } = context;
    let metaData: HeadMetaDataType = {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/요양보호사구인/${to}/${recruitingUuid}`,
        title: "요양보호사 일자리 구인/구직",
        description: "요양보호사님께 꼭 맞는 일자리 정보가 있습니다. 지금 바로 확인하고, 쉽게 요양보호사 구인구직 해보세요.",
    };
    let response: GetRecruitingResponseInterface;
    try {
        response = await HttpUtil.request<GetRecruitingResponseInterface, GetRecruitingRequestInterface>(EndpointEnum.GET_RECRUITING, {
            uuid: recruitingUuid as string,
            lotAddressName: from as string,
        });
        if (!response) {
            res.statusCode = 404;
            return { props: { metaData } };
        }
    } catch (e) {
        res.statusCode = 404;
        return { props: { metaData } };
    }
    const { data } = response;
    const metaDescription = `${data.address.roadAddressName} 요양보호사님께 꼭 맞는 일자리 정보가 있습니다. 지금 바로 확인하고, 쉽게 요양보호사 구인구직 해보세요.`;
    const metaTitle = `${data.address.roadAddressName} 요양보호사 일자리 구직`;
    const employmentType = () => {
        if (data.job === JobEnum.HOME_CARE) {
            return "FULL_TIME";
        }
        return "PART_TIME";
    };
    const addressMetaData = () => {
        const arr = data.address.roadAddressName.split(" ");
        return {
            addressLocality: `${arr[0]} ${arr[1]}`,
            addressRegion: `${arr.slice(2)}`,
        };
    };

    const descriptionMetaData = () => {
        let preferCaregiver: string;
        if (data.preferCaregiverGender === "MALE") {
            preferCaregiver = "남성 선생님 선호";
        } else if (data.preferCaregiverGender === "FEMALE") {
            preferCaregiver = "여성 선생님 선호";
        } else {
            preferCaregiver = "선생님 성별 상관없음";
        }
        const motionState = RecipientMotionStateLabel.get(data.recipient?.motionState);
        const cognitiveState = RecipientCognitiveStateLabel.get(data.recipient?.cognitiveState);

        const getStatesLabel = () => {
            const states: string[] = [];

            if (motionState) {
                states.push(motionState);
            }
            if (cognitiveState) {
                states.push(cognitiveState);
            }
            return states.length > 0 ? states.join(" / ") : "-";
        };

        // eslint-disable-next-line
        // prettier-ignore
        // 네이버 채용 정보 속성 관련으로 인해 자동으로 줄바꿈이 되지 않도록 prettier, eslint ignore 처리
        return `- 어르신 정보:${RecruitingService.getSubTitle(data)}<br/> - 선호 요양보호사님 성별:${preferCaregiver}<br/> - 거동 및 인지 상태:${getStatesLabel()}<br/> - 필요 서비스:${RecruitingService.getNeedServiceText(data)}<br/> - 근무 요일/시간:${getWorkTimeInfo(data)}<br/> - 특이사항:${ConverterUtil.newLineToBr(data.memo) || "없음"}`;
    };

    const addProductJsonLd = (): string | undefined => {
        if (data.certType !== "YOBOLOVE") {
            return undefined;
        }
        return `{
                  "@context" : "https://schema.org/",
                  "@type" : "JobPosting",
                  "title" : "[${data.address.regionFirstDepth} ${data.address.regionSecondDepth}] ${JobLabel.get(data.job)} 요양보호사 일자리 구인구직 취업 채용",
                  "description" :"${descriptionMetaData()}",
                  "datePosted" : "${data.openedDate}",
                  "validThrough" : "${data.expiredDate}",
                  "employmentType" : "${employmentType()}",
                  "hiringOrganization" : {
                      "@type" : "Organization",
                      "name" : "${data.centerName}",
                      "sameAs" : "https://yobolove.co.kr",
                      "logo" : "https://imagedelivery.net/jfIRjXneURbVKR0daxEchg/8f946deb-1626-4feb-d97f-f07aebf0bf00/icon"
                  },
                  "jobLocation": {
                      "@type": "Place",
                      "address": {
                          "@type": "PostalAddress",
                          "streetAddress": "상세 주소는 담당자 연락처로 문의 바랍니다.",
                          "addressLocality": "${addressMetaData()?.addressLocality}",
                          "addressRegion": "${addressMetaData()?.addressRegion}",
                          "postalCode": "${data.address.zipCode}",
                          "addressCountry": "대한민국"
                      }
                    },
                  "baseSalary": {
                      "@type": "MonetaryAmount",
                      "currency": "KRW",
                      "value": {
                        "@type": "QuantitativeValue",
                        "value": "${data.pay}",
                        "unitText": "${PayTypeLabel.get(data.payType)}"
                      }
                  },
                  "educationRequirements": "학력 무관",
                  "workHours": ["${getWorkTimeInfo(data)}"]
                  }
                  `;
    };

    if (data.certType !== "YOBOLOVE") {
        metaData = {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/요양보호사구인&${data.address.roadAddressName}/${recruitingUuid}`,
            title: metaTitle,
            description: metaDescription,
        };
    } else {
        metaData = {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/요양보호사구인&${data.address.roadAddressName}/${recruitingUuid}`,
            title: metaTitle,
            description: metaDescription,
            productJsonLd: addProductJsonLd(),
        };
    }
    return { props: { response, metaData } };
};

Recruiting.defaultProps = {
    response: { data: "loading" },
};

export default WithHeadMetaData(Recruiting);
