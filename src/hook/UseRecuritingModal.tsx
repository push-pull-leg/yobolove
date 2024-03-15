import { Box, useTheme } from "@mui/material";
import RecruitingContent from "../components/RecruitingContent";
import UsePopup from "./UsePopup";
import RecruitingDetailInterface from "../interface/RecruitingDetailInterface";

const UseRecruitingModal = () => {
    const theme = useTheme();
    const { openPopup } = UsePopup();
    const openRecruitingDetailModal = (recruiting: RecruitingDetailInterface, title?: string, handleClose?: () => void) =>
        openPopup(
            title || recruiting.address.roadAddressName,
            undefined,
            <Box
                component="article"
                sx={{
                    backgroundColor: theme.palette.primary.contrastText,
                    width: "100%",
                    margin: "0 auto",
                    p: 5,
                }}
            >
                <RecruitingContent recruiting={recruiting} />
            </Box>,
            handleClose,
        );
    return { openRecruitingDetailModal };
};
export default UseRecruitingModal;
