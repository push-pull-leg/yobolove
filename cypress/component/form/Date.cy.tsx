/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Date from "../../../src/components/form/Date";
import DateUtil from "../../../src/util/DateUtil";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.locale("ko");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs().tz("Asia/Seoul");
faker.locale = "ko";
const testDate = {
    year: faker.datatype.number({ min: 2015, max: 2030 }),
    month: faker.datatype.number({ min: 1, max: 12 }),
    day: faker.datatype.number({ min: 1, max: 28 }),
};

function changeDateAction(testDate) {
    const now = DateUtil.toDate();
    const getYear = now.getFullYear();
    const getMonth = now.getMonth() + 1;
    const getDay = now.getDate();

    const yearDiff = getYear - testDate.year;
    const monthDiff = getMonth - testDate.month;
    const dayDiff = getDay - testDate.day;

    for (let i = 0; i < Math.abs(yearDiff); i++) {
        if (yearDiff < 0) {
            cy.get("div.mbsc-selected").then($el => {
                $el[0].nextSibling.click();
                cy.wait(100);
            });
        } else {
            cy.get("div.mbsc-selected").then($el => {
                $el[0].previousSibling.click();
                cy.wait(100);
            });
        }
    }

    for (let i = 0; i < Math.abs(monthDiff); i++) {
        if (monthDiff < 0) {
            cy.get("div.mbsc-selected").then($el => {
                $el[1].nextSibling.click();
                cy.wait(100);
            });
        } else {
            cy.get("div.mbsc-selected").then($el => {
                $el[1].previousSibling.click();
                cy.wait(100);
            });
        }
    }

    for (let i = 0; i < Math.abs(dayDiff); i++) {
        if (dayDiff < 0) {
            cy.get("div.mbsc-selected").then($el => {
                $el[2].nextSibling.click();
            });
        } else {
            cy.get("div.mbsc-selected").then($el => {
                $el[2].previousSibling.click();
            });
        }
    }

    return cy.get("div.mbsc-selected").then($el => {
        expect($el[0].innerText).to.equal(`${testDate.year}년`);
        expect($el[1].innerText).to.equal(`${testDate.month}월`);
        expect($el[2].innerText).to.equal(`${testDate.day}일`);
    });
}

describe("form-date 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("placeholder 값 / name 값 / id 값 / required 가 동일한 지 확인", () => {
            cy.makeProps().then(props => {
                const { name, placeholder, title } = props;
                cy.mount(<Date title={title} name={name} placeholder={placeholder} required />);
                cy.checkProps("[role=textbox]>input", "date", name, placeholder, true);
            });
        });
    });

    context("optional props 테스트", () => {
        beforeEach(() => {
            cy.mount(<Date title="test-title" labelStyle="input" name="test-name" placeholder="test placeholder" />);
        });

        it("defaultValue 값이 undefined 일 때, 현재 value 가 현재 날짜인 지 확인", () => {
            cy.get("[role=textbox]>input")
                .invoke("val")
                .then(value => {
                    const currentValue = DateUtil.toDate();
                    expect(value).to.equal(DateUtil.toString(currentValue, "YYYY년 M월 DD일"));
                });
        });
    });

    context("동작 테스트", () => {
        it("전체 동작(날짜 선택, handleChange(onChange/validate) 확인", () => {
            /**
             * 인풋 클릭 시 날짜 선택 스와이퍼 켜지는 지 확인
             */
            cy.mount(
                <Date
                    title="test-title"
                    name="test-name"
                    placeholder="test-placeholder"
                    required
                    minDate="2010-01-01"
                    maxDate="2099-12-31"
                    onChange={(name, currentValue) => alert(`${name} ${currentValue}`)}
                />,
            );
            cy.get("[role=textbox] > input").click();
            cy.get("[role=dialog], .MuiDrawer-root ").should("be.inViewport").and("be.visible");

            /**
             * 현재 선택된 오늘 날짜에서 랜덤 날짜와의 차이만큼 아래/위 클릭하면 랜덤 날짜가 선택되는 지 확인
             */
            changeDateAction(testDate);
            /**
             * onChange 테스트
             */
            cy.on("window:alert", text => {
                expect(text).to.equal(`test-name ${testDate.year}-${testDate.month.toString().padStart(2, "0")}-${testDate.day.toString().padStart(2, "0")}`);
            });
            /**
             * 날짜 선택 후 확인 클릭 시, 인풋의 밸류값이 선택된 날짜로 변경되었는 지 확인
             */
            cy.get("button[data-cy=confirm]").should("have.text", "확인").click();
            cy.get("[data-cy=modal-box]").should("not.exist");
            cy.get("input#date-test-name")
                .invoke("val")
                .then(value => {
                    expect(value).to.equal(`${testDate.year}년 ${testDate.month}월 ${testDate.day}일`);
                });

            /**
             * validate 테스트
             */
            cy.get("input#date-test-name")
                .invoke("attr", "aria-invalid")
                .then(value => {
                    expect(value).to.equal("false");
                });
        });

        it("취소 버튼 눌렀을 때 동작 테스트", () => {
            cy.mount(<Date title="test-title" name="test-name" placeholder="test-placeholder" required minDate="2010-01-01" maxDate="2099-12-31" />);
            cy.get("[role=textbox] > input").click();
            changeDateAction(testDate);
            cy.get("button[data-cy=cancel]").should("have.text", "취소").click();

            /**
             * swiper 가 꺼졌는 지, input value 가 오늘 날짜인 지 확인
             */
            cy.get("[data-cy=modal-box]").should("not.exist");
            cy.get("input#date-test-name")
                .invoke("val")
                .then(value => {
                    const currentValue = DateUtil.toDate();
                    expect(value).to.equal(DateUtil.toString(currentValue, "YYYY년 M월 DD일"));
                });

            /**
             * validate 테스트
             */
            cy.get("input#date-test-name")
                .invoke("attr", "aria-invalid")
                .then(value => {
                    expect(value).to.equal("false");
                });
        });
    });
});
