/// <reference types="cypress" />
// @ts-nocheck
import { breakpoints } from "../../src/styles/options";
import LongSwiper from "../../src/components/LongSwiper";
import React, { useState } from "react";
import { faker } from "@faker-js/faker";

const sm: number = Number(breakpoints.values?.sm);
const md: number = Number(breakpoints.values?.md);

describe("SimpleSwiper 컴포넌트 테스트", () => {
    context("Props 테스트", () => {
        it("모든 props 테스트", () => {
            const titleTest = faker.datatype.string(8);
            const contentTest = faker.datatype.string(12);
            const padding = 5;
            const remPadding = `0px ${padding * 4}px ${padding * 4}px`;
            cy.mount(<LongSwiper open={true} title={titleTest} children={contentTest} onClose={() => alert("창 닫힘")} padding={padding} isRounded={true} />);

            /*
             * open 값이 true 일 때, 컴포넌트가 뷰포트에 보이는지 확인
             */
            cy.get("[role=dialog]").should("be.visible").and("be.inViewport");

            /*
             * title 이 존재할 때 DialogTitle 이 존재하는 지, title 과 동일한 지 확인
             */
            cy.get("h2.MuiTypography-root").should("be.visible").and("be.inViewport");
            cy.get("[role=heading]").should("contain.text", titleTest).and("be.visible").and("be.inViewport");

            /*
             * children 이 존재할 때 DialogContent 가 존재하는 지, children 과 동일한 지 확인
             * padding 이 존재할 때 DialogContent 의 padding 과 동일한 지 확인
             */
            cy.get("[role=article]").should("contain.text", contentTest).and("be.visible");
            cy.get("[role=article]").should("have.css", "padding", remPadding);

            /*
             * isRounded 가 true 일 때, css 적용이 되었는 지 확인
             */
            cy.get("[role=dialog] .MuiPaper-elevation0").should("have.css", "border-radius", "12px 12px 0px 0px");
        });
        it("Optional props 테스트1", () => {
            cy.mount(<LongSwiper open={true} onClose={() => alert("창 닫힘")} />);

            /*
             * title 이 undefined 일 때, 존재하는 지 확인
             */
            cy.get("[role=heading]").should("not.exist");

            /*
             * children 이 undefined 일 때, 존재하는 지 확인
             */
            cy.get("[role=article]").should("not.exist");

            /*
             * isRound 가 undefined 일 때, css 적용이 되었는 지 확인
             */
            cy.get("[role=dialog] .MuiPaper-elevation0").should("have.css", "border-radius", "0px");

            /*
             * action 값이 존재할 때, DialogActions 가 존재하는 지 확인
             */
            cy.get(".MuiDialogActions-root").should("not.exist");
        });
        it("Optional props 테스트2", () => {
            const contentTest = faker.datatype.string(12);
            cy.mount(<LongSwiper open={true} onClose={() => alert("창 닫힘")} children={contentTest} />);

            /*
             * children 이 존재하고, padding 이 undefined 일 때, DialogContent 의 패딩 확인
             */
            cy.get("[role=article]").should("have.css", "padding", "0px");
        });
    });

    context("동작 테스트", () => {
        beforeEach(() => {
            const callback = function () {
                alert("test success");
            };
            const titleTest = faker.datatype.string(8);
            const contentTest = faker.datatype.string(12);
            const TestComponent = function () {
                const [swiperState, setSwiperState] = useState(true);
                const onClose = function () {
                    setSwiperState(false);
                    alert("창 닫힘");
                };
                return <LongSwiper open={swiperState} title={titleTest} children={contentTest} onClose={onClose} onBackdropClick={onClose} callback={callback} />;
            };
            cy.mount(<TestComponent />);
        });

        it("취소 버튼 테스트", () => {
            cy.viewport(md, 750);
            cy.get("[role=dialog] button[role=button]").click();
            cy.on("window:alert", text => {
                expect(text).to.contains("창 닫힘");
            });
            cy.get("[role=dialog]").should("not.exist");
        });

        it("pc일 때, 배경 Layer 클릭 테스트", () => {
            cy.viewport(md, 750);
            cy.get("[role=dialog]").click(10, 10);
            cy.get("[role=dialog]").should("not.exist");
        });
    });
    context("반응형 테스트", () => {
        beforeEach(() => {
            const callback = function () {
                alert("test success");
            };
            const onClose = function () {
                swiperState.open = false;
                alert("창 닫힘");
            };
            const titleTest = faker.datatype.string(8);
            const contentTest = faker.datatype.string(12);
            cy.mount(<LongSwiper open={true} title={titleTest} children={contentTest} onClose={onClose} onBackdropClick={onClose} callback={callback} />);
        });

        it("PC(md 이상)일 때, 최대 사이즈 / 가운데 정렬 테스트", () => {
            cy.viewport(md, 750);
            cy.get("[role=dialog] .MuiPaper-elevation0").then($el => {
                const maxHeight = window.innerHeight * 0.8 - 64;
                cy.checkAlignment($el[0], true, false, undefined, true, maxHeight);
                cy.get("[role=dialog] .MuiPaper-elevation0").should("have.css", "max-height", `${maxHeight}px`);
            });
        });

        it("Mobile(sm 이하)일 떄 화면 100% 테스트", () => {
            cy.viewport(sm, 750);
            cy.get("[role=dialog]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                expect(rect.width).to.equal(window.innerWidth);
                expect(rect.height).to.equal(window.innerHeight);
            });

            cy.viewport(220, 750);
            cy.get("[role=dialog]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                expect(rect.width).to.equal(window.innerWidth);
                expect(rect.height).to.equal(window.innerHeight);
            });
        });
    });
});
