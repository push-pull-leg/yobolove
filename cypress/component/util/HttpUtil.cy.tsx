/// <reference types="cypress" />
// @ts-nocheck
// import React from "react";
import HttpUtil from "../../../src/util/HttpUtil";
import EndpointEnum from "../../../src/enum/EndpointEnum";
import PostCaregiverLoginResponseInterface from "../../../src/interface/response/PostCaregiverLoginResponseInterface";
import PostCaregiverSignupResponseInterface from "../../../src/interface/response/PostCaregiverSignupResponseInterface";
import PostCaregiverLoginRequestInterface from "../../../src/interface/request/PostCaregiverLoginRequestInterface";
import PostCaregiverSignupRequestInterface from "../../../src/interface/request/PostCaregiverSignupRequestInterface";
import ResponseErrorCodeEnum from "../../../src/enum/ResponseErrorCodeEnum";
import { toBadResponse, toResponse } from "../../../src/mocks/functions";
import caregiverAuth from "../../../src/mocks/faker/CaregiverAuth";

const requestData: Map<string, any> = new Map([
    ["phoneNum", "010-1234-1234"],
    ["authCode", "162861"],
]);
describe("httpUtil 테스트", () => {
    context("정상 response 테스트(200)", () => {
        it("POST 200", async () => {
            cy.intercept("POST", "/v1/caregivers/auth/signin", {
                statusCode: 200,
                body: toResponse(caregiverAuth()),
            });
            const response = await HttpUtil.request<PostCaregiverLoginResponseInterface, PostCaregiverLoginRequestInterface>(EndpointEnum.POST_CAREGIVER_LOGIN, requestData);
            expect(Boolean(response.data)).to.true;
        });
    });
    context("잘못된 request 테스트(401)", () => {
        it("GET 401", async () => {
            cy.intercept("POST", "/v1/caregivers/auth/signup", {
                statusCode: 401,
                body: toBadResponse(ResponseErrorCodeEnum.FAILED_CODE_AUTHENTICATION, "잘못된 인증코드입니다."),
            });
            try {
                await HttpUtil.request<PostCaregiverSignupResponseInterface, PostCaregiverSignupRequestInterface>(EndpointEnum.POST_CAREGIVER_SIGNUP, requestData);
            } catch (e) {
                expect(e.code).to.equal("KNOWN_ERROR");
                expect(e.message).to.equal("잘못된 인증코드입니다.");
            }
        });
    });
});
