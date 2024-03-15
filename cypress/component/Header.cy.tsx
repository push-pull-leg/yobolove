/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Header from "../../src/components/Header";
import { CreateRouter } from "../support/component";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { RecoilRoot } from "recoil";
import { breakpoints } from "../../src/styles/options";

const md: number = Number(breakpoints.values?.md);
/**
 * TODO pathname 별로 다르게 작업해야함 > e2e 테스트로 이동 필요
 */

describe("Header 컴포넌트 테스트", () => {
    context("렌더링 테스트", () => {
        it("pathname 별 테스트 / !router", () => {
            cy.viewport(1000, 750);
            cy.mount(<Header />);
            cy.get("[data-cy=empty-menu]").should("exist");
        });
        it("pathname 별 테스트 / '/' ", () => {
            cy.viewport(1000, 750);
            let router = CreateRouter();
            cy.mountWithoutRecoil(
                <RouterContext.Provider value={router}>
                    <RecoilRoot>
                        <Header />
                    </RecoilRoot>
                </RouterContext.Provider>,
            );
            cy.get("[data-cy=empty-menu]").should("not.exist");
            cy.get("[data-cy=caregiver-header]").should("exist");
        });
        it("pathname 별 테스트 / '/center' ", () => {
            cy.viewport(1000, 750);
            let router = CreateRouter();
            router.pathname = "/center";
            cy.mountWithoutRecoil(
                <RouterContext.Provider value={router}>
                    <RecoilRoot>
                        <Header />
                    </RecoilRoot>
                </RouterContext.Provider>,
            );
            cy.get("[data-cy=empty-menu]").should("not.exist");
            cy.get("[data-cy=center-header]").should("exist");
        });
    });
    context("햄버거 메뉴 관련 테스트", () => {
        it("md 이상일 때 햄버거 메뉴 없음", () => {
            cy.viewport(md, 750);
            cy.mount(<Header />);
            cy.get("[data-cy=hamburger-icon]").should("not.exist");
        });
        it("md 미만일 때 햄버거 메뉴 없음 / 동작 테스트", () => {
            cy.viewport(md - 1, 750);
            cy.mount(<Header />);
            cy.get("[data-cy=hamburger-icon]").should("exist").click();
            cy.get("[role=menu]").should("be.visible");
            cy.get(".MuiDrawer-root").click(500, 500);
            cy.get("[role=menu]").should("not.be.visible").and("have.css", "visibility", "hidden");
        });
    });
});
