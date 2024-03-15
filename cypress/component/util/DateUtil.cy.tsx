/// <reference types="cypress" />
// @ts-nocheck
import DateUtil from "../../../src/util/DateUtil";

const testDateRegex = (regex, date) => {
    return regex.test(date);
};
describe("DateUtil 테스트", () => {
    context("toString 테스트", () => {
        it("return", () => {
            const regex = /(202[0-9]-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]))/;
            const input = {
                date: "Wed Nov 03 2021 02:13:56 GMT+0900 (한국 표준시)",
                format: "YYYY-MM-DD",
            };
            const output = "2021-11-03";
            expect(output).to.deep.equal(DateUtil.toString(input.date, input.format));
            expect(true).to.equal(testDateRegex(regex, output));
            expect("").to.equal(DateUtil.toString());
        });
    });

    context("toDate 테스트", () => {
        it("return", () => {
            const input = "19871218";
            const output = new Date("1987-12-18");
            /**
             * Date 객체는 비교할 수 없으므로, toString 으로 비교
             */
            expect(DateUtil.toString(output)).to.equal(DateUtil.toString(DateUtil.toDate(input)));
            expect(DateUtil.toString(new Date())).to.equal(DateUtil.toString(DateUtil.toDate()));
        });
    });
    context("weekNumberToWeekDays 테스트", () => {
        it("31 > [0, 1, 2, 3, 4]", () => {
            expect([0, 1, 2, 3, 4]).to.deep.equal(DateUtil.weekNumberToWeekDays(31));
        });
        it("90 > [1, 3, 4, 6]", () => {
            expect([1, 3, 4, 6]).to.deep.equal(DateUtil.weekNumberToWeekDays(90));
        });
        it("88 > [3, 4, 6]", () => {
            expect([3, 4, 6]).to.deep.equal(DateUtil.weekNumberToWeekDays(88));
        });
    });

    context("weekNumberToWeekDays weekDaysToWeekNumber", () => {
        it("[0, 1, 2, 3, 4] > 31", () => {
            expect(31).to.deep.equal(DateUtil.weekDaysToWeekNumber([0, 1, 2, 3, 4]));
        });
        it("[1, 3, 4, 6] > 90", () => {
            expect(90).to.deep.equal(DateUtil.weekDaysToWeekNumber([1, 3, 4, 6]));
        });
        it("[3, 4, 6] > 88", () => {
            expect(88).to.deep.equal(DateUtil.weekDaysToWeekNumber([3, 4, 6]));
        });
    });

    context("toDayFromWeekNumber test", () => {
        it("return", () => {
            const input = [undefined, 4, 5, 99, 15, 79];
            const output = ["", "수", "월,수", "월,화,토,일", "월~목", "월~목,일"];
            for (let i = 0; i < input.length; i += 1) {
                expect(output[i]).to.deep.equal(DateUtil.toDayFromWeekNumber(input[i]));
            }
        });
    });

    context("now / getIsoString test", () => {
        it("return", () => {
            const TIME_ZONE = 3240 * 10000;
            const now = new Date(+new Date() + TIME_ZONE).toISOString();
            expect(now.slice(0, 19)).to.deep.equal(DateUtil.now("YYYY-MM-DDTHH:mm:ss"));
            expect(now.slice(0, 19) + "Z").to.deep.equal(DateUtil.getIsoString());
            expect(now.split("T")[0]).to.deep.equal(DateUtil.now());
        });
    });
    context("sleep test", () => {
        it("return", () => {
            let numb = 0;
            const add = async () => {
                let add2 = setInterval(() => numb++, 100);
                await DateUtil.sleep(500);
                clearInterval(add2);
                await expect(numb).to.equal(5);
            };
            add();
        });
    });
});
