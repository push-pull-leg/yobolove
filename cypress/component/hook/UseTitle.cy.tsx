/// <reference types="cypress" />
// @ts-nocheck
import { UseTitleTest } from "../../support/component";
import { faker } from "@faker-js/faker";

const randomTitle = {
    headerTitle: faker.datatype.string(10),
    mainTitle: faker.datatype.string(10),
};

describe("UseTitle hook test", () => {
    context("실행", () => {
        it("return", () => {
            cy.mount(<UseTitleTest mainTitle={randomTitle.mainTitle} headerTitle={randomTitle.headerTitle} />);
            cy.get("h1[data-cy=main-title]").should("have.text", randomTitle.mainTitle);
            cy.get("h3[data-cy=header-title]").should("have.text", randomTitle.headerTitle);
        });
    });
});
