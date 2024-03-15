import { Typography } from "@mui/material";
import React from "react";
import { useRecoilState } from "recoil";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import SimpleSwiper from "./SimpleSwiper";
import UsePreventBack from "../hook/UsePreventBack";

/**
 * Dialog 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=861%3A71104)
 * @category Component
 */
function Dialog() {
    const [dialogRecoil, setDialogRecoil] = useRecoilState(dialogRecoilState);

    const closeDialog = () => {
        setDialogRecoil({
            open: false,
        });
    };

    /**
     * Dialog 닫기
     */
    const close = () => {
        closeDialog();
        if (dialogRecoil.onClose !== undefined) {
            dialogRecoil.onClose();
        }
    };

    /**
     * 확인 버튼 누르기
     */
    const confirm = () => {
        closeDialog();
        if (dialogRecoil.onConfirm !== undefined) {
            dialogRecoil.onConfirm();
        }
    };

    /**
     * 취소 버튼 누르기
     */
    const cancel = () => {
        closeDialog();
        if (dialogRecoil.onCancel !== undefined) {
            dialogRecoil.onCancel();
        }
    };
    UsePreventBack("dialog", dialogRecoil.open, close);
    return (
        <SimpleSwiper
            open={dialogRecoil.open}
            onClose={close}
            onCancel={cancel}
            title={dialogRecoil.title}
            hasCloseButton={dialogRecoil.hasCloseButton}
            confirmButtonText={dialogRecoil.confirmButtonText}
            hasCancelButton={dialogRecoil.hasCancelButton}
            cancelButtonText={dialogRecoil.cancelButtonText}
            onConfirm={confirm}
            confirmButtonStyle={dialogRecoil.confirmButtonStyle}
            cancelButtonStyle={dialogRecoil.cancelButtonStyle}
            flexDirection={dialogRecoil.flexDirection}
            cancelButton={dialogRecoil.cancelButton}
            hasConfirmButton={dialogRecoil.hasConfirmButton}
            bottomSubButtonText={dialogRecoil.bottomSubButtonText}
            onClickBottomSubButton={dialogRecoil.onClickBottomSubButton}
            isCloseWhenBackDropClick={dialogRecoil.isCloseWhenBackDropClick}
        >
            <Typography variant="body1" component="div" sx={{ display: "flex", flexDirection: "column" }}>
                {dialogRecoil.content}
            </Typography>
            {dialogRecoil.caption && (
                <Typography variant="caption" color="primary" sx={{ mt: 2, "&::before": { content: '"*"', display: "inline-block" } }} display="flex">
                    {dialogRecoil.caption}
                </Typography>
            )}
        </SimpleSwiper>
    );
}

export default Dialog;
