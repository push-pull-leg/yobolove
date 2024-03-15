import dayjs from "dayjs";
import "dayjs/locale/ko";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.locale("ko");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs().tz("Asia/Seoul");

const WEEK_LABEL = ["월", "화", "수", "목", "금", "토", "일"];

/**
 * Date 관련  UTIL 입니다.
 * 문자형 <> 날짜형 변환 등 날짜 관련 method 들을 해당 class 에서 정의합니다.
 * @category Util
 */
class DateUtil {
    private static timer: ReturnType<typeof setTimeout> | undefined;

    /**
     * static class 는 직접 인스턴스화 불가능
     * @hidden
     */
    private constructor() {
        throw new Error("cannot instantiate using a static class");
    }

    /**
     * date > string 변환
     * @param date 날짜(문자형, 날짜형, null). null 이면 현재 시간
     * @param format 원하는 포맷
     */
    public static toString(date: string | Date | null, format: string = "YYYY-MM-DD"): string {
        if (!date) return "";
        return dayjs(date).format(format).toString();
    }

    /**
     * string > date 변환
     * @param value 문자형 날짜 데이터
     */
    public static toDate(value?: string): Date {
        if (value === "" || !value) return new Date();
        return dayjs(value).toDate();
    }

    /**
     * weekNumber > weekDays 로 변환해주는 method.
     *
     * ### 1. weekNumber 를 2진수으로 변환.
     * ```shell
     * 31 > "11111"
     * ```
     *
     * ### 2. 없는 숫자를 0으로 채워서 7자리를 채움.
     * ```shell
     * "11111" > "0011111"
     * ```
     *
     * ### 3. array 형태로 변환후 배열을 뒤집음(월>1, 일>64)
     * ```shell
     * "0011111" > ["0", "0", "1", "1", "1", "1", "1"] > ["1", "1", "1", "1", "1", "0", "0"]
     * ```
     *
     * ### 4. 해당 array 를 돌면서 "1" 이 있으면 해당 인덱스를 push 하는 배열을 return
     * ```shell
     * ["1", "1", "1", "1", "1", "0", "0"] > [0, 1, 2, 3, 4]
     * ```
     *
     * @example
     * DateUtil.weekNumberToWeekDays(31) // 31[0, 1, 2, 3, 4]
     * DateUtil.weekNumberToWeekDays(90) // [1, 3, 4, 6]
     * DateUtil.weekNumberToWeekDays(88) // [3, 4, 6]
     *
     * @param weekNumber 월,화,수,목,금,토,일을 이진법으로 변환수 숫자 형태로 만든 숫자
     */
    public static weekNumberToWeekDays(weekNumber: number | null): number[] {
        if (!weekNumber) return [];
        const weekDays = [];
        const binWeeks = weekNumber.toString(2).padStart(7, "0").split("").reverse();
        for (let i = 0; i < binWeeks.length; i++) {
            if (binWeeks[i] === "1") {
                weekDays.push(i);
            }
        }
        return weekDays;
    }

    /**
     * weekNumber > weekDays 로 변환해주는 method.
     *
     * ### 1. array 를 돌면서 2진수 형태로 변환
     * ```shell
     * [0, 1, 2, 3, 4] > "0011111"
     * ```
     *
     * ### 2. 2진수를 array 형태로 변환후 reverse
     * ```shell
     * "0011111" > ["0", "0", "1", "1", "1", "1", "1"]  > ["1", "1", "1", "1", "1", "0", "0"]
     * ```
     *
     * ### 3. 문자열로 변환 후, 10진수로 변환
     * ```shell
     * ["1", "1", "1", "1", "1", "0", "0"] > "0011111" > 31
     * ```
     *
     * @example
     * DateUtil.weekDaysToWeekNumber([0, 1, 2, 3, 4]) // 31
     * DateUtil.weekDaysToWeekNumber([1, 3, 4, 6]) // 90
     * DateUtil.weekDaysToWeekNumber([3, 4, 6]) // 88
     *
     * @param weekDays 월, 화, 수, 목, 금, 토, 일 을 인덱싱후 array 에 넣은 숫자
     */
    public static weekDaysToWeekNumber(weekDays: number[]): number {
        let binWeeks = "";
        for (let i = 0; i < 7; i++) {
            if (weekDays.includes(i)) {
                binWeeks += "1";
            } else {
                binWeeks += "0";
            }
        }
        return Number(parseInt(binWeeks.split("").reverse().join(""), 2));
    }

    /**
     * weekNumber > 요일 라벨로 변환.
     * ### 1. weekNumber 를 배열 형태의 이진수로 변환
     * ### 2. 해당 배열을 돌면서 특정 index 를 startIdx 로 시작해 연속적으로 값이 있을 때까지 endIdx 로 잡는다.
     * ### 3. endIdx - startIdx 가 3보다 클 경우(3개 이상의 요일이 연속된 경우) ~ 로 묶어서 메세지 저장하고, 아니면 각 값을 저장한다.
     *
     * @example
     * DateUtil.toDayFromWeekNumber(31) // 월~금
     * DateUtil.weekDaysToWeekNumber(90) // 화, 목, 금, 일
     * DateUtil.weekDaysToWeekNumber(88) //목, 금, 일
     *
     * @param weekNumber
     */
    public static toDayFromWeekNumber(weekNumber: number | undefined | null): string {
        if (!weekNumber) return "";
        const convert = weekNumber.toString(2).padStart(7, "0").split("").reverse();
        const messages = [];

        for (let i = 0; i < convert.length; i += 1) {
            if (convert[i] === "0") continue;

            const startIdx = i;
            let endIdx = i;
            for (let j = i; j < convert.length; j += 1) {
                if (convert[j] === "0") {
                    endIdx = j - 1;
                    break;
                } else {
                    endIdx = j;
                }
            }
            if (endIdx - startIdx >= 3) {
                messages.push(`${WEEK_LABEL[startIdx]}~${WEEK_LABEL[endIdx]}`);
                i = endIdx;
            } else {
                messages.push(WEEK_LABEL[i]);
            }
        }
        return messages.join();
    }

    /**
     * 현재 년-월-일 을 문자열로 return
     * @param format
     */
    public static now(format: string | undefined = "YYYY-MM-DD"): string {
        return dayjs().format(format).toString();
    }

    /**
     * 현재 년-월-일 을 ISO 문자열로 return
     */
    public static getIsoString(): string {
        return `${dayjs().format("YYYY-MM-DDTHH:mm:ss").toString()}Z`;
    }

    /**
     * async sleep
     * @param delaySecond sleep 시간(초)
     */
    public static async sleep(delaySecond: number): Promise<void> {
        if (this.timer) clearTimeout(this.timer);
        return new Promise(resolve => {
            this.timer = setTimeout(resolve, delaySecond);
        });
    }

    /**
     * timer clear
     */
    public static clearTimer() {
        if (this.timer) clearTimeout(this.timer);
    }
}

export default DateUtil;
