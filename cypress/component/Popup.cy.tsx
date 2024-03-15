/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import { PopupRecoilState } from "../support/component";
import Popup from "../../src/components/Popup";
import { faker } from "@faker-js/faker";

const randomText = faker.datatype.string(8);
const randomSentence = faker.lorem.paragraph(3);
const randomProps = {
    open: true,
    title: faker.datatype.string(10),
    onClose: () => {
        alert(randomText);
    },
    component: <span data-cy="popup-component">{randomSentence}</span>,
    src: faker.image.cats(),
};

describe("Popup 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("component가 있을 떄", () => {
            cy.mount(
                <>
                    <PopupRecoilState trigger={true} open={false} title={randomProps.title} onClose={randomProps.onClose} component={randomProps.component} src={randomProps.src}>
                        <Popup />
                    </PopupRecoilState>
                </>,
            );
            cy.get("button[id=trigger]").click();
            cy.get("h6[role=heading]").should("have.text", randomProps.title);
            cy.get("[data-cy=popup-component]").should("have.text.text", randomSentence);
            cy.get("button[role=button]").click();
            cy.get("[role=dialog]").should("not.exist");
            cy.on("window:alert", text => {
                expect(text).to.contains(randomText);
            });
        });
        it("src만 있을 떄", () => {
            cy.mount(
                <>
                    <PopupRecoilState trigger={true} open={false} title={randomProps.title} onClose={randomProps.onClose} src={randomProps.src}>
                        <Popup />
                    </PopupRecoilState>
                </>,
            );
            cy.get("button[id=trigger]").click();
            cy.get("div[role=article] > iframe").should("have.attr", "src", randomProps.src).and("have.attr", "title", randomProps.title);
        });
    });
});
