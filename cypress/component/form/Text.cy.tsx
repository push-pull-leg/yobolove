/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Text from "../../../src/components/form/Text";
import { faker } from "@faker-js/faker";

faker.locale = "ko";

const randomTyping = faker.datatype.string(10).replaceAll("{", "").replaceAll("}", "");
const randomMaxLength = faker.datatype.number({ min: 4, max: 9 });
const randomValid = faker.datatype.boolean();

describe("form-date 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("name / placeholder / defaultValue = null 테스트 ", () => {
            cy.makeProps().then(props => {
                const { name, placeholder, title, helperText, autoFocus } = props;
                cy.mount(<Text title={title} name={name} placeholder={placeholder} helperText={helperText} autoFocus={autoFocus} required />);
                cy.checkProps("[data-cy=type-input] > input", "text", name, placeholder, true);
                cy.get("[data-cy=type-input] > input").should("not.have.value");

                cy.get("[role=note]").should("have.text", helperText);
                cy.focused().then($el => {
                    expect($el[0].getAttribute("id")).to.equal(`text-${name}`);
                });
            });
        });

        it("defaultValue 테스트", () => {
            cy.mount(<Text title="test-title" defaultValue={randomTyping} name="test-name" placeholder="test-placeholder" required />);
            cy.get("[data-cy=type-input] > input").should("have.value", randomTyping);
        });
    });
    context("동작 텍스트", () => {
        it("disableSpacing 테스트", () => {
            cy.mount(<Text title="test-title" name="test-name" placeholder="test-placeholder" required disableSpacing />);
            cy.get("[data-cy=type-input] > input").focus().type(`${randomTyping} ${randomTyping}`).should("have.value", `${randomTyping}${randomTyping}`);
        });
        const testReg = /^[0-9]$/g;
        const combinationTyping = faker.datatype.uuid();
        it("RegExp 테스트", () => {
            cy.mount(<Text title="test-title" name="test-name" placeholder="test-placeholder" required regExp={testReg} />);
            cy.get("[data-cy=type-input] > input")
                .focus()
                .type(combinationTyping)
                .should("have.value", combinationTyping.replace(/[^0-9]/g, "").charAt(0));
        });
        it("maxLength 테스트", () => {
            cy.mount(<Text title="test-title" name="test-name" placeholder="test-placeholder" maxLength={randomMaxLength} required />);
            cy.get("[data-cy=type-input] > input")
                .focus()
                .type(randomTyping)
                .should("have.value", randomTyping.slice(0, randomMaxLength - randomTyping.length));
        });

        /**
         * onChange test
         */
        let changeCount = 0;
        const onChange = (name, value) => {
            expect(value).to.equal(randomTyping.slice(0, changeCount + 1));
            changeCount++;
        };
        it("랜덤 string type 시 밸류 테스트 / onChange 테스트 / validate", () => {
            cy.mount(<Text title="test-title" name="test-name" placeholder="test-placeholder" required onChange={onChange} />);
            cy.get("[data-cy=type-input] > input").focus().type(randomTyping).should("have.value", randomTyping);
            /**
             * validate test
             */
            cy.get("[data-cy=type-input] > input").should("have.attr", "aria-invalid", "false");
        });
        it("밸류가 없을 때 validate", () => {
            cy.mount(<Text title="test-title" name="test-name" placeholder="test-placeholder" required />);
            cy.get("[data-cy=type-input] > input").should("have.attr", "aria-invalid", "true");
        });
        it("valid props 를 받았을 때", () => {
            cy.mount(<Text title="test-title" name="test-name" placeholder="test-placeholder" valid={randomValid} />);
            cy.get("[data-cy=type-input] > input").should("have.attr", "aria-invalid", `${!randomValid}`);
        });
        const onValidate = () => {
            return false;
        };
        it("onValidate return false", () => {
            cy.mount(<Text title="test-title" name="test-name" placeholder="test-placeholder" onValidate={onValidate} />);
            cy.get("[data-cy=type-input] > input").focus().type(randomTyping);
            cy.get("[data-cy=type-input] > input").should("have.attr", "aria-invalid", "true");
        });
    });
});
