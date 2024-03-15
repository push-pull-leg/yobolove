import { atom, selector } from "recoil";
import { v1 } from "uuid";

/**
 * 로딩바 관련 리코일 데이터
 */
interface LoadingRecoilStateInterface {
    /**
     * 로딩바 노출 여부
     */
    open: boolean;
}

const defaultLoadingRecoilStateInterface: LoadingRecoilStateInterface = {
    open: false,
};

/**
 * @category Recoil
 */
export const loadingRecoilState = atom({
    key: `loadingState${v1()}`,
    default: defaultLoadingRecoilStateInterface,
});

/**
 * @category Recoil
 */
export const loadingRecoilSelector = selector({
    key: `loadingSelector${v1()}`,
    get: ({ get }): LoadingRecoilStateInterface => get(loadingRecoilState),
});
