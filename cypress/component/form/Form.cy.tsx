/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import Text from "../../../src/components/form/Text";
import Radio from "../../../src/components/form/Radio";
import MultipleSelect from "../../../src/components/form/MultipleSelect";
import Form from "../../../src/components/form/Form";
import { faker } from "@faker-js/faker";
import EndpointEnum from "../../../src/enum/EndpointEnum";
import Phone from "../../../src/components/form/Phone";
import Date from "../../../src/components/form/Date";
import { breakpoints } from "../../../src/styles/options";

faker.locale = "ko";

const sm: number = Number(breakpoints.values?.sm);
const md: number = Number(breakpoints.values?.md);

const dataLength = faker.datatype.number({ min: 3, max: 4 });
const testData = new Map();
let data;
let dataArray;

function randomData() {
    for (let i = 0; i < dataLength; i += 1) {
        data = faker.name.jobType();
        testData.set(data, data);
    }
    dataArray = Array.from(testData, function (item) {
        return { key: item[0], value: item[1] };
    });
}

randomData();
const fakePhoneNumber = `010${faker.datatype.number({ min: 10000000, max: 99999999 })}`;
const arr = [...fakePhoneNumber.replaceAll("-", "")];
const fakeName = faker.datatype.string(5);
describe("form 컴포넌트 테스트", () => {
    context("props / valid 테스트", () => {
        const buttonText = faker.lorem.words(1);
        beforeEach(() => {
            cy.viewport(md, 900);
            cy.mount(
                <Form endpointEnum={EndpointEnum.POST_CAREGIVER_LOGIN} buttonText={buttonText}>
                    <Text title="이름" name="name" defaultValue={fakeName} placeholder="이름을 입력해주세요" required />
                    <Phone title="핸드폰 번호" name="phone" defaultValue={fakePhoneNumber} placeholder="핸드폰필드를 입력해주세요" required labelStyle="input" />
                    <MultipleSelect
                        title="멀티셀렉박스"
                        name="multipleSelect"
                        defaultValue={[dataArray[0].key, dataArray[1].key]}
                        placeholder="셀렉박스를 입력해주세요"
                        data={testData}
                        required
                    />
                    <Date title="날짜선택" name="date" placeholder="날짜를 선택해주세요" required />
                    <Radio defaultValue={dataArray[0].key} title="라디오박스" name="radio" placeholder="라디오박스를 입력해주세요" data={testData} required />
                </Form>,
            );
        });
        it("버튼 텍스트 확인", () => {
            cy.get("button[type=submit]").should("have.text", buttonText);
        });
        it("valid 테스트 / required value가 모두 있을 때 valid true", () => {
            cy.get("button[type=submit]").should("not.be.disabled");
            cy.get("button[type=submit]").should("have.css", "background-color", "rgb(255, 86, 124)");
        });
        it("valid 테스트 / required value가 하나라도 없을 때 valid false", () => {
            cy.get("input#text-name").clear();
            cy.get("button[type=submit]").should("be.disabled");
            cy.get("button[type=submit]").should("have.css", "background-color", "rgba(0, 0, 0, 0.12)");
        });
    });
    context("props / valid 테스트", () => {
        beforeEach(() => {
            cy.viewport(md, 900);
            cy.mount(
                <Form endpointEnum={EndpointEnum.POST_CAREGIVER_LOGIN} buttonText="확인">
                    <Text title="이름" name="name" placeholder="이름을 입력해주세요" />
                    <Phone title="핸드폰 번호" name="phone" placeholder="핸드폰필드를 입력해주세요" labelStyle="input" />
                    <MultipleSelect title="멀티셀렉박스" name="multipleSelect" defaultValue={[]} placeholder="셀렉박스를 입력해주세요" data={testData} />
                    <Radio title="라디오박스" name="radio" placeholder="라디오박스를 입력해주세요" data={testData} />
                </Form>,
            );
        });
        it("required 가 없을 때, 값이 하나도 없을 떄 valid true", () => {
            cy.get("button[type=submit]").should("not.be.disabled");
            cy.get("button[type=submit]").should("have.css", "background-color", "rgb(255, 86, 124)");
        });
    });

    context("optional props 테스트", () => {
        it("버튼 없을때 확인", () => {
            cy.mount(
                <Form endpointEnum={EndpointEnum.POST_CAREGIVER_LOGIN}>
                    <Text title="이름" name="name" placeholder="이름을 입력해주세요" />
                </Form>,
            );
            cy.get("button[type=submit]").should("not.exist");
        });
        it("defaultValid props Test", () => {
            cy.mount(
                <Form endpointEnum={EndpointEnum.POST_CAREGIVER_LOGIN} defaultValid={false} buttonText="확인">
                    <Text title="이름" name="name" placeholder="이름을 입력해주세요" />
                </Form>,
            );
            cy.get("button[type=submit]").should("have.attr", "disabled", "disabled");
        });
        it("onChange 테스트", () => {
            let changeCount = 0;
            /**
             * onChange 테스트
             */
            const onChange = (name, value) => {
                const formattedValue = value.replaceAll("-", "").replaceAll("_", "");
                const nowValue = arr.slice(0, changeCount + 1).join("");
                expect(formattedValue).to.equal(nowValue);
                changeCount++;
            };
            cy.mount(
                <Form endpointEnum={EndpointEnum.POST_CAREGIVER_LOGIN} onChange={onChange} buttonText="확인">
                    <Phone title="핸드폰 번호" name="phone" placeholder="핸드폰필드를 입력해주세요" labelStyle="input" />
                </Form>,
            );
            cy.get("[data-cy=phone-input] > input").focus().type(fakePhoneNumber);
        });
    });
});
