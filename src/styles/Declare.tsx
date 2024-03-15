import React from "react";

declare module "@mui/material/styles" {
    // 추가할 typography variants 넣어줍니다.
    interface TypographyVariants {
        h0: React.CSSProperties;
        subtitle3: React.CSSProperties;
        body3: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
        h0?: React.CSSProperties;
        h1?: React.CSSProperties;
        h1_a?: React.CSSProperties;
        h2?: React.CSSProperties;
        subtitle1?: React.CSSProperties;
        subtitle2?: React.CSSProperties;
        subtitle3?: React.CSSProperties;
        body1?: React.CSSProperties;
        body2?: React.CSSProperties;
        body3?: React.CSSProperties;
        caption?: React.CSSProperties;
        button?: React.CSSProperties;
    }

    interface BreakpointOverrides {
        xl: false;
    }

    interface Palette {
        other: Palette["primary"];
        kakaotalk: Palette["primary"];
    }

    interface PaletteOptions {
        other: PaletteOptions["primary"];
        kakaotalk: PaletteOptions["primary"];
    }
}

declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        h1_a: true;
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        other: true;
        kakaotalk: true;
        text: true;
    }

    interface ButtonPropsVariantOverrides {
        selected: true;
        unselected: true;
    }
}
