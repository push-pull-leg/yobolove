/// <reference types="cypress" />
// @ts-nocheck
import Terms from "../../src/components/Terms";
import React from "react";
import { faker } from "@faker-js/faker";
import MockTerms from "../../src/mocks/faker/Terms";
import DateUtil from "../../src/util/DateUtil";

let termsAgreement = {
    agreedDate: DateUtil.toString(faker.date.past(), "YYYY.MM.DD"),
    terms: MockTerms(),
};

let userType = "CENTER";

const randomCss = {
    backgroundColor: faker.color.rgb({ format: "css" }),
    height: `${faker.datatype.number({ min: 100, max: 200 })}px`,
    my: faker.datatype.number({ min: 4, max: 10 }),
    py: faker.datatype.number({ min: 4, max: 10 }),
};

describe("Term 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("userType = Center / sx = undefined / agreeDate = O", () => {
            cy.mount(<Terms userType={userType} termsAgreement={termsAgreement} />);
            cy.get("[data-cy=terms-title]>h6").should("have.text", termsAgreement.terms.title);
            cy.get("[data-cy=terms-title]>span").should("have.text", `동의 ${termsAgreement.agreedDate}`);
            cy.get("div[tabindex=0]").should("have.attr", "href", `/center/terms/${termsAgreement.terms.uuid}`);
            cy.get(".MuiListItemSecondaryAction-root >p").should("have.text", "동의");
        });
        it("userType = CAREGIVER / sx = O / agreeDate = X", () => {
            termsAgreement.agreedDate = undefined;
            userType = "CAREGIVER";
            cy.mount(<Terms userType={userType} termsAgreement={termsAgreement} sx={randomCss} />);
            cy.get("[data-cy=terms-title]>span").should("have.text", "-");
            cy.get("div[tabindex=0]")
                .should("have.attr", "href", `/terms/${termsAgreement.terms.uuid}`)
                .and("have.css", "background-color", randomCss.backgroundColor)
                .and("have.css", "height", randomCss.height)
                .and("have.css", "margin-top", `${randomCss.my * 4}px`)
                .and("have.css", "margin-bottom", `${randomCss.my * 4}px`)
                .and("have.css", "padding-top", `${randomCss.py * 4}px`)
                .and("have.css", "padding-bottom", `${randomCss.py * 4}px`);
            cy.get(".MuiListItemSecondaryAction-root >p").should("have.text", "미동의");
        });
    });
});
