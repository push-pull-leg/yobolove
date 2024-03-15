/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Email from "../../../src/components/form/Email";
import { faker } from "@faker-js/faker";

const fakeValue = faker.internet.email();
const fakeName = faker.datatype.string(10);
const optionDomain = faker.helpers.arrayElement(["naver.com", "daum.net", "hanmail.net", "gmail.com"]);
const randomDomain = faker.helpers.arrayElement(["yahoo.co.kr", "hotmail.com", "nate.com", "kslab.co.kr"]);

describe("form-Email 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("title / name / defaultValue / maxLength / required 테스트 ", () => {
            cy.makeProps().then(props => {
                const maxLength = faker.datatype.number({ min: 10, max: 20 });
                const { title, name, placeholder } = props;
                cy.mount(<Email title={title} name={name} maxLength={maxLength} placeholder={placeholder} required />);
                cy.checkProps("[data-cy=type-input]>input", "text", name, placeholder, true);
                cy.get("[data-cy=type-input]>input").should("have.attr", "maxLength", maxLength);
                cy.get("[role=button]>em").should("have.text", "이메일 뒷주소 선택");
            });
        });
        it("defaultValue domain in option / required 테스트 ", () => {
            let defaultValue = `${fakeName}@${optionDomain}`;
            cy.mount(<Email defaultValue={defaultValue} />);
            cy.get("[data-cy=type-input]>input").should("have.value", defaultValue.split("@")[0]);
            cy.get("[data-cy=type-input]>input").should("not.have.attr", "required");
            cy.get("[data-cy=email-select]>input").should("have.value", defaultValue.split("@")[1]);
            cy.get("[data-cy=email-select]>input").should("not.have.attr", "required");
        });
        it("defaultValue domain not in option / required 테스트 ", () => {
            let defaultValue = `${fakeName}@${randomDomain}`;
            cy.mount(<Email defaultValue={defaultValue} />);
            cy.get("[data-cy=type-input]>input").should("have.value", defaultValue.split("@")[0]);
            cy.get("[data-cy=type-input]>input").should("not.have.attr", "required");
            cy.get("[data-cy=email-select]>input").should("have.value", "direct");
            cy.get("[data-cy=email-select]>input").should("not.have.attr", "required");
            cy.get("[data-cy=direct-input]>div>input").should("have.value", defaultValue.split("@")[1]);
        });
    });
    context("동작 테스트", () => {
        let changeCount = 0;
        const onChange = (name, value) => {
            if (fakeValue.split("0")[0].length === changeCount + 1) {
                expect(value.replace("@", "")).to.equal(fakeValue.replace("@", "").slice(0, changeCount + 1));
                expect(name).to.eq(fakeName);
            }
            changeCount++;
        };
        it("앞부분 입력/maxLength/삭제 테스트", () => {
            let maxLength = faker.datatype.number({ min: 16, max: 20 });
            const fakeAccount = faker.datatype.string(15);
            cy.mount(<Email maxLength={maxLength} />);
            cy.get("[data-cy=type-input]>input").type(fakeAccount);
            cy.get("[data-cy=type-input]>input").should("have.value", fakeAccount);

            maxLength = faker.datatype.number({ min: 10, max: 14 });
            cy.mount(<Email maxLength={maxLength} />);
            cy.get("[data-cy=type-input]>input").type(fakeAccount);
            cy.get("[data-cy=type-input]>input").should("have.value", fakeAccount.slice(0, maxLength));
            cy.get("[data-cy=reset-button]").click();
            cy.get("[data-cy=type-input]>input").should("not.have.value");
        });

        it("뒷부분 select / 입력 테스트", () => {
            const selectNum = faker.datatype.number({ min: 0, max: 3 });
            const fakeAccount = faker.datatype.string(10);
            cy.mount(<Email onChange={onChange} />);
            cy.get("[data-cy=email-select]").click();
            cy.get("[role=listbox]").should("be.inViewport").and("be.visible");
            cy.get("[role=listbox]>li").then($el => {
                $el[selectNum].click();
                let value = $el[selectNum].textContent;
                cy.wait(100);
                cy.get("[data-cy=email-select]>div").should("have.text", value);
            });
            cy.get("[role=listbox]>li").then($el => {
                $el[4].click();
                cy.wait(100);
                cy.get("[data-cy=email-select]>input").should("have.value", "direct");
                cy.get("[data-cy=direct-input]").should("be.inViewport").and("be.visible").type(fakeAccount);
                cy.get("[data-cy=direct-input]>div>input").should("have.value", fakeAccount);
            });
        });
        it("onChange 테스트", () => {
            changeCount = 0;
            cy.mount(<Email onChange={onChange} name={fakeName} />);
            cy.get("[data-cy=type-input]>input").type(fakeValue.split("@")[0]);
            cy.get("[data-cy=email-select]").click();
            cy.get("[role=listbox]>li").then($el => {
                $el[4].click();
                cy.get("[data-cy=direct-input]").type(fakeValue.split("@")[1]);
            });
        });
    });
    context("validate 테스트", () => {
        it("required false", () => {
            cy.mount(<Email required={false} />);
            cy.get("[data-cy=type-input]>input").should("have.attr", "aria-invalid", "false");
        });
        it("required true (직접 입력)", () => {
            cy.mount(<Email required />);
            cy.get("[data-cy=type-input]>input").should("have.attr", "aria-invalid", "true");
            cy.get("[data-cy=type-input]>input").type(fakeValue.split("@")[0]);
            cy.get("[data-cy=type-input]>input").clear();
            cy.get("[data-cy=helper-text]").should("have.text", "값을 입력해주세요");
            cy.get("[data-cy=type-input]>input").type(fakeValue.split("@")[0]);
            cy.get("[data-cy=helper-text]").should("have.text", "이메일 형식으로 입력해주세요");
            cy.get("[data-cy=email-select]").click();
            cy.get("[role=listbox]>li").then($el => {
                $el[4].click();
                cy.get("[data-cy=direct-input]").type(fakeValue.split("@")[1]);
            });
            cy.get("[data-cy=helper-text]").should("not.exist");
            cy.get("[data-cy=type-input]>input").should("have.attr", "aria-invalid", "false");
        });
        it("required true (선택 도메인)", () => {
            const selectNum = faker.datatype.number({ min: 0, max: 3 });
            cy.mount(<Email required />);
            cy.get("[data-cy=type-input]>input").should("have.attr", "aria-invalid", "true");
            cy.get("[data-cy=type-input]>input").type(fakeValue.split("@")[0]);
            cy.get("[data-cy=email-select]").click();
            cy.get("[role=listbox]>li").then($el => {
                $el[selectNum].click();
            });
            cy.get("[data-cy=helper-text]").should("not.exist");
            cy.get("[data-cy=type-input]>input").should("have.attr", "aria-invalid", "false");
        });
    });
});
