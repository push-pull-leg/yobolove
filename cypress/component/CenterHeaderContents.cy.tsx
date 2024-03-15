/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { RecoilRoot } from "recoil";
import { CreateRouter } from "../support/component";
import { faker } from "@faker-js/faker";
import { css } from "@emotion/css";
import CenterHeaderContents from "../../src/components/CenterHeaderContents";

const randomCss = {
    backgroundColor: faker.color.rgb({ format: "css" }),
};

const randomClass = css`
    background-color: ${randomCss.backgroundColor};
`;

describe("CenterHeaderContents 컴포넌트 테스트", () => {
    context("로그인 여부에 따른 렌터링", () => {
        it("로그인하지 않음", () => {
            cy.viewport(1000, 750);
            let router = CreateRouter();
            router.pathname = "/center";
            cy.mountWithoutRecoil(
                <RouterContext.Provider value={router}>
                    <RecoilRoot>
                        <CenterHeaderContents menuStyle={randomClass} />
                    </RecoilRoot>
                </RouterContext.Provider>,
            );
            cy.get("[data-cy=header-wrapper]").should("have.css", "background-color", randomCss.backgroundColor);
            cy.get("[data-cy=conditional-link]").should("have.attr", "href", encodeURI("/기관/구인공고등록"));
            cy.get("[data-cy=main-link]").should("have.attr", "href", encodeURI("/기관"));
            cy.get("[data-cy=login]").should("have.attr", "href", encodeURI("/기관/로그인"));
            cy.get("[data-cy=login-button]").should("have.text", "로그인");
            cy.get("[data-cy=caregiver-link]").should("have.attr", "href", "/");
            cy.get("[data-cy=my-info-link]").should("not.exist");
        });
        it("로그인함 ", () => {
            cy.viewport(1000, 750);
            let router = CreateRouter();
            router.pathname = "/center";
            cy.mountWithCenterLogin(
                <RouterContext.Provider value={router}>
                    <CenterHeaderContents menuStyle={randomClass} />
                </RouterContext.Provider>,
            );
            cy.get("[data-cy=my-info-link]").should("have.attr", "href", encodeURI("/기관/계정정보"));
            cy.get("[data-cy=my-info-link]").should("have.text", "내정보");
            cy.get("[data-cy=caregiver-link]").should("have.attr", "href", "/");
            cy.get("[data-cy=my-info-link]").should("have.attr", "href", encodeURI("/기관/계정정보"));
            cy.get("[data-cy=login]").should("not.exist");
        });
    });
});
