/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import { faker } from "@faker-js/faker";
import Checkbox from "../../../src/components/form/Checkbox";

faker.locale = "ko";

describe("Checkbox 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("title / name / data / required /테스트 ", () => {
            cy.makeRandomOption().then(value => {
                cy.makeProps().then(props => {
                    const { testData } = value;
                    const { name, placeholder, title } = props;
                    cy.mount(<Checkbox title={title} data={testData} name={name} placeholder={placeholder} required />);
                    cy.get("[data-cy=input-checkbox]").should("have.attr", "placeholder", placeholder);
                    cy.get("label.MuiFormLabel-root").should("have.attr", "title", title).should("have.attr", "for", `checkbox-${name}`);
                    cy.get("span.MuiFormLabel-asterisk").should("be.visible");
                    cy.get("[data-cy=checkbox-option]>span.MuiTypography-subtitle1").then($el => {
                        for (let i = 0; i < $el.length; i += 1) {
                            let valueArray = Array.from(testData.values());
                            expect($el[i].textContent).to.equal(valueArray[i]);
                        }
                    });
                    cy.get("[data-cy=checkbox-option]>span>input").then($el => {
                        for (let i = 0; i < $el.length; i += 1) {
                            expect($el[i].checked).to.equal(false);
                        }
                    });
                });
            });
        });
        it("defaultValue / required /테스트 ", () => {
            cy.makeRandomOption().then(value => {
                const { testData, randomArray } = value;
                cy.mount(<Checkbox data={testData} defaultValue={randomArray} />);
                cy.get("span.MuiFormLabel-asterisk").should("not.exist");
                cy.get("[data-cy=checkbox-option]>span>input").then($el => {
                    for (let i = 0; i < $el.length; i += 1) {
                        if ($el[i].checked === true) {
                            expect(randomArray).includes($el[i].value);
                        } else {
                            expect(randomArray).not.includes($el[i].value);
                        }
                    }
                });
            });
        });
    });
    context("동작테스트", () => {
        it("클릭 후 checked 변경 테스트", () => {
            let changeCount = 1;
            const onChange = (name, value) => {
                const formattedValue = `${name} ${value.toString()}`;
                if (changeCount % 2) {
                    expect(formattedValue).to.equal(`${name} ${value.toString()}`);
                } else {
                    expect(formattedValue).to.equal(`${name} `);
                }
                changeCount++;
            };
            cy.makeRandomOption().then(value => {
                const { testData, randomClickIndex } = value;
                cy.mount(<Checkbox data={testData} onChange={onChange} name="test" />);
                cy.get("[data-cy=checkbox-option]>span>input").then($el => {
                    for (let i = 0; i < randomClickIndex.length; i += 1) {
                        $el[randomClickIndex[i]].click();
                        expect($el[randomClickIndex[i]].checked).to.equal(true);
                        $el[randomClickIndex[i]].click();
                        expect($el[randomClickIndex[i]].checked).to.equal(false);
                    }
                });
            });
        });
        it("validation 테스트 / required false", () => {
            cy.makeRandomOption().then(value => {
                const { testData } = value;
                cy.mount(<Checkbox data={testData} />);
                cy.get("[data-cy=input-checkbox]").should("have.attr", "data-test", "true");
            });
        });
        it("validation 테스트 / required true / value none", () => {
            cy.makeRandomOption().then(value => {
                const { testData } = value;
                cy.mount(<Checkbox data={testData} required />);
                cy.get("[data-cy=input-checkbox]").should("have.attr", "data-test", "false");
            });
        });
        it("validation 테스트 / required true / value ", () => {
            cy.makeRandomOption().then(value => {
                const { testData, randomArray } = value;
                cy.mount(<Checkbox data={testData} defaultValue={randomArray} required />);
                cy.get("[data-cy=input-checkbox]").should("have.attr", "data-test", "true");
            });
        });
    });
});
