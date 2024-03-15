import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Container, List, ListItem, ListItemText, Paper, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import { css } from "@emotion/css";
import { ArrowForward, ArrowForwardIos } from "@mui/icons-material";
import { GetServerSideProps } from "next";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { toRem } from "../styles/options/Function";
import breakpoints from "../styles/options/Breakpoints";
import Recruitings from "../components/Recruitings";
import sectionStyle from "../styles/sectionStyle";
import HttpUtil from "../util/HttpUtil";
import EndpointEnum from "../enum/EndpointEnum";
import GetRecruitingResponseInterface from "../interface/response/GetRecruitingsResponseInterface";
import UseHttp from "../hook/UseHttp";
import UseCaregiverService from "../hook/UseCaregiverService";
import GetRecruitingNewCountResponseInterface from "../interface/response/GetRecruitingNewCountResponseInterface";
import ConverterUtil from "../util/ConverterUtil";
import GetRecruitingsRequestInterface from "../interface/request/GetRecruitingsRequestInterface";
import Error from "../components/Error";
import WithHeadMetaData from "../hoc/WithHeadMetaData";
import EventUtil from "../util/EventUtil";
import CommonUtil from "../util/CommonUtil";
import UseNudge from "../hook/UseNudge";
import UseNoticeEffect from "../hook/UseNoticeEffect";

const imgUrl = process.env.NEXT_PUBLIC_CDN_HOST;

const containerBackgroundStyle = css`
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    left: 0;
`;

const typoStyle = css`
    text-align: center;
    padding-top: ${toRem(28)};
    @media (min-width: ${Number(breakpoints.values?.md)}px) {
        padding-top: 0;
        text-align: left;
    }
`;

const main = css`
    width: 100%;
    height: ${toRem(240)};
    background: url(${imgUrl}/assets/images/img-yobotalk-01-sm-2x.png) no-repeat bottom;
    background-size: contain;
    @media (min-width: ${Number(breakpoints.values?.sm)}px) {
        height: ${toRem(260)};
        background: url(${imgUrl}/assets/images/img-yobotalk-01-sm-2x.png) no-repeat bottom;
        background-size: contain;
    }
    @media (min-width: ${Number(breakpoints.values?.md)}px) {
        width: 344px;
        height: 100%;
        background: url(${imgUrl}/assets/images/img-yobotalk-03-md.webp) no-repeat bottom;
    }
    @media (min-width: ${Number(breakpoints.values?.lg)}px) {
        width: ${toRem(421)};
        height: 100%;
        background: url(${imgUrl}/assets/images/img-yobotalk-03-lg.webp) no-repeat bottom;
    }
`;

dayjs.extend(isBetween);

/**
 * {@link Home} props
 */
type HomePropsType = {
    /**
     * gssp 에서 받아오는 초기 구인공고 데이터.
     */
    initialRecruitingResponse?: GetRecruitingResponseInterface | "loading" | null;
    /**
     * gssp 에서 받아오는 초기 새로운 일자리 갯수 데이터
     */
    initialNewCountResponse?: GetRecruitingNewCountResponseInterface | null;
};

/**
 * 구직자 홈
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1502%3A74619)
 * @category Page
 * @Caregiver
 */
