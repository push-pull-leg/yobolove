/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import ListSkeleton from "../../../src/components/skeleton/ListSkeleton";

describe("ListSkeleton 컴포넌트 테스트", () => {
    context("visual 테스트", () => {
        it("컴포넌트 내 skeleton 갯수 확인", () => {
            cy.mount(<ListSkeleton />);
            cy.get("[data-cy=skeleton]").then($el => {
                for (let i = 0; i < 3; i += 1) {
                    expect($el[i]).to.exist;
                }
            });
        });
    });
});
