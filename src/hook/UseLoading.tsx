import { useSetRecoilState } from "recoil";
import { loadingRecoilState } from "../recoil/LoadingRecoil";

/**
 * UI 컴포넌트에서 로딩창을 띄우고 싶을 때 사용합니다. 로딩관련 데이터는 리코일로 관리하빈다.
 * @category Hook
 */
function UseLoading() {
    const setLoadingRecoil = useSetRecoilState(loadingRecoilState);

    /**
     * 로딩창 열기
     */
    const openLoading = (): void => {
        setLoadingRecoil({ open: true });
    };

    /**
     * 로딩창 닫기
     */
    const closeLoading = (): void => {
        setLoadingRecoil({ open: false });
    };
    return { openLoading, closeLoading };
}

export default UseLoading;
