import { atom, selector } from "recoil";
import { v1 } from "uuid";
import RecruitingsFilterDataInterface from "../interface/RecruitingsFilterDataInterface";

/**
 * 초기 구인게시판 필터 데이터도 리코일 사용
 * @category Recoil
 */
export const recruitingsFilterDataRecoilState = atom<RecruitingsFilterDataInterface | undefined>({
    key: `recruitingsFilterState${v1()}`,
    default: undefined,
});

/**
 * @category Recoil
 */
export const recruitingsFilterDataRecoilSelector = selector({
    key: `recruitingsFilterSelector${v1()}`,
    get: ({ get }): RecruitingsFilterDataInterface | undefined => get(recruitingsFilterDataRecoilState),
});
