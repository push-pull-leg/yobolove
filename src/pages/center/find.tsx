import type { NextPage } from "next";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import sectionStyle from "../../styles/sectionStyle";
import UseTitle from "../../hook/UseTitle";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";

/**
 * 기관용 서비스 - 계정 찾기
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1527%3A89062)
 * @category Page
 * @Center
 */
const Find: NextPage = function Find() {
    UseTitle("계정 찾기", "계정 찾기");
    return (
        <Box display="flex" height="100%" alignItems="flex-start" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
            <Typography variant="h3">어떤 정보를 찾으시겠어요?</Typography>

            <Link href="/center/find-id" as="/기관/아이디찾기" passHref>
                <a style={{ width: "100%" }}>
                    <Button size="large" variant="outlined" sx={{ mt: 5 }} fullWidth>
                        아이디 찾기
                    </Button>
                </a>
            </Link>

            <Link href="/center/find-password" as="/기관/비밀번호찾기" passHref>
                <a style={{ width: "100%" }}>
                    <Button size="large" variant="outlined" sx={{ mt: 5 }} fullWidth>
                        비밀번호 찾기
                    </Button>
                </a>
            </Link>
        </Box>
    );
};
export default WithHeadMetaData(Find);
