import React, { ChangeEvent, ReactElement, useContext, useEffect, useMemo, useState } from "react";
import { Checkbox as MaterialCheckBox, FormControl, FormControlLabel, Typography } from "@mui/material";
import { css } from "@emotion/css";
import FormGroup from "@mui/material/FormGroup";
import { FormContext, InputPropsType } from "./Form";
import { toRem } from "../../styles/options/Function";
import Label from "./Label";
import theme from "../../styles/Theme";
import WithGenericMemo from "../../hoc/WithGenericMemo";
import { CheckBoxType } from "../../type/CheckBoxType";

const radioLabelStyle = css`
    display: flex;
    gap: ${toRem(12)};
    flex-basis: 100%;

    > * {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
    }

    button {
        padding: 0;

        label {
            padding: ${theme.spacing(2.75, 4.5)};
        }
    }

    button[class*="MuiButton-fullWidth"] {
        label {
            justify-content: flex-start;
        }
    }
`;

/**
 * {@link Checkbox} props
 * @category PropsType
 */
interface CheckboxPropsInterface<T extends string> extends InputPropsType<T[]> {
    /**
     * Generic Type 의 배열형
     */
    defaultValue?: T[];
    onChange?: (name: string, value: T[], event?: ChangeEvent<HTMLInputElement>) => void;
    /**
     * value : label 형태의 라벨 데이터
     */
    data: Map<T, CheckBoxType>;
}

/**
 * 체크박스 형태의 컴포넌트.
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=2005%3A102288)
 * @category Form
 */
function Checkbox<T extends string>(props: CheckboxPropsInterface<T>) {
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const { title, data, name, defaultValue = [], placeholder, variant, required = false, onChange, labelStyle } = props;
    const [value, setValue] = useState<T[]>(defaultValue);
    const [isValid, setIsValid] = useState<boolean>(!(required && defaultValue.length === 0));

    /**
     * required 이고 value 가 없거나 length 가 0 이면 invalid
     *
     * @param currentValue string
     */
    const validate = (currentValue: T[] | undefined) => {
        if (required) {
            if (currentValue?.length === 0) {
                return false;
            }
        }
        setIsValid(true);
        return true;
    };

    /**
     * value 를 generic 으로 변경하고 해당 value 값이 기존 array 있으면 splice, 없으면 push 해줌.
     * @param e ChangeEvent
     *
     * @return boolean
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.value) return;

        const itemValue: T = e.target.value as unknown as T;
        const currentValue = [...value];
        const idx = currentValue.indexOf(itemValue);
        if (e.target.checked && idx === -1) {
            currentValue.push(itemValue);
        } else if (!e.target.checked && idx >= 0) {
            currentValue.splice(idx, 1);
        }

        setValue(currentValue);
        const valid = validate(currentValue);

        if (onChange !== undefined) {
            onChange(name, currentValue, e);
        }
        if (handleChangeValue) {
            handleChangeValue(name, { value: currentValue, isValid: valid });
        }
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

    const optionItems = useMemo(() => {
        const out: ReactElement[] = [];

        data.forEach(({ title: checkBoxTitle, isSelectable = true, desc }, key) => {
            const isChecked = Boolean(value.includes(key));

            out.push(
                <FormControlLabel
                    key={checkBoxTitle}
                    sx={{ display: "flex", alignItems: desc ? "flex-start" : "center", justifyContent: "left", width: "100%", m: 0 }}
                    value={key}
                    control={<MaterialCheckBox disabled={!isSelectable} checked={isChecked} onChange={handleChange} />}
                    label={
                        <>
                            <Typography variant="body1" color={`rgba(0, 0, 0, ${!isSelectable && !isChecked ? 0.25 : 0.87})`}>
                                {checkBoxTitle}
                            </Typography>
                            {desc && (
                                <Typography variant="caption" color="text.primary">
                                    {desc}
                                </Typography>
                            )}
                        </>
                    }
                    componentsProps={{
                        typography: {
                            variant: "subtitle1",
                            color: "inherit",
                            sx: { pt: `${desc ? 7 : 0}px` },
                        },
                    }}
                    data-cy="checkbox-option"
                />,
            );
        });

        return out;
    }, [data, value]);

    return (
        <FormControl fullWidth variant={variant}>
            <Label labelStyle={labelStyle} required={required} title={title} id={`checkbox-${name}`} />
            <FormGroup data-cy="input-checkbox" placeholder={placeholder} className={radioLabelStyle} color="secondary" data-test={`${isValid}`}>
                {optionItems}
            </FormGroup>
        </FormControl>
    );
}

Checkbox.defaultProps = {
    defaultValue: [],
    onChange: undefined,
};
export default WithGenericMemo(Checkbox);
