import React, { memo, ReactElement, Ref, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { css } from "@emotion/css";
import { Box, FormControl, FormHelperText, IconButton, OutlinedInput, ToggleButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { Datepicker, locale } from "@mobiscroll/react";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Cancel } from "@mui/icons-material";
import { FormContext, InputPropsType } from "./Form";
import Label from "./Label";
import { toRem } from "../../styles/options/Function";
import SimpleSwiper from "../SimpleSwiper";
import DateUtil from "../../util/DateUtil";
import EventUtil from "../../util/EventUtil";
import UsePreventBack from "../../hook/UsePreventBack";
import { TimeRangeInterface } from "../../interface/TimeRangeInterface";

dayjs.extend(minMax);

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

const weekButtonStyle = css`
    font-size: ${toRem(22)};
    line-height: 1.2;
`;

type WeekDataType = {
    value: number;
    label: string;
};

const WeekData: WeekDataType[] = [
    {
        value: 0,
        label: "월",
    },
    {
        value: 1,
        label: "화",
    },
    {
        value: 2,
        label: "수",
    },
    {
        value: 3,
        label: "목",
    },
    {
        value: 4,
        label: "금",
    },
    {
        value: 5,
        label: "토",
    },
    {
        value: 6,
        label: "일",
    },
];

export type TimeRangeInnerRefType = { setValue(value: TimeRangeInterface): void; reset?: (validProps?: boolean) => void };

/**
 * {@link TimeRange} props
 * @category PropsType
 */
interface TimeRangePropsInterface extends Omit<InputPropsType<TimeRangeInterface>, "innerRef"> {
    /**
     * GenericType 은 {@link TimeRangeInterface}. 이고 값이 변경될 때마다 호출됨.
     * @param name
     * @param value
     */
    onChange?: (name: string, value: TimeRangeInterface | undefined) => void;
    defaultValue?: TimeRangeInterface;
    /**
     * 비활성화 여부
     */
    disabled?: boolean;
    helperText?: string;
    /**
     * 요일 관련 인풋을 보여줄지 여부
     */
    showWeek?: boolean;
    /**
     * 모든 타이틀의 prefix > ex) titlePrefix: 근무 > 근무요일/근무 시작시간/근무 종료시간
     */
    titlePrefix?: string;
    innerRef?: Ref<TimeRangeInnerRefType>;
}

/**
 * 초기 값
 */
export const initialTimeValue: TimeRangeInterface = {
    days: 31,
    startAt: "",
    endAt: "",
};

/**
 * 시간대 선택 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1527%3A94799)
 * @category Form
 */
function TimeRange(props: TimeRangePropsInterface) {
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const { title, name, variant, required = false, onChange, defaultValue, labelStyle, helperText, disabled, showWeek, titlePrefix, placeholder, innerRef } = props;
    /**
     * 실제 값
     */
    const [value, setValue] = useState<TimeRangeInterface | undefined>(defaultValue || initialTimeValue);
    /**
     * 값을 선택할 때 마다 저장되는 임시 값
     */
    const [range, setRange] = useState<TimeRangeInterface>((defaultValue && !defaultValue.startAt) || !defaultValue ? initialTimeValue : defaultValue);
    const [openSwiper, setOpenSwiper] = useState<boolean>(false);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const [isValid, setIsValid] = useState<boolean>(!(required && !defaultValue));

    /**
     * currentIsDirectlyWriteVisitTime: 요일/시간 입력 여부
     *
     * @param currentValue string
     * @param _isDirectlyWriteVisitTime
     */
    const validate = (currentValue: TimeRangeInterface | undefined) => {
        if (required) {
            if (!currentValue || !currentValue.endAt || !currentValue.startAt) {
                setIsValid(false);
                return false;
            }

            if (showWeek && currentValue.days === 0) {
                setIsValid(false);
                return false;
            }
        }
        setIsValid(true);
        return true;
    };

    const reset = () => {
        const hasValue = value?.startAt || value?.endAt || value?.days;

        if (disabled || !hasValue) return;

        setRange(initialTimeValue);
        setValue(initialTimeValue);

        onChange?.(name, undefined);
    };

    useEffect(() => {
        handleChangeValue?.(name, { value, isValid: validate(value) });
    }, [required, value]);

    useImperativeHandle(innerRef, () => ({
        setValue(_value: TimeRangeInterface | undefined) {
            setValue(_value);
            if (_value && onChange !== undefined) {
                onChange(name, _value);
            }
        },
        reset() {
            reset();
        },
    }));

    const closeSwiper = useCallback(() => setOpenSwiper(false), []);
    UsePreventBack("time-range", openSwiper, closeSwiper);

    /**
     * range 에 있는 값을 value 에 그대로 저장해준다.
     */
    const handleChange = () => {
        closeSwiper();

        if (!range) return;

        setValue(range);

        if (router) {
            if (router.pathname === "/account/desired-work") {
                EventUtil.gtmEvent("click", "condition", "possibleTime", `시작시간:${range?.startAt} 종료시간:${range?.endAt}`);
            } else if (router.pathname === "/recruitings") {
                EventUtil.gtmEvent("click", "filterTime", "board", `시작시간:${range?.startAt} 종료시간:${range?.endAt}`);
            }
        }

        onChange?.(name, range);
    };

    const handleChangeStartTime = (e: { value: Date | null }) => {
        if (!e.value || (e.value && e.value.toString() === "Invalid Date")) return;

        const newStartAt = dayjs(e.value).format("HH:mm").toString();

        if (range?.startAt !== newStartAt) setRange(prev => ({ ...prev, startAt: newStartAt }));
    };

    const handleChangeEndTime = (e: { value: Date | null }) => {
        if (!e.value || (e.value && e.value.toString() === "Invalid Date")) return;

        const newEndAt = dayjs(e.value).format("HH:mm").toString();

        if (range?.endAt !== newEndAt) setRange(prev => ({ ...prev, endAt: newEndAt }));
    };

    const open = () => {
        setOpenSwiper(true);
    };

    useEffect(() => {
        if (defaultValue) {
            validate(defaultValue);
        }
        handleChangeValue?.(name, { value: defaultValue, isValid: validate(defaultValue) });

        return () => {
            closeSwiper();
            if (unmountInput) unmountInput(name);
        };
    }, [name]);

    const weekDays = useMemo(() => DateUtil.weekNumberToWeekDays(range?.days), [range?.days]);

    const handleWeekChange = (_e: React.MouseEvent<HTMLElement>, currentWeekDays: number[]): void => {
        const currentValue = { ...range };
        currentValue.days = DateUtil.weekDaysToWeekNumber(currentWeekDays);
        setRange(currentValue);
    };

    const weekDom = useMemo(() => {
        if (!showWeek) return null;
        const out: ReactElement[] = [];
        WeekData.forEach(weekData => {
            out.push(
                <ToggleButton key={weekData.label} value={weekData.value} aria-label={weekData.label} classes={{ root: weekButtonStyle }}>
                    {weekData.label}
                </ToggleButton>,
            );
        });
        return (
            <ToggleButtonGroup value={weekDays} onChange={handleWeekChange} aria-label="text formatting" fullWidth color="primary">
                {out}
            </ToggleButtonGroup>
        );
    }, [showWeek, value, weekDays, range]);

    const valueTitle = useMemo<string>(() => {
        if (!value) return "";

        if (!value.startAt && !value.endAt) return "";

        let prefix = "";
        if (showWeek && weekDays) {
            prefix = DateUtil.toDayFromWeekNumber(range?.days);
        }

        return `${prefix} ${value.startAt?.substring(0, 5)}~${value.endAt?.substring(0, 5)}`;
    }, [value?.startAt, value?.endAt, range]);

    return (
        <FormControl fullWidth variant={variant} size="small" required={required}>
            <Label labelStyle={labelStyle} required={required} title={title} id={`timerange-${name}`} />
            {helperText && (
                <FormHelperText color="text.secondary" data-cy="helpertext" sx={{ ml: 0, mt: 0, mb: 3 }}>
                    {helperText}
                </FormHelperText>
            )}
            <Box sx={{ m: 0, p: 0, cursor: "pointer" }} display="flex" flexDirection="column" gap={4}>
                <OutlinedInput
                    value={valueTitle}
                    placeholder={placeholder || "시간대 선택"}
                    endAdornment={
                        value?.startAt ? (
                            <IconButton data-cy="reset" onClick={() => reset()}>
                                <Cancel fontSize="medium" color="action" />
                            </IconButton>
                        ) : (
                            <ArrowForwardIosIcon fontSize="medium" color="action" />
                        )
                    }
                    fullWidth
                    id={`timerange-${name}`}
                    margin="dense"
                    readOnly
                    disabled={disabled}
                    size="small"
                    inputProps={{
                        "data-cy": "timerange-input",
                        sx: { cursor: "pointer" },
                        onClick: () => open(),
                        "aria-invalid": `${!isValid}`,
                    }}
                />
            </Box>
            <SimpleSwiper
                open={openSwiper}
                transformControl={isSmDown ? "none!important" : "undefined"}
                onBackDropClick={isSmDown ? () => {} : closeSwiper}
                hasCancelButton
                onCancel={closeSwiper}
                onConfirm={handleChange}
            >
                {showWeek && (
                    <Box sx={{ mb: 9 }} data-cy="select-days">
                        <Typography variant="h3" sx={{ mb: 5 }}>
                            {titlePrefix} 요일
                        </Typography>
                        {weekDom}
                    </Box>
                )}
                <Typography variant="h3" sx={{ mb: 5 }}>
                    {titlePrefix} 시작시간
                </Typography>
                <Datepicker
                    onChange={handleChangeStartTime}
                    theme="material"
                    animation="slide-up"
                    display="inline"
                    touchUi
                    controls={["time"]}
                    width="100%"
                    defaultSelection="09:00"
                    value={range?.startAt || undefined}
                    stepMinute={10}
                    timeWheels="A HH|mm"
                    dataTimezone="Asia/Seoul"
                    locale={locale.ko}
                    cssClass={mobiscrollModuleStyle}
                    renderItem={({ display }: { display: string; value: number }) => (display.length > 2 ? `${display.slice(-2)}시` : `${display}분`)}
                />

                <Typography variant="h3" sx={{ mb: 5, mt: 9 }}>
                    {titlePrefix} 종료시간
                </Typography>
                <Datepicker
                    onChange={handleChangeEndTime}
                    theme="material"
                    animation="slide-up"
                    display="inline"
                    touchUi
                    controls={["time"]}
                    width="100%"
                    defaultSelection="10:00"
                    value={range?.endAt || undefined}
                    stepMinute={10}
                    timeWheels="A HH|mm"
                    dataTimezone="Asia/Seoul"
                    locale={locale.ko}
                    cssClass={mobiscrollModuleStyle}
                    renderItem={({ display }: { display: string; value: number }) => (display.length > 2 ? `${display.slice(-2)}시` : `${display}분`)}
                />
            </SimpleSwiper>
        </FormControl>
    );
}

TimeRange.defaultProps = {
    onChange: undefined,
    defaultValue: undefined,
    disabled: false,
    helperText: undefined,
    showWeek: false,
    titlePrefix: "",
    innerRef: undefined,
};
export default memo(TimeRange);
