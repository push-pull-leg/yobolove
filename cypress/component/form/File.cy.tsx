/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import File from "../../../src/components/form/File";
import { faker } from "@faker-js/faker";
import CenterMeCertFile from "../../../src/mocks/faker/CenterMeCertFile";

import("../../../src/mocks/response/get-center-me-cert-file");

const randomValue = faker.image.dataUri();
const randomDescription = faker.datatype.string(20);
const randomAccept = faker.datatype.string(10);
const onChange = (name, value) => {
    alert(`${name} ${value.name}`);
};

describe("form-Email 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("title / name / defaultValue / required / description 테스트 ", () => {
            cy.makeProps().then(props => {
                const { title, name, placeholder } = props;
                cy.mount(<File title={title} name={name} placeholder={placeholder} description={randomDescription} accept={randomAccept} required />);
                cy.get("[data-cy=input-label]").should("have.text", title);
                cy.get("[data-cy=file-input]").should("have.attr", "name", name);
                cy.get("[data-cy=file-button]").should("have.text", placeholder);
                cy.get("[data-cy=file-input]").should("have.attr", "required", "required").and("have.attr", "accept", randomAccept);
                cy.get("[role=note]").should("have.text", randomDescription);
            });
        });
        it("optional props(required, defaultValue, accept) 테스트", () => {
            cy.makeProps().then(props => {
                const { title, name, placeholder } = props;
                cy.mount(<File title={title} name={name} defaultValue={randomValue} placeholder={placeholder} required={false} />);
                cy.get("[data-cy=file-input]").should("have.attr", "accept", "image/*").and("not.have.attr", "required");
                cy.get("[role=note]").should("not.exist");
                cy.get("[data-cy=changed-file-input]>input").should("have.value", " 증명서 등록완료");
                cy.get("[data-cy=changed-file-button]").should("exist").and("be.inViewport").and("have.text", "변경");
            });
        });
    });
    context("동작 테스트", () => {
        it("업로드 & 동작테스트", () => {
            cy.mount(<File onChange={onChange} name={randomDescription} />);
            cy.get("[data-cy=file-input]").selectFile(
                [
                    {
                        contents: "cypress/fixtures/media/example.jpg",
                        fileName: "example.jpg",
                        mimeType: "image/jpg",
                    },
                ],
                { force: true },
            );
            cy.get("[data-cy=file-input]").should("have.value", "C:\\fakepath\\example.jpg");
            cy.on("window:alert", text => {
                expect(text).to.eq(`${randomDescription} example.jpg`);
            });
            cy.get("[data-cy=changed-file-input]").click();
            cy.get("div.PhotoView-Portal").should("be.inViewport");
            cy.readFile("cypress/fixtures/media/example.jpg", "base64").then(data => {
                let imgSrc = document.querySelector("img.PhotoView__Photo").src;
                expect(imgSrc).to.eq(`data:image/jpg;base64,${data}`);
            });
            cy.get("svg.PhotoView-Slider__toolbarIcon").click();
            cy.get("div.PhotoView-Portal").should("not.exist");
        });

        it("openSlider response 테스트", () => {
            cy.mount(<File defaultValue name={randomDescription} />);
            cy.get("[data-cy=changed-file-input]").click();
            cy.get("img.PhotoView__Photo").should("have.attr", "src", CenterMeCertFile().certFileAsBase64);
        });
    });
    context("validate 테스트", () => {
        it("required, 밸류가 없을 때 / 이미지가 아닌 파일을 올렸을 때", () => {
            cy.mount(<File required name={randomDescription} />);
            cy.get("[data-cy=file-input]").should("have.attr", "aria-invalid", "true");
            cy.get("[data-cy=file-input]").selectFile(
                [
                    {
                        contents: "cypress/fixtures/media/video.mp4",
                        fileName: "video.mp4",
                        mimeType: "mp4",
                    },
                ],
                { force: true },
            );
            cy.get("[data-cy=helper-text]").should("have.text", "사진으로 등록해주세요");
            cy.get("[data-cy=file-input]").should("have.attr", "aria-invalid", "true");
        });
        it("!required", () => {
            cy.mount(<File name={randomDescription} />);
            cy.get("[data-cy=file-input]").should("have.attr", "aria-invalid", "false");
        });
    });
});
