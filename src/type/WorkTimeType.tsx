import { TimeRangeInterface } from "../interface/TimeRangeInterface";

/**
 * timerange는 startAt, endAT 2개만 가지고 있고, days는 요일까지 다 가지고 있음.
 */
export interface WorkTimeType extends TimeRangeInterface {
    memo: string | null;
    weeklyWorkHours: number | null;
}
