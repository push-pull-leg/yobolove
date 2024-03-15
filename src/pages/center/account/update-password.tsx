import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Typography } from "@mui/material";
import React, { ReactElement, useState } from "react";
import Form from "../../../components/form/Form";
import PasswordInput from "../../../components/form/PasswordInput";
import PutCenterPasswordRequestInterface from "../../../interface/request/PutCenterPasswordRequestInterface";
import Text from "../../../components/form/Text";
import UseCenterService from "../../../hook/UseCenterService";
import ResponseErrorCodeEnum from "../../../enum/ResponseErrorCodeEnum";
import CenterProfile from "../../../components/CenterProfile";
import UseTitle from "../../../hook/UseTitle";
import WithHeadMetaData from "../../../hoc/WithHeadMetaData";
import WithCenterAuth from "../../../hoc/WithCenterAuth";
import EventUtil from "../../../util/EventUtil";

/**
 * 기관용 서비스 - 비밀번호 변경
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A92555)
 * @category Page
 * @Center
 */
const UpdatePassword: NextPage = function UpdatePassword() {
    UseTitle("비밀번호 변경");
    const { updatePassword } = UseCenterService();
    const [passwordHelperText, setPasswordHelperText] = useState<ReactElement | undefined>(undefined);

    const updateCenterPassword = async (request: PutCenterPasswordRequestInterface) => {
        EventUtil.gtmEvent("click", "change", "cenChangepw", "0");

        setPasswordHelperText(undefined);
        const response = await updatePassword(request);
        if (!response) return;

        if (response.error && response.error.code === ResponseErrorCodeEnum.BAD_CREDENTIALS_CENTER_ACCOUNT) {
            setPasswordHelperText(
                <Typography variant="caption" color="error">
                    현재 비밀번호를 잘못 입력했습니다.
                </Typography>,
            );
        }
    };

    return (
        <CenterProfile sx={{ pt: 5, px: 4 }}>
            <Form<PutCenterPasswordRequestInterface> buttonText="비밀번호 변경" onSubmit={updateCenterPassword}>
                <Text
                    title="현재 비밀번호를 입력해주세요."
                    required
                    type="password"
                    name="accountPwd"
                    placeholder="현재 비밀번호"
                    labelVariant="h3"
                    helperText={passwordHelperText}
                />

                <Typography variant="h3" sx={{ mt: 5 }}>
                    새로운 비밀번호를 입력해주세요.
                </Typography>
                <PasswordInput name="newAccountPwd" />
            </Form>
        </CenterProfile>
    );
};
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true);

export default WithHeadMetaData(UpdatePassword);
