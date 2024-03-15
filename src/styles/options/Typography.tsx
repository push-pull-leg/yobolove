import { TypographyOptions } from "@mui/material/styles/createTypography";
import { toRem } from "./Function";

const typography: TypographyOptions = {
    h1_a: {
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: toRem(48),
        lineHeight: 1.3,
        color: "#000000",
    },
    h1: {
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: toRem(36),
        lineHeight: 1.3,
        color: "#000000",
    },
    h2: {
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: toRem(28),
        lineHeight: 1.3,
        color: "#000000",
    },
    h3: {
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: toRem(24),
        lineHeight: 1.3,
        color: "#000000",
    },
    h4: {
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: toRem(22),
        lineHeight: 1.3,
        color: "#000000",
    },
    h5: {
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: toRem(20),
        lineHeight: 1.3,
        color: "#000000",
    },
    h6: {
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: toRem(18),
        lineHeight: 1.3,
        color: "#000000",
    },

    body1: {
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: toRem(20),
        lineHeight: 1.3,
        color: "#000000",
    },
    body2: {
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: toRem(18),
        lineHeight: 1.3,
        color: "#000000",
    },

    subtitle1: {
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: toRem(22),
        lineHeight: 1.3,
        color: "#000000",
    },
    subtitle2: {
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: toRem(20),
        lineHeight: 1.3,
        color: "#000000",
    },
    caption: {
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: toRem(18),
        lineHeight: 1.3,
        color: "#000000",
    },
    overline: {
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: toRem(14),
        lineHeight: 1.3,
        textTransform: "uppercase",
        color: "#000000",
    },
};

export default typography;
