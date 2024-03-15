import type { NextPage } from "next";
import { Box, Button, Step, Stepper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Link from "next/link";
import sectionStyle from "../styles/sectionStyle";
import KakaotalkIcon from "../styles/images/img-icon-kakaotalk.svg";
import StepOneIcon from "../styles/images/1.svg";
import StepTwoIcon from "../styles/images/2.svg";
import StepThreeIcon from "../styles/images/3.svg";
import UseTitle from "../hook/UseTitle";
import WithHeadMetaData from "../hoc/WithHeadMetaData";
import EventUtil from "../util/EventUtil";
import UseKakao from "../hook/UseKakao";

/**
 * 시작하기
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1502%3A74780)
 * @category Page
 * @Caregiver
 */
const Login: NextPage = function Login() {
    UseTitle("요양보호사 로그인", "로그인");
    const { login, loadScript } = UseKakao();

    const signUpWithPhoneNum = () => {
        EventUtil.gtmEvent("click", "start", "login", "signup");
    };

    const logInWithPhoneNum = () => {
        EventUtil.gtmEvent("click", "start", "login", "login");
    };

    useEffect(() => {
        loadScript();
    }, []);

    return (
        <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 12, textAlign: "center" }, "sm")}>
            <Typography variant="h3">
                지금 바로 가입하고
                <br />
                희망 일자리를 알림으로 편하게 받아보세요!
            </Typography>
            <Stepper
                orientation="vertical"
                connector={
                    <Box component="div" sx={{ flex: "1 1 auto", ml: 3.25, my: -0.4 }}>
                        <Box component="div" sx={{ borderColor: "#020202", borderLeftStyle: "solid", borderLeftWidth: 0.25, height: "1.625rem" }} />
                    </Box>
                }
                sx={{ my: 6 }}
            >
                <Step sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                    <StepOneIcon />
                    <Typography variant="h6" sx={{ pl: 1.75 }}>
                        가입 & 희망 근무 조건 선택
                    </Typography>
                </Step>
                <Step sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                    <StepTwoIcon />
                    <Typography variant="h6" sx={{ pl: 1.75 }}>
                        일자리 알림 메시지 확인
                    </Typography>
                </Step>
                <Step sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                    <StepThreeIcon />
                    <Typography variant="h6" sx={{ pl: 1.75 }}>
                        내가 원하는 일자리에서 근무 시작!
                    </Typography>
                </Step>
            </Stepper>
            <Button startIcon={<KakaotalkIcon />} variant="contained" sx={{ mt: 2 }} color="kakaotalk" size="large" fullWidth onClick={() => login()}>
                카카오톡 회원가입/로그인
            </Button>
            <Typography variant="body1" sx={{ mt: 12 }}>
                카카오톡이 없다면 휴대폰 번호로
            </Typography>

            <Box display="flex" width="100%" gap={3} sx={{ mt: 4, mb: 12 }}>
                <Link href="/signup" as="/회원가입" passHref>
                    <a style={{ width: "100%" }}>
                        <Button fullWidth variant="outlined" color="secondary" onClick={() => signUpWithPhoneNum()}>
                            회원가입
                        </Button>
                    </a>
                </Link>
                <Link href="/login-by-phone" as="/휴대폰로그인" passHref>
                    <a style={{ width: "100%" }}>
                        <Button fullWidth variant="outlined" color="secondary" onClick={() => logInWithPhoneNum()}>
                            로그인
                        </Button>
                    </a>
                </Link>
            </Box>
        </Box>
    );
};

export default WithHeadMetaData(Login);
