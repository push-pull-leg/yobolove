/// <reference types="cypress" />
// @ts-nocheck
import { faker } from "@faker-js/faker";
import { UseAuthCodeTest } from "../../support/component";
import React from "react";
import Dialog from "../../../src/components/Dialog";
import Alert from "../../../src/components/Alert";
import { toBadResponse, toResponse } from "../../../src/mocks/functions";
import caregiverAuth from "../../../src/mocks/faker/CaregiverAuth";
import AuthCode from "../../../src/mocks/faker/AuthCode";
import jwtToken from "../../../src/mocks/faker/JwtToken";
import ResponseErrorCodeEnum from "../../../src/enum/ResponseErrorCodeEnum";
import dayjs from "dayjs";

const fakeAuthNumber = faker.datatype.number({ min: 100000, max: 999999 });
const fakeAuthResponse = AuthCode();
const fakeSignInResponse = caregiverAuth();
const fakeToken = jwtToken();
const randomPageType = faker.helpers.arrayElement([
    "CAREGIVER_SIGNUP",
    "CAREGIVER_LOGIN",
    "CAREGIVER_WITHDRAWAL",
    "CENTER_WITHDRAWAL",
    "CENTER_FIND_ID",
    "CENTER_FIND_PASSWORD",
    "CENTER_ADD_NUMBER",
]);

describe("UseAuthCode hook test", () => {
    context("step=REQUEST_AUTH_CODE && CAREGIVER_SIGNUP", async () => {
        it("props test", () => {
            cy.intercept("POST", "/v1/auth/code", {
                statusCode: 200,
                body: toResponse(fakeAuthResponse),
            });
            cy.intercept("GET", `/v1/auth/code/authenticate?authCode=${fakeAuthNumber}&phoneNum=010-5038-5902&process=CAREGIVER_SIGN_IN`, {
                statusCode: 200,
                body: toResponse(fakeToken),
            });
            cy.intercept("POST", "/v1/caregivers/auth/signin", {
                statusCode: 200,
                body: toResponse(fakeSignInResponse),
            });
            cy.mount(
                <UseAuthCodeTest page="CAREGIVER_SIGN_IN" authCodeProcess="CAREGIVER_SIGN_IN">
                    <Dialog />
                </UseAuthCodeTest>,
            );
            cy.get("[data-cy=phone-input] > input").focus().type("01050385902");
            cy.get("[data-cy=phone-num]").click();
            cy.on("window:alert", text => {
                expect(text).to.equal("010-5038-5902");
            });
            cy.get("[data-cy=submit-button]").click();
            cy.get("[role=heading]").should("have.text", "010-5038-5902로 인증 문자를 보냅니다.");
            cy.get("[data-cy=confirm]").click();
            cy.get("[data-cy=type-input]>input").type(fakeAuthNumber);
        });
    });
    context("step=REQUEST_AUTH_CODE && CENTER_SIGNUP && 재발송횟수 초과 에러", async () => {
        it("props test", () => {
            cy.intercept("POST", "/v1/auth/code", {
                statusCode: 400,
                body: toBadResponse(
                    ResponseErrorCodeEnum.EXCEEDED_CODE_GENERATION,
                    "재발송 횟수 5회 초과 보안을 위해 입력이 중지됩니다.\n  계정 정보를 확인하시려면 고객센터(1661-7939)로 문의해주시길 바랍니다.",
                ),
            });
            cy.mount(
                <UseAuthCodeTest page="CENTER_SIGNUP" authCodeProcess="CENTER_SIGNUP">
                    <Dialog />
                    <Alert />
                </UseAuthCodeTest>,
            );
            cy.get("[data-cy=phone-input] > input").focus().type("01050385902");
            cy.get("[data-cy=phone-num]").click();
            cy.get("[data-cy=submit-button]").click();
            cy.get("[role=heading]").should("have.text", "010-5038-5902가 고객님의 번호가 맞으신가요?");
            cy.get("[data-cy=confirm]").click();
            cy.get("[role=dialog] .MuiDialogTitle-root").should("have.text", "재발송 횟수 초과");
            cy.get("[role=dialog] .MuiDialogContent-root").should(
                "have.text",
                "보안을 위해 입력이 중지됩니다. 계정 정보를 확인하시려면 고객센터(1661-7939)로 문의해주시길 바랍니다.",
            );
        });
    });
    context("시간 초과 에러", async () => {
        it("props test", () => {
            const now = dayjs();
            fakeAuthResponse.createAt = now.format();
            fakeAuthResponse.expireAt = now.add(2, "seconds").format();
            cy.intercept("POST", "/v1/auth/code", {
                statusCode: 200,
                body: toResponse(fakeAuthResponse),
            });
            cy.mount(
                <UseAuthCodeTest page={randomPageType} authCodeProcess={randomPageType}>
                    <Dialog />
                    <Alert />
                </UseAuthCodeTest>,
            );
            cy.get("[data-cy=phone-input] > input").focus().type("01050385902");
            cy.get("[data-cy=phone-num]").click();
            cy.get("[data-cy=submit-button]").click();
            cy.get("[data-cy=confirm]").click();
            cy.wait(3500);
            cy.get("[data-cy=type-input]>input").type(fakeAuthNumber);
            cy.get("[role=dialog] .MuiDialogTitle-root").should("have.text", "인증시간이 지났어요");
            cy.get("[role=dialog] .MuiDialogContent-root").should("have.text", "다시받기를 눌러주세요");
        });
    });
    context("백엔드 에러", async () => {
        it("props test", () => {
            cy.intercept("POST", "/v1/auth/code", {
                statusCode: 200,
                body: toResponse(fakeAuthResponse),
            });
            cy.intercept("GET", `/v1/auth/code/authenticate?authCode=${fakeAuthNumber}&phoneNum=010-5038-5902&process=${randomPageType}`, {
                statusCode: 400,
                body: toBadResponse(ResponseErrorCodeEnum.FAILED_CODE_AUTHENTICATION, "인증번호가 맞지 않아요. 다시 입력해주세요."),
            });
            cy.mount(
                <UseAuthCodeTest page={randomPageType} authCodeProcess={randomPageType}>
                    <Dialog />
                </UseAuthCodeTest>,
            );
            cy.get("[data-cy=phone-input] > input").focus().type("01050385902");
            cy.get("[data-cy=phone-num]").click();
            cy.get("[data-cy=submit-button]").click();
            cy.get("[data-cy=confirm]").click();
            cy.get("[data-cy=type-input]>input").type(fakeAuthNumber);
            cy.get("[data-cy=error-message]").should("have.text", "인증번호가 맞지 않아요. 다시 입력해주세요.");
        });
    });
});
