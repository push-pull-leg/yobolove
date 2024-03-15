import { createTheme } from "@mui/material/styles";
import { breakpoints, palette, typography } from "./options";

// eslint-disable-next-line import/no-mutable-exports
let theme = createTheme({
    palette,
    typography,
    breakpoints,
    spacing: (factor: number) => `${0.25 * factor}rem`, // (Bootstrap strategy)
});

theme = createTheme(theme, {
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    wordBreak: "keep-all",
                },
            },
            variants: [
                {
                    props: { variant: "h3" },
                    style: {
                        fontWeight: 600,
                    },
                },
            ],
        },
        MuiSvgIcon: {
            styleOverrides: {
                fontSizeSmall: {
                    fontSize: theme.spacing(4),
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: theme.palette.primary.contrastText,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    // border: "1px solid inherit",
                },
            },
            defaultProps: {
                disableElevation: true,
            },
            variants: [
                {
                    props: { size: "large" },
                    style: {
                        fontWeight: 500,
                        fontSize: theme.spacing(5.5),
                        lineHeight: 1.2,
                        textTransform: "uppercase",
                        padding: theme.spacing(2.75, 4.5),
                    },
                },
                {
                    props: { size: "medium" },
                    style: {
                        fontWeight: 500,
                        fontSize: theme.spacing(5),
                        lineHeight: 1.2,
                        textTransform: "uppercase",
                        padding: theme.spacing(1.25, 4),
                    },
                },
                {
                    props: { size: "small" },
                    style: {
                        fontWeight: 500,
                        fontSize: theme.spacing(4.5),
                        lineHeight: 1.2,
                        textTransform: "uppercase",
                        padding: theme.spacing(1.25, 4),
                    },
                },
                {
                    props: { variant: "selected" },
                    style: {
                        backgroundColor: "rgba(255, 86, 124, 0.08)",
                        border: "1px solid rgba(255, 86, 124, 0.5)",
                        color: theme.palette.primary.dark,
                    },
                },
                {
                    props: { variant: "unselected" },
                    style: {
                        backgroundColor: "transparent",
                        border: "1px solid rgba(0, 0, 0, 0.23)",
                        color: theme.palette.text.secondary,
                    },
                },
            ],
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontWeight: 400,
                    fontSize: theme.spacing(4.5),
                    lineHeight: 1.2,
                    color: theme.palette.text.secondary,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    fontWeight: 400,
                    fontSize: theme.spacing(5.5),
                    lineHeight: 1.2,
                    padding: theme.spacing(3.25, 3),
                    height: theme.spacing(6.5),
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    minHeight: "initial",
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    padding: 0,
                    marginRight: theme.spacing(2),
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.primary.contrastText,
                },
            },
        },
        MuiCardHeader: {
            styleOverrides: {
                action: {
                    margin: 0,
                    color: theme.palette.text.secondary,
                },
            },
        },

        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: theme.spacing(6),
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: theme.spacing(1),
                    height: theme.spacing(6),
                    lineHeight: theme.spacing(6),
                },
                label: {
                    paddingLeft: theme.spacing(2),
                    paddingRight: theme.spacing(2),
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    ">:not(:first-of_type)": {
                        marginLeft: theme.spacing(3),
                    },
                },
            },
        },
        MuiBreadcrumbs: {
            styleOverrides: {
                separator: {
                    margin: theme.spacing(0, 1),
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    display: "flex",
                },
                asterisk: {
                    color: theme.palette.primary.main,
                },
            },
        },
    },
});

export default theme;
