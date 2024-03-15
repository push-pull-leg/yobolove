/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Phone from "../../../src/components/form/Phone";
import { faker } from "@faker-js/faker";

faker.locale = "ko";
const fakePhoneNumber = faker.phone.number("010-####-####");
const fakeShortPhoneNumber = faker.phone.number("010-#####-##");
const randomNumber = faker.phone.number("####-####-####");
const arr = [...fakePhoneNumber.replaceAll("-", "")];

describe("form-phone 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("name / placeholder / defaultValue='' 테스트", () => {
            cy.makeProps().then(props => {
                const { name, placeholder, title, autoFocus } = props;
                cy.mount(<Phone title={title} name={name} placeholder={placeholder} required autoFocus={autoFocus} />);
                cy.checkProps("[data-cy=phone-input] > input", "phone", name, placeholder, true);
                cy.get("[data-cy=phone-input] > input")
                    .should("have.attr", "aria-describedby", `phone-${name}-helpertext`)
                    .should("have.id", `phone-${name}`)
                    .should("have.attr", "name", name);
                cy.get("[role=note]").should("have.id", `phone-${name}-helpertext`).should("have.text", "- 없이 숫자만 입력");

                cy.focused().then($el => {
                    expect($el[0].getAttribute("id")).to.equal(`phone-${name}`);
                });
            });
        });
        it("defaultValue 가 맞는 형식일 때", () => {
            cy.mount(<Phone title="test-title" defaultValue={fakePhoneNumber} name="test-name" placeholder="test-placeholder" required />);
            cy.get("[role=note]").should("not.have.text");
        });
    });

    context("동작 테스트", () => {
        let changeCount = 0;
        /**
         * onChange 테스트
         */
        const onChange = (name, value) => {
            const formattedValue = value.replaceAll("-", "").replaceAll("_", "");
            const nowValue = arr.slice(0, changeCount + 1).join("");
            expect(formattedValue).to.equal(nowValue);
            changeCount++;
        };
        it("제대로 입력 / onChange", () => {
            cy.mount(<Phone title="test-title" name="test-name" placeholder="test-placeholder" onChange={onChange} />);
            /**
             * 제대로 입력
             */
            cy.get("[data-cy=phone-input] > input").focus().type(fakePhoneNumber);
            cy.get("[role=note]").should("not.have.text");
        });
        it("잘못 입력 / 12자리 미만 입력", () => {
            cy.mount(<Phone title="test-title" name="test-name" placeholder="test-placeholder" />);
            /**
             * 잘못 입력
             */
            cy.get("[data-cy=phone-input] > input").clear().focus().type(randomNumber);
            cy.get("[role=note]").should("have.text", "정확한 휴대폰 번호를 입력해주세요.");

            /**
             * 짧게 입력
             */
            cy.get("[data-cy=phone-input] > input").clear().focus().type(fakeShortPhoneNumber);
            cy.get("[role=note]").should("have.text", "정확한 휴대폰 번호를 입력해주세요.");
        });

        it("isValid 테스트 / required false 일 때, 빈 칸/잘못입력", () => {
            cy.mount(<Phone title="test-title" name="test-name" placeholder="test-placeholder" />);
            /**
             * 빈칸일 때
             */
            cy.get("[data-cy=phone-input] > input").should("have.attr", "aria-invalid", "false");

            /**
             * 잘못입력했을 때
             */
            cy.get("[data-cy=phone-input] > input").focus().type(randomNumber);
            cy.get("[data-cy=phone-input] > input").should("have.attr", "aria-invalid", "true");
        });
        it("isValid 테스트 / required true 일 때, 빈 칸/잘못입력/제대로입력", () => {
            cy.mount(<Phone title="test-title" name="test-name" required placeholder="test-placeholder" />);
            /**
             * 빈칸일 때
             */
            cy.get("[data-cy=phone-input] > input").should("have.attr", "aria-invalid", "true");

            /**
             * 잘못입력했을 때
             */
            cy.get("[data-cy=phone-input] > input").focus().type(randomNumber);
            cy.get("[data-cy=phone-input] > input").should("have.attr", "aria-invalid", "true");

            /**
             * 제대로했을 때
             */
            cy.get("[data-cy=phone-input] > input").focus().clear().type(fakePhoneNumber);
            cy.get("[data-cy=phone-input] > input").should("have.attr", "aria-invalid", "false");
        });
    });
});
