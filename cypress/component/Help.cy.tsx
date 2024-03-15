/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import { faker } from "@faker-js/faker";
import Help from "../../src/components/Help";

faker.locale = "ko";

describe("Help 컴포넌트 테스트", () => {
    context("동작 / css 테스트", () => {
        it("동작 / css 테스트 ", () => {
            cy.mount(<Help />);
            /**
             * 위치, 클릭 동작 테스트
             */
            cy.get("[aria-label=help]")
                .then($el => {
                    const rect = $el[0].getBoundingClientRect();
                    expect(window.innerHeight - rect.height - rect.top).to.eq(20);
                    expect(window.innerWidth - rect.left - rect.width).to.eq(20);
                })
                .click();
            /**
             * dialog 위치, 클릭 동작 테스트
             */
            cy.get("[role=presentation]").should("be.visible").should("be.inViewport");
            cy.get("[role=dialog]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                expect(window.innerHeight - rect.height - rect.top).to.eq(20);
                expect(window.innerWidth - rect.left - rect.width).to.eq(20);
                cy.get(".MuiDialog-root").click(10, 10);
                cy.get("[role=presentation]").should("not.exist");
            });
            /**
             * 카카오톡 링크 동작 테스트
             */
            cy.get("[aria-label=help]").click();
            cy.get("[data-cy=link-kakao]").invoke("removeAttr", "target").click();
            cy.location().should(loc => {
                expect(loc.toString()).to.eq("https://accounts.kakao.com/login/?continue=http%3A%2F%2Fpf.kakao.com%2F_WikWK%2Fchat#login");
            });
        });
    });
});
