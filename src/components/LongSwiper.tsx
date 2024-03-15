import React, { ReactElement } from "react";
import { AppBar, Box, Container, DialogContent, DialogTitle, IconButton, SwipeableDrawer, Toolbar, Typography } from "@mui/material";
import { ArrowBack, Close } from "@mui/icons-material";
import { css } from "@emotion/css";
import { toRem, toRemWithUnit } from "../styles/options/Function";

const paperStyle = css`
    max-width: 600px;
    padding: 0;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    @media (min-width: ${toRem(600)}) {
        max-height: calc(100vh - ${toRem(64)});
        max-width: ${toRem(600)};
        top: auto;
        left: auto;
        right: auto;
        bottom: auto;
    }
`;

/**
 * {@link LongSwiper} props
 * @category PropsType
 */
type SwiperPropsType = {
    /**
     * 열림 여부
     */
    open: boolean;
    /**
     * 닫힐 떄 이벤트
     */
    onClose: () => void;
    /**
     * 제목
     */
    title?: string;
    /**
     * children
     */
    children?: ReactElement;
    /**
     * 모서리 rounded 여부
     */
    isRounded?: boolean;
    /**
     * content 부분 padding
     */
    padding?: number | object;
    /**
     * zIndex
     */
    zIndex?: number;
};

/**
 * 화면전체를 차지하는 Bottom Sheet. 팝업, 다음주소찾기 등에서 사용됨
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=924%3A72991)
 * @category Component
 */
function LongSwiper(props: SwiperPropsType) {
    const { open, onClose, title, children, isRounded, padding, zIndex } = props;

    if (!open) {
        return <span />;
    }

    const rootClass = css`
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: ${zIndex};
    `;

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            disableScrollLock={false}
            onOpen={onClose}
            swipeAreaWidth={0}
            classes={{
                root: rootClass,
                paper: paperStyle,
            }}
            transitionDuration={{ enter: 130, exit: 0 }}
            PaperProps={{
                elevation: 0,
                sx: {
                    inset: "auto",
                    borderRadius: isRounded ? "12px 12px 0 0" : 0,
                    maxHeight: {
                        sm: "100%",
                        md: "calc(80vh - 64px)",
                        mt: 2,
                    },
                },
            }}
            ModalProps={{
                keepMounted: false,
                closeAfterTransition: true,
            }}
            disableBackdropTransition
            role="dialog"
            data-cy="long-swiper"
        >
            {title && (
                <DialogTitle sx={{ p: 0 }}>
                    <AppBar position="relative" aria-label="Sub Navigation Bar" elevation={1}>
                        <Toolbar
                            sx={{
                                maxWidth: "lg",
                                minHeight: { sm: toRemWithUnit(14), md: toRemWithUnit(16) },
                                px: { xs: 4, sm: 6, md: 8 },
                            }}
                            component={Container}
                            variant="dense"
                        >
                            <IconButton sx={{ visibility: "hidden" }}>
                                <ArrowBack />
                            </IconButton>
                            <Box flex={1} display="flex" flexWrap="nowrap" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                                <Typography variant="h6" flex={1} align="center" role="heading">
                                    {title}
                                </Typography>
                            </Box>
                            <IconButton role="button" data-cy="close" onClick={onClose}>
                                <Close />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </DialogTitle>
            )}
            {children && (
                <DialogContent
                    sx={{
                        p: padding || 0,
                        width: "100%",
                        height: 9999,
                        visibility: "inherit",
                        mt: 2,
                        mb: 2,
                    }}
                    role="article"
                >
                    {children}
                </DialogContent>
            )}
        </SwipeableDrawer>
    );
}

LongSwiper.defaultProps = {
    title: undefined,
    children: undefined,
    isRounded: false,
    padding: undefined,
    zIndex: undefined,
};
export default LongSwiper;
