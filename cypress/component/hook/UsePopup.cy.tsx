/// <reference types="cypress" />
// @ts-nocheck
import { faker } from "@faker-js/faker";
import { UsePopupTest } from "../../support/component";
import { Box, Typography } from "@mui/material";
import React from "react";
import theme from "../../../src/styles/Theme";
import Popup from "../../../src/components/Popup";

const randomTitle = faker.datatype.string();
const randomText = faker.lorem.lines(5);
let test = (
    <Box
        component="article"
        sx={{
            backgroundColor: theme.palette.primary.contrastText,
            width: "100%",
            margin: "0 auto",
            p: 5,
            height: "200px",
        }}
        data-cy="test-box"
    >
        <Typography data-cy="test-text">{randomText}</Typography>
    </Box>
);

describe("OpenPopup 훅 테스트", () => {
    context("openPopup 테스트", () => {
        it("", () => {
            cy.mount(
                <UsePopupTest title={randomTitle} component={test} src={undefined} trigger={true} onClose={() => {}}>
                    <Popup />
                </UsePopupTest>,
            );
            cy.get("[data-cy=open-button]").click();
            cy.get("[data-cy=long-swiper]").should("to.exist").and("be.visible");
            cy.get("h6[role=heading]").should("have.text", randomTitle);
            cy.get("[data-cy=test-box]").should("to.exist").and("be.visible");
            cy.get("[data-cy=test-text]").should("to.exist").and("be.visible").and("have.text", randomText);
            cy.get("button[role=button]").click();
            cy.get("[role=dialog]").should("not.exist");
        });
    });
    context("closePopup 테스트", () => {
        it("", () => {
            cy.mount(
                <UsePopupTest title={randomTitle} component={test} src={undefined} trigger={true} onClose={() => {}}>
                    <Popup />
                </UsePopupTest>,
            );
            cy.get("[data-cy=open-button]").click();
            cy.get("[data-cy=long-swiper]").should("to.exist").and("be.visible");
            cy.get("[data-cy=close-button]").click();
            cy.get("[role=dialog]").should("not.exist");
        });
    });
});
