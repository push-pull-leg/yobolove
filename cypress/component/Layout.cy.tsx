/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Layout from "../../src/components/Layout";
import { RecoilRoot } from "recoil";
import { RouterContext } from "next/dist/shared/lib/router-context";

const createRouter = () => {
    return {
        pathname: "/",
        route: "/",
        query: {},
        asPath: "/",
        components: {},
        isFallback: false,
        basePath: "",
        events: { emit: cy.spy().as("emit"), off: cy.spy().as("off"), on: cy.spy().as("on") },
        push: cy.spy().as("push"),
        replace: cy.spy().as("replace"),
        reload: cy.spy().as("reload"),
        back: cy.spy().as("back"),
        prefetch: cy.stub().as("prefetch").resolves(),
        beforePopState: cy.spy().as("beforePopState"),
    };
};

describe("Layout 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("children 테스트", () => {
            const router = createRouter();
            const children = (
                <div data-cy="test-text" className="childrenTest">
                    test text
                </div>
            );
            cy.mountWithoutRecoil(
                <RouterContext.Provider value={router}>
                    <RecoilRoot>
                        <Layout children={children} />
                    </RecoilRoot>
                </RouterContext.Provider>,
            );
            /*
             * children 값이 존재할 때, 잘 보이는 지 확인
             */
            cy.get("[data-cy=test-text]").should("contain.text", "test text").and("be.visible").and("be.inViewport");
        });
    });
});
