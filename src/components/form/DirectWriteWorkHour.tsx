import React from "react";
import { Typography } from "@mui/material";
import Text from "./Text";
import NumberInput from "./NumberInput";

type DirectWriteWorkHourProps = {
    workDayHourDefaultValue: string | null | undefined;
    weeklyWorkHoursDefaultValue: number | null | undefined;
    isRequiredWeeklyWorkHours?: boolean;
    workDayHourTitle?: string;
    workDayHourPlaceholder?: string;
};

function DirectWriteWorkHour({
    workDayHourDefaultValue,
    weeklyWorkHoursDefaultValue,
    isRequiredWeeklyWorkHours,
    workDayHourTitle,
    workDayHourPlaceholder,
}: DirectWriteWorkHourProps) {
    return (
        <>
            <Text
                title={workDayHourTitle}
                name="directWriteWorkHourMemo"
                placeholder={workDayHourPlaceholder}
                required
                defaultValue={workDayHourDefaultValue ?? ""}
                rows={3}
                maxLength={150}
                autoSubmit={false}
                showMaxLengthHelperText
            />
            <NumberInput
                title={
                    <>
                        주간 근무시간&nbsp;
                        {!isRequiredWeeklyWorkHours && (
                            <Typography component="small" color="text.secondary">
                                (선택)
                            </Typography>
                        )}
                    </>
                }
                placeholder="주간 근무시간"
                name="weeklyWorkHours"
                defaultValue={weeklyWorkHoursDefaultValue ?? undefined}
                required={isRequiredWeeklyWorkHours}
                max={999}
                textAlign="start"
            />
        </>
    );
}

DirectWriteWorkHour.defaultProps = {
    workDayHourTitle: "",
    isRequiredWeeklyWorkHours: true,
    workDayHourPlaceholder: undefined,
};

export default DirectWriteWorkHour;