function Home(props: HomePropsType) {
    const { initialRecruitingResponse, initialNewCountResponse } = props;
    const { httpRequest } = UseHttp();
    const { isLoggedIn, hasDesiredWork, caregiverRecoil } = UseCaregiverService();
    const [recruitingResponse, setRecruitingResponse] = useState<GetRecruitingResponseInterface | undefined | "loading">(initialRecruitingResponse || undefined);
    const [newCount, setNewCount] = useState<number>(initialNewCountResponse?.data?.newCount || 0);
    const theme = useTheme();
    const isUpperLg = useMediaQuery(theme.breakpoints.up("lg"));
    const isUpperMd = useMediaQuery(theme.breakpoints.up("md"));
    const { handleMountedInHome } = UseNudge();

    UseNoticeEffect({
        callback: (canNoticeOpen: boolean) => {
            if (!canNoticeOpen) handleMountedInHome();
        },
    });

    const typoVariant = () => {
        if (isUpperLg) {
            return "h1";
        }
        if (isUpperMd) {
            return "h2";
        }
        return "h3";
    };

    const getRecruitings = useCallback(async (): Promise<void> => {
        setRecruitingResponse("loading");
        try {
            const initialResponse = await httpRequest<GetRecruitingResponseInterface, GetRecruitingsRequestInterface>(EndpointEnum.GET_RECRUITINGS, {
                size: 6,
            });
            setRecruitingResponse(initialResponse);
        } catch (e) {
            setRecruitingResponse(undefined);
        }
    }, []);

    const getNewCount = async (): Promise<void> => {
        setRecruitingResponse("loading");
        const newCountResponse = await httpRequest<GetRecruitingNewCountResponseInterface>(EndpointEnum.GET_RECRUITING_NEW_COUNT);
        if ("error" in newCountResponse) return;

        setNewCount(newCountResponse.data.newCount);
    };

    useEffect(() => {
        if (!initialRecruitingResponse) {
            /**
             * SSR 에서 initial 데이터를 받지 못하면 CSR 에서 동적으로 데이터 불러옴
             */
            getRecruitings();
        }
        if (!initialNewCountResponse) {
            getNewCount();
        }
    }, []);

    const recruitings = useMemo(() => {
        if (!recruitingResponse) {
            return <Error buttonText="다시 시도하기" onClick={() => getRecruitings()} />;
        }
        if (recruitingResponse === "loading") {
            return (
                <ul style={{ padding: "12px" }}>
                    <Card
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                        elevation={0}
                        raised={false}
                    >
                        <CardHeader title={<Skeleton animation="wave" variant="text" />} titleTypographyProps={{ variant: "body1" }} sx={{ p: 0, textAlign: "left" }} />
                        <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 2.5 } }}>
                            <ListItem disablePadding sx={{ mt: 1, clear: "both", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "secondary.dark" }}>
                                    <Skeleton animation="wave" variant="text" width="50%" height={15} />
                                </ListItemText>
                            </ListItem>
                            <ListItem disablePadding sx={{ mt: 1, clear: "both", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "secondary.dark" }}>
                                    <Skeleton animation="wave" variant="text" width="30%" height={15} />
                                </ListItemText>
                            </ListItem>
                        </CardContent>
                    </Card>
                </ul>
            );
        }
        if (recruitingResponse.error) {
            return <div>{recruitingResponse.error.message}</div>;
        }
        return <Recruitings recruitings={recruitingResponse.data} variant="simple" />;
    }, [recruitingResponse]);

    const recruitingLink = useMemo(() => {
        let link = "/login";
        let linkAs = "/시작하기";
        if (isLoggedIn()) {
            if (hasDesiredWork()) {
                link = "/recruitings";
                linkAs = "/게시판";
            } else {
                link = "/account/desired-work";
                linkAs = "/내정보/희망근무조건";
            }
        }
        return { link, linkAs };
    }, [caregiverRecoil.tokenData]);

    const clickRecruitings = () => {
        if (isLoggedIn()) {
            EventUtil.gtmEvent("click", "board", "home", "main");
        } else {
            EventUtil.gtmEvent("click", "apply", "home", "main");
        }
    };

    const recruitingApply = () => {
        if (!isLoggedIn()) {
            EventUtil.gtmEvent("click", "apply", "home", "bottom");
        } else {
            EventUtil.gtmEvent("click", "work", "home", "0");
        }
    };

    return (
        <>
            <Container
                className={containerBackgroundStyle}
                component="section"
                maxWidth={false}
                sx={{
                    backgroundColor: theme.palette.background.default,
                    height: {
                        xs: toRem(390),
                        sm: toRem(400),
                        md: toRem(460),
                        lg: toRem(560),
                    },
                    maxWidth: "initial",
                }}
            >
                <Box
                    display="flex"
                    height="100%"
                    maxWidth="lg"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    sx={{
                        px: { xs: 4, sm: 6, md: 8 },
                        m: "0 auto",
                        gap: 3,
                        justifyContent: {
                            xs: "space-between",
                        },
                        flexDirection: {
                            xs: "column",
                            sm: "column",
                            md: "row",
                        },
                    }}
                >
                    <div className={typoStyle}>
                        <Typography
                            variant={typoVariant()}
                            sx={{
                                wordBreak: "keep-all",
                                fontWeight: "600",
                                mb: {
                                    xs: 5,
                                    sm: 4,
                                    md: 6,
                                    lg: 8,
                                },
                            }}
                        >
                            요양보호사님 일자리
                            <br />
                            맞춤형으로 찾아서 알림 드려요!
                            <Typography
                                sx={{
                                    mt: 1.5,
                                    fontSize: {
                                        xs: "1rem",
                                        sm: "1rem",
                                        md: "1.25rem",
                                        lg: "1.25rem",
                                    },
                                }}
                            >
                                희망 근무조건 등록하고 <strong>무료로 알림</strong>받으세요
                            </Typography>
                        </Typography>
                        <Link href={recruitingLink.link} as={recruitingLink.linkAs} passHref>
                            <a>
                                <Button
                                    variant="contained"
                                    onClick={() => clickRecruitings()}
                                    endIcon={<ArrowForward />}
                                    sx={{ px: { xs: 4, md: 5 }, py: { xs: 1.5, md: 3.25 } }}
                                    size="large"
                                >
                                    {isLoggedIn() ? "일자리 공고 보기" : "맞춤형 일자리 받기"}
                                </Button>
                            </a>
                        </Link>
                    </div>
                    <div className={main} />
                </Box>
            </Container>
            <Box component="section" display="flex" alignItems="flex-start" justifyContent="center" flexDirection="column" {...sectionStyle({ py: 9 })}>
                <Typography variant="subtitle1">{ConverterUtil.toCommaString(newCount)}개의 새로운 일자리가 있어요</Typography>
                <Link href="/recruitings" as={`/${encodeURI("게시판")}`} passHref>
                    <a>
                        <Button
                            onClick={() => EventUtil.gtmEvent("click", "board", "home", "whole")}
                            endIcon={<ArrowForwardIos />}
                            sx={{ mt: 1, p: 0, px: 0 }}
                            variant="text"
                            disableTouchRipple
                            disableElevation
                            disableRipple
                            disableFocusRipple
                        >
                            전체 공고 확인하기
                        </Button>
                    </a>
                </Link>
                <Box
                    width="100%"
                    sx={{
                        mt: 4,
                        mx: {
                            xs: -4,
                            sm: -6,
                            md: 0,
                            lg: 0,
                        },
                        width: {
                            xs: "calc(100% + 2rem)",
                            sm: "calc(100% + 3rem)",
                            md: "100%",
                            lg: "100%",
                        },
                    }}
                >
                    {recruitings}
                </Box>
                <Paper
                    variant="outlined"
                    square
                    sx={{
                        mt: 9,
                        p: 5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContents: "center",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="subtitle1">요양보호사님이신가요?</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {isLoggedIn() ? "희망 근무조건이나 알림여부를 변경하고 싶다면" : "내 조건에 꼭 맞는 일자리, 찾아다니지 않아도 문자로 알려줘요"}
                    </Typography>
                    <Link href={isLoggedIn() ? "/내정보/희망근무조건" : "/시작하기"} passHref>
                        <a style={{ marginTop: 20 }}>
                            <Button onClick={() => recruitingApply()} variant="outlined" size="medium" endIcon={<ArrowForward />}>
                                {isLoggedIn() ? "알림 조건 변경" : "일자리 알림 신청"}
                            </Button>
                        </a>
                    </Link>
                </Paper>
                <Paper
                    variant="outlined"
                    square
                    sx={{
                        mt: 5,
                        p: 5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContents: "center",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="subtitle1">인력을 찾는 요양기관이신가요?</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        쉽고 빠른 구인신청, 공고 등록과 알림톡 발송 모두 무료
                    </Typography>
                    <Link href="/center" as="/기관" passHref>
                        <a style={{ marginTop: 20 }}>
                            <Button variant="outlined" size="medium" endIcon={<ArrowForward />}>
                                기관용 서비스
                            </Button>
                        </a>
                    </Link>
                </Paper>
            </Box>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async context => {
    const { req } = context;
    const userAgent = typeof navigator === "undefined" ? req.headers["user-agent"] : navigator.userAgent;

    if (CommonUtil.isBot(userAgent)) {
        try {
            const recruitingResponse = await HttpUtil.request<GetRecruitingResponseInterface, GetRecruitingsRequestInterface>(EndpointEnum.GET_RECRUITINGS, {
                size: 6,
            });

            const newCountResponse = await HttpUtil.request<GetRecruitingNewCountResponseInterface>(EndpointEnum.GET_RECRUITING_NEW_COUNT);
            return { props: { initialRecruitingResponse: recruitingResponse || null, initialNewCountResponse: newCountResponse || null } };
        } catch (e) {
            return { props: {} };
        }
    }
    return { props: {} };
};

Home.defaultProps = {
    initialRecruitingResponse: undefined,
    initialNewCountResponse: undefined,
};

export default WithHeadMetaData(Home);
