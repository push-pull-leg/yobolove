import { Box, Button, DialogActions, DialogContent, DialogTitle, Drawer, IconButton } from "@mui/material";
import React, { ReactElement, ReactNode, useMemo } from "react";
import { css } from "@emotion/css";
import { Close } from "@mui/icons-material";
import breakpoints from "../styles/options/Breakpoints";
import { toRemWithUnit } from "../styles/options/Function";
import EventUtil from "../util/EventUtil";
import { ButtonStyleType } from "../type/ButtonStyleType";
import { zSimpleSwiper } from "../styles/options/ZIndex";

const rootClass = css`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: ${zSimpleSwiper};
    @media (max-width: ${Number(breakpoints.values?.sm)}px) {
        align-items: flex-end;
    }
`;

const paperClass = css`
    border-radius: 12px;
    max-width: ${Number(breakpoints.values?.sm)}px;
    padding: 0;
    width: 100%;
    top: auto;
    left: auto;
    right: auto;
    bottom: auto;
    margin-top: 0.25rem;
    @media (max-width: ${Number(breakpoints.values?.sm)}px) {
        margin: 0;
        border-radius: 12px 12px 0 0;
        width: 100%;
        max-width: 100% !important;
    }
`;

const actionClass = css`
    display: flex;
    gap: ${toRemWithUnit(1)};

    > * {
        margin-left: 0 !important;
    }
`;

/**
 * {@link SimpleSwiper} props
 * @category PropsType
 */
type SimpleSwiperPropsType = {
    /**
     * 열림 여부
     */
    open: boolean;
    /**
     * children
     */
    children: ReactNode;
    /**
     * 닫힘 이벤트
     */
    onClose?: () => void;
    /**
     * title 영역
     */
    title?: ReactNode;
    /**
     * 확인버튼텍스트
     */
    confirmButtonText?: string;
    /**
     * 확인버튼 스타일
     */
    confirmButtonStyle?: ButtonStyleType;
    /**
     * 확인버튼 클릭 이벤트
     */
    onConfirm: () => void;
    /**
     * 취소 버튼 노출 여부
     */
    hasCancelButton?: boolean;
    /**
     * 취소 버튼 텍스트
     */
    cancelButtonText?: string;
    /**
     * 취소 버튼 스타일
     */
    cancelButtonStyle?: ButtonStyleType;
    /**
     * 취소 버튼 클릭 이벤트
     */
    onCancel?: () => void;
    /**
     * 취소버튼 Element. 값이 있다면 cancelButtonText, cancelButtonStyle 을 무시함.
     */
    cancelButton?: ReactElement;
    /**
     * 우측 상단 닫기 버튼 노출 여부
     */
    hasCloseButton?: boolean;
    /**
     * 확인/취소 버튼들의 flex-direction 값
     */
    flexDirection?: "row" | "column";
    /**
     * 백드롭(뒷 배경) 클릭 시, 추가할 이벤트
     */
    onBackDropClick?: () => void;
    /**
     * transformControl
     */
    transformControl?: string;
    /**
     * 확인버튼 여부
     */
    hasConfirmButton?: boolean;
    /**
     * 제일 하단에 위치한 서브 버튼의 텍스트
     */
    bottomSubButtonText?: string;
    /**
     * 하단 서브 버튼 클릭 이벤트
     */
    onClickBottomSubButton?: () => void;
    /**
     * 백드롭 클릭 시, 다이얼로그 닫기 불가 여부
     */
    isCloseWhenBackDropClick?: boolean;
};

/**
 * 화면 중간정도 차지하는 모달. Dialog 등에 사용
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=924%3A72991)
 * @category Component
 */
