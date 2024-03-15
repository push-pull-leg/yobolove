/// <reference types="cypress" />
import { breakpoints } from "../../src/styles/options";
import Dialog from "../../src/components/Dialog";
import { dialogRecoilState } from "../../src/recoil/DialogRecoil";
import { RecoilObserver } from "../support/component";

const sm: number = Number(breakpoints.values?.sm);
const md: number = Number(breakpoints.values?.md);

describe("Dialog 컴포넌트 테스트", () => {
    context("Props 테스트", () => {
        /*
         * props 테스트
         */
        it("모든 props 테스트", () => {
            const value = {
                open: true,
                title: "test title",
                content: "test content",
                caption: "test caption",
                confirmButtonText: "test confirm",
                hasCancelButton: true,
                callback: () => {
                    alert("test success");
                },
            };
            cy.mount(
                <RecoilObserver recoilState={dialogRecoilState} value={value}>
                    <Dialog />
                </RecoilObserver>,
            );
            cy.get("button#trigger").click();
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");
            cy.get("[role=dialog] .MuiDialogTitle-root").should("have.text", value.title).and("be.visible").and("be.inViewport");
            cy.get("[role=dialog] .MuiDialogContent-root").should("contain.text", value.content).and("be.visible").and("be.inViewport");
            cy.get("[role=dialog] .MuiTypography-caption").should("contain.text", value.caption).and("be.visible").and("be.inViewport");

            cy.get("[role=dialog] button[role=button]").should("contain.text", "test confirm").and("be.visible").and("be.inViewport");
            cy.get("[role=dialog] button[role=button]").should("contain.text", "취소").and("be.visible").and("be.inViewport");
        });

        it("optional props 테스트", () => {
            const value = {
                open: true,
                title: "test title",
                content: "text content",
                hasCancelButton: false,
                hasConfirmButton: false,
            };
            cy.mount(
                <RecoilObserver recoilState={dialogRecoilState} value={value}>
                    <Dialog />
                </RecoilObserver>,
            );
            cy.get("button#trigger").click();
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");
            cy.get("[role=dialog] .MuiTypography-caption").should("not.exist");
            cy.get("button[data-cy=confirm]").should("not.exist");
            cy.get("button[data-cy=cancel]").should("not.exist");
        });
    });

    context("동작 테스트", () => {
        beforeEach(() => {
            const value = {
                open: true,
                title: "test title",
                content: "text content",
                caption: "test caption",
                hasCancelButton: true,
                onConfirm: () => {
                    alert("onConfirm Test");
                },
                onCancel: () => {
                    alert("onCancel Test");
                },
                onClose: () => {
                    alert("onClose Test");
                },
            };
            cy.mount(
                <RecoilObserver recoilState={dialogRecoilState} value={value}>
                    <Dialog />
                </RecoilObserver>,
            );
        });

        it("확인 버튼 테스트", () => {
            cy.get("button#trigger").click();
            cy.get("[role=dialog] button[role=button]").contains("확인").click();
            cy.on("window:alert", text => {
                expect(text).to.contains("onConfirm Test");
            });
        });

        it("취소 버튼 테스트", () => {
            cy.get("button#trigger").click();
            cy.get("button[data-cy=cancel]").contains("취소").click();
            cy.get("[role=dialog]").should("not.exist");
            cy.on("window:alert", text => {
                expect(text).to.contains("onCancel Test");
            });
        });

        it("배경 Layer 클릭 테스트", () => {
            cy.get("button#trigger").click();
            cy.wait(500);
            cy.get(".MuiDrawer-root").click(10, 10);
            cy.get("[role=dialog]").should("not.exist");
            cy.on("window:alert", text => {
                expect(text).to.contains("onClose Test");
            });
        });
    });

    context("반응형 테스트", () => {
        beforeEach(() => {
            const value = {
                open: true,
                title: "test title",
                content: "text content",
                caption: "test caption",
                hasCancelButton: true,
                callback: () => {
                    alert("test success");
                },
            };
            cy.mount(
                <RecoilObserver recoilState={dialogRecoilState} value={value}>
                    <Dialog />
                </RecoilObserver>,
            );
        });
        it("PC(md)이상일 때, 최대 사이즈 / 가운데 정렬 테스트", () => {
            cy.get("button#trigger").click();
            cy.viewport(md, 750);
            cy.get("[role=dialog]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                expect(rect.width).to.equal(sm);
                const centerX = Math.round(rect.x + rect.width / 2);
                const centerY = Math.round($el[0].offsetTop + rect.height / 2);

                expect(centerX).to.equal(Math.round(window.innerWidth / 2));
                expect(centerY).to.equal(Math.round(window.innerHeight / 2) + 2);
            });
        });
        it("Mobile(sm)이하일 떄 하단 정렬 테스트", () => {
            cy.get("button#trigger").click();
            cy.viewport(sm, 750);
            cy.get("[role=dialog]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                expect(rect.width).to.equal(window.innerWidth);
                expect(Math.round($el[0].offsetTop + rect.height)).to.equal(window.innerHeight);
            });

            cy.viewport(220, 750);
            cy.get("[role=dialog]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                expect(rect.width).to.equal(window.innerWidth);
                expect(Math.round($el[0].offsetTop + rect.height)).to.equal(window.innerHeight);
            });

            cy.get("[role=dialog] button[role=button]").contains("취소").click();
        });
    });
});
