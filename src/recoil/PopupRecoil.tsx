import { atom, selector } from "recoil";
import { v1 } from "uuid";
import { ReactElement } from "react";

/**
 * 팝업 관련 리코일 데이터
 */
interface PopupRecoilStateInterface {
    /**
     * 팝업 열림 여부
     */
    open: boolean;
    /**
     * 팝업 제목
     */
    title?: string;
    /**
     * 팝업 소스(url)
     */
    src?: string;
    /**
     * 팝업 component
     */
    component?: ReactElement;
    /**
     * 닫힐 때 이벤트
     */
    onClose?: () => void;
    /**
     * zIndex
     */
    zIndex?: number;
}

const defaultPopupRecoilStateInterface: PopupRecoilStateInterface = {
    open: false,
    title: undefined,
    src: undefined,
    component: undefined,
    onClose: undefined,
    zIndex: undefined,
};

/**
 * @category Recoil
 */
export const popupRecoilState = atom({
    key: `popupState${v1()}`,
    default: defaultPopupRecoilStateInterface,
});

/**
 * @category Recoil
 */
export const popupRecoilSelector = selector({
    key: `popupSelector${v1()}`,
    get: ({ get }): PopupRecoilStateInterface => get(popupRecoilState),
});
