/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Address from "../../../src/components/form/Address";
import { faker } from "@faker-js/faker";
import AddressType from "../../../src/type/AddressType";

faker.locale = "ko";

describe("form-address 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("placeholder 값 / name 값 / id 값 / required 가 동일한 지 확인 / helper message 확인 / auto focus 확인", () => {
            cy.makeProps().then(props => {
                const { name, placeholder, title, helperText } = props;
                cy.mount(<Address title={title} name={name} placeholder={placeholder} required helperText={helperText} />);
                cy.checkProps("[role=textbox] > input", "address", name, placeholder, true);
                cy.get("[role=textbox] > input").should("not.have.value");
                cy.get("[role=note]").should("have.text", helperText);
            });
        });
    });

    context("optional props 테스트", () => {
        beforeEach(() => {
            cy.mount(<Address title="test title" labelStyle="input" name="test-name" placeholder="test placeholder" />);
        });

        it("required 값이 없을 때, attr 확인, label style 이 input 일 경우, legend 와 타이틀이 같은 지 확인", () => {
            cy.get("[role=textbox] > input").should("not.have.attr", "required");
            cy.get("fieldset[aria-hidden=true] > legend>span").should("have.text", "test title");
        });
    });

    let testValue: AddressType | undefined = undefined;
    context("동작 테스트", () => {
        testValue = {
            basicTitle: faker.address.secondaryAddress(),
            detailTitle: faker.address.streetAddress(true),
            roadnameCode: faker.random.numeric(7),
            bcode: faker.random.numeric(10),
        };
        it("value 테스트 ", () => {
            cy.mount(<Address title="test title" defaultValue={testValue} name="test-name" placeholder="test placeholder" required />);
            cy.get("[role=textbox] > textarea")
                .invoke("val")
                .then(value => {
                    expect(value).to.equal(`${testValue.detailTitle}`);
                });
        });

        it("input 클릭 시 swiper open 되는 지 확인", () => {
            cy.mount(<Address title="test title" defaultValue={testValue} name="test-name" placeholder="test placeholder" required />);
            cy.get("#address-test-name").click();
            cy.get("[role=dialog], .MuiDrawer-root ").should("be.inViewport").and("be.visible");
        });

        it("value 값이 있을 때 reset 버튼 작동 확인 / onChange 확인", () => {
            cy.mount(
                <Address
                    title="test title"
                    defaultValue={testValue}
                    onChange={(name, value) => alert(`${name} ${value}`)}
                    name="test-name"
                    placeholder="test placeholder"
                    required
                />,
            );
            cy.get("[data-cy=reset]").click();
            cy.get("[role=textbox] > textarea").should("not.exist");
            cy.get("#address-test-name").should("have.not.value");
            cy.on("window:alert", text => {
                expect(text).to.equal(`test-name undefined`);
            });
        });

        it("onchange 테스트", () => {
            // iframe control은 component test에서 불가능. e2e테스트로 대체, reset 버튼에서만 테스트
        });

        it("validate 테스트, value 값이 있을 때", () => {
            cy.mount(<Address title="test title" defaultValue={testValue} name="test-name" placeholder="test placeholder" required />);
            cy.get("[role=textbox] > textarea")
                .invoke("attr", "aria-invalid")
                .then(isValid => {
                    expect(isValid).to.equal("false");
                });
        });
        it("validate 테스트, value 값이 없을 때", () => {
            testValue = null;
            cy.mount(<Address title="test title" defaultValue={testValue} name="test-name" placeholder="test placeholder" required />);
            cy.get("[role=textbox] > input")
                .invoke("attr", "aria-invalid")
                .then(isValid => {
                    expect(isValid).to.equal("true");
                });
        });
    });
});
