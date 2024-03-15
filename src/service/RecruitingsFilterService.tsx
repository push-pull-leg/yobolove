/* eslint-disable prefer-const */
import RecruitingsFilterDataInterface from "../interface/RecruitingsFilterDataInterface";

/**
 * 초기 필터 데이터
 */
export const initFilterData: RecruitingsFilterDataInterface = {
    address: undefined,
    jobs: undefined,
    isTemporary: undefined,
    workTime: undefined,
};

/**
 * 구직자용 > 게시판 > 필터에서 사용되는 기능성 서비스
 * 데이터 저장, 불러오기, 초기화 등을 담당.
 * 캡슐화를 위해 data 는 getter / setter 로 관리
 * {@link RecruitingsFilterDataInterface} 관리가 가장 주요한 목적.
 * @category Service
 */
class RecruitingsFilterService {
    /**
     * 필터 데이터 저장소. 초기값으로 설정.
     * @private data
     */
    private data: RecruitingsFilterDataInterface = initFilterData;

    /**
     * query params 이 있으면 해당 데이터로 넣고 아니면 recoil data 로  넣는다. 일부분만 있을 수도 있으니 항목별로 초기 initData 에 query param 을 각각 지정해준다.
     * @param data 초기 데이터(recoil) by Recoil
     * @param initialFilterData 초기화할 필터 데이터
     */
    public init(data: RecruitingsFilterDataInterface, initialFilterData?: RecruitingsFilterDataInterface): RecruitingsFilterDataInterface {
        let initialData: RecruitingsFilterDataInterface = { ...data };
        if (initialFilterData) {
            initialData = Object.assign(initialData, initialFilterData);
        }
        this.setData(initialData);
        return initialData;
    }

    public getData(): RecruitingsFilterDataInterface {
        return this.data;
    }

    public setData(filterData: RecruitingsFilterDataInterface) {
        this.data = filterData;
    }
}

export default new RecruitingsFilterService();
