/// <reference types="cypress" />
// @ts-nocheck
import { faker } from "@faker-js/faker";
import { UseNudgeTest } from "../../support/component";
import Dialog from "../../../src/components/Dialog";
import React from "react";

const randomTitle = faker.datatype.string();
const randomText = faker.lorem.lines(5);
const randomNumber = faker.datatype.number({ min: 1, max: 4 });
const randomWrongNumber = faker.datatype.number({ min: 5, max: 20 });

describe("UseNudge hook test", () => {
    context("handleMountedInHome / setFromRecruitings / openSignupModal 테스트", () => {
        it(
            '!(typeof window !== undefined || !window.sessionStorage || utmSource === "kakaotalk" || isLoggedIn())' + "/ numOfOpenRecruitingContent < 5,  fromRecruitings === true",
            () => {
                cy.mount(
                    <UseNudgeTest condition="main" numOfOpenRecruitingContentSession={randomNumber} fromRecruitingsSession={true} utm={randomTitle}>
                        <Dialog />
                    </UseNudgeTest>,
                );
                cy.get("[data-cy=test-button]").click();
                cy.get("#drawer-simple-swiper").should("to.exist").and("be.inViewport");
                cy.get("[data-cy=modal-box]>h2>h3").should("have.text", "나의 맞춤 일자리가 생기면먼저 알려드릴게요");
                cy.get("[data-cy=modal-box]>h2>p").should("have.text", "가입 한 번으로원하는 조건의 일자리 정보를카톡/문자로 편하게 받을 수 있어요.");
                cy.get("[data-cy=kakao-login]").should("to.exist").and("be.inViewport").and("have.text", "카카오톡 회원가입/로그인");
                cy.get("[data-cy=phone-login]").should("have.attr", "href", encodeURI("/회원가입"));
                cy.get("[data-cy=phone-login]>button").should("have.text", "휴대폰 회원가입/로그인");
                cy.get("button[data-cy=confirm]").should("not.exist");
                cy.get("button[data-cy=cancel]").should("not.exist");
                cy.get("button[data-cy=close]").click();
                cy.get("#drawer-simple-swiper").should("not.exist");
            },
        );
        it(
            '!(typeof window !== undefined || !window.sessionStorage || utmSource === "kakaotalk" || isLoggedIn())' +
                "/ numOfOpenRecruitingContent < 5,  fromRecruitings === false",
            () => {
                cy.mount(
                    <UseNudgeTest condition="main" numOfOpenRecruitingContentSession={randomNumber} fromRecruitingsSession={false} utm={randomTitle}>
                        <Dialog />
                    </UseNudgeTest>,
                );
                cy.get("[data-cy=test-button]").click();
                cy.get("#drawer-simple-swiper").should("not.exist");
            },
        );
        it(
            '!(typeof window !== undefined || !window.sessionStorage || utmSource === "kakaotalk" || isLoggedIn())' + "/ numOfOpenRecruitingContent > 5,  fromRecruitings === true",
            () => {
                cy.mount(
                    <UseNudgeTest condition="main" numOfOpenRecruitingContentSession={randomWrongNumber} fromRecruitingsSession={true} utm={randomTitle}>
                        <Dialog />
                    </UseNudgeTest>,
                );
                cy.get("[data-cy=test-button]").click();
                cy.get("#drawer-simple-swiper").should("not.exist");
            },
        );
        it(
            '!(typeof window !== undefined || !window.sessionStorage || utmSource === "kakaotalk" )' +
                "/ numOfOpenRecruitingContent < 5,  fromRecruitings === true / !isLoggedIn()",
            () => {
                cy.mountWithLogin(
                    <UseNudgeTest condition="main" numOfOpenRecruitingContentSession={randomNumber} fromRecruitingsSession={true} utm={randomTitle}>
                        <Dialog />
                    </UseNudgeTest>,
                );
                cy.get("[data-cy=test-button]").click();
                cy.get("#drawer-simple-swiper").should("not.exist");
            },
        );
        it(
            "!(typeof window !== undefined || !window.sessionStorage || isLoggedIn())" + "/ numOfOpenRecruitingContent < 5,  fromRecruitings === true / utmSource === kakaotalk",
            () => {
                cy.mount(
                    <UseNudgeTest condition="main" numOfOpenRecruitingContentSession={randomWrongNumber} fromRecruitingsSession={true} utm="kakaotalk">
                        <Dialog />
                    </UseNudgeTest>,
                );
                cy.get("[data-cy=test-button]").click();
                cy.get("#drawer-simple-swiper").should("not.exist");
            },
        );
        it(
            '!(typeof window !== undefined || utmSource === "kakaotalk" || isLoggedIn())' + "/ numOfOpenRecruitingContent < 5,  fromRecruitings === true / !window.sessionStorage",
            () => {
                cy.mount(
                    <UseNudgeTest condition="main" numOfOpenRecruitingContentSession={randomNumber} fromRecruitingsSession={true} clear={true} utm={randomTitle}>
                        <Dialog />
                    </UseNudgeTest>,
                );
                cy.get("[data-cy=test-button]").click();
                cy.get("#drawer-simple-swiper").should("not.exist");
            },
        );
    });
});
