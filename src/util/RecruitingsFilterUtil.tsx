import RecruitingsFilterDataInterface from "../interface/RecruitingsFilterDataInterface";
import GetRecruitingsRequestInterface from "../interface/request/GetRecruitingsRequestInterface";
import JobEnum, { JobFilterLabel, JobLabel } from "../enum/JobEnum";
import ConverterUtil from "./ConverterUtil";
import IsTemporaryEnum, { IsTemporaryLabel } from "../enum/IsTemporaryEnum";
import QueryType from "../type/QueryType";
import CaregiverDesiredWorkInterface from "../interface/CaregiverDesiredWorkInterface";
import AddressUtil from "./AddressUtil";

/**
 * {@link CaregiverDesiredWorkInterface} / {@link QueryType} / {@link RecruitingsFilterDataInterface} / object 를 서로 변환하는 method
 *
 * @category Util
 */
class RecruitingsFilterUtil {
    /**
     * static class 는 직접 인스턴스화 불가능
     */
    private constructor() {
        throw new Error("cannot instantiate using a static class");
    }

    /**
     * {@link CaregiverDesiredWorkInterface} > {@link QueryType} 으로 변환해주는 method
     * 근무지역은 address.lotAddressName 에서 추출
     * 근무형태는 caregiverDesiredJobSet 에서 추출
     * 근무시간은 desiredWorkTime 에서 추출.
     *
     * @param desiredWork
     */
    public static getQueryParamsByDesiredWork(desiredWork: CaregiverDesiredWorkInterface): QueryType {
        const query: QueryType = {};
        if (desiredWork.address?.lotAddressName) {
            query["근무지역"] = RecruitingsFilterUtil.toURLString(desiredWork.address.lotAddressName);
        }
        if (desiredWork.caregiverDesiredJobSet && desiredWork.caregiverDesiredJobSet.length > 0) {
            query["근무형태"] = RecruitingsFilterUtil.toURLString(desiredWork.caregiverDesiredJobSet.map((job: JobEnum) => JobLabel.get(job)).join("-"));
        }
        if (desiredWork.desiredWorkTime) {
            query["근무시간"] = `${desiredWork.desiredWorkTime.startAt?.replace(":", "-")}~${desiredWork.desiredWorkTime.endAt?.replace(":", "-")}`;
        }
        return query;
    }

    /**
     * {@link RecruitingsFilterDataInterface} 를 {@link GetRecruitingsRequestInterface}로 변환.
     * initialRequest 로 추가적인 object 를 넘길 수도 있음.
     * workTime.startAt / workTime.endAt 이  둘다 있다면, workTime 을 따로 구성하고 없으면 삭제
     *
     * @param filterData
     * @param initialRequest
     */
    public static getRequestByFilterData(filterData: RecruitingsFilterDataInterface, initialRequest: object): GetRecruitingsRequestInterface {
        let params: GetRecruitingsRequestInterface = Object.assign(initialRequest, {
            address: filterData.address?.lotAddressName,
            jobs: filterData.jobs?.join(","),
            isTemporary: filterData.isTemporary,
        });
        if (filterData.workTime?.startAt && filterData.workTime?.endAt) {
            params = { workTime: `${filterData.workTime?.startAt}T${filterData.workTime?.endAt}`, ...params };
        } else {
            delete params.workTime;
        }
        return params;
    }

    /**
     * {@link QueryType}을 {@link RecruitingsFilterDataInterface} 로 변환해줌
     * getQueryParamsByDesiredWork method 와 반대로 근무지역을 address 로, 근무형태를 jobs 로, 근무시간을 workTime 로 변환해줌
     * @param queryParams
     */
    public static getFilterDataByQueryParams(queryParams: QueryType): RecruitingsFilterDataInterface {
        const filterData: RecruitingsFilterDataInterface = {};
        if (!queryParams) return filterData;

        const queryAddress = queryParams["근무지역"]?.toString();
        if (queryAddress) {
            const lotAddressName = AddressUtil.toAddressFromURLString(queryAddress);
            filterData.address = { lotAddressName };
        }

        const queryJobs = queryParams["근무형태"];
        if (queryJobs) {
            const jobs: JobEnum[] = [];
            queryJobs
                .toString()
                .split("-")
                .forEach((jobLabel: string) => {
                    const job = ConverterUtil.getKeyByValueOfMap<JobEnum>(JobFilterLabel, jobLabel);
                    if (job) {
                        jobs.push(job);
                    }
                });
            filterData.jobs = jobs;
        }

        const queryIsTemporary = queryParams["임시대근"];
        if (queryIsTemporary) {
            filterData.isTemporary = queryIsTemporary === "임시대근만";
        }

        const queryVisitTime = queryParams["근무시간"];
        if (queryVisitTime) {
            const [startAt, endAt] = queryVisitTime.toString().replace("-", ":").replace("-", ":").split("~");
            if (startAt && endAt) {
                filterData.workTime = { startAt, endAt, days: null, memo: null, weeklyWorkHours: null };
            }
        }
        return filterData;
    }

    /**
     * {@link RecruitingsFilterDataInterface}을 {@link QueryType} 로 변환해줌
     * @param data
     */
    public static getQueryParamsByFilterData(data: RecruitingsFilterDataInterface): QueryType {
        const currenData: RecruitingsFilterDataInterface = data;
        if (!currenData) return {};

        const queryParameter: QueryType = {};
        if (currenData.address?.lotAddressName) {
            queryParameter["근무지역"] = RecruitingsFilterUtil.toURLString(currenData.address?.lotAddressName);
        }

        if (currenData.jobs && currenData.jobs?.length > 0) {
            queryParameter["근무형태"] = RecruitingsFilterUtil.toURLString(currenData.jobs.map((job: JobEnum) => JobLabel.get(job)).join("-"));
        }
        if (currenData.isTemporary) {
            queryParameter["임시대근"] = IsTemporaryLabel.get(currenData.isTemporary.toString() as IsTemporaryEnum);
        }
        if (currenData.workTime) {
            queryParameter["근무시간"] = `${currenData.workTime.startAt?.replace(":", "-")}~${currenData.workTime.endAt?.replace(":", "-")}`;
        }
        return queryParameter;
    }

    /**
     * {@link QueryType} 으로 변환시, 괄호/공백 등은 삭제하거나 다른 문자로 치환해서 SEO 에 적합하게 바꿔줌.
     * @param text
     * @private
     */
    public static toURLString(text?: string): string {
        if (!text) return "";

        return AddressUtil.removeWordsWithBrackets(text).replace(/ /g, "-");
    }
}

export default RecruitingsFilterUtil;
