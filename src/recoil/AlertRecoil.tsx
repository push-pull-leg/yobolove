import { atom, selector } from "recoil";
import { v1 } from "uuid";

/**
 * Alert 관련 recoil data
 */
interface AlertRecoilStateInterface {
    /**
     * Alert 열림 여부
     */
    open: boolean;
    /**
     * Alert 제목
     */
    title: string;
    /**
     * Alert 내용
     */
    content?: string;
    /**
     * Alert icon 노출 여부
     */
    hasIcon?: boolean;
}

const defaultAlertRecoilStateInterface: AlertRecoilStateInterface = {
    open: false,
    title: "",
    hasIcon: true,
};

/**
 * @category Recoil
 */
export const alertRecoilState = atom({
    key: `alertState${v1()}`,
    default: defaultAlertRecoilStateInterface,
});

/**
 * @category Recoil
 */
export const alertRecoilSelector = selector({
    key: `alertSelector${v1()}`,
    get: ({ get }): AlertRecoilStateInterface => get(alertRecoilState),
});
