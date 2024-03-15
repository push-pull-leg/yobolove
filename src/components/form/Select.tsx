import React, { ReactElement, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormControl, ListItemText, MenuItem, Select as MaterialSelect, SelectChangeEvent, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormContext, InputPropsType } from "./Form";
import Label from "./Label";
import WithGenericMemo from "../../hoc/WithGenericMemo";
import EventUtil from "../../util/EventUtil";

/**
 * {@link Select} props
 * @category PropsType
 */
interface SelectPropsInterface<T extends string> extends InputPropsType<T> {
    /**
     * generic 타입
     */
    defaultValue?: T;
    data: Map<T, string | ReactElement>;
    /**
     * value parsing function
     */
    parsing?: Function;
}

/**
 * 셀렉박스 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A73080)
 * @category Form
 */
function Select<T extends string>(props: SelectPropsInterface<T>) {
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const { title, data, name, defaultValue, placeholder, variant, required = false, onChange, endAdornment, labelStyle, parsing, labelColor, innerRef } = props;
    const [value, setValue] = useState<T | undefined>(defaultValue);
    const [isValid, setIsValid] = useState<boolean>(!(required && !defaultValue));
    const router = useRouter();

    /**
     * required 익 값이 없으면 invalid
     *
     * @param currentValue string
     */
    const validate = (currentValue: T | undefined) => {
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
     *
     * @param currentValue
     */
    const handleChange = (currentValue: T | undefined): void => {
        const valid = validate(currentValue);
        setValue(currentValue);
        if (onChange !== undefined && currentValue) {
            onChange(name, currentValue, valid);
        }
        if (handleChangeValue) {
            handleChangeValue(name, { value: parsing ? parsing(currentValue) : currentValue, isValid: valid });
        }
    };

    const handleSelect = (e: SelectChangeEvent<string>): void => {
        const currentValue: T = e.target.value as unknown as T;
        if (router && router.pathname === "/account/desired-work") {
            if (name === "preferCareGender") {
                EventUtil.gtmEvent("click", "condition", "seniorGender", e.target.value);
            } else if (name === "possibleDistanceMinute") {
                EventUtil.gtmEvent("click", "condition", "travelTime", e.target.value);
            }
        }
        handleChange(currentValue);
    };

    useEffect(() => {
        const valid = validate(defaultValue);
        if (handleChangeValue) {
            handleChangeValue(name, { value: parsing ? parsing(defaultValue) : defaultValue, isValid: valid });
        }
        return () => {
            if (unmountInput) unmountInput(name);
        };
    }, [name]);

    useImperativeHandle(innerRef, () => ({
        setValue(currentValue: T | undefined) {
            handleChange(currentValue);
        },
    }));

    const menuItems = useMemo<ReactElement[]>(() => {
        const out: ReactElement[] = [];
        data.forEach((currentValue, key) => {
            out.push(
                <MenuItem value={key} key={currentValue.toString()} dense sx={{ py: 1.5, px: 4 }}>
                    <ListItemText primary={currentValue} primaryTypographyProps={{ variant: "body1" }} sx={{ m: 0 }} />
                </MenuItem>,
            );
        });
        return out;
    }, [data]);

    return (
        <FormControl fullWidth variant={variant} required={required} size="small">
            <Label labelColor={labelColor} labelStyle={labelStyle} required={required} title={title} id={`select-${name}`} />
            <MaterialSelect
                displayEmpty
                required={required}
                size="small"
                labelId={`select-${name}`}
                value={value || ""}
                placeholder={placeholder}
                endAdornment={endAdornment}
                label={labelStyle === "input" ? title : null}
                onChange={handleSelect}
                renderValue={selected => (!selected ? <Typography color="text.secondary">{placeholder}</Typography> : data.get(selected))}
                data-cy="select-input"
                name={name}
                inputProps={{ invalid: `${!isValid}`, id: `select-${name}` }}
            >
                {menuItems}
            </MaterialSelect>
        </FormControl>
    );
}

Select.defaultProps = {
    defaultValue: undefined,
    parsing: undefined,
};

export default WithGenericMemo(Select);
