/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import { UtmKeys } from "../../../src/interface/UtmInterface";
import { faker } from "@faker-js/faker";
import UtmService from "../../../src/service/UtmService";

const randomUtmKey = faker.helpers.arrayElement(UtmKeys);
const firstRandomValue = faker.word.noun();
const secondRandomValue = faker.word.noun();

let output;
let input;
let query = {
    utm_source: firstRandomValue,
    utm_medium: secondRandomValue,
};

/**
 * 새로운 테스트를 위해 기존 data를 삭제함
 * utmService.remove() 테스트는 이것으로 대체
 */
const clear = () => {
    UtmKeys.forEach(utmKey => {
        UtmService.remove(utmKey);
    });
};

describe("UtmService 테스트", () => {
    context("input / output", () => {
        it("setFromQuery 테스트", () => {
            clear();
            UtmService.setFromQuery({ utm_source: firstRandomValue });
            output = UtmService.get("utmSource");
            expect(firstRandomValue).to.eq(output);
        });
        it("getAll 테스트", () => {
            clear();
            UtmService.setFromQuery(query);
            output = UtmService.getAll();
            input = {
                utmSource: firstRandomValue,
                utmMedium: secondRandomValue,
            };
            expect(input).to.deep.eq(output);
        });
        it("get 테스트", () => {
            clear();
            UtmService.setFromQuery(query);
            output = {
                first: UtmService.get("utmSource"),
                second: UtmService.get("utmMedium"),
            };
            expect(firstRandomValue).to.eq(output.first);
            expect(secondRandomValue).to.eq(output.second);
        });
        it("set 테스트", () => {
            clear();
            UtmService.set(randomUtmKey, firstRandomValue);
            output = UtmService.get(randomUtmKey);
            expect(firstRandomValue).to.eq(output);
            expect(firstRandomValue).to.eq(sessionStorage.getItem(randomUtmKey));
        });
        it("setInitialQuery 테스트", () => {
            clear();
            UtmService.setInitialQuery({ utm_medium: firstRandomValue });
            UtmService.setFromQuery({});
            output = UtmService.get("utmMedium");
            expect(firstRandomValue).to.eq(output);
        });
    });
});
