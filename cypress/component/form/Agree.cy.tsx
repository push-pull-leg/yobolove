/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import { faker } from "@faker-js/faker";
import Agree from "../../../src/components/form/Agree";
import checkbox from "../../../src/components/form/Checkbox";

faker.locale = "ko";

describe("form-Agree 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("title / name / defaultValue / required /테스트 ", () => {
            cy.makeProps().then(props => {
                const { title, name } = props;
                cy.mount(<Agree title={title} name={name} required />);
                cy.checkProps("[data-cy=agree-checkbox]>input", "checkbox", name, undefined, true);
                cy.get("[data-cy=agree-checkbox] > input").should("not.be.checked");
                cy.get("[data-cy=checkbox-label]").should("have.text", title);
            });
        });
        it("defaultValue / required /테스트 ", () => {
            cy.makeProps().then(props => {
                const { title, name } = props;
                cy.mount(<Agree title={title} name={name} defaultValue={true} />);
                cy.get("[data-cy=agree-checkbox] > input").should("be.checked");
                cy.get("[data-cy=agree-checkbox] > input").should("have.attr", "checked", "checked");
            });
        });
    });
    context("동작 테스트", () => {
        const clickNum = faker.datatype.number({ min: 1, max: 10 });
        let changeNum = 1;
        /**
         * onChange 테스트
         */
        const onChange = (name, value) => {
            if (changeNum % 2 === 0) {
                expect(value).to.equal(false);
            } else {
                expect(value).to.equal(true);
            }
            changeNum++;
        };
        it("체크 / onChange 테스트 ", () => {
            cy.makeProps().then(props => {
                const { title, name } = props;
                cy.mount(<Agree title={title} name={name} onChange={onChange} />);

                /**
                 * 클릭으로 value 가 변하는 지 테스트, onChange 테스트
                 */
                for (let i = 0; i < clickNum; i += 1) {
                    cy.get("[data-cy=agree-checkbox] > input").click();
                }
                cy.get("[data-cy=agree-checkbox] > input").then($el => {
                    if (clickNum % 2 === 0) {
                        expect($el[0].checked).to.equal(false);
                    } else {
                        expect($el[0].checked).to.equal(true);
                    }
                });
            });
        });
        it("validation 테스트", () => {
            /**
             * required false & value false 일 때, 발리데이션 테스트
             */
            cy.makeProps().then(props => {
                const { title, name } = props;
                cy.mount(<Agree title={title} name={name} onChange={onChange} required={false} />);
                cy.get("[data-cy=agree-checkbox]")
                    .invoke("attr", "aria-invalid")
                    .then(isValid => {
                        expect(isValid).to.equal("false");
                    });
            });
            /**
             * required true & value false 일 때, 발리데이션 테스트
             */
            cy.makeProps().then(props => {
                const { title, name } = props;
                cy.mount(<Agree title={title} name={name} onChange={onChange} required />);
                cy.get("[data-cy=agree-checkbox]")
                    .invoke("attr", "aria-invalid")
                    .then(isValid => {
                        expect(isValid).to.equal("true");
                    });
            });
            /**
             * required true & defaultValue false 일 때, 발리데이션 테스트
             */
            cy.makeProps().then(props => {
                const { title, name } = props;
                cy.mount(<Agree title={title} name={name} defaultValue={true} onChange={onChange} required />);
                cy.get("[data-cy=agree-checkbox]")
                    .invoke("attr", "aria-invalid")
                    .then(isValid => {
                        expect(isValid).to.equal("false");
                    });
            });
        });
    });
});
