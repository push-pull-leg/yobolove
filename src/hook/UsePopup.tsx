import { useSetRecoilState } from "recoil";
import { ReactElement } from "react";
import { popupRecoilState } from "../recoil/PopupRecoil";

/**
 * UI 컴포넌트에서 팝업을 띄우고 싶을 때 사용합니다.
 * @category Hook
 */
function UsePopup() {
    const setPopupRecoil = useSetRecoilState(popupRecoilState);

    /**
     * 팝업 열기
     * @param title 팝업 헤더 제목
     * @param src iframe 형태로 사용할떄 해당 iframe 의 src
     * @param component 컴포넌트를 직접 넣어서 사용할 때, 해당 컴포넌트
     * @param onClose 닫힐때 이벤트 리스너
     */
    const openPopup = (title: string, src?: string, component?: ReactElement, onClose?: () => void, zIndex?: number) => {
        setPopupRecoil({
            open: true,
            title,
            src,
            component,
            onClose,
            zIndex,
        });
    };

    /**
     * 팝업 닫기
     */
    const closePopup = () => {
        setPopupRecoil({
            open: false,
        });
    };

    return { openPopup, closePopup };
}

export default UsePopup;
