/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import TimeRange from "../../../src/components/form/TimeRange";
import DateUtil from "../../../src/util/DateUtil";
import { faker } from "@faker-js/faker";
import Recruiting from "../../../src/mocks/faker/Recruiting";

const DAYS: number[] = [1, 2, 4, 8, 16, 32, 64];

let midday = "";
let hour = faker.datatype.number({ min: 1, max: 24 });
let minute = Math.round(faker.datatype.number({ min: 1, max: 6, precision: 0.1 })) * 10;
let meridiem = {};
let nowTime = {};
let randomTime = {};
let middayDiff;
let hourDiff;
let minuteDiff;
let randomHourValue;
const now = DateUtil.toDate();
let getMidday = "";
let getHours = now.getHours();
let getMinutes = now.getMinutes();
let pickerMinute;

function getRandomTime() {
    randomHourValue = hour;
    if (hour === 24) {
        randomHourValue = 0;
        hour = 0;
    }

    if (hour >= 13) {
        midday = "오후";
        meridiem.random = "PM";
    } else {
        midday = "오전";
        meridiem.random = "AM";
    }
    if (midday === "오전" && hour === 12) {
        randomHourValue = 0;
        hour = 0;
    }

    if (minute === 60) {
        minute = 0;
    }

    nowTime = {
        midday: getMidday,
        hour: getHours,
        minute: getMinutes,
    };

    randomTime = {
        midday: midday,
        hour: hour,
        minute: minute,
    };

    pickerMinute = Math.floor(nowTime.minute / 10) * 10;

    hourDiff = 10 - randomTime.hour;
    minuteDiff = (0 - randomTime.minute) / 10;
    if (randomTime.midday === "오전") {
        middayDiff = 0;
    } else {
        middayDiff = 1;
    }
}

getRandomTime();

const helperText = faker.datatype.string(15);

let defaultValue = {
    ...Recruiting().visitTime,
    memo: "안녕하세요",
};

let selectedRandomNumber = faker.datatype.number({ min: 0, max: 4 });
let unSelectedRandomNumber = faker.datatype.number({ min: 5, max: 6 });
let binaryDays = 31 - Math.pow(2, selectedRandomNumber) + Math.pow(2, unSelectedRandomNumber);

