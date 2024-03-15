import type { NextPage } from "next";
import { Box, Button, Typography } from "@mui/material";
import React, { ReactElement, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import sectionStyle from "../../styles/sectionStyle";
import Form from "../../components/form/Form";
import Text from "../../components/form/Text";
import PostCenterLoginRequestInterface from "../../interface/request/PostCenterLoginRequestInterface";
import UseCenterService from "../../hook/UseCenterService";
import ResponseErrorCodeEnum from "../../enum/ResponseErrorCodeEnum";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";
import EventUtil from "../../util/EventUtil";

/**
 * 기관용 서비스 - 로그인
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1546%3A81953)
 * @category Page
 * @Center
 */
const Login: NextPage = function Login() {
    const { login } = UseCenterService();
    const router = useRouter();
    const [passwordHelperText, setPasswordHelperText] = useState<ReactElement | undefined>(undefined);

    const handleClickFind = () => EventUtil.gtmEvent("click", "forget", "cenLogin", "0");

    const handleClickSignupButton = () => EventUtil.gtmEvent("click", "signup", "cenLogin", "0");

    /**
     * 로그인 시도.
     * password 의 helper text 를 리셋하고 {@link login} 실행.
     * error 발생 시 password helper text 설정
     * @param request
     */
    const onSubmit = async (request: PostCenterLoginRequestInterface): Promise<void> => {
        EventUtil.gtmEvent("click", "cenLogin", "cenLogin", "0");

        setPasswordHelperText(undefined);
        const response = await login(request, "redirect-uri" in router.query && router.query["redirect-uri"] ? router.query["redirect-uri"].toString() : "/center");
        if (!response) return;

        if (response.error && response.error.code === ResponseErrorCodeEnum.BAD_CREDENTIALS_CENTER_ACCOUNT) {
            setPasswordHelperText(
                <Typography variant="caption" color="error">
                    아이디 또는 비밀번호가 맞지 않아요. 다시 입력해주세요.
                </Typography>,
            );
        }
    };

    return (
        <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "center" }, "sm", true)}>
            <Form<PostCenterLoginRequestInterface> onSubmit={onSubmit} buttonText="기관 로그인">
                <Text title="아이디" required type="text" name="accountId" placeholder="아이디" labelStyle="input" autoFocus />
                <Text title="비밀번호" required type="password" name="accountPwd" placeholder="비밀번호" labelStyle="input" helperText={passwordHelperText} />
            </Form>
            <Link href="/center/find" as="/기관/계정찾기" passHref>
                <a>
                    <Typography variant="body2" color="primary" sx={{ mt: 4 }} onClick={handleClickFind}>
                        아이디/비밀번호를 잊으셨나요?
                    </Typography>
                </a>
            </Link>

            <Typography variant="subtitle1" color="text" sx={{ mt: 18 }}>
                요보사랑이 처음이라면
            </Typography>

            <Link href="/center/signup" as="/기관/가입신청" passHref>
                <a style={{ width: "100%" }}>
                    <Button size="large" variant="outlined" sx={{ mt: 4 }} fullWidth onClick={handleClickSignupButton}>
                        기관회원 가입신청
                    </Button>
                </a>
            </Link>
        </Box>
    );
};
export default WithHeadMetaData(Login);
