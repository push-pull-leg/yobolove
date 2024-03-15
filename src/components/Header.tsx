import React, { ReactElement, useMemo, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Container, Hidden, IconButton, SwipeableDrawer, Toolbar } from "@mui/material";
import { css } from "@emotion/css";
import { useRouter } from "next/router";
import { toRemWithUnit } from "../styles/options/Function";
import palette from "../styles/options/Palette";
import CenterHeaderContents, { CenterHeaderMenu } from "./CenterHeaderContents";
import CaregiverHeaderContents, { CaregiverHeaderMenu } from "./CaregiverHeaderContents";
import ConverterUtil from "../util/ConverterUtil";
import HeaderMenu from "./HeaderMenu";
import EventUtil from "../util/EventUtil";

const primary = palette.primary as { main: string };
const menuStyle = css`
    a > *:hover {
        color: ${primary.main};
    }
`;

/**
 * 공통 헤더컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1989%3A100569)
 * @category Component
 */
function Header() {
    const router = useRouter();
    /**
     * 햄버거 메뉴 열림 여부
     */
    const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

    /**
     * 햄버거 메뉴 닫기
     */
    const closeDrawer = () => {
        setIsOpenDrawer(false);
    };

    /**
     * 햄버거 메뉴 열기
     */
    const openDrawer = () => {
        EventUtil.gtmEvent("click", "hamburger", "center", "0");

        setIsOpenDrawer(true);
    };

    /**
     * Header contents 부분 dom
     */
    const headerContentsDom = useMemo<ReactElement>(() => {
        if (!router) return <div data-cy="empty-menu" />;

        if (ConverterUtil.isCenterPath(router.pathname)) {
            return <CenterHeaderContents menuStyle={menuStyle} />;
        }

        return <CaregiverHeaderContents menuStyle={menuStyle} />;
    }, [router?.pathname]);

    /**
     * 햄버거 메뉴 부분
     */
    const menuDom = useMemo<ReactElement>(() => {
        if (!router) return <div data-cy="empty-menu" />;

        if (ConverterUtil.isCenterPath(router.pathname)) {
            return <HeaderMenu menuList={CenterHeaderMenu} />;
        }

        return <HeaderMenu menuList={CaregiverHeaderMenu} />;
    }, [router?.pathname]);

    return (
        <>
            <AppBar position="fixed" role="navigation" aria-label="Global Navigation Bar" elevation={1}>
                <Toolbar
                    sx={{
                        maxWidth: "lg",
                        minHeight: { sm: toRemWithUnit(14), md: toRemWithUnit(16) },
                        px: { xs: 4, sm: 6, md: 8 },
                    }}
                    component={Container}
                    variant="dense"
                >
                    <Hidden mdUp>
                        <IconButton onClick={openDrawer} data-cy="hamburger-icon" aria-label="open the menu" aria-haspopup aria-expanded={isOpenDrawer} aria-controls="menu">
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    {headerContentsDom}
                </Toolbar>
            </AppBar>

            <SwipeableDrawer
                onBackdropClick={closeDrawer}
                onOpen={openDrawer}
                open={isOpenDrawer}
                onClose={closeDrawer}
                anchor="left"
                disableSwipeToOpen
                PaperProps={{
                    role: "menu",
                }}
                sx={{ display: isOpenDrawer ? "flex" : "none" }}
                transitionDuration={{ enter: 0, exit: 0 }}
            >
                <Box
                    sx={{
                        width: {
                            xs: 288,
                            sm: 308,
                            md: 320,
                            lg: 320,
                        },
                    }}
                    role="presentation"
                    onClick={closeDrawer}
                    onKeyDown={closeDrawer}
                >
                    {menuDom}
                </Box>
            </SwipeableDrawer>
        </>
    );
}

export default React.memo(Header);
