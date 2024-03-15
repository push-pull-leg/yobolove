/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Select from "../../../src/components/form/Select";
import { faker } from "@faker-js/faker";

faker.locale = "ko";

describe("form-date 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("name / placeholder / defaultValue = null 테스트 ", () => {
            cy.makeRandomOption().then(value => {
                cy.makeProps().then(props => {
                    const { testData } = value;
                    const { name, placeholder, title } = props;
                    cy.mount(<Select title={title} data={testData} name={name} placeholder={placeholder} required />);
                    cy.checkProps("[data-cy=select-input] input", "select", name, placeholder, true);
                    cy.get("[data-cy=select-input] > [role=button]").should("have.not.text");
                    cy.get("[data-cy=select-input] input").should("have.not.value");
                });
            });
        });
        it("defaultValue 테스트 ", () => {
            cy.makeRandomOption(1).then(value => {
                cy.makeProps().then(props => {
                    const { testData, randomArray } = value;
                    const { name, placeholder } = props;
                    cy.mount(<Select title="test-title" data={testData} defaultValue={randomArray[0]} name={name} placeholder={placeholder} required />);
                    cy.get("[data-cy=select-input] > [role=button]").should("have.text", randomArray[0]);
                    cy.get("[data-cy=select-input] input").should("have.value", randomArray[0]);
                });
            });
        });
    });
    context("동작 테스트", () => {
        it("클릭 후 동작/props 테스트", () => {
            const onChange = (name, value) => {
                alert(`${name} ${value}`);
            };
            cy.makeRandomOption(1).then(value => {
                cy.makeProps().then(props => {
                    const { testData, testDataArray, randomClickIndex } = value;
                    const { name, placeholder } = props;
                    cy.mount(<Select title="test-title" data={testData} name={name} placeholder={placeholder} onChange={onChange} required />);

                    /**
                     * input 창 클릭 시 select option list 내려오는 지 확인
                     */
                    cy.get("[data-cy=select-input]").click();
                    cy.get("[role=listbox]").should("be.inViewport").and("be.visible");

                    /**
                     * option list 와 data 비교
                     */
                    cy.get("[role=listbox] li").then($el => {
                        for (let i = 0; i < testDataArray.length; i++) {
                            expect($el[i].dataset.value).to.equal(testDataArray[i]);
                        }
                    });

                    /**
                     * 랜덤한 숫자의 체크박스를 클릭 시 밸류가 바뀌는 지 확인 // option 리스트가 꺼지는 지 확인
                     */
                    cy.get("[role=option]").then($el => {
                        $el[randomClickIndex[0]].click();
                        cy.wait(100);
                        cy.get("[role=listbox]").should("not.exist");
                    });

                    cy.get("[data-cy=select-input]>input")
                        .invoke("val")
                        .then(value => {
                            expect(value).to.equal(testDataArray[randomClickIndex[0]]);
                        });

                    /**
                     * onChange 확인
                     */
                    cy.on("window:alert", text => {
                        expect(text).to.equal(`${name} ${testDataArray[randomClickIndex[0]]}`);
                    });

                    /**
                     * validate 테스트
                     */
                    cy.get("[data-cy=select-input]>input")
                        .invoke("attr", "invalid")
                        .then(value => {
                            expect(value).to.equal("false");
                        });
                });
            });
        });

        it("value 가 없을 때 validate 테스트", () => {
            cy.makeRandomOption(1).then(value => {
                cy.makeProps().then(props => {
                    const { testData, testDataArray } = value;
                    const { name, placeholder } = props;

                    cy.mount(<Select title="test-title" data={testData} defaultValue="" name={name} placeholder={placeholder} required />);

                    /**
                     * data 와 option list 비교
                     */
                    cy.get("[data-cy=select-input]").click();
                    cy.get("[role=listbox] li").then($el => {
                        for (let i = 0; i < $el.length; i += 1) {
                            expect(testDataArray[i]).to.equal($el[i].dataset.value);
                        }
                    });

                    cy.get("[data-cy=select-input]>input")
                        .invoke("attr", "invalid")
                        .then(value => {
                            expect(value).to.equal("true");
                        });
                });
            });
        });
    });
});
