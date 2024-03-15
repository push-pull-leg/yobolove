import { Box, CircularProgress, Modal } from "@mui/material";
import { useRecoilState } from "recoil";
import React from "react";
import { loadingRecoilState } from "../recoil/LoadingRecoil";

/**
 * 공통 로딩 컴포넌트 입니다.
 *
 * @category Component
 */
function Loading() {
    const [loadingRecoil, setLoadingRecoil] = useRecoilState(loadingRecoilState);
    return (
        <Modal open={loadingRecoil.open} onClose={() => setLoadingRecoil({ open: false })} data-cy="loading-modal">
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
                <CircularProgress size={80} thickness={4} />
            </Box>
        </Modal>
    );
}

export default Loading;
