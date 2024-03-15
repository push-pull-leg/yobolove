import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { css } from "@emotion/css";
import { FormControl, OutlinedInput, useMediaQuery, useTheme } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { Datepicker, locale } from "@mobiscroll/react";
import dayjs from "dayjs";
import { FormContext, InputPropsType } from "./Form";
import Label from "./Label";
import SimpleSwiper from "../SimpleSwiper";
import UsePreventBack from "../../hook/UsePreventBack";
import { toRem } from "../../styles/options/Function";

const mobiscrollModuleStyle = css`
    background-color: transparent !important;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    .mbsc-datepicker-tab-active {
        visibility: inherit;
    }

    .mbsc-scroller-wheel-group {
        padding: 0;
    }

    .mbsc-scroller-wheel-wrapper {
        padding: 0;
        margin: 0;
        flex: 1;
    }

    .mbsc-scroller-wheel-line {
        display: block;
        background-color: rgba(255, 86, 124, 0.1);
    }

    .mbsc-scroller-wheel-cont {
        &:before,
        &:after {
            border-color: transparent;
        }
    }

    .mbsc-scroller-wheel-item {
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 130%;
        color: rgba(0, 0, 0, 0.25);

        &.mbsc-selected {
            font-size: 24px;
            color: #ff567c;
        }
    }
`;

const inputStyle = css`
    cursor: pointer;
`;

/**
 * {@link Date} props
 * @category PropsType
 */
interface DatePropsInterface extends InputPropsType {
    /**
     * 최소 날짜
     */
    minDate?: string;
    /**
     * 최대 날짜
     */
    maxDate?: string;
}

/**
 * 날짜 선택 컴포넌트. date state 변수에 값이 변경될 때 마다 저장해두다가 확인을 누르면 value 에 date 값을 넣어준다.
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=861%3A73840)
 * @category Form
 */
function Date(props: DatePropsInterface) {
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const { title, name, defaultValue, placeholder, variant, required = false, onChange, minDate = "2010-01-01", maxDate = "2099-01-01", labelStyle } = props;
    const [value, setValue] = useState<string | undefined>(defaultValue);
    const [date, setDate] = useState<string | undefined>(defaultValue);
    const [openSwiper, setOpenSwiper] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(!(required && !defaultValue));
    const closeSwiper = useCallback(() => setOpenSwiper(false), []);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    /**
     * 날짜 선택은 SimpleSwiper 이므로 취소버튼 방지
     */
    UsePreventBack("date", openSwiper, closeSwiper);

    /**
     * required 일때 값이 없으면 invalid
     *
     * @param currentValue string
     */
    const validate = (currentValue: string | undefined) => {
        const valid = !(required && !currentValue);
        setIsValid(valid);
        return valid;
    };

    /**
     * date 값을 그대로 저장
     */
    const handleChange = () => {
        const valid = validate(date);
        setValue(date);

        closeSwiper();
        if (onChange !== undefined) {
            onChange(name, date || "");
        }
        if (handleChangeValue) {
            handleChangeValue(name, { value: date, isValid: valid });
        }
    };

    useEffect(() => {
        const valid = validate(defaultValue);
        if (handleChangeValue) {
            handleChangeValue(name, { value, isValid: valid });
        }
        return () => {
            closeSwiper();
            if (unmountInput) unmountInput(name);
        };
    }, []);

    return (
        <FormControl fullWidth variant={variant} size="small" required={required}>
            <Label labelStyle={labelStyle} required={required} title={title} id={`date-${name}`} />
            <OutlinedInput
                label={labelStyle === "input" ? title : null}
                onClick={() => setOpenSwiper(true)}
                value={value ? dayjs(value, "YYYY-MM-DD").format("YYYY년 M월 D일") : ""}
                id={`date-${name}`}
                name={name}
                fullWidth
                placeholder={placeholder}
                required={required}
                margin="dense"
                readOnly
                size="small"
                role="textbox"
                inputProps={{ "aria-invalid": `${!isValid}`, className: inputStyle }}
                endAdornment={<ArrowForwardIos sx={{ color: "rgba(0, 0, 0, 0.45)", fontSize: toRem(24) }} />}
            />
            <SimpleSwiper
                open={openSwiper}
                onCancel={closeSwiper}
                transformControl={isSmDown ? "none!important" : "undefined"}
                onBackDropClick={isSmDown ? () => {} : closeSwiper}
                title="날짜 입력"
                hasCancelButton
                onConfirm={handleChange}
            >
                <Datepicker
                    onChange={event => setDate(dayjs(event.value).format("YYYY-MM-DD").toString())}
                    theme="material"
                    animation="slide-up"
                    display="inline"
                    touchUi
                    controls={["date"]}
                    value={date}
                    width="100%"
                    dateFormat="YYYY-M-D"
                    dateWheels="|YYYY|M|D|"
                    dataTimezone="Asia/Seoul"
                    displayTimezone="Asia/Seoul"
                    locale={locale.ko}
                    min={minDate}
                    max={maxDate}
                    cssClass={mobiscrollModuleStyle}
                />
            </SimpleSwiper>
        </FormControl>
    );
}

Date.defaultProps = {
    minDate: "2010-01-01",
    maxDate: "2099-12-31",
};
export default memo(Date);
