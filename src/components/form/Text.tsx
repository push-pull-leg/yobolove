import React, { ChangeEvent, ChangeEventHandler, FocusEventHandler, memo, ReactElement, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Box, FormControl, OutlinedInput, Typography } from "@mui/material";
import { css } from "@emotion/css";
import { FormContext, FormContextPopup, InputPropsType } from "./Form";
import Label from "./Label";
import { toRem } from "../../styles/options/Function";
import EventUtil from "../../util/EventUtil";

const inputStyle = css`
    display: flex;
    gap: ${toRem(12)};

    > button {
        flex: none;
    }
`;

/**
 * {@link TextPropsInterface} props
 * @category PropsType
 */
interface TextPropsInterface extends InputPropsType {
    /**
     * input type
     */
    type?: string;
    /**
     * maxlength 에 도달했을 때 자동으로 submit 할지 여부. 일반적으로 인증문자입력에 사용
     */
    autoSubmit?: boolean;
    /**
     * 텍스트필드 우측에 사용되는 커스텀 버튼
     */
    button?: ReactElement;
    /**
     * multiline 텍스트 필드가 필요한 경우 라인 수에 맞춰서 사용.
     */
    rows?: number;
    /**
     * valid 여부를 주입해주는 props. undefined 가 아니면, 해당 값으로 valid 를 판단한다.
     */
    valid?: boolean;
    /**
     * 최대 글자 크기 보여줄지 여부
     */
    showMaxLengthHelperText?: boolean;
    /**
     * type = number 인경우 최대값
     */
    max?: number;
    /**
     * type = number 인경우 최소값
     */
    min?: number;
    /**
     * 입력제한을 하는 정규식.
     *
     * **validation 이 아닌 입력을 아예 불가능하게 함**
     */
    regExp?: RegExp;
    /**
     * 공백 disabled 여부
     */
    disableSpacing?: boolean;
}

/**
 * 텍스트필드 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A90126)
 * @category Form
 */
function Text(props: TextPropsInterface) {
    const {
        title = "",
        type,
        name,
        defaultValue = "",
        placeholder,
        variant,
        required = false,
        onChange,
        endAdornment,
        labelStyle,
        maxLength,
        autoFocus,
        button,
        helperText,
        labelVariant,
        autoSubmit,
        isPopup,
        rows,
        onClick,
        labelColor,
        disabled,
        valid,
        showMaxLengthHelperText,
        min,
        max,
        innerRef,
        regExp,
        disableSpacing,
        description,
    } = props;
    const formContext = useContext(isPopup ? FormContextPopup : FormContext);
    const { handleChangeValue, submit, unmountInput } = formContext;
    const [value, setValue] = useState<string>(defaultValue);
    const [isValid, setIsValid] = useState<boolean>(valid !== undefined || !(required && !defaultValue));

    /**
     * #### 1. 주입받은 valid 가 있으면, 해당 값으로 설정.
     * #### 2. required 일 때, 값이 없으면 invalid
     * #### 3. onValidate 가 있을 때 해당 onValidate 로 판단.
     *
     * @param currentValue string
     */
    const validate = (currentValue: string) => {
        const { onValidate } = props;

        if (valid !== undefined) {
            setIsValid(valid);
            return valid;
        }
        if (required) {
            if (currentValue.trim() === "") {
                setIsValid(false);
                return false;
            }
        }

        if (onValidate) {
            if (!onValidate(currentValue)) {
                setIsValid(false);
                return false;
            }
        }

        setIsValid(true);
        return true;
    };

    /**
     * 값이 maxlength 에 도달하고, autoSubmit 이있거나, name 이 authCode 인경우, 자동 제출
     * @return boolean
     */
    const handleChange = (currentValue: string) => {
        if (disabled) return;

        /**
         * regExp Props 가 있을 때는 해당 값으로 test 를 해보고 안되면 return ;
         */
        if (regExp && !regExp.test(currentValue) && currentValue) {
            return;
        }

        if (disableSpacing && currentValue.includes(" ")) {
            return;
        }

        if (maxLength) {
            if (currentValue.length > maxLength) {
                return;
            }
        }
        const currentValid = validate(currentValue);
        setValue(currentValue);
        if (onChange !== undefined) {
            onChange(name, currentValue);
        }
        if (handleChangeValue && name) {
            /**
             * 입력시에 저장을 하기 위해선 form 에 데이터를 넣을때 spacing 처리를 한 후 에 넣어준다.
             */
            handleChangeValue(name, { value: currentValue.trim(), isValid: currentValid });
        }

        if (maxLength === currentValue.length && submit !== undefined && (autoSubmit || name === "authCode")) {
            submit();
        }
    };
    const handleChangeText: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        handleChange(e.target.value);
    };

    useImperativeHandle(innerRef, () => ({
        setValue(currentValue: string | undefined) {
            handleChange(currentValue || "");
        },
    }));

    useEffect(() => {
        if (!disabled) {
            const currentValid = validate(defaultValue);
            if (handleChangeValue && name) {
                handleChangeValue(name, { value: defaultValue, isValid: currentValid });
            }
        }
        return () => {
            if (unmountInput) unmountInput(name);
        };
    }, [name]);

    const sendEvent: FocusEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        EventUtil.gtmEvent("change", "code", "signup", e.target.value, "/회원가입");
    };

    const realIsValid = useMemo<boolean>(() => {
        if (valid !== undefined) {
            if (handleChangeValue && name) {
                handleChangeValue(name, { value, isValid: valid });
            }
            return valid;
        }

        return isValid;
    }, [valid, isValid]);

    return (
        <FormControl fullWidth variant={variant} required={required} size="small">
            <Label labelColor={labelColor} labelStyle={labelStyle} required={required} title={title} id={`text-${name}`} labelVariant={labelVariant} />
            {description && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 5 }} role="note">
                    {description}
                </Typography>
            )}
            <div className={inputStyle}>
                <OutlinedInput
                    autoComplete="off"
                    type={type}
                    label={labelStyle === "input" ? title : null}
                    value={value}
                    id={`text-${name}`}
                    fullWidth
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    margin="dense"
                    size="small"
                    endAdornment={endAdornment}
                    onChange={handleChangeText}
                    onBlur={sendEvent}
                    autoFocus={autoFocus}
                    inputProps={{
                        maxLength,
                        "aria-invalid": `${!realIsValid}`,
                        min,
                        max,
                    }}
                    error={Boolean(value) && !realIsValid}
                    data-cy="type-input"
                    multiline={rows ? rows > 1 : false}
                    rows={rows}
                    onClick={onClick}
                    disabled={disabled}
                />
                {button}
            </div>
            {showMaxLengthHelperText && maxLength && (
                <Box role="note" sx={{ mt: 2 }} textAlign="right">
                    <Typography variant="caption" color="text.disabled">
                        현재 {value ? value.length : 0}자 / 최대 {maxLength}자
                    </Typography>
                </Box>
            )}
            {helperText && (
                <Box role="note" sx={{ mt: 2 }} textAlign="left">
                    {helperText}
                </Box>
            )}
        </FormControl>
    );
}

Text.defaultProps = {
    type: "text",
    autoSubmit: true,
    button: undefined,
    rows: 1,
    valid: undefined,
    showMaxLengthHelperText: false,
    min: 0,
    max: Infinity,
    regExp: undefined,
    disableSpacing: false,
};

export default memo(Text);
