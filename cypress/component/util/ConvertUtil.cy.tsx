/// <reference types="cypress" />
// @ts-nocheck
import ConverterUtil from "../../../src/util/ConverterUtil";
import { faker } from "@faker-js/faker";
import { GenderLabel } from "../../../src/enum/GenderEnum";
import { JobFilterLabel } from "../../../src/enum/JobEnum";
import { PayTypeLabel } from "../../../src/enum/PayTypeEnum";

const randomString = faker.datatype.string();

describe("ConverterUtil 테스트", () => {
    context("isCenterPath 테스트", () => {
        it("return", () => {
            const input = ["/center", "/기관", "/%EA%B8%B0%EA%B4%80"];
            const wrongInput = randomString;
            for (let i = 0; i < 3; i += 1) {
                expect(true).to.deep.equal(ConverterUtil.isCenterPath(input[i]));
            }
            expect(false).to.deep.equal(ConverterUtil.isCenterPath(wrongInput));
        });
    });
    context("toCommaString 테스트", () => {
        it("return", () => {
            const input = ["123456", "15308235824", "5260834607645"];
            const output = ["123,456", "15,308,235,824", "5,260,834,607,645"];
            for (let i = 0; i < 3; i += 1) {
                expect(output[i]).to.deep.equal(ConverterUtil.toCommaString(input[i]));
            }
        });
    });
    context("getKeyByValueOfMap 테스트", () => {
        it("return", () => {
            const input = {
                map: [GenderLabel, JobFilterLabel, PayTypeLabel],
                value: ["여성", "방문요양", "시급"],
            };
            const output = ["FEMALE", "VISIT_CARE", "HOURLY"];
            for (let i = 0; i < 3; i += 1) {
                expect(output[i]).to.deep.equal(ConverterUtil.getKeyByValueOfMap(input.map[i], input.value[i]));
            }
        });
    });
    context("filterMap 테스트", () => {
        it("return", () => {
            const input = {
                map: [GenderLabel, JobFilterLabel, PayTypeLabel],
                funnel: [["FEMALE"], ["VISIT_CARE"], ["HOURLY"]],
            };
            const output = [new Map([["FEMALE", "여성"]]), new Map([["VISIT_CARE", "방문요양"]]), new Map([["HOURLY", "시급"]])];
            for (let i = 0; i < 3; i += 1) {
                expect(output[i]).to.deep.equal(ConverterUtil.filterMap(input.map[i], input.funnel[i]));
            }
        });
    });
    context("getNumberMap 테스트", () => {
        it("return", () => {
            const prefix = faker.word.adjective(3);
            const postfix = faker.word.adjective(4);
            const input = [
                {
                    startNumber: 3,
                    endNumber: 6,
                    prefix,
                    postfix,
                },
                {
                    startNumber: 3,
                    endNumber: 6,
                },
            ];
            const output = [
                new Map([
                    ["3", `${prefix}3${postfix}`],
                    ["4", `${prefix}4${postfix}`],
                    ["5", `${prefix}5${postfix}`],
                    ["6", `${prefix}6${postfix}`],
                ]),
                new Map([
                    ["3", "3"],
                    ["4", "4"],
                    ["5", "5"],
                    ["6", "6"],
                ]),
            ];
            for (let i = 0; i < 2; i += 1) {
                expect(output[i]).to.deep.equal(ConverterUtil.getNumberMap(input[i].startNumber, input[i].endNumber, input[i].prefix, input[i].postfix));
            }
        });
    });
});
