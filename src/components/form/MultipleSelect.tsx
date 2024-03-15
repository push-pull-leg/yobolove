import React, { ReactElement, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Checkbox, FormControl, FormHelperText, ListItemText, MenuItem, Select as MaterialSelect, SelectChangeEvent, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormContext, InputPropsType } from "./Form";
import Label from "./Label";
import EventUtil from "../../util/EventUtil";

/**
 * {@link MultipleSelect} props
 * @category PropsType
 */
interface MultipleSelectPropsInterface<T extends string> extends InputPropsType<T[]> {
    /**
     * Generic 배열타입
     */
    defaultValue?: T[];
    /**
     * key / value 형식의 data label 값
     */
    data: Map<T, string>;
    /**
     * 값 변경 이벤트 핸들러
     * @param name 이름
     * @param value 값
     */
    onChange?: (name: string, value: T[]) => void;
}

/**
 * 멀티플 셀렉박스 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A73080)
 * @category Form
 */
function MultipleSelect<T extends string>(props: MultipleSelectPropsInterface<T>) {
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const { title, data, name, defaultValue = [], placeholder, variant, required = false, onChange, endAdornment, labelStyle, helperText, labelColor, innerRef } = props;
    const [value, setValue] = useState<T[]>(defaultValue);
    const [isValid, setIsValid] = useState<boolean>(!(required && defaultValue.length === 0));

    const router = useRouter();

    /**
     * required 이고, value 의 길이가 0 이면 invalid
     *
     * @param currentValue string
     */
    const validate = (currentValue: T[]) => {
        if (required) {
            if (currentValue.length === 0) {
                setIsValid(false);
                return false;
            }
        }
        setIsValid(true);
        return true;
    };

    /**
     * @param currentValue
     */
    const handleChange = (currentValue: T[]): void => {
        const valid = validate(currentValue);
        setValue(currentValue);
        if (onChange !== undefined) {
            onChange(name, currentValue);
        }
        if (handleChangeValue) {
            handleChangeValue(name, { value: currentValue, isValid: valid });
        }
    };

    /**
     * 실제 값이 변경되는 method. event 에서 value 값을 Generic 캐스팅 한 후에 handleChange 를 해준다.
     * @param e
     */
    const handleChangeInput = (e: SelectChangeEvent<T[]>): void => {
        const currentValue: T[] = e.target.value as unknown as T[];
        if (router) {
            if (router.pathname === "/account/desired-work") {
                EventUtil.gtmEvent("click", "condition", "job", `${e.target.value}`);
            } else if (router.pathname === "/recruitings") {
                EventUtil.gtmEvent("click", "filterJob", "board", `${e.target.value}`);
            }
        }
        handleChange(currentValue);
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
        setValue(currentValue: T[]) {
            handleChange(currentValue);
        },
    }));

    /**
     * menu-item 은 data, value 에 값에 따라 메모라이즈.
     */
    const menuItems = useMemo(() => {
        const out: ReactElement[] = [];
        data.forEach((currentValue, key) => {
            out.push(
                <MenuItem data-cy="option-list" value={key as unknown as string} key={currentValue} dense sx={{ py: 1.5, px: 4 }}>
                    <Checkbox role="checkbox" checked={value?.indexOf(key) > -1} sx={{ p: 0, mr: 2 }} />
                    <ListItemText role="option" primary={currentValue} primaryTypographyProps={{ variant: "body1" }} />
                </MenuItem>,
            );
        });
        return out;
    }, [data, value]);

    return (
        <FormControl fullWidth variant={variant} required={required} size="small">
            <Label labelColor={labelColor} labelStyle={labelStyle} required={required} title={title} id={`time-${name}`} />
            <MaterialSelect
                displayEmpty
                required={required}
                size="small"
                labelId={`multipleSelect-${name}`}
                multiple
                value={value}
                placeholder={placeholder}
                endAdornment={endAdornment}
                label={labelStyle === "input" ? title : null}
                onChange={handleChangeInput}
                renderValue={selected =>
                    selected.length === 0 ? (
                        <Typography color="text.secondary">{placeholder}</Typography>
                    ) : (
                        selected
                            .filter(item => data.has(item))
                            .map(item => data.get(item))
                            .join(", ")
                    )
                }
                data-cy="select-input"
                inputProps={{ "aria-invalid": `${!isValid}`, invalid: `${!isValid}` }}
            >
                {menuItems}
            </MaterialSelect>
            {helperText && <FormHelperText color="text.secondary">{helperText}</FormHelperText>}
        </FormControl>
    );
}

MultipleSelect.defaultProps = {
    defaultValue: [],
    onChange: undefined,
};
export default MultipleSelect;
