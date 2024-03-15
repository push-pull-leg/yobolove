import type { NextPage } from "next";
import { Box, Button, Card, CardContent, CardHeader, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { toRem } from "../../styles/options/Function";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";

const imgUrl = `${process.env.NEXT_PUBLIC_CDN_HOST}/assets/images/`;

const LaunchEvent: NextPage = function LaunchEvent() {
    const theme = useTheme();
    const isUpperLg = useMediaQuery(theme.breakpoints.up("lg"));
    const isUpperMd = useMediaQuery(theme.breakpoints.up("md"));
    const isUpperSm = useMediaQuery(theme.breakpoints.up("sm"));

    const mainTypoVariant = () => {
        if (isUpperLg) {
            return "h5";
        }
        if (isUpperMd) {
            return "h6";
        }
        return "overline";
    };

    const secondTypoVariant = () => {
        if (isUpperMd) {
            return "h1";
        }
        if (isUpperSm) {
            return "h2";
        }
        return "h3";
    };

    const subTypoVariant = () => {
        if (isUpperMd) {
            return "h4";
        }
        return "body2";
    };

    const secondSubTypoVariant = () => {
        if (isUpperMd) {
            return "h4";
        }
        return "overline";
    };

    const infoTypoVariant = () => {
        if (isUpperMd) {
            return "h4";
        }
        return "caption";
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                component="section"
                sx={{
                    background: {
                        lg: `url(${imgUrl}main-1920.png) no-repeat center`,
                        md: `url(${imgUrl}main-md.png) no-repeat center`,
                        sm: `url(${imgUrl}main-sm0.png) no-repeat center`,
                        xs: `url(${imgUrl}360-767.png) no-repeat center`,
                    },
                    height: {
                        lg: toRem(900),
                        md: toRem(540),
                        sm: toRem(420),
                        xs: toRem(460),
                    },
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant={mainTypoVariant()}
                    color="primary.contrastText"
                    sx={{
                        mt: {
                            lg: toRem(146),
                            md: toRem(68),
                            sm: toRem(58),
                            xs: toRem(84),
                        },
                    }}
                >
                    요보사랑 개편 기념 가입 이벤트
                </Typography>
                <Typography
                    color="secondary.main"
                    sx={{
                        fontSize: {
                            lg: toRem(18),
                            md: toRem(16),
                            xs: toRem(16),
                        },
                        mt: {
                            lg: toRem(570),
                            md: toRem(370),
                            sm: toRem(280),
                            xs: toRem(270),
                        },
                    }}
                >
                    이벤트 기간 : 2022.11.23(수) ~ 12.06(화)
                </Typography>
            </Box>
            <Box
                component="section"
                sx={{
                    background: `url(${imgUrl}2-image.png) no-repeat 50% 100%`,
                    backgroundSize: {
                        md: "600px 414px",
                        xs: "360px 248px",
                    },
                    backgroundColor: "#F8F8F8",
                    height: {
                        md: toRem(680),
                        sm: toRem(400),
                        xs: toRem(414),
                    },
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant={secondTypoVariant()}
                    align="center"
                    sx={{
                        mt: {
                            md: toRem(140),
                            sm: toRem(60),
                            xs: toRem(72),
                        },
                    }}
                >
                    요양보호사님 일자리 찾을 때<br />
                    이런 어려움이 있으셨나요?
                </Typography>
                <Typography
                    color="text.primary"
                    variant={secondSubTypoVariant()}
                    sx={{
                        margin: {
                            md: "54px 0 0 76px",
                            sm: "30px 0 0 58px",
                            xs: "43px 0 0 58px",
                        },
                    }}
                >
                    이 많은 공고를 언제
                    <br />다 본담....
                </Typography>
                <Typography
                    color="text.primary"
                    variant={secondSubTypoVariant()}
                    sx={{
                        margin: {
                            md: "30px 0 0 -356px",
                            sm: "17px 0 0 -206px",
                            xs: "16px 0 0 -206px",
                        },
                    }}
                >
                    내가 찾는 조건과
                    <br />딱 맞는 곳이 없네
                </Typography>
                <Typography
                    color="text.primary"
                    variant={secondSubTypoVariant()}
                    sx={{
                        margin: {
                            md: "-33px 0 0 312px",
                            sm: "-24px 0 0 196px",
                            xs: "-22px 0 0 194px",
                        },
                    }}
                >
                    다시 일하고 싶은데
                    <br />
                    예전 센터에
                    <br />
                    연락해야 하나...
                </Typography>
            </Box>
            <Box
                component="section"
                sx={{
                    background: `url(${imgUrl}section-03.png) no-repeat`,
                    backgroundPosition: {
                        md: "50% 376px",
                        xs: "50% 248px",
                    },
                    backgroundSize: {
                        md: "600px 579px",
                        xs: "324px 313px",
                    },
                    height: {
                        md: toRem(1086),
                        sm: toRem(615),
                        xs: toRem(627),
                    },
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant={secondTypoVariant()}
                    sx={{
                        mt: {
                            md: toRem(140),
                            sm: toRem(60),
                            xs: toRem(72),
                        },
                    }}
                    align="center"
                >
                    이제, 내게 맞는 일자리만
                    <br />
                    확인하세요!
                </Typography>
                <Typography
                    color="text.primary"
                    align="center"
                    variant={subTypoVariant()}
                    sx={{
                        mt: {
                            xs: toRem(16),
                        },
                    }}
                >
                    <Box component="span" color="primary.main">
                        희망 근무 조건
                    </Box>
                    만 등록해두면
                    <br />
                    카카오/문자 알림과 요보사랑 게시판으로
                    <br />
                    언제든 맞춤형 일자리를 확인할 수 있어요
                </Typography>
            </Box>
            <Box
                component="section"
                sx={{
                    background: `url(${imgUrl}section-04.png) no-repeat`,
                    backgroundSize: {
                        md: "600px 619px",
                        xs: "324px 355px",
                    },
                    backgroundPosition: {
                        md: "50% 321px",
                        xs: "50% 203px",
                    },
                    height: {
                        md: toRem(1072),
                        sm: toRem(614),
                        xs: toRem(626),
                    },
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#FFDDE5",
                }}
            >
                <Typography
                    variant={secondTypoVariant()}
                    sx={{
                        mt: {
                            md: toRem(140),
                            sm: toRem(60),
                            xs: toRem(72),
                        },
                    }}
                    align="center"
                >
                    이토록 편리하고 유용한&nbsp;
                    <Box component="span" color="primary.main">
                        요보사랑
                    </Box>
                    <br />
                    지금 가입하고 선물도 받으세요!
                </Typography>
                <Typography
                    color="text.primary"
                    align="center"
                    variant="h4"
                    sx={{
                        mt: {
                            xs: toRem(16),
                        },
                    }}
                >
                    💖 초간단 참여 방법 💖
                </Typography>
            </Box>
            <Box
                component="section"
                sx={{
                    background: {
                        md: `url(${imgUrl}big_bg.png) no-repeat center`,
                        xs: `url(${imgUrl}section-05-sm.png) no-repeat center`,
                    },
                    backgroundSize: {
                        md: "1920px 900px",
                        xs: "767px 360px",
                    },
                    height: {
                        lg: toRem(900),
                        md: toRem(900),
                        sm: toRem(360),
                        xs: toRem(360),
                    },
                    width: "100%",
                }}
            />
            <Box
                component="section"
                sx={{
                    py: {
                        md: toRem(140),
                        sm: toRem(60),
                        xs: toRem(72),
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant={secondTypoVariant()} align="center">
                    이벤트 &nbsp;
                    <Box component="span" color="primary.main">
                        QnA
                    </Box>
                </Typography>
                <Card
                    sx={{
                        boxShadow: "none",
                        width: { lg: toRem(768), md: "90%", sm: "90%", xs: "90%" },
                        display: "flex",
                        flexDirection: "column",
                        gap: toRem(8),
                        pt: "2rem",
                    }}
                >
                    <CardContent sx={{ display: "flex", backgroundColor: "#FF89A3", py: toRem(8), borderRadius: "0.25rem" }}>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }} color="primary.contrastText">
                            Q.
                        </Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }} color="primary.contrastText">
                            요양보호사 자격증만 있으면 누구나 참여 가능한가요?
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ display: "flex", backgroundColor: "#FFE6EB", py: "0.5rem !important", borderRadius: "0.25rem" }}>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            A.
                        </Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            네! 현재 일을 하지 않더라도 요양보호사 자격증만 있으면 누구나 가입 가능하고 이벤트 참여도 가능해요
                        </Typography>
                    </CardContent>
                </Card>
                <Card
                    sx={{
                        boxShadow: "none",
                        width: { lg: toRem(768), md: "90%", sm: "90%", xs: "90%" },
                        display: "flex",
                        flexDirection: "column",
                        gap: toRem(8),
                        pt: "1.5rem",
                    }}
                >
                    <CardContent sx={{ display: "flex", backgroundColor: "#FF89A3", py: toRem(8), borderRadius: "0.25rem" }}>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8) }} color="primary.contrastText">
                            Q.
                        </Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8) }} color="primary.contrastText">
                            기존 회원은 참여할 수 없나요?
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ display: "flex", backgroundColor: "#FFE6EB", py: "0.5rem !important", borderRadius: "0.25rem" }}>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8) }}>
                            A.
                        </Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8) }}>
                            아쉽지만 신규 회원만 참여 가능해요. 12월 초에 회원 모두를 위한 이벤트가 진행됩니다! 그때까지 조금만 기다려주세요 ^^
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Divider sx={{ border: "2px, solid, rgba(0,0,0,0.5)", margin: "0 auto", width: { lg: toRem(768), md: "90%", sm: "90%", xs: "90%" } }} />
            <Box
                component="section"
                sx={{
                    py: {
                        xs: toRem(72),
                    },
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant={secondTypoVariant()} align="center">
                    꼭 확인해주세요!
                </Typography>
                <Card
                    sx={{
                        boxShadow: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: toRem(8),
                        pt: "2rem",
                        width: { lg: toRem(768), md: "90%", sm: "90%", xs: "90%" },
                    }}
                >
                    <CardHeader sx={{ p: 0 }} title={<Typography variant={infoTypoVariant()}>[이벤트 정보]</Typography>} />
                    <CardContent sx={{ display: "flex", p: 0 }}>
                        <Typography variant={infoTypoVariant()}>•</Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            이벤트 기간: 2022.11.23(수) ~ 12.06(화)
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ display: "flex", p: 0 }}>
                        <Typography variant={infoTypoVariant()}>•</Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            요양보호사님 확인 기간: 12.07(수) ~ 12/12(월)
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ display: "flex", p: 0 }}>
                        <Typography variant={infoTypoVariant()}>•</Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            선물 지급: 2022.12.15(목) 가입한 휴대번호로 발송
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ display: "flex", p: 0 }}>
                        <Typography variant={infoTypoVariant()}>•</Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            휴대번호를 잘못 입력하거나 기프티콘 수신이 불가한 경우, 재발급이 어렵습니다. 꼭 유효한 번호를 입력해주세요!
                        </Typography>
                    </CardContent>
                </Card>
                <Card
                    sx={{
                        boxShadow: "none",
                        width: { lg: toRem(768), md: "90%", sm: "90%", xs: "90%" },
                        display: "flex",
                        flexDirection: "column",
                        gap: toRem(8),
                    }}
                >
                    <CardHeader sx={{ p: 0 }} title={<Typography variant={infoTypoVariant()}>[필독 사항]</Typography>} />
                    <CardContent sx={{ display: "flex", p: 0 }}>
                        <Typography variant={infoTypoVariant()}>•</Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            본 이벤트는 당사 사정에 의해 조기 종료될 수 있습니다.
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ display: "flex", p: 0 }}>
                        <Typography variant={infoTypoVariant()}>•</Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            가입 후 희망조건을 입력/저장해야 이벤트 참여가 완료됩니다. 미입력 시 선물이 지급되지 않습니다.
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ display: "flex", p: 0 }}>
                        <Typography variant={infoTypoVariant()}>•</Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            해당 이벤트는 요양보호사님을 위한 이벤트로 예비 요양보호사님도 참여 가능합니다. 이벤트 마감 후 자격증, 시험 확인증을 확인 후 리워드가 지급됩니다.
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ display: "flex", p: "0 !important" }}>
                        <Typography variant={infoTypoVariant()}>•</Typography>
                        <Typography variant={infoTypoVariant()} sx={{ pl: toRem(8), wordBreak: "break-all" }}>
                            본 이벤트는 신규 가입 대상으로, 기존 요보사랑 등록 회원은 참여가 불가합니다. 기존 회원이 탈퇴 후 재가입할 경우 선물이 지급되지 않습니다.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Box
                sx={{
                    position: "sticky",
                    bottom: 0,
                    py: toRem(24),
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "white",
                    boxShadow: "0 -12px 16px hsl(30deg 20% 80% / 20%)",
                }}
            >
                <Button
                    variant="contained"
                    size="large"
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.12)", width: { lg: toRem(600), md: toRem(400), sm: toRem(400), xs: "90%" }, py: 3 }}
                    disabled
                >
                    <Typography color="rgba(0, 0, 0, 0.26)" variant="subtitle1" sx={{ pl: 2.5 }}>
                        종료된 이벤트입니다.
                    </Typography>
                </Button>
            </Box>
        </Box>
    );
};

export default WithHeadMetaData(LaunchEvent);
