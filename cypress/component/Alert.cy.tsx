/// <reference types="cypress" />
import { RecoilObserver } from "../support/component";
import { alertRecoilState } from "../../src/recoil/AlertRecoil";
import Alert from "../../src/components/Alert";

describe("Alert 컴포넌트 테스트", () => {
    context("Props 테스트", () => {
        /*
         * props 테스트
         */
        it("모든 props 테스트", () => {
            const value = {
                open: true,
                title: "test title",
                content: "text content",
                hasIcon: true,
                callback: () => {
                    alert("test success");
                },
            };
            cy.mount(
                <RecoilObserver recoilState={alertRecoilState} value={value}>
                    <Alert />
                </RecoilObserver>,
            );
            cy.get("button#trigger").click();
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");
            cy.get("[role=dialog] svg").should("have.attr", "data-testid").and("eq", "CheckCircleOutlineIcon");
            cy.get("[role=dialog] .MuiDialogTitle-root").should("have.text", value.title).and("be.visible").and("be.inViewport");
            cy.get("[role=dialog] .MuiDialogContent-root").should("contain.text", value.content).and("be.visible").and("be.inViewport");

            cy.get("[role=dialog]").click();
        });

        it("optional props 테스트", () => {
            const value = {
                open: true,
                title: "test title",
                hasIcon: false,
            };
            cy.mount(
                <RecoilObserver recoilState={alertRecoilState} value={value}>
                    <Alert />
                </RecoilObserver>,
            );
            cy.get("button#trigger").click();
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");
            cy.get("[role=dialog] svg").should("not.exist");
            cy.get("[role=dialog] .MuiDialogTitle-root").should("have.text", value.title).and("be.visible").and("be.inViewport");
            cy.get("[role=dialog] .MuiDialogContent-root").should("not.exist");
            cy.get("[role=dialog]").click();
        });
    });

    context("동작 테스트", () => {
        beforeEach(() => {
            const value = {
                open: true,
                title: "test title",
                content: "text content",
                hasIcon: true,
                callback: () => {
                    alert("test success");
                },
            };
            cy.mount(
                <RecoilObserver recoilState={alertRecoilState} value={value}>
                    <Alert />
                </RecoilObserver>,
            );
        });

        it("라이트박스 클릭시 닫힘 테스트", () => {
            cy.get("button#trigger").click();
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");
            cy.wait(500);
            cy.get(".MuiDialog-container").click(10, 10);
            cy.wait(500);
            cy.get("[role=dialog]").should("not.exist");
        });

        it("1200ms 후에 자동 닫힘 테스트", () => {
            cy.get("button#trigger").click();
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");
            cy.clock();
            cy.wait(2000);
            cy.get("[role=dialog]").should("not.exist");
        });
    });
});
