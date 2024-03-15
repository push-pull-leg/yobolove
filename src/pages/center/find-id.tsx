import type { NextPage } from "next";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import Link from "next/link";
import sectionStyle from "../../styles/sectionStyle";
import UseAuthCode from "../../hook/UseAuthCode";
import CenterAccountInterface from "../../interface/CenterAccountInterface";
import UseTitle from "../../hook/UseTitle";
import AuthCodeProcessEnum from "../../enum/AuthCodeProcessEnum";
import AuthCodeRequestInterface from "../../interface/request/AuthCodeRequestInterface";
import UseCenterService from "../../hook/UseCenterService";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";

/**
 * 기관용 서비스 - 아이디 찾기
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1527%3A89141)
 * @category Page
 * @Center
 */
const FindId: NextPage = function FindId() {
    const { setTitle } = UseTitle("아이디 찾기", "아이디 찾기");
    const theme = useTheme();
    const { findId } = UseCenterService();
    const [centerAccount, setCenterAccount] = useState<CenterAccountInterface | null | undefined>(undefined);
    const { render } = UseAuthCode({
        page: "CENTER_FIND_ID",
        requestTitle: "등록하신 기관 대표자님의 휴대폰 번호로 인증해주세요.",
        authCodeProcess: AuthCodeProcessEnum.CENTER_FIND_ID,
        onComplete: async (request: AuthCodeRequestInterface): Promise<void> => {
            const centerAccountResponse = await findId(request);
            if (!centerAccountResponse) {
                setCenterAccount(null);
            } else {
                setTitle("아이디 확인", "아이디 확인");
                setCenterAccount(centerAccountResponse);
            }
        },
    });

    if (centerAccount !== undefined) {
        if (centerAccount) {
            return (
                <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "center" }, "sm", true)}>
                    <Typography variant="h3">고객님의 휴대폰 번호로 등록된 아이디입니다.</Typography>
                    <Paper sx={{ mt: 5, px: 4, py: 3, backgroundColor: theme.palette.background.default }} elevation={0}>
                        <Typography variant="subtitle1">{centerAccount.accountId}</Typography>
                        <Typography variant="subtitle1">{centerAccount.createdDate}가입</Typography>
                    </Paper>
                    <Link href="/center/login" as="/기관/로그인" passHref>
                        <a style={{ width: "100%" }}>
                            <Button size="large" variant="outlined" sx={{ mt: 8 }} fullWidth>
                                로그인 하기
                            </Button>
                        </a>
                    </Link>

                    <Link href="/center/find-password" as="/기관/비밀번호찾기" passHref>
                        <a style={{ width: "100%" }}>
                            <Button size="large" variant="outlined" sx={{ mt: 4 }} fullWidth>
                                비밀번호 찾기
                            </Button>
                        </a>
                    </Link>
                </Box>
            );
        }
        return (
            <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
                <Typography variant="h3">고객님의 번호로 등록된 계정 정보가 없습니다.</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    지금 바로 가입하여 요보사랑 인력찾기 서비스를 이용해보세요.
                </Typography>
                <Link href="/center/signup" as="/기관/가입신청" passHref>
                    <a style={{ width: "100%" }}>
                        <Button size="large" variant="outlined" sx={{ mt: 9 }} fullWidth>
                            가입 신청하기
                        </Button>
                    </a>
                </Link>

                <Link href="/center" as="/기관" passHref>
                    <a style={{ textDecoration: "underline", marginTop: 16 }}>
                        <Typography variant="caption" color="text.secondary">
                            홈 화면으로 돌아가기
                        </Typography>
                    </a>
                </Link>
            </Box>
        );
    }
    return render();
};
export default WithHeadMetaData(FindId);
