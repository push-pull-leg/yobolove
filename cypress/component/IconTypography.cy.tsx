/// <reference types="cypress" />
// @ts-nocheck
import { faker } from "@faker-js/faker";
import IconTypography from "../../src/components/IconTypography";
import React from "react";
import BluetoothIcon from "@mui/icons-material/Bluetooth";

const label = faker.datatype.string(10);

describe("IconTypography 컴포넌트 테스트", () => {
    context("props 테스트", () => {
        it("필수 props 테스트", () => {
            cy.mount(<IconTypography label={label} labelSelector="component-test" />);
            cy.get("[data-cy=component-test]").should("have.text", label);
        });
        it("optional props 테스트", () => {
            const icon = <BluetoothIcon fontSize="small" color="success" />;
            cy.mount(
                <IconTypography
                    label={label}
                    labelSelector="component-test"
                    iconSelector="Bluetooth-icon"
                    icon={icon}
                    color="primary.contrastText"
                    labelColor="error.main"
                    typographyVariant="h3"
                    sx={{ mt: 5 }}
                />,
            );
            cy.get("[data-cy=Bluetooth-icon]>svg").should("have.css", "color", "rgb(76, 175, 80)").and("have.attr", "data-testid", "BluetoothIcon");
            cy.get("h3[data-cy=component-test]").should("exist").should("be.visible").should("have.css", "color", "rgb(100, 36, 235)");
        });
    });
});