describe("form-Time 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("placeholder 값 / name 값 / id 값 / required 가 동일한 지 확인", () => {
            cy.makeProps().then(props => {
                const { name, placeholder, title } = props;
                cy.mount(<TimeRange title={title} name={name} placeholder={placeholder} helperText={helperText} required />);
                cy.checkProps("[data-cy=timerange-input]", "timerange", name, placeholder, true);
                cy.get("[data-cy=helpertext]").should("have.text", helperText);
            });
        });
        it("showweek / titlePrefix / disabled / required 가 동일한 지 확인", () => {
            cy.mount(<TimeRange showWeek={true} titlePrefix={helperText} />);
            cy.get("[data-cy=agree-checkbox]").should("be.visible").and("exist");
            cy.get("[data-cy=timerange-input]").click();
            cy.wait(100);
            cy.get("[data-cy=select-days]").should("exist").and("be.inViewport");
            cy.get("[role=group]>button").then($el => {
                for (let i = 0; i < 7; i += 1) {
                    if (i < 5) {
                        cy.get($el[i]).should("have.attr", "aria-pressed", "true");
                    } else {
                        cy.get($el[i]).should("have.attr", "aria-pressed", "false");
                    }
                }
            });
            cy.get("[data-cy=select-days]>h3").should("have.text", `${helperText} 요일`);
            cy.get("[role=article]>h3").then($el => {
                expect($el[0].innerText).to.eq(`${helperText} 시작시간`);
                expect($el[1].innerText).to.eq(`${helperText} 종료시간`);
            });
            cy.get("[aria-selected=true]").then($el => {
                expect($el[0].textContent).to.eq("09시");
                expect($el[1].textContent).to.eq("00분");
                expect($el[2].textContent).to.eq("10시");
                expect($el[3].textContent).to.eq("00분");
            });
        });
        it("defaultValue test", () => {
            cy.mount(<TimeRange defaultValue={defaultValue} showWeek={true} />);
            cy.get("[data-cy=timerange-input]").should(
                "have.value",
                `${DateUtil.toDayFromWeekNumber(defaultValue.days)} ${defaultValue.startAt.slice(0, -3)}~${defaultValue.endAt.slice(0, -3)}`,
            );
        });
    });
    context("동작테스트", () => {
        it("요일선택 / 시간선택 동작테스트", () => {
            cy.mount(<TimeRange showWeek={true} />);
            /**
             * input 클릭 시 modal open
             */
            cy.get("[data-cy=timerange-input]").click();
            cy.get("[data-cy=modal-box]").should("be.inViewport").and("be.visible");
            /**
             * 요일 선택/해제
             */
            cy.get("[role=group]>button").then($el => {
                cy.get($el[selectedRandomNumber]).click().should("have.attr", "aria-pressed", "false");
                cy.get($el[unSelectedRandomNumber]).click().should("have.attr", "aria-pressed", "true");
            });

            /**
             * 시간 선택
             */
            cy.wait(100);
            for (let i = 0; i < Math.abs(hourDiff); i++) {
                if (hourDiff < 0) {
                    cy.get("[aria-selected=true]").then($el => {
                        $el[2].nextSibling.click();
                        cy.wait(100);
                    });
                } else {
                    cy.get("[aria-selected=true]").then($el => {
                        $el[2].previousSibling.click();
                        cy.wait(100);
                    });
                }
            }

            for (let i = 0; i < Math.abs(minuteDiff); i++) {
                if (minuteDiff < 0) {
                    cy.get("[aria-selected=true]").then($el => {
                        $el[3].nextSibling.click();
                        cy.wait(100);
                    });
                } else {
                    cy.get("[aria-selected=true]").then($el => {
                        $el[3].previousSibling.click();
                        cy.wait(100);
                    });
                }
            }
            cy.get("[aria-selected=true]").then($el => {
                expect($el[2].textContent).to.eq(`${String(randomTime.hour).padStart(2, "0")}시`);
                expect($el[3].textContent).to.eq(`${String(randomTime.minute).padStart(2, "0")}분`);
            });

            /**
             * 확인 버튼 눌렀을 때, input의 value가 선택한 요일과 시간인 것 확인
             */
            cy.get("button[data-cy=confirm]").should("have.text", "확인").click();
            cy.get("[data-cy=timerange-input]").should(
                "have.value",
                `${DateUtil.toDayFromWeekNumber(binaryDays)} 09:00~${String(randomHourValue).padStart(2, "0")}:${String(randomTime.minute).padStart(2, "0")}`,
            );

            /**
             * memo 직접입력 체크박스 클릭 시 입력한 헬퍼텍스트가 메모에 타이핑되는지 확인
             */
            cy.get("[data-cy=agree-checkbox]>input").click().should("be.checked");
            cy.get("textarea#text-memo").type(helperText).should("have.text", helperText);

            /**
             * 메모가 있을 때, 요일/시간 인풋창 비활성화 확인, 메모 input unchecked 후 활성화 되는지 확인
             */
            cy.get("[data-cy=timerange-input]").should("be.disabled");
            cy.get("[data-cy=agree-checkbox]>input").click().should("not.be.checked");
            cy.get("[data-cy=timerange-input]").should("not.be.disabled");
        });
        it("취소 버튼 테스트", () => {
            /**
             * 밸류 수정 후, 취소 눌렀을 때 변경 X
             */
            defaultValue.memo = undefined;
            cy.mount(<TimeRange defaultValue={defaultValue} showWeek={true} />);
            cy.get("[data-cy=timerange-input]").click();

            for (let i = 0; i < Math.abs(hourDiff); i++) {
                if (hourDiff < 0) {
                    cy.get("[aria-selected=true]").then($el => {
                        $el[2].nextSibling.click();
                        cy.wait(100);
                    });
                } else {
                    cy.get("[aria-selected=true]").then($el => {
                        $el[2].previousSibling.click();
                        cy.wait(100);
                    });
                }
            }

            for (let i = 0; i < Math.abs(minuteDiff); i++) {
                if (minuteDiff < 0) {
                    cy.get("[aria-selected=true]").then($el => {
                        $el[3].nextSibling.click();
                        cy.wait(100);
                    });
                } else {
                    cy.get("[aria-selected=true]").then($el => {
                        $el[3].previousSibling.click();
                        cy.wait(100);
                    });
                }
            }
            cy.wait(100);

            cy.get("button[data-cy=cancel]").should("have.text", "취소").click();
            cy.get("[data-cy=timerange-input]").should(
                "have.value",
                `${DateUtil.toDayFromWeekNumber(defaultValue.days)} ${defaultValue.startAt.slice(0, -3)}~${defaultValue.endAt.slice(0, -3)}`,
            );
        });
        it("reset 테스트", () => {
            cy.mount(<TimeRange defaultValue={defaultValue} />);
            cy.get("[data-cy=reset]").click();
            cy.get("[data-cy=timerange-input]").should("have.value", "");
        });
        it("valid 테스트 / required false / value 없음", () => {
            cy.mount(<TimeRange required={false} />);
            cy.get("[data-cy=timerange-input]").should("have.attr", "aria-invalid", "false");
        });
        it("valid 테스트 / required true / value 없음", () => {
            cy.mount(<TimeRange required />);
            cy.get("[data-cy=timerange-input]").should("have.attr", "aria-invalid", "true");
        });
        it("valid 테스트 / required true / showWeek true / 선택요일 없음", () => {
            defaultValue.days = 0;
            cy.mount(<TimeRange required defaultValue={defaultValue} showWeek={true} />);
            cy.get("[data-cy=timerange-input]").should("have.attr", "aria-invalid", "true");
        });
        it("valid 테스트 / required true / value memo 빼고 있음", () => {
            defaultValue.days = 3;
            defaultValue.memo = helperText;
            cy.mount(<TimeRange showWeek={true} defaultValue={defaultValue} required />);
            cy.get("textarea#text-memo").clear();
            cy.get("[data-cy=timerange-input]").should("have.attr", "aria-invalid", "true");
        });
        it("valid 테스트 / required true / value memo만 있음", () => {
            defaultValue = { memo: helperText };
            cy.mount(<TimeRange showWeek={true} defaultValue={defaultValue} required />);
            cy.get("[data-cy=timerange-input]").should("have.attr", "aria-invalid", "false");
        });
    });
});
