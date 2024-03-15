/// <reference types="cypress" />
// @ts-nocheck
import { faker } from "@faker-js/faker";
import Alert from "../../../src/components/Alert";
import React from "react";
import { UseAlertTest } from "../../support/component";

const randomTitle = faker.datatype.string();
const randomText = faker.datatype.string(30);

describe("OpenAlert 훅 테스트", () => {
    context("openAlert 테스트 / props 테스트", () => {
        it("", () => {
            cy.mount(
                <UseAlertTest title={randomTitle} content={randomText} hasIcon={true}>
                    <Alert />
                </UseAlertTest>,
            );
            cy.get("[data-cy=open-button]").click();
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");
            cy.get("[role=dialog] svg").should("have.attr", "data-testid").and("eq", "CheckCircleOutlineIcon");
            cy.get("[role=dialog] .MuiDialogTitle-root").should("have.text", randomTitle);
            cy.get("[data-cy=alert-content]").should("have.text", randomText);
            cy.clock();
            cy.wait(2000);
            cy.get("[role=dialog]").should("not.exist");
        });
    });
    context("closeAlert 테스트 / props 테스트", () => {
        it("", () => {
            cy.mount(
                <UseAlertTest title={randomTitle} hasIcon={false}>
                    <Alert />
                </UseAlertTest>,
            );
            cy.get("[data-cy=open-button]").click();
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");
            cy.get("[role=dialog] svg").should("not.exist");
            cy.get("[data-cy=alert-content]").should("not.exist");
            cy.get("[data-cy=close-button]").click();
            cy.get("[role=dialog]").should("not.exist");
        });
    });
});
