import type { NextPage } from "next";
import React, { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import UseAuthCode from "../../hook/UseAuthCode";
import sectionStyle from "../../styles/sectionStyle";
import Form from "../../components/form/Form";
import PutCenterAnonymousPasswordRequestInterface from "../../interface/request/PutCenterAnonymousPasswordRequestInterface";
import UseCenterService from "../../hook/UseCenterService";
import AuthCodeProcessEnum from "../../enum/AuthCodeProcessEnum";
import PasswordInput from "../../components/form/PasswordInput";
import UseTitle from "../../hook/UseTitle";
import AuthCodeRequestInterface from "../../interface/request/AuthCodeRequestInterface";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";
import BadResponseInterface from "../../interface/response/BadResponseInterface";
import ResponseErrorCodeEnum from "../../enum/ResponseErrorCodeEnum";
import { Undefinable } from "../../type/Undefinable";

/**
 * 기관용 서비스 - 비밀번호 찾기
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1527%3A89651)
 * @category Page
 * @Center
 */
const FindPassword: NextPage = function FindPassword() {
    const { setTitle } = UseTitle("비밀번호 찾기", "비밀번호 찾기");
    const { updateAnonymousPassword } = UseCenterService();
    const token = useRef<Undefinable>();
    const [codeAuthToken, setCodeAuthToken] = useState<string | undefined>(undefined);
    const [isFailed, setIsFailed] = useState<boolean>(false);
    const { render } = UseAuthCode({
        page: "CENTER_FIND_PASSWORD",
        requestTitle: "등록하신 기관 대표자님의 휴대폰 번호로 인증해주세요.",
        authCodeProcess: AuthCodeProcessEnum.CENTER_ANONYMOUS_PWD_UPDATE,
        onComplete: async (request: AuthCodeRequestInterface): Promise<void> => {
            setCodeAuthToken(request.codeAuthToken);
        },
        onError: async (response: BadResponseInterface): Promise<void> => {
            if (response.error.code === ResponseErrorCodeEnum.NOT_FOUND_CENTER_BY_ADMIN_PHONE_NUM) {
                setIsFailed(true);
            }
        },
    });

    const onPasswordChange = async (request: PutCenterAnonymousPasswordRequestInterface): Promise<void> => {
        const currentRequest = { ...request };
        if (token.current) currentRequest.codeAuthToken = token.current;

        const isChangeAnonymousPassword = await updateAnonymousPassword(currentRequest);
        if (!isChangeAnonymousPassword) {
            setIsFailed(true);
            setTitle("계정확인", "계정 확인");
        }
    };

    if (isFailed) {
        return (
            <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    고객님의 번호로 등록된 계정 정보가 없습니다.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    지금 바로 가입하여 요보사랑 인력찾기 서비스를 이용해보세요.
                </Typography>

                <Link href="/center/signup" as="/기관/가입신청" passHref>
                    <a style={{ width: "100%", marginTop: 36 }}>
                        <Button variant="outlined" size="large" fullWidth>
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

    if (codeAuthToken) {
        return (
            <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
                <Typography variant="h3" sx={{ fontWeight: 600, mb: 3 }}>
                    새로운 비밀번호를 입력해주세요.
                </Typography>

                <Form<PutCenterAnonymousPasswordRequestInterface> buttonText="변경하기" onSubmit={onPasswordChange} parameter={{ codeAuthToken }}>
                    <PasswordInput name="newAccountPwd" />
                </Form>
            </Box>
        );
    }

    return render();
};
export default WithHeadMetaData(FindPassword);
