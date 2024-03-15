/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import CenterRecruitingSkeleton from "../../../src/components/skeleton/CenterRecruitingSkeleton";

describe("CenterRecruitingSkeleton 컴포넌트 테스트", () => {
    context("visual 테스트", () => {
        it("컴포넌트 내 skeleton 갯수 확인", () => {
            cy.mount(<CenterRecruitingSkeleton />);
            cy.get("[data-cy=skeleton]").then($el => {
                for (let i = 0; i < 10; i += 1) {
                    expect($el[i]).to.exist;
                }
            });
        });
    });
});
