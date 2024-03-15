/// <reference types="cypress" />
// @ts-nocheck
import Footer from "../../src/components/Footer";
import React from "react";
import Popup from "../../src/components/Popup";
import { CreateRouter } from "../support/component";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { RecoilRoot } from "recoil";

describe("Footer 컴포넌트 테스트", () => {
    context("구직자 전용 페이지일 경우", () => {
        it("버튼 테스트", () => {
            let router = CreateRouter();
            router.pathname = "/";
            cy.mountWithoutRecoil(
                <RouterContext.Provider value={router}>
                    <RecoilRoot>
                        <Popup />
                        <Footer />
                    </RecoilRoot>
                </RouterContext.Provider>,
            );
            cy.get("[role=button]").contains("개인정보처리방침").click();
            cy.get("[role=dialog] .MuiPaper-elevation").should("be.visible");
            cy.get(".MuiDialogContent-root > iframe").its("0.contentDocument.body").should("contain.text", "개인정보처리방침(구직자)_221012");
            cy.get("[data-cy=close]").click();
            cy.get("[role=button]").contains("서비스이용약관").click();
            cy.get("[role=dialog] .MuiPaper-elevation").should("be.visible");
            cy.get(".MuiDialogContent-root > iframe").its("0.contentDocument.body").should("contain.text", "(필수)이용약관(구직자)");
        });
    });
    context("기관 전용 페이지일 경우", () => {
        it("버튼 테스트", () => {
            let router = CreateRouter();
            router.pathname = "/center";
            cy.mountWithoutRecoil(
                <RouterContext.Provider value={router}>
                    <RecoilRoot>
                        <Popup />
                        <Footer />
                    </RecoilRoot>
                </RouterContext.Provider>,
            );
            cy.get("[role=button]").contains("개인정보처리방침").click();
            cy.get("[role=dialog] .MuiPaper-elevation").should("be.visible");
            cy.get(".MuiDialogContent-root > iframe").its("0.contentDocument.body").should("contain.text", "개인정보처리방침(기관)_221012");
            cy.get("[data-cy=close]").click();
            cy.get("[role=button]").contains("서비스이용약관").click();
            cy.get("[role=dialog] .MuiPaper-elevation").should("be.visible");
            cy.get(".MuiDialogContent-root > iframe").its("0.contentDocument.body").should("contain.text", "(필수)이용약관(기관)");
        });
    });
});
