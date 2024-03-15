import { Box, Button, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import React from "react";
import sectionStyle from "../styles/sectionStyle";

/**
 * {@link Error} props
 * @category PropsType
 */
type ErrorPropsType = {
    /**
     * 에러 타이틀
     */
    title?: string;
    /**
     * 설명
     */
    description?: string;
    /**
     * 버튼 텍스트
     */
    buttonText?: string;
    /**
     * 버튼 클릭 이벤트
     */
    onClick?: () => void;
};

/**
 * Error 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=2158%3A100827)
 * @category Component
 */
function Error(props: ErrorPropsType) {
    const { title, description, buttonText, onClick } = props;
    return (
        <Box
            component="section"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            {...sectionStyle({ pt: 8, textAlign: "center", margin: "0 auto" }, "sm")}
            data-cy="error"
        >
            <ErrorOutline fontSize="large" />
            <Typography variant="subtitle1" display="flex" sx={{ mt: 2 }}>
                {title}
            </Typography>
            <Typography variant="body2" display="flex" sx={{ mt: 2 }}>
                {description}
            </Typography>
            {buttonText && (
                <Button variant="outlined" onClick={onClick} sx={{ mt: 4 }}>
                    {buttonText}
                </Button>
            )}
        </Box>
    );
}

Error.defaultProps = {
    title: "서버와의 통신에 실패했습니다.",
    description: "잠시 후 다시 시도해주세요",
    buttonText: undefined,
    onClick: undefined,
};

export default Error;
