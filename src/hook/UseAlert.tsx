import { useSetRecoilState } from "recoil";
import { alertRecoilState } from "../recoil/AlertRecoil";

/**
 * {@link alertRecoilState} 를 이용해 Alert 컴포넌트를 UI 에서 사용하기 위한 Custom Hook
 * @category Hook
 */
export default function UseAlert() {
    const setAlertRecoil = useSetRecoilState(alertRecoilState);
    /**
     * Alert 열기
     * @param title Alert 타이틀
     * @param content Alert Content 영역
     * @param hasIcon Alert 아이콘 보여주기 여부
     */
    const openAlert = (title: string, content?: string, hasIcon?: boolean): void => {
        setAlertRecoil({
            open: true,
            title,
            content,
            hasIcon: hasIcon === undefined ? true : hasIcon,
        });
    };

    /**
     * Alert 닫기
     */
    const closeAlert = (): void => {
        setAlertRecoil({
            open: false,
            title: "",
        });
    };

    return { openAlert, closeAlert };
}
