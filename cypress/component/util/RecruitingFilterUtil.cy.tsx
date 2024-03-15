/// <reference types="cypress" />
// @ts-nocheck
import RecruitingsFilterDataInterface from "../../../src/interface/RecruitingsFilterDataInterface";
import JobEnum from "../../../src/enum/JobEnum";
import RecruitingsFilterUtil from "../../../src/util/RecruitingsFilterUtil";

describe("RecruitingsFilterUtil 테스트", () => {
    context("getFilterDataByQueryParams 테스트", () => {
        it("input 테스트", () => {
            const input = {
                근무형태: "방문요양-입주요양-요양시설",
            };
            const output: RecruitingsFilterDataInterface = {
                jobs: [JobEnum.VISIT_CARE, JobEnum.HOME_CARE, JobEnum.FACILITY],
            };

            expect(output).to.deep.equal(RecruitingsFilterUtil.getFilterDataByQueryParams(input));
        });
    });
    context("getQueryParamsByDesireWork 테스트", () => {
        it("return", () => {
            const input = {
                address: {
                    detailTitle: "서울 강남구 강남대로92길 13 (Jerry's planet Building)",
                },
                caregiverDesiredJobSet: [JobEnum.VISIT_CARE, JobEnum.HOME_CARE],
                desiredWorkTime: {
                    startAt: "09:00",
                    endAt: "21:30",
                },
            };
            const output = {
                근무지역: "서울-강남구-강남대로92길-13",
                근무형태: "방문요양-입주요양",
                근무시간: "09-00~21-30",
            };
            expect(output).to.deep.equal(RecruitingsFilterUtil.getQueryParamsByDesiredWork(input));
        });
    });
    context("getFilterDataByQueryParams", () => {
        it("return", () => {
            const input = {
                근무지역: "서울-강남구-강남대로92길-13",
                근무형태: "방문요양-입주요양",
                근무시간: "09-00~21-30",
                임시대근: "임시대근만",
            };
            const output = {
                address: { detailTitle: "서울 강남구-강남대로92길-13" },
                jobs: ["VISIT_CARE", "HOME_CARE"],
                visitTime: { startAt: "09:00", endAt: "21:30", memo: null, days: null },
                isTemporary: true,
            };
            const emptyOutput = {};
            expect(emptyOutput).to.deep.equal(RecruitingsFilterUtil.getFilterDataByQueryParams());
            expect(output).to.deep.equal(RecruitingsFilterUtil.getFilterDataByQueryParams(input));
        });
    });
    context("getRequestByFilterData 테스트", () => {
        it("return", () => {
            const input = {
                filterData: {
                    address: { detailTitle: "서울 강남구 강남대로92길 13 (Jerry's planet Building)" },
                    jobs: [JobEnum.VISIT_CARE, JobEnum.HOME_CARE],
                    isTemporary: true,
                    visitTime: {
                        startAt: "09:00",
                        endAt: "21:30",
                    },
                },
                initialRequest: {},
            };
            const output = {
                visitTime: "09:00T21:30",
                address: "서울 강남구 강남대로92길 13 (Jerry's planet Building)",
                jobs: "VISIT_CARE,HOME_CARE",
                isTemporary: true,
            };
            expect(output).to.deep.equal(RecruitingsFilterUtil.getRequestByFilterData(input.filterData, input.initialRequest));
            delete input.filterData.visitTime;
            delete output.visitTime;
            expect(output).to.deep.equal(RecruitingsFilterUtil.getRequestByFilterData(input.filterData, input.initialRequest));
        });
    });
    context("getQueryParamsByFilterData 테스트", () => {
        it("return", () => {
            const input = {
                address: { detailTitle: "서울-강남구-강남대로92길-13" },
                jobs: [JobEnum.VISIT_CARE, JobEnum.HOME_CARE],
                isTemporary: true,
                visitTime: {
                    startAt: "09:00",
                    endAt: "23:00",
                },
            };
            const output = {
                근무지역: "서울-강남구-강남대로92길-13",
                근무형태: "방문요양-입주요양",
                임시대근: "임시대근만",
                근무시간: "09-00~23-00",
            };
            const emptyOutput = {};
            expect(output).to.deep.equal(RecruitingsFilterUtil.getQueryParamsByFilterData(input));
            expect(emptyOutput).to.deep.equal(RecruitingsFilterUtil.getQueryParamsByFilterData());
        });
    });
    context("toURLString 테스트", () => {
        it("return", () => {
            const input = "서울 강남구 강남대로92길 13 (Jerry's planet Building)";
            const output = "서울-강남구-강남대로92길-13";
            expect(output).to.deep.equal(RecruitingsFilterUtil.toURLString(input));
            expect("").to.deep.equal(RecruitingsFilterUtil.toURLString());
        });
    });
});
