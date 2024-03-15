/// <reference types="cypress" />
// @ts-nocheck
import Spacer from "../../src/components/Spacer";
import React from "react";
import { faker } from "@faker-js/faker";

const randomCss = {
    backgroundColor: faker.color.rgb({ format: "css" }),
    height: `${faker.datatype.number({ min: 100, max: 200 })}px`,
    my: faker.datatype.number({ min: 4, max: 10 }),
    py: faker.datatype.number({ min: 4, max: 10 }),
};

describe("Spacer 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("default", () => {
            cy.mount(<Spacer />);
            cy.get("[data-cy=spacer]").should("have.css", "margin-top", "0px");
        });
        it("random css", () => {
            cy.mount(<Spacer sx={randomCss} />);
            cy.get("[data-cy=spacer]")
                .should("have.css", "background-color", randomCss.backgroundColor)
                .and("have.css", "height", randomCss.height)
                .and("have.css", "margin-top", `${randomCss.my * 4}px`)
                .and("have.css", "margin-bottom", `${randomCss.my * 4}px`)
                .and("have.css", "padding-top", `${randomCss.py * 4}px`)
                .and("have.css", "padding-bottom", `${randomCss.py * 4}px`);
        });
    });
});
