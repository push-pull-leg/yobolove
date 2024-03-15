/// <reference types="cypress" />
// @ts-nocheck
import { breakpoints } from "../../src/styles/options";
import SimpleSwiper from "../../src/components/SimpleSwiper";
import React, { useState } from "react";
import { faker } from "@faker-js/faker";

const sm: number = Number(breakpoints.values?.sm);
const md: number = Number(breakpoints.values?.md);

const contentTest = faker.datatype.string(12);
const buttonText = faker.datatype.string(10);

describe("SimpleSwiper 컴포넌트 테스트", () => {
    context("Props 테스트", () => {
        it("모든 props 테스트", () => {
            const titleTest = faker.datatype.string(8);
            const contentTest = faker.datatype.string(12);
            cy.mount(<SimpleSwiper open={true} title={titleTest} hasCancelButton={true} children={contentTest} />);

            /*
             * open 값이 true 일 때, 컴포넌트가 뷰포트에 보이는지 확인
             */
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");

            /*
             * title 이 title 과 동일한 지 확인
             */
            cy.get("[role=heading]").should("contain.text", titleTest).and("be.visible").and("be.inViewport");

            /*
             * children 이 children 과 동일한 지 확인
             */
            cy.get("[role=article]").should("contain.text", contentTest).and("be.visible").and("be.inViewport");
            /*
             * hasCancelButton 이 true 일 때, 취소버튼이 있는 지 확인 / callback 함수가 존재할 때, 확인버튼이 있는 지 확인
             */
            cy.get("[role=button]").should("contain.text", "취소").and("be.visible").and("be.inViewport");
            cy.get("[role=button]").should("contain.text", "확인").and("be.visible").and("be.inViewport");
        });

        it("Optional props 테스트", () => {
            let buttonTest = false;
            cy.mount(<SimpleSwiper open={true} children={contentTest} hasCancelButton={buttonTest} onConfirm={!buttonTest} bottomSubButtonText={buttonText} />);

            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");
            cy.get("[data-cy=sub-button]").should("be.visible").and("be.inViewport");
            /*
             * title 이 undefined 일 때, 존재하는 지 확인
             */
            cy.get("[role=heading]").should("not.exist");

            /*
             * hasCancelButton 이 false 일 때, 취소버튼이 있는 지 확인 / callback 함수가 false 일 때, 확인버튼이 있는 지 확인
             */
            if (buttonTest) {
                cy.get("[role=button]").contains("확인").should("not.exist");
            } else {
                cy.get("[role=button]").contains("취소").should("not.exist");
            }
        });
        it("Optional props 테스트 2", () => {
            let randomButtonDom = <button data-cy="cancel-button">{contentTest}</button>;
            cy.mount(<SimpleSwiper open={true} hasCancelButton={true} cancelButton={randomButtonDom} />);
            cy.get("[data-cy=cancel-button]").contains(contentTest);
        });
    });

    context("동작 테스트", () => {
        beforeEach(() => {
            const titleTest = faker.datatype.string(8);
            const contentTest = faker.datatype.string(12);
            const TestComponent = function () {
                const [swiperState, setSwiperState] = useState(true);
                const onClose = function () {
                    setSwiperState(false);
                    alert("창 닫힘");
                };
                const onCancel = function () {
                    setSwiperState(false);
                    alert("취소버튼");
                };
                const onConfirm = function () {
                    setSwiperState(false);
                    alert("확인버튼");
                };
                const onClickBottomSubButton = function () {
                    alert("다시보지않기");
                };
                return (
                    <SimpleSwiper
                        open={swiperState}
                        title={titleTest}
                        hasCancelButton={true}
                        children={contentTest}
                        onClose={onClose}
                        hasCloseButton={true}
                        backDropClickClose={onClose}
                        onConfirm={onConfirm}
                        onCancel={onCancel}
                        bottomSubButtonText={buttonText}
                        onClickBottomSubButton={onClickBottomSubButton}
                    />
                );
            };
            cy.mount(<TestComponent />);
        });

        it("취소 버튼 테스트", () => {
            cy.get("[role=dialog] button[role=button]").contains("취소").click();
            cy.get("[role=dialog]").should("not.exist");
            cy.on("window:alert", text => {
                expect(text).to.equal("취소버튼");
            });
        });

        it("확인 버튼 테스트", () => {
            cy.get("[role=dialog] button[role=button]").contains("확인").click();
            cy.get("[role=dialog]").should("not.exist");
            cy.on("window:alert", text => {
                expect(text).to.equal("확인버튼");
            });
        });

        it("닫기 버튼 테스트", () => {
            cy.get("[data-cy=close]").click();
            cy.get("[role=dialog]").should("not.exist");
            cy.on("window:alert", text => {
                expect(text).to.equal("창 닫힘");
            });
        });

        it("서브 버튼 테스트", () => {
            cy.get("[data-cy=sub-button]").click();
            cy.on("window:alert", text => {
                expect(text).to.equal("다시보지않기");
            });
        });
        it("빈 공간 클릭 테스트", () => {
            cy.get(".MuiDrawer-root").click(10, 10);
            cy.get("[role=dialog]").should("not.exist");
            cy.on("window:alert", text => {
                expect(text).to.equal("창 닫힘");
            });
        });
    });

    context("반응형 테스트", () => {
        beforeEach(() => {
            const titleTest = faker.datatype.string(8);
            const contentTest = faker.datatype.string(12);
            cy.mount(<SimpleSwiper open={true} title={titleTest} hasCancelButton={true} children={contentTest} />);
        });

        it("PC(md 이상)일 때, 최대 사이즈 / 가운데 정렬 테스트", () => {
            cy.viewport(md, 750);
            cy.get("[role=dialog]").then($el => {
                cy.checkAlignment($el[0], true, true, sm);
            });
        });

        it("Mobile(sm 이하)일 떄 하단 정렬 테스트", () => {
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
        });
    });
});
