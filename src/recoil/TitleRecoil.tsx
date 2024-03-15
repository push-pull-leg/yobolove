import { atom, selector } from "recoil";
import { v1 } from "uuid";

/**
 * 타이틀 관련 리코일 데이터
 */
interface TitleRecoilStateInterface {
    /**
     * 모바일 시안 헤더 타이틀
     */
    headerTitle?: string;
    /**
     * PC 시안 컨텐츠 타이틀
     */
    mainTitle?: string;
}

const defaultTitleRecoilStateInterface: TitleRecoilStateInterface = {
    headerTitle: undefined,
    mainTitle: undefined,
};

/**
 * @category Recoil
 */
export const titleRecoilState = atom({
    key: `titleState${v1()}`,
    default: defaultTitleRecoilStateInterface,
});

/**
 * @category Recoil
 */
export const titleRecoilSelector = selector({
    key: `titleSelector${v1()}`,
    get: ({ get }): TitleRecoilStateInterface => get(titleRecoilState),
});
