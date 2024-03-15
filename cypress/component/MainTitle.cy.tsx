/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import MainTitle from "../../src/components/MainTitle";
import { TitleRecoilState } from "../support/component";
import { faker } from "@faker-js/faker";

const randomTitle = {
    headerTitle: faker.datatype.string(10),
    mainTitle: faker.datatype.string(10),
};

describe("MainTitle 컴포넌트 테스트", () => {
    context("", () => {
        it("텍스트 props 테스트", () => {
            cy.mount(
                <>
                    <TitleRecoilState mainTitle={randomTitle.mainTitle} headerTitle={randomTitle.headerTitle}>
                        <MainTitle />
                    </TitleRecoilState>
                </>,
            );
            cy.get("[data-cy=main-title]").should("have.text", randomTitle.mainTitle);
        });
        it("텍스트 props 테스트", () => {
            randomTitle.mainTitle = undefined;
            cy.mount(
                <>
                    <TitleRecoilState mainTitle={randomTitle.mainTitle} headerTitle={randomTitle.headerTitle}>
                        <MainTitle />
                    </TitleRecoilState>
                </>,
            );
            cy.get("[data-cy=mainTitle-title]").should("not.exist");
        });
    });
});
