/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import { faker } from "@faker-js/faker";
import PasswordInput from "../../../src/components/form/PasswordInput";

faker.locale = "ko";
const ACCOUNT_PWD_REGEX_CONTAIN = /^.*(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
const randomPassword = `${faker.internet.password(5, false, /[a-zA-Z]/)}${faker.internet.password(5, false, /[!@#$%^&+=]/)}${faker.internet.password(5, false, /[0-9]/)}`;
const wrongPassword = faker.internet.password(12, false, /[a-zA-Z]/);
const shortPassword = `${faker.internet.password(3, false, /[a-zA-Z]/)}${faker.internet.password(2, false, /[!@#$%^&+=]/)}${faker.internet.password(2, false, /[0-9]/)}`;
const wrongAndShortPassword = faker.internet.password(6, false, /[a-zA-Z]/);

describe("password-input 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("name / placeholder / defaultValue = null 테스트 ", () => {
            cy.makeProps().then(props => {
                const { name } = props;
                cy.mount(<PasswordInput name={name} />);
                cy.get("[data-cy=type-input] > input").then($el => {
                    expect($el[0].name).to.equal(name);
                    expect($el[1].name).to.equal(`${name}Confirm`);
                });
                cy.get("[data-cy=regex-helper]").should("have.text", "영문, 숫자, 특수문자 모두 사용");
                cy.get("[data-cy=length-helper]").should("have.text", "10~30자리 이내");
                cy.get("[data-cy=regex-check-icon]>svg").should("have.css", "color", "rgba(44, 44, 44, 0.1)");
                cy.get("[data-cy=length-check-icon]>svg").should("have.css", "color", "rgba(44, 44, 44, 0.1)");
            });
        });
    });
    context("동작 테스트", () => {
        it("validation 테스트 / 정규식에 맞는 비밀번호 입력 시", () => {
            cy.mount(<PasswordInput />);
            cy.get("[data-cy=type-input] > input").then($el => {
                const valid = ACCOUNT_PWD_REGEX_CONTAIN.test(randomPassword);
                expect(valid).to.equal(true);
                cy.get($el[0]).type(randomPassword).should("have.value", randomPassword);
            });
            cy.get("[data-testid=CheckCircleOutlineIcon]").should("have.css", "color", "rgb(76, 175, 80)");
        });
        it("validation 테스트 / 정규식과 다른 && 길이는 맞는 비밀번호 입력 시", () => {
            cy.mount(<PasswordInput />);
            cy.get("[data-cy=type-input] > input").then($el => {
                const valid = ACCOUNT_PWD_REGEX_CONTAIN.test(wrongPassword);
                expect(valid).to.equal(false);
                cy.get($el[0]).type(wrongPassword).should("have.value", wrongPassword);
            });
            cy.get("[data-cy=regex-check-icon]>svg").should("have.css", "color", "rgba(44, 44, 44, 0.1)");
            cy.get("[data-cy=length-check-icon]>svg").should("have.css", "color", "rgb(76, 175, 80)");
        });
        it("validation 테스트 / 입력했다가 지웠을 시", () => {
            cy.mount(<PasswordInput />);
            cy.get("[data-cy=type-input] > input").then($el => {
                cy.get($el[0]).type(wrongPassword).clear();
            });
            cy.get("[data-cy=regex-helper]").should("have.text", "영문, 숫자, 특수문자 모두 사용");
        });
        it("validation 테스트 / 정규식과 맞는 && 길이는 짧은 비밀번호 입력 시", () => {
            cy.mount(<PasswordInput />);
            cy.get("[data-cy=type-input] > input").then($el => {
                const valid = ACCOUNT_PWD_REGEX_CONTAIN.test(shortPassword);
                expect(valid).to.equal(true);
                cy.get($el[0]).type(shortPassword).should("have.value", shortPassword);
            });
            cy.get("[data-cy=regex-check-icon]>svg").should("have.css", "color", "rgb(76, 175, 80)");
            cy.get("[data-cy=length-check-icon]>svg").should("have.css", "color", "rgba(44, 44, 44, 0.1)");
        });
        it("validation 테스트 / 정규식과 다른 && 짧은 비밀번호 입력 시", () => {
            cy.mount(<PasswordInput />);
            cy.get("[data-cy=type-input] > input").then($el => {
                const valid = ACCOUNT_PWD_REGEX_CONTAIN.test(wrongAndShortPassword);
                expect(valid).to.equal(false);
                cy.get($el[0]).type(wrongAndShortPassword).should("have.value", wrongAndShortPassword);
            });
            cy.get("[data-cy=regex-check-icon]>svg").should("have.css", "color", "rgba(44, 44, 44, 0.1)");
            cy.get("[data-cy=length-check-icon]>svg").should("have.css", "color", "rgba(44, 44, 44, 0.1)");
        });
        it("validation 테스트 / 다시 입력란에 다른 비밀번호 입력 시", () => {
            cy.mount(<PasswordInput />);
            cy.get("[data-cy=type-input] > input").then($el => {
                cy.get($el[0]).type(randomPassword).should("have.value", randomPassword);
                cy.get($el[1]).type(wrongPassword).should("have.value", wrongPassword);
                cy.get($el[0]).should("have.attr", "aria-invalid", "true");
                cy.get($el[1]).should("have.attr", "aria-invalid", "true");
            });
            cy.get("[data-cy=password-helper]").should("have.text", "비밀번호가 맞지 않아요. 다시 입력해주세요.").should("have.css", "color", "rgb(100, 36, 235)");
        });
        it("validation 테스트 / 다시 입력란에 같은 비밀번호 입력 시", () => {
            cy.mount(<PasswordInput />);
            cy.get("[data-cy=type-input] > input").then($el => {
                cy.get($el[0]).type(randomPassword).should("have.value", randomPassword);
                cy.get($el[1]).type(randomPassword).should("have.value", randomPassword);
                cy.get($el[0]).should("have.attr", "aria-invalid", "false");
                cy.get($el[1]).should("have.attr", "aria-invalid", "false");
            });
            cy.get("[data-cy=password-helper]").should("have.text", "비밀번호가 일치합니다.").should("have.css", "color", "rgb(76, 175, 80)");
        });
        it("validation 테스트 / 다시 입력란에 먼저 입력 후 비밀번호 창에 같은 비밀번호 입력 시", () => {
            cy.mount(<PasswordInput />);
            cy.get("[data-cy=type-input] > input").then($el => {
                cy.get($el[1]).type(randomPassword).should("have.value", randomPassword);
                cy.get($el[0]).type(randomPassword).should("have.value", randomPassword);
                cy.get($el[0]).should("have.attr", "aria-invalid", "false");
                cy.get($el[1]).should("have.attr", "aria-invalid", "false");
            });
            cy.get("[data-cy=password-helper]").should("have.text", "비밀번호가 일치합니다.").should("have.css", "color", "rgb(76, 175, 80)");
        });
    });
});
