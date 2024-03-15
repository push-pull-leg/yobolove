/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Tel from "../../../src/components/form/Tel";
import { faker } from "@faker-js/faker";

faker.locale = "ko";
const fakeMobileNumber = faker.phone.number("010-####-####");
const fakeSeoulNumber = faker.phone.number("02-####-####");
const fakeLocationNumber = faker.phone.number(`0${faker.datatype.number({ min: 3, max: 6 })}${faker.datatype.number({ min: 1, max: 5 })}-####-####`);
const fakeInternetNumber = faker.phone.number("070-####-####");
const fakeSafetyNumber = faker.phone.number(`050${faker.datatype.number({ min: 1, max: 9 })}-####-####`);
const fakeWrongNumber = faker.phone.number("123-456-7890");
const rightFormatNumberArray = [fakeMobileNumber, fakeSeoulNumber, fakeLocationNumber, fakeInternetNumber, fakeSafetyNumber];
const toArray = number => {
    return [...number.replaceAll("-", "")];
};

describe("form-phone 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("name / placeholder / defaultValue='' 테스트", () => {
            cy.makeProps().then(props => {
                const { name, placeholder, title, autoFocus } = props;
                cy.mount(<Tel title={title} name={name} placeholder={placeholder} required autoFocus={autoFocus} />);
                cy.checkProps("[data-cy=tel-input] > input", "tel", name, placeholder, true);
                cy.get("[data-cy=tel-input] > input")
                    .should("have.attr", "aria-describedby", `tel-${name}-helpertext`)
                    .should("have.id", `tel-${name}`)
                    .should("have.attr", "name", name);
                cy.get("[role=note]").should("have.id", `tel-${name}-helpertext`).should("have.text", "- 없이 숫자만 입력");

                cy.focused().then($el => {
                    expect($el[0].getAttribute("id")).to.equal(`tel-${name}`);
                });
            });
        });
    });
    context("동작 테스트", () => {
        it("onChange", () => {
            let changeCount = 0;
            /**
             * onChange 테스트
             */
            const onChange = (name, value) => {
                const formattedValue = value.replaceAll("-", "").replaceAll("_", "");
                const nowValue = toArray(value)
                    .slice(0, changeCount + 1)
                    .join("");
                expect(formattedValue).to.equal(nowValue);
                changeCount++;
            };
            cy.mount(<Tel title="test-title" name="test-name" placeholder="test-placeholder" onChange={onChange} />);
            /**
             * 핸드폰 번호 제대로 입력
             */
            cy.get("[data-cy=tel-input] > input").focus().type(fakeMobileNumber);
            /**
             * helperText 유무 확인
             */
            cy.get("[role=note]").should("not.have.text");
            cy.get("[data-cy=tel-input] > input").should("have.value", fakeMobileNumber);
        });
        it("제대로 입력", () => {
            cy.mount(<Tel title="test-title" name="test-name" placeholder="test-placeholder" />);
            /**
             * 핸드폰 번호 제대로 입력
             */
            for (let i = 0; i < rightFormatNumberArray.length; i += 1) {
                cy.get("[data-cy=tel-input] > input").focus().type(rightFormatNumberArray[i]);
                cy.get("[role=note]").should("not.have.text");
                cy.get("[data-cy=tel-input] > input").should("have.value", rightFormatNumberArray[i]).clear();
            }
        });
        it("정규식에 맞지 않게 입력", () => {
            cy.mount(<Tel title="test-title" name="test-name" placeholder="test-placeholder" />);
            /**
             * 잘못된 번호 제대로 입력
             */
            cy.get("[data-cy=tel-input] > input").focus().type(fakeWrongNumber);
            cy.get("[role=note]").should("have.text", "전화번호 형식의 번호를 입력해주세요.");
        });
        context("valid Test", () => {
            it("required, 제대로 된 value", () => {
                cy.mount(<Tel title="test-title" name="test-name" placeholder="test-placeholder" required defaultValue={fakeMobileNumber} />);
                cy.get("[data-cy=tel-input] > input").should("have.attr", "aria-invalid", "false");
            });
            it("required, 잘못된 value", () => {
                cy.mount(<Tel title="test-title" name="test-name" placeholder="test-placeholder" required defaultValue={fakeWrongNumber} />);
                cy.get("[data-cy=tel-input] > input").should("have.attr", "aria-invalid", "true");
            });
            it("!required, value 없음", () => {
                cy.mount(<Tel title="test-title" name="test-name" placeholder="test-placeholder" required />);
                cy.get("[data-cy=tel-input] > input").should("have.attr", "aria-invalid", "true");
            });
        });
    });
});
