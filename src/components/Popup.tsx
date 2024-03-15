import React from "react";
import { useRecoilState } from "recoil";
import { css } from "@emotion/css";
import { popupRecoilState } from "../recoil/PopupRecoil";
import LongSwiper from "./LongSwiper";
import UsePreventBack from "../hook/UsePreventBack";

const iframeStyle = css`
    width: 100%;
    height: 100%;
    border: 0;
`;

/**
 * 팝업 관련 컴포넌트. {@link popupRecoilState} 리코일 데이터를 이용해서 관리
 * 취소버튼 막기위헤 {@link UsePreventBack} 사용. component 가 있으면 component 를 그대로 rendering. 없으면 src 를 이용해 iframe 으로 띄운다.
 * 둘 다 없는경우, empty span 띄운다
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=2009%3A100935)
 * @category Component
 */
function Popup() {
    const [popupRecoil, setPopupRecoil] = useRecoilState(popupRecoilState);
    const close = () => {
        if (popupRecoil.onClose) popupRecoil.onClose();
        setPopupRecoil({
            open: false,
        });
    };
    UsePreventBack("popup", popupRecoil.open, close);

    if (!popupRecoil.component && !popupRecoil.src) {
        return <span />;
    }

    return (
        <LongSwiper data-cy="popup" title={popupRecoil.title} open={popupRecoil.open} onClose={() => close()} isRounded={false} padding={0} zIndex={popupRecoil.zIndex}>
            {popupRecoil.component ? popupRecoil.component : <iframe title={popupRecoil.title} src={popupRecoil.src} className={iframeStyle} />}
        </LongSwiper>
    );
}

export default React.memo(Popup);
