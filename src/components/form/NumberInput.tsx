import React, { ChangeEvent, ChangeEventHandler, forwardRef, memo, ReactElement, useContext, useEffect, useImperativeHandle, useState } from "react";
import { Box, FormControl, OutlinedInput } from "@mui/material";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { css } from "@emotion/css";
import { FormContext, FormContextPopup, InputPropsType } from "./Form";
import Label from "./Label";

/**
 * {@link NumberFormatInput} props
 * @category PropsType
 */
interface NumberFormatInputPropsType {
    /**
     * 값 변경 핸들러
     * @param event
     */
    onChange: (event: { target: { name: string; value: string } }) => void;
    /**
     * input name 값
     */
    name: string;
    /**
     * 최대값
     */
    max: number;
    /**
     * 최소값
     */
    min: number;
}

/**
 * Number Format Input
 */
const NumberFormatInput = forwardRef<ReactElement, NumberFormatInputPropsType>((props, ref) => {
    const { onChange, min, max, ...other } = props;

    const isAllowed = (values: NumberFormatValues) => {
        if (values.floatValue !== undefined) {
            if (max !== undefined && values.floatValue > max) {
                return false;
            }
            if (min !== undefined && values.floatValue < min) {
                return false;
            }
        }
        return true;
    };

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            isAllowed={isAllowed}
            onValueChange={(values: NumberFormatValues) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
        />
    );
});

/**
 * {@link Number} props
 * @category PropsType
 */
interface NumberPropsInterface extends InputPropsType<number> {
    defaultValue?: number;
    onChange?: (name: string, value: number) => void;
    /**
     * 최대값
     */
    max?: number;
    /**
     * 최소값
     */
    min?: number;
    /**
     * text-align
     */
    textAlign?: string;
}

/**
 * 연세, 금액 등의 숫자 전용 인풋 컴포넌트. value type 은 number
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A90126)
 * @category Form
 */
function NumberInput(props: NumberPropsInterface) {
    const {
        title = "",
        name,
        defaultValue,
        placeholder,
        variant,
        required = false,
        onChange,
        endAdornment,
        labelStyle,
        maxLength,
        autoFocus,
        helperText,
        labelVariant,
        isPopup,
        onClick,
        labelColor,
        disabled,
        min = 0,
        max,
        innerRef,
        textAlign,
    } = props;
    const formContext = useContext(isPopup ? FormContextPopup : FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const [value, setValue] = useState<number | undefined>(defaultValue);
    const [isValid, setIsValid] = useState<boolean>(!(required && defaultValue === undefined));

    /**
     * thousandSeparator 를 제외한 실제 입력가능한 숫자 길이 계산
     */
    const calcMaxLength = (): number | undefined => {
        if (!maxLength) return undefined;
        if (maxLength < 3) {
            return maxLength;
        }
        return maxLength + Math.floor((maxLength - 1) / 3);
    };

    /**
     * #### 1. 주입받은 valid 가 있으면, 해당 값으로 설정.
     * #### 2. required 일 때, 값이 없으면 invalid
     *
     * @param currentValue string
     */
    const validate = (currentValue: number | string | undefined) => {
        if (required) {
            if (currentValue === undefined || currentValue === "") {
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
    const handleChange = (currentValue: string | undefined) => {
        if (disabled) return;

        const isCurrentValueAbsent = currentValue === undefined || currentValue === "";
        const numberOfCurrentValue = isCurrentValueAbsent ? undefined : Number(currentValue);

        const currentValid = validate(currentValue);
        setValue(numberOfCurrentValue);

        onChange?.(name, numberOfCurrentValue);

        if (handleChangeValue && name) {
            handleChangeValue(name, { value: numberOfCurrentValue, isValid: currentValid });
        }
    };

    const handleChangeNumber: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        handleChange(e.target.value);
    };

    useImperativeHandle(innerRef, () => ({
        setValue(currentValue: number | undefined) {
            handleChange(currentValue === undefined ? undefined : String(currentValue));
        },
    }));

    useEffect(() => {
        if (!disabled) {
            const currentValid = validate(defaultValue);
            if (handleChangeValue && name) {
                handleChangeValue(name, { value: Number(defaultValue), isValid: currentValid });
            }
        }
        return () => {
            if (unmountInput) unmountInput(name);
        };
    }, [name]);

    const inputStyles = css`
        text-align: ${textAlign};
    `;

    return (
        <FormControl fullWidth variant={variant} required={required} size="small">
            <Label labelColor={labelColor} labelStyle={labelStyle} required={required} title={title} id={`text-${name}`} labelVariant={labelVariant} />
            <OutlinedInput
                autoComplete="off"
                type="tel"
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
                onChange={handleChangeNumber}
                autoFocus={autoFocus}
                inputProps={{
                    maxLength: `${calcMaxLength()}`,
                    min,
                    max,
                    "aria-invalid": `${!isValid}`,
                    sx: { textAlign: "right" },
                    "data-cy": "number-input",
                }}
                inputComponent={NumberFormatInput as any}
                error={Boolean(value) && !isValid}
                data-cy="type-input"
                onClick={onClick}
                disabled={disabled}
                classes={{ input: inputStyles }}
            />
            {helperText && (
                <Box role="note" sx={{ mt: 2 }} textAlign="left" data-cy="number-input-helper">
                    {helperText}
                </Box>
            )}
        </FormControl>
    );
}

NumberInput.defaultProps = {
    defaultValue: undefined,
    onChange: undefined,
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    textAlign: "end",
};

export default memo(NumberInput);
