/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import RecruitingSkeleton from "../../../../src/components/skeleton/RecruitingSkeleton";
import { faker } from "@faker-js/faker";
import { css } from "@emotion/css";

const randomCss = {
    display: "flex",
    backgroundColor: faker.color.rgb({ format: "css" }),
    height: `${faker.datatype.number({ min: 100, max: 200 })}px`,
    justifyContent: faker.helpers.arrayElement(["center", "flex-start", "flex-end"]),
    alignItems: faker.helpers.arrayElement(["center", "flex-start", "flex-end"]),
    marginBottom: `${faker.datatype.number({ min: 4, max: 10 })}px`,
};

const randomSize = `${faker.datatype.number({ min: 20, max: 24 })}px`;

const randomMoneyIconCss = {
    width: randomSize,
    height: randomSize,
    fill: faker.color.rgb({ format: "css" }),
    margin: `${faker.datatype.number({ min: 4, max: 10 })}px`,
};

const randomTitleClass = css`
    display: flex;
    background-color: ${randomCss.backgroundColor};
    height: ${randomCss.height};
    justify-content: ${randomCss.justifyContent};
    align-items: ${randomCss.alignItems};
    margin-bottom: ${randomCss.marginBottom};
`;

const randomMoneyIconClass = css`
    width: ${randomSize};
    height: ${randomSize};
    fill: ${randomMoneyIconCss.fill};
    margin: ${randomMoneyIconCss.margin};
`;

describe("RecruitingSkeleton 컴포넌트 테스트", () => {
    context("visual 테스트", () => {
        it("props 테스트", () => {
            cy.mount(<RecruitingSkeleton certTypeAndDateStyle={randomTitleClass} moneyIconStyle={randomMoneyIconClass} />);
            cy.get("[data-cy=skeleton-title]")
                .should("have.css", "background-color", randomCss.backgroundColor)
                .and("have.css", "height", randomCss.height)
                .and("have.css", "justify-content", randomCss.justifyContent)
                .and("have.css", "align-items", randomCss.alignItems)
                .and("have.css", "margin-bottom", randomCss.marginBottom);
            cy.get("[data-cy=money-icon]")
                .should("have.css", "width", randomSize)
                .and("have.css", "height", randomSize)
                .and("have.css", "fill", randomMoneyIconCss.fill)
                .and("have.css", "margin", randomMoneyIconCss.margin);
        });
        it("컴포넌트 내 skeleton 갯수 확인", () => {
            cy.mount(<RecruitingSkeleton certTypeAndDateStyle={randomTitleClass} moneyIconStyle={randomMoneyIconClass} />);
            cy.get("[data-cy=skeleton]").then($el => {
                for (let i = 0; i < 9; i += 1) {
                    expect($el[i]).to.exist;
                }
            });
        });
    });
});
