/// <reference types="cypress" />
// @ts-nocheck
import Recruitings from "../../src/components/Recruitings";
import React from "react";
import { breakpoints } from "../../src/styles/options";
import recruiting from "../../src/mocks/faker/Recruiting";

let testData = [...Array(6)].map(() => {
    return recruiting();
});
const sm: number = Number(breakpoints.values?.sm);

function mouseDrag(target, x1, y1, x2, y2) {
    cy.get(target).trigger("mousedown", x1, y1).trigger("mousemove", x2, y2).trigger("mouseup");
}

describe("Index 컴포넌트 테스트", () => {
    context("Props 테스트 / variant = simple", () => {
        beforeEach("Props 테스트 / variant = normal / PC", () => {
            cy.viewport(1200, 750);
            cy.mount(<Recruitings recruitings={testData} variant="simple" />);
        });

        it("카드의 갯수가 6개가 맞는 지 확인", () => {
            cy.get("[role=presentation]").then($el => {
                expect($el.length).to.equal(6);
            });
        });

        it("리스트의 최대 넓이가 1024인지, 뷰포트 가운데 있는 지 확인", () => {
            cy.get("[role=listbox]").then($el => {
                cy.checkAlignment($el[0], undefined, true, 1024);
            });
        });
    });

    context("Props 테스트 / variant = simple", () => {
        beforeEach("Props 테스트 / variant = simple / MO", () => {
            cy.viewport(sm, 750);
            cy.mount(<Recruitings recruitings={testData} variant="simple" />);
        });

        it("66.67%이상 슬라이드 시 넘어가는 지 확인", () => {
            cy.get("li.slide").then($el => {
                const rect = $el[0].getBoundingClientRect();
                const move = rect.width * 0.67;
                const click = innerWidth * 0.8;
                const drag = click - move;

                mouseDrag(".carousel-root", click, 30, drag, 30);
                cy.get($el[0]).should("not.be.inViewport");
            });
        });

        it("리스트가 1행으로 이루어졌는 지 확인", () => {
            cy.get("li.slide").then($el => {
                const rect = $el[0].getBoundingClientRect();
                const listHeight = document.getElementsByClassName("carousel-root")[0].clientHeight;
                expect(listHeight).to.equal(Math.round(rect.height));
            });
        });

        it("뷰포트가 440~768일 때, 리스트의 좌우 패딩이 24인지 확인", () => {
            cy.get(".slider-wrapper>.slider").should("have.css", "padding", "0px 24px");
        });
    });

    context("Props 테스트 / variant = simple", () => {
        beforeEach("Props 테스트 / variant = simple / MO", () => {
            cy.viewport(430, 750);
            cy.mount(<Recruitings recruitings={testData} variant="simple" />);
        });
        it("뷰포트가 439이하일 때, 리스트의 좌우 패딩이 16인지 확인", () => {
            cy.get(".slider-wrapper>.slider").should("have.css", "padding", "0px 16px");
        });
    });

    context("Props 테스트 / variant = normal", () => {
        beforeEach("Props 테스트 / variant = normal / PC", () => {
            cy.viewport(1200, 750);
            cy.mount(<Recruitings recruitings={testData} />);
        });
        it("뷰포트가 768이상일 때, 리스트가 2열인지 확인 / 중앙인지 확인", () => {
            cy.get("[role=presentation]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                const listWidth = document.querySelectorAll('[role="listbox"]')[0].clientWidth;
                document.querySelectorAll('[role="listbox"]')[0].style.columnGap = 8;
                expect(listWidth).to.equal(rect.width * 2 + 8);
            });
            cy.get("[role=listbox]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                const centerX = Math.round(rect.x + rect.width / 2);
                expect(centerX).to.equal(Math.round(window.innerWidth / 2));
            });
        });
    });

    context("Props 테스트 / variant = normal", () => {
        beforeEach("Props 테스트 / variant = normal / MO", () => {
            cy.viewport(sm, 650);
            cy.mount(<Recruitings recruitings={testData} />);
        });
        it("뷰포트가 440~767일 때, 리스트가 1열인지 확인 / 콘텐츠의 width가 100%인지 확인", () => {
            cy.get("[role=presentation]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                const listWidth = document.querySelectorAll('[role="listbox"]')[0].clientWidth;
                expect(listWidth).to.equal(rect.width);
            });
        });
    });

    context("Props 테스트 / variant = normal", () => {
        beforeEach("Props 테스트 / variant = normal / MO", () => {
            cy.viewport(sm - 1, 750);
            cy.mount(<Recruitings recruitings={testData} />);
        });
        it("뷰포트가 439 이하일 때, 리스트가 1열인지 확인 / 콘텐츠의 width가 100%인지 확인", () => {
            cy.get("[role=presentation]").then($el => {
                const rect = $el[0].getBoundingClientRect();
                const listWidth = document.querySelectorAll('[role="listbox"]')[0].clientWidth;
                expect(listWidth).to.equal(rect.width);
            });
        });
    });
});
