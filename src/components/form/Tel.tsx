import React, { ChangeEvent, ChangeEventHandler, forwardRef, memo, useContext, useEffect, useMemo, useState } from "react";
import { Box, FormControl, FormHelperText, OutlinedInput } from "@mui/material";
import { IMaskInput } from "react-imask";
import { FormContext, HelperType, InputPropsType } from "./Form";
import Label from "./Label";

/**
 * {@link TelInput} props
 * @category PropsType
 */
type TelInputPropsType = {
    onChange: (event: { target: { name: string; value: string } }) => void;
    placeholder: string;
    name: string;
    value: string;
};

const TEL_REGEX: RegExp = /^0(\d{1,3})-(\d{3,4})-(\d{3,4})$/;
const NUM_REGEX: RegExp = /[^0-9]/g;

/**
 * 전화번호의 regex 를 보고 mask 를 판별해주는 MAP
 */
const PREFIX_MASK_MAP: Map<RegExp, string> = new Map<RegExp, string>([
    [/^01([016789])/, "000-0000-0000"],
    [/^02/, "00-0000-0000"],
    [/^0([3456])([12345])/, "000-0000-0000"],
    [/^070/, "000-0000-0000"],
    [/^050([123456789])/, "0000-0000-0000"],
]);

/**
 * 전화번호 마스크 컴포넌트
 *
 * @category Form
 */
const TelInput = forwardRef<HTMLElement, TelInputPropsType>((props: TelInputPropsType, ref: any) => {
    const { onChange, placeholder, name, value, ...other } = props;
    const mask = useMemo<string>(() => {
        let currentMask = "000-0000-0000";
        let matched = false;
        PREFIX_MASK_MAP.forEach((_mask: string, regExp: RegExp): void => {
            if (matched) {
                return;
            }
            if (regExp.test(value.replace(NUM_REGEX, ""))) {
                matched = true;
                currentMask = _mask;
            }
        });
        return currentMask;
    }, [value]);

    const handleChange = (currentValue: any) => {
        if (onChange) onChange({ target: { name: name || "", value: currentValue } });
    };

    return (
        <IMaskInput
            {...other}
            name={name}
            mask={mask}
            charSet={" "}
            radix="."
            unmask="typed"
            value={value}
            lazy={false}
            placeholder={placeholder}
            inputRef={ref}
            onAccept={handleChange}
        />
    );
});

const initialHelper = { message: "- 없이 숫자만 입력", error: false };

/**
 * 전화번호 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A73080)
 * @category Form
 */
function Tel(props: InputPropsType) {
    const { title, name, defaultValue = "", placeholder, variant, required = false, onChange, endAdornment, labelStyle, autoFocus, disabled, labelVariant, helperText } = props;
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const [value, setValue] = useState<string>(defaultValue);
    const [helper, setHelper] = useState<HelperType | null>(initialHelper);
    const [isValid, setIsValid] = useState<boolean>(!(required && (!defaultValue || !TEL_REGEX.test(defaultValue || ""))));

    /**
     * #### 1. required 이고 값이 없으면 invalid
     * #### 2. 값이 있고, 정규식을 통과하지 못하면 invalid
     *
     * @param currentValue string
     */
    const validate = (currentValue: string) => {
        const formattedValue = currentValue.replaceAll("_", "");
        if (required) {
            if (!formattedValue) {
                setIsValid(false);
                return false;
            }
        }
        if (formattedValue && !TEL_REGEX.test(formattedValue)) {
            setIsValid(false);
            setHelper({ message: "전화번호 형식의 번호를 입력해주세요.", error: true });
            return false;
        }

        setHelper({ message: "", error: true });
        setIsValid(true);
        return true;
    };

    /**
     * @param currentValue
     */
    const handleChangeTel = (currentValue: string): void => {
        if (disabled) return;

        const formattedValue = currentValue.replaceAll("_", "");
        setValue(currentValue);
        const valid = validate(currentValue);
        if (onChange !== undefined) {
            onChange(name, currentValue);
        }
        if (handleChangeValue) {
            handleChangeValue(name, { value: formattedValue, isValid: valid });
        }
    };
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        handleChangeTel(e.target.value);
    };

    useEffect(() => {
        if (!disabled) {
            const valid = validate(defaultValue);
            if (handleChangeValue) {
                handleChangeValue(name, { value, isValid: valid });
            }
        }
        return () => {
            if (unmountInput) unmountInput(name);
        };
    }, [name]);

    return (
        <FormControl fullWidth variant={variant} size="small" required={required}>
            <Label labelStyle={labelStyle} labelVariant={labelVariant} required={required} title={title} id={`tel-${name}`} />
            <OutlinedInput
                type="tel"
                required={required}
                label={labelStyle === "input" ? title : null}
                sx={{ flex: 1 }}
                size="small"
                value={value || ""}
                onChange={handleChange}
                name={name}
                id={`tel-${name}`}
                inputComponent={TelInput as any}
                placeholder={placeholder || ""}
                endAdornment={endAdornment}
                autoFocus={autoFocus}
                aria-describedby={`tel-${name}-helpertext`}
                data-cy="tel-input"
                inputProps={{ "aria-invalid": `${!isValid}`, "data-cy": "tel-input" }}
                disabled={disabled}
            />
            {!disabled && helper && (
                <FormHelperText id={`tel-${name}-helpertext`} error={helper.error} role="note">
                    {helper.message}
                </FormHelperText>
            )}
            {helperText && (
                <Box role="note" sx={{ mt: 2 }} textAlign="left">
                    {helperText}
                </Box>
            )}
        </FormControl>
    );
}

export default memo(Tel);
