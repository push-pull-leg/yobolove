/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Label from "../../../src/components/form/Label";

let required = true;
let labelStyle = "form";

describe("form-label 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        const TestComponent = function () {
            return <Label labelStyle={labelStyle} title="test-title" id="test-name" required={required} />;
        };

        it("labelStyle 이 form 일 때 props test", () => {
            cy.mount(<TestComponent />);
            cy.get("[data-cy=input-label]").should("have.text", "test-title").and("be.visible");
            cy.get("[for=test-name]").should("to.exist").and("contain.text", "test-title");
            cy.get("[aria-hidden=ture], .MuiFormLabel-asterisk").should("have.text", " *").and("be.visible");
        });

        it("labelStyle 이 input 일 때 props test", () => {
            labelStyle = "input";
            cy.mount(<TestComponent />);
            cy.get("[for=test-name], [data-shrink=true]").should("have.text", "test-title").and("be.visible");
        });

        it("title 이 없을 때 props test", () => {
            labelStyle = "input";
            cy.mount(<Label labelStyle={labelStyle} id="test-name" required={required} />);
            cy.get("[data-cy=label]").should("not.exist");
        });

        it("required false 일 때 props test", () => {
            required = false;
            cy.mount(<TestComponent />);
            cy.get("[data-shrink=true] > .MuiFormLabel-asterisk").should("not.exist");
            labelStyle = "form";

            cy.mount(<TestComponent />);
            cy.get("[aria-hidden=true], .MuiFormLabel-asterisk").should("not.exist");
        });
    });
});
