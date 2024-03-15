import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRecoilState } from "recoil";
import { useEffect, useRef } from "react";
import nl2br from "react-nl2br";
import { alertRecoilState } from "../recoil/AlertRecoil";
import { toRem } from "../styles/options/Function";
import { Undefinable } from "../type/Undefinable";

const CLOSE_TIMEOUT_SECONDS: number = 1.2;
/**
 * Alert 컴포넌트 정의입니다.
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=3451%3A119999)
 * @category Component
 */
export default function Alert() {
    const [alertRecoil, setAlertRecoil] = useRecoilState(alertRecoilState);
    const closeTimeout = useRef<Undefinable<ReturnType<typeof setTimeout>>>();

    /**
     * Alert 닫기.
     * timeout 이 있으면 clearTimeout 하고 alertRecoil.open false 로 변경.
     * **가끔 여러 레이어가 올라와 있으면 html-overflow 가 그대로 hidden 이 되는 경우가 있음. 그런경우에 강제적으로 default 값으로 변경**
     */
    const close = () => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setAlertRecoil({
            open: false,
            title: "",
        });
    };

    /**
     * 열리고 나서 {@link CLOSE_TIMEOUT_SECONDS} 초 후에 닫힘
     */
    useEffect(() => {
        if (alertRecoil.open) {
            closeTimeout.current = setTimeout(() => {
                if (alertRecoil.open) {
                    close();
                }
            }, CLOSE_TIMEOUT_SECONDS * 1000);
        }
    }, [alertRecoil.open]);

    if (!alertRecoil.open) {
        return <span />;
    }

    return (
        <Dialog
            open={alertRecoil.open}
            disableEscapeKeyDown={false}
            scroll="body"
            fullWidth
            maxWidth="sm"
            onBackdropClick={close}
            sx={{ p: 0, m: 0 }}
            PaperProps={{ elevation: 0 }}
            closeAfterTransition
        >
            <Box sx={{ p: 5, pt: 6 }} display="flex" flexDirection="column" alignItems="center">
                {alertRecoil.hasIcon && <CheckCircleOutlineIcon fontSize="large" sx={{ mb: 4, fontSize: toRem(40) }} />}
                <DialogTitle variant="subtitle1" sx={{ p: 0 }}>
                    {alertRecoil.title}
                </DialogTitle>
                {alertRecoil.content && (
                    <DialogContent sx={{ mt: 1, p: 0, width: "100%", textAlign: "center" }}>
                        <Typography data-cy="alert-content" variant="body1" sx={{ width: "100%", wordBreak: "break-all" }}>
                            {nl2br(alertRecoil.content)}
                        </Typography>
                    </DialogContent>
                )}
            </Box>
        </Dialog>
    );
}
