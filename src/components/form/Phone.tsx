import React, { ChangeEvent, ChangeEventHandler, FocusEventHandler, memo, ReactElement, useContext, useEffect, useState } from "react";
import { FormControl, FormHelperText, OutlinedInput } from "@mui/material";
import { IMaskInput } from "react-imask";
import { css } from "@emotion/css";
import { FormContext, FormContextPopup, HelperType, InputPropsType } from "./Form";
import { toRem } from "../../styles/options/Function";
import Label from "./Label";
import EventUtil from "../../util/EventUtil";

const inputStyle = css`
    display: flex;
    gap: ${toRem(12)};
`;

/**
 * {@link PhoneInput} props
 * @category PropsType
 */
type PhoneInputPropsType = {
    /**
     * 값이 변경될 때 이벤트 핸들러
     * @param event 해당 이벤트
     */
    onChange: (event: { target: { name: string; value: string } }) => void;
    placeholder: string;
    name: string;
};

/**
 * 핸드폰번호 정규식
 */
const PHONE_REGEX = /^01([016789])-?(\d{3,4})-?(\d{3,4})$/;

/**
 * Mask input 을 위한 커스텀 인풋
 *
 * @category Form
 */
const PhoneInput = React.forwardRef<HTMLElement, PhoneInputPropsType>((props: PhoneInputPropsType, ref: any) => {
    const { onChange, placeholder, name, ...other } = props;
    const handleChange = (value: any) => {
        if (onChange) onChange({ target: { name: name || "", value } });
    };

    return (
        <IMaskInput
            {...other}
            name={name}
            mask="000-0000-0000"
            charSet={" "}
            radix="."
            unmask="typed"
            lazy={false}
            placeholder={placeholder}
            inputRef={ref}
            onAccept={handleChange}
            overwrite
        />
    );
});

const initialHelper = { message: "- 없이 숫자만 입력", error: false };

/**
 * {@link Phone} props
 * @category PropsType
 */
interface PhonePropsInterface extends InputPropsType {
    /**
     * 인풋 우측에 노출될 커스텀 버튼 컴포넌트
     */
    button?: ReactElement;
}

/**
 * 핸드폰번호 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A72139)
 * @category Form
 */
function Phone(props: PhonePropsInterface) {
    const {
        title,
        name,
        defaultValue = "",
        placeholder,
        variant,
        required = false,
        onChange,
        endAdornment,
        labelStyle,
        autoFocus,
        button,
        disabled,
        isPopup,
        labelVariant,
    } = props;
    const formContext = useContext(isPopup ? FormContextPopup : FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const [value, setValue] = useState<string>(defaultValue);
    const [helper, setHelper] = useState<HelperType | null>(initialHelper);
    const [isValid, setIsValid] = useState<boolean>(!(required && !defaultValue));

    /**
     * #### 1. required 이고, value 가 없으면 invalid
     * #### 2. 값이 존재하고, REGEX 를 통과하지 못하면, invalid. helperText 를 띄워준다.
     *
     * @param currentValue string
     */
    const validate = (currentValue: string) => {
        if (required) {
            if (currentValue === "") {
                setIsValid(false);
                return false;
            }
        }
        if (currentValue && !PHONE_REGEX.test(currentValue)) {
            setIsValid(false);
            setHelper({ message: "정확한 휴대폰 번호를 입력해주세요.", error: true });
            return false;
        }

        setHelper({ message: "", error: true });
        setIsValid(true);
        return true;
    };

    /**
     * @param currentValue
     */
    const handleChangePhone = (currentValue: string): void => {
        setValue(currentValue);
        const valid = validate(currentValue);
        if (onChange !== undefined) {
            onChange(name, currentValue);
        }
        if (handleChangeValue) {
            handleChangeValue(name, { value: currentValue, isValid: valid });
        }
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        handleChangePhone(e.target.value);
    };

    const sendEvent: FocusEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        EventUtil.gtmEvent("change", "phoneNumber", "signup", e.target.value, "/회원가입");
    };

    useEffect(() => {
        const valid = validate(defaultValue);
        if (handleChangeValue) {
            handleChangeValue(name, { value, isValid: valid });
        }
        return () => {
            if (unmountInput) unmountInput(name);
        };
    }, [name]);

    return (
        <FormControl fullWidth variant={variant} size="small" required={required}>
            <Label labelStyle={labelStyle} labelVariant={labelVariant} required={required} title={title} id={`phone-${name}`} />
            <div className={inputStyle}>
                <OutlinedInput
                    type="tel"
                    required={required}
                    label={labelStyle === "input" ? title : null}
                    sx={{ flex: 1 }}
                    size="small"
                    value={value || ""}
                    onChange={handleChange}
                    onBlur={sendEvent}
                    name={name}
                    id={`phone-${name}`}
                    inputComponent={PhoneInput as any}
                    placeholder={placeholder || ""}
                    endAdornment={endAdornment}
                    autoFocus={autoFocus}
                    aria-describedby={`phone-${name}-helpertext`}
                    data-cy="phone-input"
                    inputProps={{ "aria-invalid": `${!isValid}` }}
                    disabled={disabled}
                />
                {button}
            </div>
            {helper && (
                <FormHelperText id={`phone-${name}-helpertext`} error={helper.error} role="note">
                    {helper.message}
                </FormHelperText>
            )}
        </FormControl>
    );
}

Phone.defaultProps = {
    button: undefined,
};
export default memo(Phone);
