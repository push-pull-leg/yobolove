/// <reference types="cypress" />
// @ts-nocheck
import Recruiting from "../../src/components/Recruiting";
import React from "react";
import DateUtil from "../../src/util/DateUtil";
import recruiting from "../../src/mocks/faker/Recruiting";
import RecruitingInterface from "../../src/interface/RecrutingInterface";
import { GenderLabel } from "../../src/enum/GenderEnum";

// TODO interface 변경 됨에 따라 수정 필요
let testData: RecruitingInterface = recruiting();

describe("Recruiting 컴포넌트 테스트", () => {
    context("Props 테스트 / variant = normal", () => {
        testData.certType = "YOBOLOVE";
        beforeEach("Props 테스트 / variant = normal", () => {
            cy.mount(<Recruiting recruiting={testData} variant={"normal"} />);
        });

        it("타이틀이 address.detailTitle 과 일치하는 지 확인", () => {
            const copyOfTestData = { ...testData };
            cy.get("[data-cy=title]")
                .should("contain.text", copyOfTestData.address.basicTitle || copyOfTestData.address.detailTitle)
                .and("be.visible")
                .and("be.inViewport");
        });

        it("subtitle 이 {testData.recipientGrade}등급 {testData.recipientAge}세 {testData.recipientGender} 어르신과 일치하는 지 확인", () => {
            const copyOfTestData = { ...testData };
            const subTitle = `${copyOfTestData.recipientGrade}등급 ${copyOfTestData.recipientAge}세 ${GenderLabel.get(copyOfTestData.recipientGender)} 어르신`;
            cy.get("[data-cy=sub-title]").should("contain.text", subTitle).and("be.visible").and("be.inViewport");
        });

        it("요보사랑 인증 공고일 때(certType 가 `YOBOLOVE` 일 때) 카드가 있는 지 확인", () => {
            cy.get("[role=heading] [role=status]").should("contain.text", "요보사랑 인증").and("be.visible").and("be.inViewport");
        });

        it("카드의 날짜가 openedDate 인지 확인", () => {
            const date = DateUtil.toString(testData.openedDate, "M/D");
            cy.get("[data-cy=date]").should("contain.text", date).and("be.visible").and("be.inViewport");
        });
    });

    context("Props 테스트 / variant = normal", () => {
        beforeEach("optional props 테스트 / isCertified = false", () => {
            testData.certType = "P";
            cy.mount(<Recruiting recruiting={testData} variant={"normal"} />);
        });

        it("요보사랑 인증 공고가 아닐 때(certType 가 `YOBOLOVE` 아닐 때) 카드가 있는 지 확인", () => {
            cy.get("[role=heading] [role=status]").should("not.exist");
        });
    });

    context("Props 테스트 / variant = simple", () => {
        testData.certType = "YOBOLOVE";
        beforeEach("Props 테스트 / variant = simple", () => {
            cy.mount(<Recruiting recruiting={testData} variant="simple" />);
        });

        it("타이틀이 address.detailTitle 과 일치하는 지 확인", () => {
            const copyOfTestData = { ...testData };
            cy.get("[data-cy=title]")
                .should("contain.text", copyOfTestData.address.basicTitle || copyOfTestData.address.detailTitle)
                .and("be.visible")
                .and("be.inViewport");
        });

        it("카드의 날짜가 openedDate 인지 확인", () => {
            const date = DateUtil.toString(testData.openedDate, "M/D");
            cy.get("[data-cy=date]").should("have.text", date).and("be.visible").and("be.inViewport");
        });
    });
});
