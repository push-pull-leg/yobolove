/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import AuthenticatedPhone from "../../../src/components/form/AuthenticatedPhone";
import { faker } from "@faker-js/faker";
import mock from "../../../src/mocks/mock";
import { toResponse } from "../../../src/mocks/functions";
import AuthCode from "../../../src/mocks/faker/AuthCode";

const fakeNumber = faker.phone.number("010-####-####");

mock.onPost("/v1/auth/code").reply(() => [200, toResponse(AuthCode())]);

describe("AuthenticatedPhone 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("필수/공통 props 테스트", () => {
            cy.makeProps().then(props => {
                const { title, name, placeholder, helperText } = props;
                cy.mount(<AuthenticatedPhone title={title} name={name} placeholder={placeholder} helperText={helperText} />);
                cy.checkProps("[data-cy=authenticated-phone-input]>input", "tel", undefined, placeholder, false);
                cy.get("[data-cy=authenticated-phone-input]>input").should("have.id", `authenticated-phone-${name}`);
                cy.get("[role=note]").should("have.text", helperText);
            });
        });
        it("optional / 개별 props 테스트", () => {
            cy.makeProps().then(props => {
                const { title, name, placeholder, helperText } = props;
                const startAdornment = <div>test</div>;
                cy.mount(
                    <AuthenticatedPhone
                        title={title}
                        defaultValue={fakeNumber}
                        startAdornment={startAdornment}
                        name={name}
                        placeholder={placeholder}
                        helperText={helperText}
                        required
                        disabled
                    />,
                );
                cy.get("[data-cy=authenticated-phone-input]>input")
                    .should("have.attr", "required", "required")
                    .should("have.attr", "disabled", "disabled")
                    .should("have.value", fakeNumber);
                cy.get("[data-cy=authenticated-phone-input]>div").should("have.text", "test");
                cy.get("[data-cy=end-button]").should("exist").should("be.visible");
                cy.get("[data-cy=end-button]>svg").should("exist").should("have.attr", "data-testid", "CancelIcon");
            });
        });
    });
    context("동작 테스트", () => {
        /**
         * input mask 관련 테스트는 phone 컴포넌트에서 진행, 인증 관련 테스트는 phoneAuth 및 e2e로 대체
         */

        it("render 함수 동작 테스트 / onOpen 테스트 / onClose 테스트", () => {
            cy.mount(<AuthenticatedPhone onOpen={() => alert("open!")} />);
            cy.get("[data-cy=authenticated-phone-input]").click();
            cy.on("window:alert", text => {
                expect(text).to.equal("open!");
            });
            cy.get("[data-cy=phone-auth]").should("be.visible").and("be.inViewport");
        });
        it("onClose 테스트", () => {
            cy.mount(<AuthenticatedPhone onClose={() => alert("close!")} />);
            cy.get("[data-cy=authenticated-phone-input]").click();
            cy.get("[data-cy=close]").click();
            cy.on("window:alert", text => {
                expect(text).to.equal("close!");
            });
        });
        it("defaultValue 있을때 reset 테스트", () => {
            cy.mount(<AuthenticatedPhone defaultValue={fakeNumber} />);
            cy.get("[data-cy=end-button]").click();
            cy.wait(100);
            cy.get("[data-cy=authenticated-phone-input]>input").should("not.have.value");
            cy.get("[role=dialog]").should("be.visible").should("be.inViewport");
            cy.get("[role=button]").then($el => {
                $el[0].click();
                cy.wait(100);
            });
            cy.get("[data-cy=authenticated-phone-input]>svg").should("exist").should("have.attr", "data-testid", "ArrowForwardIosIcon");
        });
        it("validation 테스트 / required false", () => {
            cy.mount(<AuthenticatedPhone />);
            cy.get("[data-cy=authenticated-phone-input]>input").should("have.attr", "aria-invalid", "false");
        });
        it("validation 테스트 / required true / value undefined", () => {
            cy.mount(<AuthenticatedPhone required />);
            cy.get("[data-cy=authenticated-phone-input]>input").should("have.attr", "aria-invalid", "true");
        });
        it("validation 테스트 / required true / value 있음", () => {
            cy.mount(<AuthenticatedPhone defaultValue={fakeNumber} required />);
            cy.get("[data-cy=authenticated-phone-input]>input").should("have.attr", "aria-invalid", "false");
        });
    });
});
