import type { NextPage } from "next";
import { css } from "@emotion/css";
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Image from "next/image";
import { toRem } from "../../styles/options/Function";
import breakpoints from "../../styles/options/Breakpoints";
import UseCenterService from "../../hook/UseCenterService";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";
import UseNoticeEffect from "../../hook/UseNoticeEffect";
import StorageUtil from "../../util/StorageUtil";
import RecruitingSessionStorageKeys from "../../enum/RecruitingSessionStorageKeys";
import EventUtil from "../../util/EventUtil";
import EXTERNAL_SITE_URL_CONFIG from "../../config/ExternalSiteUrlConfig";

const IMG_CDN_URL = process.env.NEXT_PUBLIC_CDN_HOST;

const containerBackgroundStyle = css`
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    left: 0;
    width: 100%;
    height: ${toRem(360)};
    background-image: url("${IMG_CDN_URL}${"/assets/images/img-caregiver-ver2-xs.webp"}");
    @media (min-width: ${Number(breakpoints.values?.md)}px) {
        height: ${toRem(460)};
        background-image: url("${IMG_CDN_URL}${"/assets/images/img-caregiver-ver2-md.webp"}");
    }
    @media (min-width: ${Number(breakpoints.values?.lg)}px) {
        height: ${toRem(560)};
        background-image: url("${IMG_CDN_URL}${"/assets/images/img-caregiver-ver2-lg.webp"}");
    }
`;

dayjs.extend(isBetween);

/**
 * 기관용 서비스 - 홈
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1527%3A88918)
 * @category Page
 * @Center
 */
const Center: NextPage = function Center() {
    UseNoticeEffect();
    const { isLoggedIn } = UseCenterService();

    const theme = useTheme();
    const isUpperLg = useMediaQuery(theme.breakpoints.up("lg"));
    const isUpperMd = useMediaQuery(theme.breakpoints.up("md"));

    const convertTypoVariant = () => {
        if (isUpperLg) {
            return "h1_a";
        }
        if (isUpperMd) {
            return "h2";
        }
        return "h3";
    };

    const convertButtonStyles = () => {
        if (isUpperLg) return { minWidth: toRem(544), minHeight: toRem(76), fontWeight: 700, fontSize: toRem(28) };
        if (isUpperMd) return { minWidth: toRem(360), minHeight: toRem(60), fontSize: toRem(20) };
        return { minWidth: toRem(260), minHeight: toRem(50), fontSize: toRem(20) };
    };

    const handleOnetouchPaymentPageClick = () => EventUtil.gtmEvent("click", "onetouchImageBtn", "center", "0");

    return (
        <>
            <div className={containerBackgroundStyle}>
                <Box
                    maxWidth="lg"
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    height="100%"
                    flexDirection="column"
                    sx={{
                        px: { xs: 4, sm: 6, md: 8 },
                        m: "0 auto",
                    }}
                >
                    <Typography
                        variant={convertTypoVariant()}
                        sx={{
                            wordBreak: "keep-all",
                            fontWeight: 500,
                        }}
                    >
                        세상에서 가장 쉬운
                    </Typography>
                    <Typography
                        variant={convertTypoVariant()}
                        sx={{
                            wordBreak: "keep-all",
                            fontWeight: 700,
                        }}
                    >
                        요양보호사 구인 솔루션
                    </Typography>
                    <Link href={isLoggedIn() ? "/기관/구인공고등록" : "/기관/로그인?redirect-uri=/기관/구인공고등록"} passHref>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForward />}
                            size={isUpperMd ? "large" : "medium"}
                            sx={{ mt: 5.5 }}
                            onClick={() => {
                                StorageUtil.removeItem([RecruitingSessionStorageKeys.WRITTEN_RECRUITING_CONTENT, RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL]);

                                EventUtil.gtmEvent("click", "recruit", "center", "메뉴(공고등록) - menu");
                            }}
                        >
                            구인 시작하기
                        </Button>
                    </Link>
                </Box>
            </div>
            <Box component="section" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "#0D1A45", p: 6, width: "100%" }}>
                <Image
                    src={`${IMG_CDN_URL}/assets/images/img-KBBAemblem-md.png`}
                    sizes={`(max-width: ${breakpoints.values?.sm}) 60px,
                        105px`}
                    width={isUpperMd ? 105 : 60}
                    height={isUpperMd ? 108 : 62.05}
                    layout="intrinsic"
                    priority
                />
                <Box display="flex" flexDirection="column" sx={{ pl: isUpperMd ? 7 : 3, gap: 3 }}>
                    <Typography variant={isUpperMd ? "h3" : "h6"} color={theme.palette.primary.contrastText}>
                        2022 대한민국 최고브랜드대상
                        <br />
                        요보사랑 2년 연속 수상!
                    </Typography>
                    <Typography variant={isUpperMd ? "body1" : "overline"} color={theme.palette.primary.contrastText}>
                        서비스/요양보호사 구인구직 부문
                    </Typography>
                </Box>
            </Box>
            <Box component="section" display="flex" flexDirection="column">
                <Image src={`${IMG_CDN_URL}/assets/images/image-service-01-01.webp`} width="1024px" height="422px" priority />
                <Image src={`${IMG_CDN_URL}/assets/images/image-service-01-02.webp`} width="1024px" height="540px" priority />
                <Image src={`${IMG_CDN_URL}/assets/images/image-service-01-03.webp`} width="1024px" height="562px" />
                <Image src={`${IMG_CDN_URL}/assets/images/image-service-01-04.webp`} width="1024px" height="632px" />
                <Box sx={{ backgroundColor: theme.palette.primary.dark, textAlign: "center" }} width="100%">
                    <Button
                        variant="contained"
                        size="large"
                        color="error"
                        sx={{
                            ...convertButtonStyles(),
                            margin: toRem(42),
                            boxShadow: "0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.14), 0px 1px 8px rgba(0, 0, 0, 0.12)",
                        }}
                        href={EXTERNAL_SITE_URL_CONFIG.ONETOUCH_PAYMENT_PAGE_URL}
                        target="_blank"
                        onClick={handleOnetouchPaymentPageClick}
                    >
                        원터치 공고 등록 서비스 이용하기
                    </Button>
                </Box>
                <Image src={`${IMG_CDN_URL}/assets/images/image-review-02.webp`} width="1024px" height="586px" />
            </Box>
        </>
    );
};
export default WithHeadMetaData(Center);
