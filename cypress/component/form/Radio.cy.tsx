/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Radio from "../../../src/components/form/Radio";
import { faker } from "@faker-js/faker";

faker.locale = "ko";

describe("form-date 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("name / placeholder / defaultValue  / row / description /테스트 ", () => {
            const description = faker.lorem.lines(1);
            cy.makeRandomOption(1).then(value => {
                cy.makeProps().then(props => {
                    const { testData, testDataArray, randomClickIndex } = value;
                    const { name, placeholder, title } = props;
                    cy.mount(
                        <Radio
                            title={title}
                            data={testData}
                            name={name}
                            defaultValue={testDataArray[randomClickIndex[0]]}
                            placeholder={placeholder}
                            description={description}
                            required
                        />,
                    );
                    cy.get("[role=radiogroup]").should("have.attr", "placeholder", placeholder);
                    cy.get("[data-cy=radio-option] > span > input[type=radio]").then($el => {
                        for (let i = 0; i < testDataArray.length; i += 1) {
                            expect($el[i].value).to.equal(testDataArray[i]);
                        }
                    });
                    cy.get("[data-cy=input-radio]").should("have.css", "flex-flow", "column wrap");
                    cy.get("[data-cy=radio-option] > span > input[type=radio]").then($el => {
                        expect($el[randomClickIndex[0]].checked).to.equal(true);
                    });
                    cy.get("[role=note]").should("have.text", description);
                    cy.get("[data-cy=check-icon]").should("be.visible").and("be.inViewport");
                    cy.get("[data-cy=radio-icon]").should("not.exist");
                });
            });
        });
        it("디자인 렌더링 테스트 iconStyle props", () => {
            cy.makeRandomOption(1).then(value => {
                const { testData, testDataArray } = value;
                cy.mount(<Radio data={testData} iconStyle="not-checkbox" />);
                cy.get("[data-cy=radio-icon]").should("be.visible").and("be.inViewport");
                cy.get("[data-cy=check-icon]").should("not.exist");
            });
        });
        it("defaultValue 테스트 / row true 테스트", () => {
            cy.makeRandomOption(1).then(value => {
                cy.makeProps().then(props => {
                    const { testData, testDataArray } = value;
                    const { name, placeholder } = props;
                    cy.mount(<Radio title="test-title" data={testData} name={name} placeholder={placeholder} required />);
                    cy.get("[data-cy=input-radio]").should("have.css", "flex-wrap", "wrap");

                    cy.get("[data-cy=radio-option] > span > input[type=radio]").then($el => {
                        for (let i = 0; i < testDataArray.length; i += 1) {
                            expect($el[i].checked).to.equal(false);
                        }
                    });
                });
            });
        });
    });

    context("동작 텍스트", () => {
        const onChange = (name, value) => {
            alert(`${name} ${value}`);
        };
        it("랜덤 밸류 클릭 시 해당 밸류 checked, 다른 밸류 checked false / onChange 테스트", () => {
            cy.makeRandomOption(1).then(value => {
                cy.makeProps().then(props => {
                    const { testData, testDataArray, randomClickIndex } = value;
                    const { name, placeholder } = props;
                    cy.mount(<Radio title="test-title" data={testData} name={name} placeholder={placeholder} onChange={onChange} required />);
                    cy.get("[data-cy=radio-option] > span > input[type=radio]").then($el => {
                        $el[randomClickIndex[0]].click();
                        for (let i = 0; i < testDataArray.length; i += 1) {
                            if (i === randomClickIndex[0]) {
                                expect($el[i].checked).to.equal(true);
                            } else {
                                expect($el[i].checked).to.equal(false);
                            }
                        }
                    });

                    /**
                     * onChange
                     */
                    cy.on("window:alert", text => {
                        expect(text).to.equal(`${name} ${testDataArray[randomClickIndex[0]]}`);
                    });

                    /**
                     * validate
                     */
                    cy.get("[data-cy=input-radio]").should("have.attr", "data-test", "true");
                });
            });
        });
        it("defaultValue undefined 시 validate 테스트", () => {
            cy.makeRandomOption(1).then(value => {
                cy.makeProps().then(props => {
                    const { testData } = value;
                    const { name, placeholder } = props;
                    cy.mount(<Radio title="test-title" data={testData} name={name} placeholder={placeholder} onChange={onChange} required />);
                    cy.get("[data-cy=input-radio]").should("have.attr", "data-test", "false");
                });
            });
        });
        it("onValidate / required 테스트", () => {
            /**
             * onValidate 의 return 값이 false라면, 실제 value/required 와는 관계없이 무조건 false 인지 확인
             */
            const onValidate = () => {
                return false;
            };
            cy.makeRandomOption(1).then(value => {
                const { testData, testDataArray, randomClickIndex } = value;
                cy.mount(<Radio title="test-title" data={testData} onValidate={onValidate} defaultValue={testDataArray[randomClickIndex[0]]} required />);
                cy.get("[data-cy=input-radio]").should("have.attr", "data-test", "false");
            });
        });
    });
});
