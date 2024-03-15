/// <reference types="cypress" />
// @ts-nocheck
import Loading from "../../../src/components/Loading";
import React from "react";
import { UseLoadingTest } from "../../support/component";

describe("UseLoading 훅 테스트", () => {
    context("openLoading 테스트 / closeLoading 테스트", () => {
        it("", () => {
            cy.mount(
                <UseLoadingTest>
                    <Loading />
                </UseLoadingTest>,
            );
            cy.get("[data-cy=open-button]").click();
            cy.get("[data-cy=loading-modal]").should("to.exist").and("be.visible");
            cy.get("[data-cy=close-button]").click();
            cy.get("[data-cy=loading-modal]").should("not.exist");
        });
    });
});
