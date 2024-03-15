import React, { ChangeEvent, ReactElement, useContext, useEffect, useMemo, useState } from "react";
import { RadioProps } from "@mui/material/Radio";
import { Button, FormControl, FormControlLabel, Radio as MaterialRadio, RadioGroup, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";
import { css } from "@emotion/css";
import { useRouter } from "next/router";
import { FormContext, InputPropsType } from "./Form";
import { toRem } from "../../styles/options/Function";
import Label from "./Label";
import theme from "../../styles/Theme";
import WithGenericMemo from "../../hoc/WithGenericMemo";
import EventUtil from "../../util/EventUtil";

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

function StyledCheckbox(props: RadioProps) {
    return (
        <MaterialRadio
            data-cy="check-icon"
            sx={{
                "&:hover": {
                    backgroundColor: "transparent",
                },
            }}
            disableRipple
            checkedIcon={<Check />}
            icon={<Check />}
            {...props}
        />
    );
}

function StyledRadio(props: RadioProps) {
    return (
        <MaterialRadio
            data-cy="radio-icon"
            sx={{
                "&:hover": {
                    backgroundColor: "transparent",
                },
            }}
            disableRipple
            {...props}
        />
    );
}

/**
 * {@link Radio} props
 * @category PropsType
 */
interface RadioPropsInterface<T extends string> extends InputPropsType<T> {
    /**
     * Generic 타입 사용
     */
    defaultValue?: T;
    /**
     * label 값
     */
    data: Map<T, string>;
    /**
     * row 로 노출하면, 좌우가 아닌 상하로 배치됨.
     */
    row?: boolean;
    /**
     * 선택된 값을 따로 수정하고 싶을 때 parsing 을 넘겨서 데이터를 변경해줌
     */
    parsing?: Function;
    /**
     * checkbox: 버튼형식의 라디오 컴포넌트
     * radio: 체크박스 형태의 라이도 컴포넌트
     */
    iconStyle?: "checkbox" | "radio";
}

/**
 * 라디오 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A73080)
 * @category Form
 */
function Radio<T extends string>(props: RadioPropsInterface<T>) {
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const {
        title,
        data,
        name,
        defaultValue,
        placeholder,
        variant,
        required = false,
        onChange,
        row = false,
        labelStyle,
        description,
        parsing,
        labelVariant,
        iconStyle = "checkbox",
        labelColor,
    } = props;

    const [value, setValue] = useState<T | undefined>(defaultValue);
    const [isValid, setIsValid] = useState<boolean>(!(required && !defaultValue));
    const router = useRouter();

    /**
     * #### 1. required 이고 값이 없을때 invalid
     * #### 2. onValidate props 가 있을 때 해당 함수가 false 이면 invalid
     *
     * @param currentValue string
     */
    const validate = (currentValue: T | undefined) => {
        const { onValidate } = props;

        if (required) {
            if (!currentValue) {
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
     *
     * @param e ChangeEvent
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.value) return;

        if (router && router.pathname === "/account/desired-work") {
            if (name === "gender") {
                EventUtil.gtmEvent("click", "condition", "giverGender", e.target.value);
            } else if (name === "isCompleteDementia") {
                EventUtil.gtmEvent("click", "condition", "education", e.target.value);
            } else if (name === "isPassCareTest") {
                EventUtil.gtmEvent("click", "condition", "pass", e.target.value);
            } else if (name === "isPossibleCareBedridden") {
                EventUtil.gtmEvent("click", "condition", "bedridden", e.target.value);
            }
        }
        const currentValue = e.target.value as T;
        const valid = validate(currentValue);

        setValue(currentValue);

        onChange?.(name, currentValue, valid);
        handleChangeValue?.(name, { value: parsing ? parsing(currentValue) : currentValue, isValid: valid });
    };

    useEffect(() => {
        const valid = validate(defaultValue);
        if (handleChangeValue) {
            handleChangeValue(name, { value: parsing ? parsing(defaultValue) : defaultValue, isValid: valid });
        }
        return () => {
            setValue(defaultValue);
            if (unmountInput) {
                unmountInput(name);
            }
        };
    }, [name]);

    const menuItems = useMemo(() => {
        const out: ReactElement[] = [];
        data.forEach((currentValue, key) => {
            out.push(
                iconStyle === "checkbox" ? (
                    <Button size="large" fullWidth={!row} key={currentValue} variant={key === value && value ? "selected" : "unselected"}>
                        <FormControlLabel
                            sx={{ width: "100%", justifyContent: "center", m: 0 }}
                            value={key}
                            control={<StyledCheckbox onChange={handleChange} />}
                            label={currentValue}
                            componentsProps={{
                                typography: {
                                    variant: "caption",
                                    color: "inherit",
                                },
                            }}
                            data-cy="radio-option"
                        />
                    </Button>
                ) : (
                    <FormControlLabel
                        sx={{ width: "100%", justifyContent: "left", m: 0 }}
                        key={currentValue}
                        value={key}
                        control={<StyledRadio onChange={handleChange} />}
                        label={currentValue}
                        componentsProps={{
                            typography: {
                                variant: "subtitle1",
                                color: "text",
                            },
                        }}
                        data-cy="radio-option"
                    />
                ),
            );
        });
        return out;
    }, [data, value, defaultValue]);
    return (
        <FormControl fullWidth variant={variant}>
            <Label labelColor={labelColor} labelStyle={labelStyle} required={required} title={title} id={`radio-${name}`} labelVariant={labelVariant} />
            {description && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 5 }} role="note">
                    {description}
                </Typography>
            )}
            <RadioGroup row={row} value={value || ""} data-cy="input-radio" placeholder={placeholder} className={radioLabelStyle} color="secondary" data-test={`${isValid}`}>
                {menuItems}
            </RadioGroup>
        </FormControl>
    );
}

Radio.defaultProps = {
    defaultValue: undefined,
    row: false,
    parsing: undefined,
    iconStyle: "checkbox",
};

export default WithGenericMemo(Radio);
