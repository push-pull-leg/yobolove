import React, { memo, ReactElement, useContext, useEffect, useState } from "react";
import { FormControl, FormHelperText, IconButton, OutlinedInput } from "@mui/material";
import { css } from "@emotion/css";
import { ArrowForwardIos, Cancel } from "@mui/icons-material";
import { FormContext, InputPropsType } from "./Form";
import { toRem } from "../../styles/options/Function";
import Label from "./Label";
import LongSwiper from "../LongSwiper";
import UseAuthCode, { PageType } from "../../hook/UseAuthCode";
import AuthCodeProcessEnum from "../../enum/AuthCodeProcessEnum";
import UsePreventBack from "../../hook/UsePreventBack";
import AuthCodeRequestInterface from "../../interface/request/AuthCodeRequestInterface";
import { Undefinable } from "../../type/Undefinable";

const inputStyle = css`
    display: flex;
    gap: ${toRem(12)};
`;

/**
 * {@link AuthenticatedPhone} props
 * @category PropsType
 */
export interface AuthenticatedPhonePropsInterface extends InputPropsType {
    /**
     * {@link UseAuthCode} 에 필요한 PageType
     */
    page: PageType;
    /**
     * {@link UseAuthCode} 에 필요한 인증 절차
     */
    authCodeProcess: AuthCodeProcessEnum;
    /**
     * 값이 변경될 때, token 값까지 같이 받는다.
     * @param name
     * @param value
     * @param token 인증완료후 토큰
     */
    onChange?: (name: string, value: string, token?: string) => void;
    /**
     * 인증절차 팝업 열릴 때 이벤트
     */
    onOpen?: () => void;
    /**
     * 인증절차 팝업 닫힐 떄 이벤트
     */
    onClose?: () => void;
    /**
     * change 될 때 reset 이 필요한지 여부
     */
    resetOnChange?: boolean;
    /**
     * 완료 됐을 때 메세지
     */
    completeMessage?: ReactElement;
    /**
     * UseAuthCode 전달용 문자 인증번호 입력 text field 라벨
     */
    inputTitle?: string;
    /**
     * UseAuthCode 전달용 문자인증 핸드폰번호 text field 라벨
     */
    requestTitle?: string;
}

/**
 * 전화번호 인증 컴포넌트
 * {@link UseAuthCode} 로 인증프로세스를 다 진행해야지 phone 으로 저장됨
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1527%3A90269)
 * @category Form
 */
function AuthenticatedPhone(props: AuthenticatedPhonePropsInterface) {
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const {
        title,
        name,
        defaultValue,
        placeholder,
        variant,
        required = false,
        onChange,
        labelStyle,
        autoFocus,
        disabled,
        page,
        helperText,
        onOpen,
        onClose,
        authCodeProcess,
        startAdornment,
        endAdornment,
        resetOnChange,
        completeMessage,
        inputTitle,
        requestTitle,
    } = props;

    const [value, setValue] = useState<Undefinable>(defaultValue);
    const [isValid, setIsValid] = useState<boolean>(!(required && !defaultValue));
    const [localText, setLocalText] = useState<ReactElement | string | undefined>(helperText);
    const [openSwiper, setOpenSwiper] = useState<boolean>(false);

    /**
     * required 인데 현재 값이 없으면 invalid
     *
     * @param currentValue
     */
    const validate = (currentValue: string | undefined) => {
        if (required) {
            if (!currentValue) {
                setIsValid(false);
                return false;
            }
        }
        setIsValid(true);
        return true;
    };
    const close = () => {
        setOpenSwiper(false);
        if (onClose) onClose();
    };
    const open = () => {
        setOpenSwiper(true);
        if (onOpen) onOpen();
    };

    /**
     * 인증 완료 됐을 때 이벤트. 일반적인 handle change 와 비슷
     * @param phoneNum 핸드폰 번호
     * @param codeAuthToken 인증토큰
     */
    const authenticated = (phoneNum: string, codeAuthToken: string): void => {
        if (!phoneNum || !codeAuthToken) {
            return;
        }
        setValue(phoneNum);
        const valid = validate(phoneNum);
        if (onChange !== undefined) {
            onChange(name, phoneNum || "", codeAuthToken);
        }
        if (handleChangeValue) {
            handleChangeValue(name, { value: phoneNum, isValid: valid });
            handleChangeValue("codeAuthToken", { value: codeAuthToken, isValid: true });
        }

        if (resetOnChange) {
            setValue(undefined);
        }

        if (completeMessage) {
            setLocalText(completeMessage);
        }
        close();
    };

    const { render } = UseAuthCode({
        page,
        requestTitle,
        inputTitle,
        authCodeProcess: authCodeProcess || AuthCodeProcessEnum.CENTER_EXTRA_CONTACT,
        onComplete: async (request: AuthCodeRequestInterface): Promise<void> => {
            authenticated(request.phoneNum, request.codeAuthToken);
        },
        maxWidth: "lg",
        isPage: true,
    });

    UsePreventBack("authenticate-phone", openSwiper, close);
    const reset = () => {
        setValue(undefined);
        const valid = validate(undefined);
        if (handleChangeValue) {
            handleChangeValue(name, { value: undefined, isValid: valid });
            handleChangeValue("codeAuthToken", { value: undefined, isValid: true });
        }
        setLocalText(helperText);
    };
    useEffect(() => {
        const valid = validate(defaultValue);
        if (handleChangeValue) handleChangeValue(name, { value, isValid: valid });

        return () => {
            if (unmountInput) unmountInput(name);
        };
    }, [name]);

    return (
        <>
            <FormControl fullWidth variant={variant} size="small" required={required}>
                <Label labelStyle={labelStyle} required={required} title={title} id={`phone-${name}`} />
                <div className={inputStyle}>
                    <OutlinedInput
                        type="tel"
                        required={required}
                        label={labelStyle === "input" ? title : null}
                        sx={{ flex: 1 }}
                        size="small"
                        value={value || ""}
                        name={name}
                        onClick={open}
                        id={`authenticated-phone-${name}`}
                        placeholder={placeholder || ""}
                        startAdornment={startAdornment}
                        endAdornment={
                            endAdornment ||
                            (!value ? (
                                <ArrowForwardIos data-cy="end-button" color="action" />
                            ) : (
                                <IconButton size="small" data-cy="end-button" onClick={reset}>
                                    <Cancel />
                                </IconButton>
                            ))
                        }
                        autoFocus={autoFocus}
                        aria-describedby={`authenticated-phone-${name}-helpertext`}
                        data-cy="authenticated-phone-input"
                        inputProps={{ "aria-invalid": `${!isValid}`, sx: { cursor: "pointer" } }}
                        disabled={disabled}
                        readOnly
                    />
                </div>
                {localText && (
                    <FormHelperText id={`authenticated-phone-${name}-helpertext`} role="note">
                        {localText}
                    </FormHelperText>
                )}
            </FormControl>
            <LongSwiper title="휴대폰 인증" open={openSwiper} onClose={close} isRounded={false}>
                {render()}
            </LongSwiper>
        </>
    );
}

AuthenticatedPhone.defaultProps = {
    onOpen: undefined,
    onClose: undefined,
    onChange: undefined,
    resetOnChange: false,
    completeMessage: undefined,
    inputTitle: "인증번호를 입력해주세요.",
    requestTitle: undefined,
};

export default memo(AuthenticatedPhone);
