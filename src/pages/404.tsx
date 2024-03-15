import type { NextPage } from "next";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import sectionStyle from "../styles/sectionStyle";
import ConverterUtil from "../util/ConverterUtil";

/**
 * Not Found
 * 로그인 no
 *
 * @type NextPage
 * @category page
 * @function Condition
 * @link https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1007%3A45489
 * @return ReactElement
 */
const NotFound: NextPage = function NotFound() {
    const router = useRouter();
    return (
        <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "center" }, "sm", true)}>
            <Typography variant="h3">요청하신 페이지를 찾을 수 없어요</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
                입력하신 페이지 주소가 올바른지 확인해주세요.
            </Typography>

            <Link href={ConverterUtil.isCenterPath(router.pathname) ? "/기관" : "/"} passHref>
                <a>
                    <Button variant="contained" color="primary" sx={{ mt: 9 }} size="large">
                        홈으로 돌아가기
                    </Button>
                </a>
            </Link>
        </Box>
    );
};
export default NotFound;
