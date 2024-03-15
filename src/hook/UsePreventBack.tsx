import { useEffect } from "react";
import { useRouter } from "next/router";

type PreventPropsType = {
    open: boolean;
    onClose: () => void;
};
const data: { [key: string]: PreventPropsType } = {};

/**
 * UI 컴포넌트에서 취소버튼 대신 특정 동작을 하게합니다. 해쉬값을 이용해서 강제로 url 변경시킨 후, 취소버튼을 누르면 해쉬값만 사라지게 합니다.
 * 일반적으로 모달 UI 에서 open / onClose 를 제어합니다.
 * @param id 유니크 아이디
 * @param open 해당 컴포넌트가 열렸는지 여부
 * @param onClose 닫힐때 이벤트 리스너
 * @constructor
 * @category Hook
 */
function UsePreventBack(id: string, open: boolean, onClose: () => void) {
    const router = useRouter();

    /**
     * 현재 pathname 받아오기
     */
    const getPathName = (): string => {
        if (typeof window === "undefined") return "";

        let path: string = window.location.pathname;
        const { search } = window.location;

        const tmp = path.split("#");
        if (tmp.length >= 2) {
            // eslint-disable-next-line prefer-destructuring
            path = tmp[0];
        }
        return path + search;
    };

    useEffect(() => {
        data[id] = { open, onClose };
        return () => {
            delete data[id];
        };
    }, []);

    useEffect(() => {
        if (!router) return () => {};

        /**
         * 해당 팝업이 열리면, 랜덤 해쉬값을 발급해서 push 합니다.
         */
        data[id].open = open;
        if (open) {
            router.push(`${getPathName()}#${Math.round(Math.random() * 99999).toString()}`, undefined, { shallow: false, scroll: true });
        }
        router.beforePopState(() => {
            if (open) {
                onClose();
                return false;
            }
            let isClosed = false;
            Object.keys(data).forEach(key => {
                const item = data[key];
                if (isClosed) return;
                if (item.open) {
                    item.onClose();
                    isClosed = true;
                }
            });

            return true;
        });

        return () => {
            router.beforePopState(() => true);
        };
    }, [id, open]);
}

export default UsePreventBack;
