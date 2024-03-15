import React, { ChangeEvent, memo, useContext, useEffect, useImperativeHandle, useState } from "react";
import { Checkbox, FormControl, FormControlLabel, Typography } from "@mui/material";
import { FormContext, InputPropsType } from "./Form";
import EventUtil from "../../util/EventUtil";

/**
 * {@link Agree} props
 * @category PropsType
 */
interface CheckBoxPropsInterface extends InputPropsType<boolean> {
    /**
     * value 의 type 은 boolean
     */
    defaultValue?: boolean;
}

/**
 * 단일 체크박스 컴포넌트
 * 일반적으로 이용약관등의 동의/비동의 컴포넌트로 사용
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A90814)
 * @category Form
 */
function Agree(props: CheckBoxPropsInterface) {
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const { title, name, defaultValue = false, variant, required = false, onChange, innerRef } = props;
    const [value, setValue] = useState<boolean | undefined>(defaultValue);
    const [isValid, setIsValid] = useState<boolean>(!(required && !defaultValue));

    /**
     * 값이 유효한지 체크하는 validate method. 유효하면 true, 유효하지 않으면 false 를 리턴한다.
     *
     * @param currentValue
     */
    const validate = (currentValue: boolean) => {
        if (required) {
            if (!currentValue) {
                setIsValid(false);
                return false;
            }
        }
        setIsValid(true);
        return true;
    };

    /**
     * check 변경
     *
     * @return boolean
     * @param currentValue
     */
    const handleChangeChecked = (currentValue: boolean): void => {
        EventUtil.gtmEvent("click", "filterTemporary", "board", currentValue ? "임시대근" : "임시대근 미포함", "/게시판");
        const valid = validate(currentValue);
        setValue(currentValue);
        if (onChange !== undefined) {
            onChange(name, currentValue);
        }
        if (handleChangeValue) {
            handleChangeValue(name, { value: currentValue, isValid: valid });
        }
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        handleChangeChecked(e.target.checked);
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

    useImperativeHandle(innerRef, () => ({
        setValue(currentValue: boolean) {
            handleChangeChecked(currentValue);
        },
    }));

    return (
        <FormControl fullWidth variant={variant} required={required} size="small">
            <FormControlLabel
                control={
                    <Checkbox checked={value} data-cy="agree-checkbox" required={required} onChange={handleChange} name={name} id={`checkbox-${name}`} aria-invalid={!isValid} />
                }
                label={
                    <Typography variant="caption" data-cy="checkbox-label" color="text.primary">
                        {title}
                    </Typography>
                }
            />
        </FormControl>
    );
}

Agree.defaultProps = {
    defaultValue: false,
};

export default memo(Agree);
