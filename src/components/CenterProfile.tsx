import { GetServerSideProps } from "next";
import { Box, Button, Hidden, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React, { ReactElement, useMemo } from "react";
import { css } from "@emotion/css";
import Link from "next/link";
import WithCenterAuth from "../hoc/WithCenterAuth";
import { toRemWithUnit } from "../styles/options/Function";
import sectionStyle from "../styles/sectionStyle";
import { breakpoints, palette } from "../styles/options";
import UseCenterService from "../hook/UseCenterService";
import EventUtil from "../util/EventUtil";

const tabStyle = css`
    button {
        flex: 1;
        width: 100%;
        @media (min-width: ${Number(breakpoints.values?.md)}px) {
            padding-left: ${toRemWithUnit(8)};
            align-items: flex-start;
        }
    }
`;

const buttonStyle = css`
    color: ${palette.text?.disabled};

    &:hover {
        color: ${palette.text?.primary};
    }
`;

/**
 * CenterProfilePropsType
 */
type CenterProfilePropsType = {
    /**
     * 메인 영역에 들어갈 children 입니다.
     */
    children: ReactElement | ReactElement[];
    /**
     * sx
     */
    sx?: object;
};

/**
 * 기관용 센터 프로필 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A93537)
 * @category Component
 */
function CenterProfile(props: CenterProfilePropsType) {
    const { logout } = UseCenterService();
    const { children, sx } = props;
    const router = useRouter();
    const theme = useTheme();

    /**
     * 두번째 탭 클릭시 /기관/나의공고로 이동
     * 첫번째 탭 클릭시 /기관/계정정보로 이동
     * @param _e 이벤트(사용안함)
     * @param tabIndex 클릭한 탭인덱스
     */
    const handleChange = async (_e: React.SyntheticEvent, tabIndex: number) => {
        if (tabIndex === 1) {
            await router.push("/기관/나의공고");
        } else {
            await router.push("/기관/계정정보");
        }
    };

    const tabIndex = useMemo<number>(() => {
        if (router.pathname.indexOf("/center/recruitings") === 0 || router.pathname.indexOf("/기관/나의공고") === 0) {
            return 1;
        }
        return 0;
    }, [router.pathname]);

    const isUpperMd = useMediaQuery(theme.breakpoints.up("md"));

    const handleClickLogoutButton = () => {
        logout("/center");

        EventUtil.gtmEvent("click", "logout", "cenMypage", "0");
    };

    return (
        <>
            <Box
                display="flex"
                height="100%"
                alignItems="flexStart"
                {...sectionStyle({ py: 0, px: 0, pb: 0, textAlign: "left", flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" } }, "lg", true)}
            >
                <Box
                    sx={{
                        borderBottom: {
                            xs: "1px solid rgba(0, 0, 0, 0.1);",
                            sm: "1px solid rgba(0, 0, 0, 0.1);",
                            md: "0",
                            lg: "0",
                        },
                        width: { xs: "100%", sm: "100%", md: toRemWithUnit(70), lg: toRemWithUnit(70) },
                        flex: "none",
                        backgroundColor: {
                            xs: null,
                            sm: null,
                            md: theme.palette.background.default,
                            lg: theme.palette.background.default,
                        },
                    }}
                >
                    <Hidden mdDown>
                        <Typography
                            variant="h2"
                            sx={{
                                mb: 10,
                                mt: {
                                    xs: 0,
                                    sm: 0,
                                    md: 10,
                                    lg: 10,
                                },
                                px: {
                                    xs: 0,
                                    sm: 0,
                                    md: 8,
                                    lg: 8,
                                },
                            }}
                        >
                            내 정보
                        </Typography>
                    </Hidden>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="기관용 내정보 탭" orientation={isUpperMd ? "vertical" : "horizontal"} className={tabStyle}>
                        <Tab
                            label={
                                <Typography variant={isUpperMd ? "h3" : "h5"} color="inherit">
                                    계정정보
                                </Typography>
                            }
                        />
                        <Tab
                            label={
                                <Typography variant={isUpperMd ? "h3" : "h5"} color="inherit">
                                    나의 공고
                                </Typography>
                            }
                        />
                    </Tabs>
                </Box>
                <Box
                    display="flex"
                    height="100%"
                    alignItems="stretch"
                    flexDirection="column"
                    {...sectionStyle({ pt: 0, pb: 5, px: { xs: 0, sm: 0, md: 8, lg: 8 }, margin: "0 auto", textAlign: "left", ...sx }, "md")}
                >
                    {children}
                </Box>
            </Box>
            <Box flex="none" alignItems="center" width="100%" textAlign="center" sx={{ backgroundColor: "background.default" }}>
                <Box display="flex" flexDirection="row" {...sectionStyle({ pt: 5, pb: 5, px: 0, textAlign: "left", margin: "0 auto" }, "lg")}>
                    <Button variant="text" size="small" color="inherit" className={buttonStyle} onClick={handleClickLogoutButton}>
                        로그아웃
                    </Button>
                    <Link href="/center/withdrawal" passHref>
                        <a>
                            <Button variant="text" size="small" color="inherit" className={buttonStyle}>
                                회원탈퇴
                            </Button>
                        </a>
                    </Link>
                </Box>
            </Box>
        </>
    );
}

CenterProfile.defaultProps = {
    sx: {},
};
export default CenterProfile;

/**
 * 기관용 로그인 인증 필요함.
 * @category Gssp
 */
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true);
