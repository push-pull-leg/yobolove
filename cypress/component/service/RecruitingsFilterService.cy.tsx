/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import { faker } from "@faker-js/faker";
import JobEnum, { JobLabel } from "../../../src/enum/JobEnum";
import Recruiting from "../../../src/mocks/faker/Recruiting";
import RecruitingsFilterService from "../../../src/service/RecruitingsFilterService";

faker.locale = "ko";
let output;

let initialData = {
    address: {
        detailTitle: "서울 강남구 역삼동 723-24 모닝포유 401호",
    },
    jobs: "VISIT_CARE",
    isTemporary: false,
    visitTime: { days: 21, memo: "안녕하세요" },
    commuteMinute: 30,
};

let data = {
    address: {
        detailTitle: faker.address.streetAddress(true),
    },
    jobs: faker.helpers.arrayElement(Array.from(JobLabel.keys())) as JobEnum,
    isTemporary: faker.helpers.arrayElement([true, false]),
    visitTime: Recruiting().visitTime,
    commuteMinute: faker.helpers.arrayElement([15, 30, 45, 60]),
};

describe("RecruitingsFilterService 테스트", () => {
    context("input / output", () => {
        it("init 테스트", () => {
            output = RecruitingsFilterService.init(initialData, data);
            expect(data).to.deep.eq(output);
        });
        it("getData 테스트", () => {
            output = RecruitingsFilterService.getData();
            expect(data).to.deep.eq(output);
        });
        it("setData 테스트", () => {
            RecruitingsFilterService.setData(initialData);
            output = RecruitingsFilterService.getData();
            expect(initialData).to.deep.eq(output);
        });
    });
});
