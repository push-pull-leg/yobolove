import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import Cookies from "universal-cookie";

import { dialogRecoilState } from "../recoil/DialogRecoil";
import NoticeInterface from "../interface/NoticeInterface";
import NoticeConfig from "../config/NoticeConfig";
import UsePopup from "./UsePopup";

const cookies = new Cookies();
const NOW = dayjs();

const getIdNoticeOpened = (noticeId: string) => `is${noticeId}Opened`;

const getIdNeverShowNotice = (noticeId: string) => `NEVER_SHOW_${noticeId}_POPUP`;

interface IUseNoticeEffectProps {
    /**
     * canNoticeOpen 값을 매개변수로 받아 처리하는 callback 함수
     * @param canNoticeOpen
     */
    callback?: (canNoticeOpen: boolean) => void;
}

/**
 * 공지사항형 모달
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%5B%ED%94%84%EB%A1%9C%EB%8D%95%ED%8A%B8%5D%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=6210%3A142088&t=s4lZ02UVoyUyU5FE-0)
 *
 * @constructor
 * @param props
 */
export default function UseNoticeEffect(props?: IUseNoticeEffectProps) {
    const { callback } = props || {};
    const isLive = process.env.NEXT_PUBLIC_NOTICE_ENV === "live";
    const { openPopup } = UsePopup();
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    const closeNotice = () =>
        setDialogRecoil({
            open: false,
        });

    const openNotice = (notice: NoticeInterface) => {
        const { id, title, content, cancelButtonText, confirmButtonText, bottomSubButtonText, onClickBottomSubButton, isNeverShowNoticeButtonShowing } = notice;

        const idNeverShowNotice = getIdNeverShowNotice(id);
        const period = NoticeConfig.getPeriod(notice, isLive);

        const handleClickNeverShowButton = () => {
            cookies.set(idNeverShowNotice, true, { expires: dayjs(period[1], "YYYY-MM-DD").toDate() });
            closeNotice();
        };

        setDialogRecoil({
            open: true,
            title: (
                <Typography variant="h3" color="text.primary">
                    {title}
                </Typography>
            ),
            content,
            hasCancelButton: !!cancelButtonText,
            cancelButtonText,
            hasConfirmButton: !!confirmButtonText,
            confirmButtonText,
            bottomSubButtonText,
            onClickBottomSubButton: isNeverShowNoticeButtonShowing ? () => handleClickNeverShowButton() : onClickBottomSubButton,
        });
    };

    useEffect(() => {
        const notice = NoticeConfig.getNotice(NOW, { openPopup }, isLive);

        let canNoticeOpen = false;

        if (notice) {
            const { id } = notice;

            const idIsNoticeOpened = getIdNoticeOpened(id);
            const idNeverShowNotice = getIdNeverShowNotice(id);

            const isNoticeOpened = sessionStorage.getItem(idIsNoticeOpened) === "true";
            const isNeverShowNotice = cookies.get(idNeverShowNotice);
            canNoticeOpen = !isNoticeOpened && !isNeverShowNotice;

            if (canNoticeOpen) {
                sessionStorage.setItem(idIsNoticeOpened, "true");
                openNotice(notice);
            }
        }

        callback?.(canNoticeOpen);
    }, []);
}
