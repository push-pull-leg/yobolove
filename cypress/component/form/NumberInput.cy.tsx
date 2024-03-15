/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import NumberInput from "../../../src/components/form/NumberInput";
import { faker } from "@faker-js/faker";

const randomMaxLength = faker.datatype.number({ min: 4, max: 9 });
const randomMinNumber = faker.datatype.number({ min: 0, max: 8 });
const randomMaxNumber = Math.pow(10, randomMaxLength - 1) - 2;
const randomValue = faker.datatype.number({ min: randomMinNumber, max: randomMaxNumber });
const randomText = faker.lorem.word();
const calcMaxLength = (maxLength): number | undefined => {
    if (!maxLength) return undefined;
    if (maxLength < 3) {
        return maxLength;
    }
    return maxLength + Math.floor((maxLength - 1) / 3);
};

describe("form-date 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("name / placeholder / defaultValue = null 테스트 ", () => {
            cy.makeRandomOption().then(value => {
                cy.makeProps().then(props => {
                    const { testData } = value;
                    const { name, placeholder, title, helperText } = props;
                    cy.mount(<NumberInput title={title} data={testData} name={name} helperText={helperText} placeholder={placeholder} maxLength={randomMaxLength} required />);
                    cy.checkProps("[data-cy=number-input]", "text", name, placeholder, true);
                    cy.get("[data-cy=number-input-helper]").should("have.text", helperText);
                    cy.get("[data-cy=number-input]").should("not.have.value").and("have.attr", "maxLength", calcMaxLength(randomMaxLength));
                });
            });
        });
        it("optional props, defaultValue ", () => {
            cy.makeRandomOption().then(value => {
                cy.makeProps().then(props => {
                    const { testData } = value;
                    const { name, placeholder, title } = props;
                    cy.mount(
                        <NumberInput
                            title={title}
                            data={testData}
                            name={name}
                            placeholder={placeholder}
                            maxLength={randomMaxLength}
                            defaultValue={randomValue}
                            required={false}
                            disabled
                        />,
                    );
                    cy.get("[data-cy=number-input]").should("have.value", randomValue.toLocaleString()).and("not.have.attr", "required");
                    cy.get("[data-cy=number-input]").should("have.attr", "disabled", "disabled");
                    cy.get("[data-cy=number-input-helper]").should("not.exist");
                });
            });
        });
    });
    context("동작 테스트", () => {
        let changeCount = 0;
        const onChange = (name, value) => {
            const formattedValue = value.toLocaleString();
            const nowValue = Number(randomValue.toString().slice(0, changeCount + 1)).toLocaleString();
            expect(formattedValue + name).to.eq(nowValue + name);
            changeCount++;
        };
        it("입력 테스트 / onChange", () => {
            cy.mount(<NumberInput name={randomText} onChange={onChange} />);
            cy.get("[data-cy=number-input]").focus().type(randomValue);
            cy.get("[data-cy=number-input]").should("have.value", randomValue.toLocaleString());
        });
        it(" min / max / 일반 string 입력 테스트", () => {
            cy.mount(<NumberInput min={randomMinNumber} max={randomMaxNumber} maxLength={randomMaxLength} />);
            cy.get("[data-cy=number-input]").focus().type(randomText);
            /**
             * 일반 스트링 입력 시 입력되지 않음
             */
            cy.get("[data-cy=number-input]").should("not.have.value");
            /**
             * min 값보다 작은 값 입력 시 입력 되지 않음
             */
            for (let i = 0; i < randomMinNumber; i += 1) {
                cy.get("[data-cy=number-input]").focus().type(i);
                cy.get("[data-cy=number-input]").should("not.have.value");
            }
            /**
             * max 값보다 큰 값 입력 시 마지막 자리 입력 되지 않음
             */
            cy.get("[data-cy=number-input]")
                .focus()
                .type(randomMaxNumber + 1);
            cy.get("[data-cy=number-input]").should("have.value", ((randomMaxNumber - 8) / 10).toLocaleString());
        });
        it("maxLength 입력 테스트 (3이상)", () => {
            /**
             * maxLength 값보다 긴 숫자 입력 시 maxLength 이상으로 입력 되지 않음
             */
            cy.mount(<NumberInput maxLength={randomMaxLength} />);
            cy.get("[data-cy=number-input]").type(Math.pow(10, randomMaxLength));
            cy.get("[data-cy=number-input]").should("have.value", Math.pow(10, randomMaxLength - 1).toLocaleString());
        });
        it("maxLength 입력 테스트 (3미만)", () => {
            /**
             * maxLength 값보다 긴 숫자 입력 시 maxLength 이상으로 입력 되지 않음
             */
            cy.mount(<NumberInput maxLength={2} />);
            cy.get("[data-cy=number-input]").type(Math.pow(10, 3));
            cy.get("[data-cy=number-input]").should("have.value", Math.pow(10, 1).toLocaleString());
        });
    });
    context("inValid 테스트", () => {
        it("required / 값이 있을 때", () => {
            cy.mount(<NumberInput defaultValue={randomValue} required />);
            cy.get("[data-cy=number-input]").should("have.attr", "aria-invalid", "false");
        });
        it("required / 값이 없을 때", () => {
            cy.mount(<NumberInput required />);
            cy.get("[data-cy=number-input]").should("have.attr", "aria-invalid", "true");
        });
        it("!required / 값이 없을 때", () => {
            cy.mount(<NumberInput />);
            cy.get("[data-cy=number-input]").should("have.attr", "aria-invalid", "false");
        });
    });
});