function SimpleSwiper(props: SimpleSwiperPropsType) {
    const {
        open,
        onClose,
        title,
        children,
        onConfirm,
        confirmButtonText,
        hasCancelButton,
        cancelButtonText,
        confirmButtonStyle,
        cancelButtonStyle,
        hasCloseButton,
        flexDirection,
        onBackDropClick,
        transformControl,
        cancelButton,
        hasConfirmButton,
        onCancel,
        bottomSubButtonText,
        onClickBottomSubButton,
        isCloseWhenBackDropClick,
    } = props;

    if (!open) {
        return <span />;
    }

    const close = () => {
        EventUtil.gtmEvent("click", "cancel", "signup", "0", "/회원가입");

        onClose?.();
    };

    const handleBackDropClickClose = () => {
        onBackDropClick?.();

        return isCloseWhenBackDropClick ? close() : null;
    };

    const cancel = () => {
        if (onCancel !== undefined) {
            onCancel();
        }
        EventUtil.gtmEvent("click", "cancel", "signup", "0", "/회원가입");
    };

    const cancelButtonDom = useMemo<ReactElement | undefined>(() => {
        if (!hasCancelButton) return undefined;
        if (cancelButton) return cancelButton;

        return (
            <Button variant={cancelButtonStyle} fullWidth onClick={() => cancel()} size="large" role="button" data-cy="cancel">
                {cancelButtonText}
            </Button>
        );
    }, [hasCancelButton, cancelButton, cancelButtonStyle, cancelButtonText]);

    return (
        <Drawer
            classes={{
                root: rootClass,
                paper: paperClass,
            }}
            disableRestoreFocus
            anchor="bottom"
            open={open}
            onClose={(event, reason) => (reason === "backdropClick" ? handleBackDropClickClose() : close())}
            disableScrollLock
            PaperProps={{
                elevation: 0,
                sx: {
                    inset: "auto",
                    zIndex: `${zSimpleSwiper}`,
                    transform: `${transformControl}`,
                },
                role: "dialog",
            }}
            ModalProps={{
                keepMounted: false,
                closeAfterTransition: true,
            }}
            transitionDuration={{ enter: 130, exit: 0 }}
            id="drawer-simple-swiper"
        >
            <Box sx={{ px: 4, py: 5 }} data-cy="modal-box" display="flex" flexDirection="column">
                {title && (
                    <DialogTitle variant="h3" sx={{ p: 0, width: "100%", display: "flex", flexDirection: "column" }} role="heading">
                        {hasCloseButton && (
                            <Box component="div" display="flex" justifyContent="flex-end">
                                <IconButton onClick={() => close()} data-cy="close">
                                    <Close color="action" />
                                </IconButton>
                            </Box>
                        )}
                        {title}
                    </DialogTitle>
                )}
                <DialogContent sx={{ mt: 2, p: 0 }} role="article">
                    {children}
                </DialogContent>
                {(hasCancelButton || hasConfirmButton) && (
                    <DialogActions sx={{ mt: 7, p: 0, width: "100%", flexDirection }} className={actionClass}>
                        {cancelButtonDom}
                        {hasConfirmButton && (
                            <Button variant={confirmButtonStyle} fullWidth onClick={() => onConfirm()} autoFocus size="large" role="button" data-cy="confirm">
                                {confirmButtonText}
                            </Button>
                        )}
                    </DialogActions>
                )}
                {bottomSubButtonText && (
                    <>
                        <br />
                        <Button
                            data-cy="sub-button"
                            variant="text"
                            color="inherit"
                            size="small"
                            onClick={() => onClickBottomSubButton?.()}
                            sx={{ textDecoration: "underline", color: "text.secondary", margin: "0 auto" }}
                        >
                            {bottomSubButtonText}
                        </Button>
                    </>
                )}
            </Box>
        </Drawer>
    );
}

SimpleSwiper.defaultProps = {
    title: undefined,
    onClose: undefined,
    onCancel: undefined,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    hasCancelButton: false,
    confirmButtonStyle: "contained",
    cancelButtonStyle: "outlined",
    hasCloseButton: false,
    flexDirection: "row",
    transformControl: undefined,
    cancelButton: undefined,
    hasConfirmButton: true,
    onBackDropClick: undefined,
    bottomSubButtonText: undefined,
    onClickBottomSubButton: undefined,
    isCloseWhenBackDropClick: true,
};

export default React.memo(SimpleSwiper);
