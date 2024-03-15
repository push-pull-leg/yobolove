import { Box, Dialog, DialogContent, DialogTitle, Fab, Typography } from "@mui/material";
import { AddIcCall, LiveHelpOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import KakaotalkIcon from "../styles/images/img-icon-kakaotalk.svg";
import EventUtil from "../util/EventUtil";

/**
 * 페이지 우측 하단 help floating button
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1502%3A74627)
 * @category Component
 */
function Help() {
    /**
     * 열림 여부
     */
    const [openHelp, setOpenHelp] = useState<boolean>(false);

    return (
        <>
            <Fab
                color="primary"
                aria-label="help"
                sx={{
                    position: "fixed",
                    right: 20,
                    bottom: 20,
                    width: 60,
                    height: 60,
                }}
                onClick={() => {
                    setOpenHelp(true);
                    EventUtil.gtmEvent("click", "help", "home", "0", "/");
                }}
                size="large"
            >
                <LiveHelpOutlined fontSize="large" />
            </Fab>

            <Dialog
                open={openHelp}
                disableEscapeKeyDown={false}
                scroll="paper"
                fullWidth
                maxWidth="sm"
                onClose={() => setOpenHelp(false)}
                sx={{ p: 0, m: 0 }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        width: "auto",
                        borderRadius: 2,
                        position: "absolute",
                        right: 20,
                        bottom: 20,
                        margin: 0,
                    },
                }}
                closeAfterTransition
            >
                <Box sx={{ p: 5 }} display="flex" flexDirection="column" alignItems="center">
                    <DialogTitle variant="subtitle1" sx={{ p: 0 }}>
                        도움이 필요하신가요?
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2, p: 0, width: "100%" }}>
                        <Typography variant="body1">
                            요보사랑 상담센터
                            <br />
                            평일 09:30~17:30
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 5 }} color="primary">
                            <a
                                href="https://pf.kakao.com/_WikWK/chat"
                                onClick={() => EventUtil.gtmEvent("click", "talk", "home", "help", "/")}
                                target="_blank"
                                rel="noreferrer"
                                data-cy="link-kakao"
                            >
                                <KakaotalkIcon /> 카카오톡 상담하기
                            </a>
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 5 }} color="primary">
                            <a href="tel:1661-7939" onClick={() => EventUtil.gtmEvent("click", "call", "home", "help", "/")}>
                                <AddIcCall /> 상담원과 통화하기 <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1661-7939
                            </a>
                        </Typography>
                    </DialogContent>
                </Box>
            </Dialog>
        </>
    );
}

export default React.memo(Help);
