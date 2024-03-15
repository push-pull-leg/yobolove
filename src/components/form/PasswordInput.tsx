import React, { memo, ReactElement, useRef, useState } from "react";
import { Typography, useTheme } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import Text from "./Text";
import IconTypography from "../IconTypography";
import { Undefinable } from "../../type/Undefinable";

const ACCOUNT_PWD_REGEX_CONTAIN = /^.*(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
const ACCOUNT_PWD_REGEX_LENGTH = /^.{10,30}$/;

/**
 * {@link PasswordInput} props
 * @category PropsType
 */
type PasswordInputType = {
    /**
     * form name
     */
    name: string;
};

/**
 * 비밀번호/비밀번호 확인 인풋
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1875%3A93469)
 *
 * @category Form
 */
function PasswordInput(props: PasswordInputType) {
    const { name } = props;
    const accountPwd = useRef<Undefinable>();
    const accountPwdConfirm = useRef<Undefinable>();
    const theme = useTheme();

    const [valid, setValid] = useState<boolean>(false);
    const [accountPwdHelperText, setAccountPwdHelperText] = useState<ReactElement | undefined>(
        <>
            <IconTypography
                labelSelector="regex-helper"
                iconSelector="regex-check-icon"
                icon={<CheckCircleOutline fontSize="small" sx={{ color: theme.palette.secondary.light }} />}
                label="영문, 숫자, 특수문자 모두 사용"
            />
            <IconTypography
                labelSelector="length-helper"
                iconSelector="length-check-icon"
                icon={<CheckCircleOutline fontSize="small" sx={{ color: theme.palette.secondary.light }} />}
                label="10~30자리 이내"
            />
        </>,
    );
    const [accountPwdConfirmHelperText, setAccountPwdConfirmHelperText] = useState<ReactElement | undefined>(undefined);
    const getAccountPwdHelperText = (passContainedCheck: boolean, passLengthCheck: boolean) => (
        <>
            <IconTypography
                labelSelector="regex-helper"
                iconSelector="regex-check-icon"
                icon={
                    passContainedCheck ? (
                        <CheckCircleOutline fontSize="small" color="success" />
                    ) : (
                        <CheckCircleOutline fontSize="small" sx={{ color: theme.palette.secondary.light }} />
                    )
                }
                label="영문, 숫자, 특수문자 모두 사용"
            />
            <IconTypography
                labelSelector="length-helper"
                iconSelector="length-check-icon"
                icon={
                    passLengthCheck ? (
                        <CheckCircleOutline fontSize="small" color="success" />
                    ) : (
                        <CheckCircleOutline fontSize="small" sx={{ color: theme.palette.secondary.light }} />
                    )
                }
                label="10~30자리 이내"
            />
        </>
    );

    const accountPwdValidate = (_name: string, value: string | undefined): void => {
        accountPwd.current = value;

        if (!value) {
            setAccountPwdHelperText(getAccountPwdHelperText(false, false));
            setValid(false);
            return;
        }

        const passLengthCheck = ACCOUNT_PWD_REGEX_LENGTH.test(value);
        const passContainedCheck = ACCOUNT_PWD_REGEX_CONTAIN.test(value);
        if (!passContainedCheck || !passLengthCheck) {
            setAccountPwdHelperText(getAccountPwdHelperText(passContainedCheck, passLengthCheck));
            setValid(true);
            return;
        }

        if (accountPwdConfirm.current !== value) {
            setAccountPwdHelperText(getAccountPwdHelperText(true, true));
            setAccountPwdConfirmHelperText(
                <Typography variant="caption" data-cy="password-helper" color="error">
                    비밀번호가 맞지 않아요. 다시 입력해주세요.
                </Typography>,
            );
            setValid(false);
            return;
        }

        setAccountPwdConfirmHelperText(
            <Typography variant="caption" data-cy="password-helper" color="success.main">
                비밀번호가 일치합니다.
            </Typography>,
        );
        setAccountPwdHelperText(getAccountPwdHelperText(true, true));
        setValid(true);
    };

    const accountPwdConfirmValidate = (_name: string, value: string | undefined): void => {
        accountPwdConfirm.current = value;
        if (accountPwd.current !== value) {
            setAccountPwdConfirmHelperText(
                <Typography variant="caption" data-cy="password-helper" color="error">
                    비밀번호가 맞지 않아요. 다시 입력해주세요.
                </Typography>,
            );
            setValid(false);
            return;
        }

        setAccountPwdConfirmHelperText(
            <Typography variant="caption" data-cy="password-helper" color="success.main">
                비밀번호가 일치합니다.
            </Typography>,
        );
        setValid(true);
    };

    return (
        <>
            <Text
                title="비밀번호"
                name={name}
                placeholder=""
                required
                onChange={accountPwdValidate}
                helperText={accountPwdHelperText}
                valid={valid}
                type="password"
                labelStyle="input"
                disableSpacing
                regex-helper
            />
            <Text
                title="비밀번호 다시 입력"
                name={`${name}Confirm`}
                placeholder=""
                required
                onChange={accountPwdConfirmValidate}
                valid={valid}
                helperText={accountPwdConfirmHelperText}
                type="password"
                labelStyle="input"
                disableSpacing
            />
        </>
    );
}

export default memo(PasswordInput);
