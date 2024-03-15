export type EventActionType = "click" | "change" | "submit" | "select";

/**
 * 이벤트 관련 UTIL 입니다.
 * 이벤트 기록 method 가 있습니다.
 * @category Util
 */
class EventUtil {
    /**
     * static class 는 직접 인스턴스화 불가능
     */
    private constructor() {
        throw new Error("cannot instantiate using a static class");
    }

    /**
     * action / category / label / value 입력(GTM 정의)
     * CSR 환경에서만 가능.
     * 200ms 씩 돌면서 해당 action 이 실제로 window 에 정의 되어있는지 확인. 최대 10초를 기다리고, 이벤트가 활성화 되었거나, 10초 이상이 지나면 종료합니다.
     * @param action GTM Action
     * @param category GTM Category
     * @param label GTM Label
     * @param value GTM Value
     * @param path 특정 경로에서만 동작해야된다면 해당 경로를 넘김
     */
    public static gtmEvent(action: EventActionType, category: string, label: string, value: string, path?: string): void {
        if (typeof window === "undefined") return;

        if (path !== undefined && path !== decodeURI(window.location.pathname)) return;

        let count = 0;
        const timeout = setInterval(() => {
            count++;
            if (EventUtil.callEvent(action, category, label, value) || count >= 50) {
                clearInterval(timeout);
            }
        }, 200);
    }

    /**
     * window 에 해당 action 이 있는지 확인후 잇으면 호출하는 method
     * @param action
     * @param category
     * @param label
     * @param value
     * @private
     */
    private static callEvent(action: EventActionType, category: string, label: string, value: string): boolean {
        if (!window[action] || typeof window[action] !== "function") {
            return false;
        }

        window[action](category, label, value);
        return true;
    }
}

export default EventUtil;
