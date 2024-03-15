/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import recruiting from "../../src/mocks/faker/Recruiting";
import RecruitingInterface from "../../src/interface/RecrutingInterface";
import RecruitingContent from "../../src/components/RecruitingContent";
import { faker } from "@faker-js/faker";
import { GenderLabel } from "../../src/enum/GenderEnum";
import { breakpoints } from "../../src/styles/options";
import { RecipientServiceLifeLabel } from "../../src/enum/RecipientServiceLifeEnum";
import { RecipientServiceHomeLabel } from "../../src/enum/RecipientServiceHomeEnum";
import { RecipientServiceCognitiveLabel } from "../../src/enum/RecipientServiceCognitiveEnum";
import { RecipientServiceBodyLabel } from "../../src/enum/RecipientServiceBodyEnum";
import Dialog from "../../src/components/Dialog";

// TODO interface 변경 됨에 따라 수정 필요
let testData: RecruitingInterface = recruiting();
const randomGender = faker.helpers.arrayElement(["FEMALE", "MALE"]);
const sm: number = Number(breakpoints.values?.sm);

describe("RecruitingContent 컴포넌트 테스트", () => {
    context("!recruiting / loading 일 때", () => {
        it("!recruiting", () => {
            cy.mount(<RecruitingContent recruiting={undefined} />);
            cy.get("[data-cy=error]").should("be.visible").and("be.inViewport");
            cy.get("[data-cy=recruiting-content]").should("not.exist");
        });
        it("recruiting===loading", () => {
            cy.mount(<RecruitingContent recruiting="loading" />);
            cy.get("[data-cy=recruiting-skeleton]").should("be.visible").and("be.inViewport");
            cy.get("[data-cy=recruiting-content]").should("not.exist");
        });
    });
    context("convertData 테스트", () => {
        /**
         * preferGenderText Test
         */
        it("preferGenderText 테스트 / 요보사랑 인증 공고일 떄 / preferCaregiverGender === null", () => {
            testData.certType = "YOBOLOVE";
            testData.preferCaregiverGender = null;
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=prefer-gender]").should("have.text", "성별 상관 없이 지원 가능");
        });
        it("preferGenderText 테스트 / 요보사랑 인증 공고일 떄 / preferCaregiverGender === randomGender", () => {
            testData.preferCaregiverGender = randomGender;
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=prefer-gender]").should("have.text", `${GenderLabel.get(randomGender)} 선생님만 지원가능`);
        });
        it("preferGenderText 테스트 / 요보사랑 인증 공고가 아닐 때", () => {
            testData.certType = faker.helpers.arrayElement(["WORKNET", "ETC"]);
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=prefer-gender]").should("not.exist");
        });

        /**
         * needServiceText Test
         */
        it("recipientServiceLifeSet, recipientServiceHomeSet, recipientServiceCognitiveSet, recipientServiceBodySet 모두 값이 있을 때 순서대로 push 되는 지 확인", () => {
            testData.certType = "YOBOLOVE";
            let service = [];
            testData.recipientServiceLifeSet = faker.helpers.arrayElements(Array.from(RecipientServiceLifeLabel.keys()));
            testData.recipientServiceHomeSet = faker.helpers.arrayElements(Array.from(RecipientServiceHomeLabel.keys()));
            testData.recipientServiceCognitiveSet = faker.helpers.arrayElements(Array.from(RecipientServiceCognitiveLabel.keys()));
            testData.recipientServiceBodySet = faker.helpers.arrayElements(Array.from(RecipientServiceBodyLabel.keys()));
            service.push(...testData.recipientServiceLifeSet.map(value => RecipientServiceLifeLabel.get(value)));
            service.push(...testData.recipientServiceHomeSet.map(value => RecipientServiceHomeLabel.get(value)));
            service.push(...testData.recipientServiceCognitiveSet.map(value => RecipientServiceCognitiveLabel.get(value)));
            service.push(...testData.recipientServiceBodySet.map(value => RecipientServiceBodyLabel.get(value)));
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=need-service]").should("have.text", service.filter(service => Boolean(service)).join(", "));
        });
        it("needServiceText 테스트 / 요보사랑 인증 공고가 아닐 때", () => {
            testData.certType = faker.helpers.arrayElement(["WORKNET", "ETC"]);
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=need-service]").should("not.exist");
        });

        /**
         * addressData Test
         */
        it("addressData 테스트", () => {
            testData.certType = "YOBOLOVE";
            testData.address.detailTitle = faker.address.streetAddress(true);
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=address]>p").should("have.text", testData.address.detailTitle);
            cy.get("#react-kakao-maps-sdk-map-container").should("be.visible");
            cy.get("[data-cy=navigation-button]").should(
                "have.attr",
                "href",
                `https://map.naver.com/index.nhn?slng=&slat=&stext=&elng=${testData.address.lng}&elat=${testData.address.lat}&pathType=0&showMap=true&etext=${testData.address.detailTitle}&menu=route`,
            );
        });
    });
    context("contactCenter 테스트", () => {
        it("visual & 동작 테스트 / safetyNumber ", () => {
            /**
             * 모달 조건은 디스플레이의 가로넓이가 sm 이상일 경우, 이보다 작을 때는 call 로 연결되므로 e2e에서 테스트
             */
            cy.viewport(sm + 1, 750);
            testData.certType = "YOBOLOVE";
            testData.safetyNumber = faker.phone.number(`050${faker.datatype.number({ min: 1, max: 9 })}-####-####`);
            cy.mount(
                <>
                    <RecruitingContent recruiting={testData} />
                    <Dialog />
                </>,
            );
            cy.get("[data-cy=contact-button]").click();
            cy.get("[data-cy=modal-box]").should("be.inViewport").and("be.visible");
            cy.get("[data-cy=safety-number]").should("have.text", testData.safetyNumber);
        });
        it("visual & 동작 테스트 / !safetyNumber ", () => {
            cy.viewport(sm + 1, 750);
            testData.certType = "YOBOLOVE";
            testData.safetyNumber = undefined;
            cy.mount(
                <>
                    <RecruitingContent recruiting={testData} />
                    <Dialog />
                </>,
            );
            cy.get("[data-cy=contact-button]").click();
            cy.get("[data-cy=modal-box]").should("be.inViewport").and("be.visible");
            cy.get("[data-cy=safety-number]").should("have.text", "연락처 확인 실패");
        });
    });
    context("contactWorknetCenter 테스트", () => {
        it("visual & 동작 테스트 / safetyNumber ", () => {
            /**
             * 모달 조건은 디스플레이의 가로넓이가 sm 이상일 경우, 이보다 작을 때는 call 로 연결되므로 e2e에서 테스트
             */
            cy.viewport(sm + 1, 750);
            testData.certType = faker.helpers.arrayElement(["WORKNET", "ETC"]);
            testData.contactNumber = faker.phone.number(`###-####-####`);
            cy.mount(
                <>
                    <RecruitingContent recruiting={testData} />
                    <Dialog />
                </>,
            );
            cy.get("[data-cy=contact-button]").click();
            cy.get("[data-cy=modal-box]").should("be.inViewport").and("be.visible");
            cy.get("[data-cy=contact-number]").should("have.text", testData.contactNumber);
        });
    });
    context("CertType props 테스트", () => {
        it("!YOBOLOVE", () => {
            testData.certType = faker.helpers.arrayElement(["WORKNET", "ETC"]);
            testData.visitTime.memo = faker.lorem.lines(1);
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=visit-time]").should("have.text", testData.visitTime.memo);
        });
        it("!YOBOLOVE", () => {
            testData.certType = faker.helpers.arrayElement(["WORKNET", "ETC"]);
            testData.visitTime.memo = undefined;
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=visit-time]").should("have.text", "시간정보-상세내용 확인");
        });
        it("!YOBOLOVE", () => {
            testData.payType = "HOURLY";
            testData.pay = 50000;
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=pay]").should("contain.text", "시급 50,000원");
        });
        it("!YOBOLOVE", () => {
            testData.payType = "HOURLY";
            testData.pay = undefined;
            cy.mount(<RecruitingContent recruiting={testData} />);
            cy.get("[data-cy=pay]").should("contain.text", "급여정보-상세내용 확인");
        });
    });
});
