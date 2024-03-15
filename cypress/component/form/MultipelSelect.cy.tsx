/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import MultipleSelect from "../../../src/components/form/MultipleSelect";
import { faker } from "@faker-js/faker";

faker.locale = "ko";

describe("form-date 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("name / placeholder / defaultValue = null 테스트 ", () => {
            cy.makeRandomOption().then(value => {
                cy.makeProps().then(props => {
                    const { testData } = value;
                    const { name, placeholder, title } = props;
                    cy.mount(<MultipleSelect title={title} data={testData} defaultValue={[]} name={name} placeholder={placeholder} required />);
                    cy.get("[role=button]").should("have.attr", "aria-labelledby", `multipleSelect-${name}`);
                    cy.get("[data-cy=select-input] input").should("have.attr", "placeholder", `${placeholder}`);
                    cy.get("[data-cy=select-input]>[role=button]").should("have.not.text");
                    cy.get("[data-cy=select-input] input").should("have.not.value");
                });
            });
        });
        it("defaultValue 테스트 ", () => {
            cy.makeRandomOption().then(value => {
                cy.makeProps().then(props => {
                    const { testData, randomArray } = value;
                    const { name, placeholder } = props;
                    cy.mount(<MultipleSelect title="test-title" data={testData} defaultValue={randomArray} name={name} placeholder={placeholder} required />);
                    cy.get("[data-cy=select-input]>[role=button]").should("have.text", randomArray.join(", "));
                    cy.get("[data-cy=select-input] input").should("have.value", randomArray.join());
                });
            });
        });
    });
    context("동작 테스트", () => {
        let valArr = [];
        const onChange = (name, value) => {
            expect(value).to.deep.equal(valArr);
        };
        it("클릭 후 동작/props 테스트", () => {
            cy.makeRandomOption().then(value => {
                const { testData, testDataArray, randomClickIndex } = value;
                cy.mount(<MultipleSelect title="test-title" data={testData} defaultValue={[]} name="name" placeholder="placeholder" required onChange={onChange} />);

                /**
                 * input 창 클릭 시 select option list 내려오는 지 확인
                 */
                cy.get("[data-cy=select-input]").click();
                cy.get("[role=listbox]").and("be.visible");

                /**
                 * option list 와 data 비교
                 */
                cy.get("[role=listbox] li").then($el => {
                    for (let i = 0; i < testDataArray.length; i++) {
                        expect($el[i].dataset.value).to.equal(testDataArray[i]);
                    }
                });

                /**
                 * 랜덤한 숫자의 체크박스를 클릭 시 밸류가 바뀌는 지 확인
                 */
                cy.get("[role=checkbox]").then($el => {
                    for (let i = 0; i < randomClickIndex.length; i += 1) {
                        let index: number = randomClickIndex[i];
                        valArr.push(testDataArray[randomClickIndex[i]]);
                        $el[index].click();
                    }
                    let result = valArr.join();
                    cy.get("[data-cy=select-input] > input")
                        .invoke("val")
                        .then(value => {
                            expect(value).to.equal(result);
                        });
                });
                /**
                 * 맨땅 클릭 시 option 사라지는 지 확인
                 */
                cy.get("[role=presentation]").click(1, 1);
                cy.get("[role=listbox]").should("not.exist");

                /**
                 * validate 테스트
                 */
                cy.get("[data-cy=select-input] > input")
                    .invoke("attr", "invalid")
                    .then(value => {
                        expect(value).to.equal("false");
                    });
            });
        });
        it("value 가 없을 때 validate 테스트", () => {
            cy.makeRandomOption().then(props => {
                const { testData } = props;
                cy.mount(<MultipleSelect title="test-title" data={testData} defaultValue={[]} name="test-name" placeholder="test-placeholder" onChange={onChange} required />);
                cy.get("[data-cy=select-input] > input")
                    .invoke("attr", "invalid")
                    .then(value => {
                        expect(value).to.equal("true");
                    });
            });
        });
    });
});
