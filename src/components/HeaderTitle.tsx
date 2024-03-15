import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { css } from "@emotion/css";
import { Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import Logo from "../styles/images/img-yobologo-combi1.svg";
import { titleRecoilState } from "../recoil/TitleRecoil";
import ConverterUtil from "../util/ConverterUtil";

const logoStyle = css`
    vertical-align: top;
`;

/**
 * 헤더 타이틀 관련 컴포넌트. {@link titleRecoilState} 리코일 데이터를 이용해서 header title 값을 글로벌로 관리해줌
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1025%3A44508)
 * @category Component
 */
function HeaderTitle() {
    const router = useRouter();
    const titleRecoil = useRecoilValue(titleRecoilState);
    if (titleRecoil.headerTitle) {
        return (
            <Typography variant="h6" color="text.primary">
                {titleRecoil.headerTitle}
            </Typography>
        );
    }
    if (ConverterUtil.isCenterPath(router.pathname)) {
        return (
            <Link href="/center" as="/기관">
                <a>
                    <Typography color="primary" sx={{ fontWeight: 600 }}>
                        요보사랑 인력찾기
                    </Typography>
                </a>
            </Link>
        );
    }
    return (
        <Link href="/">
            <a>
                <Logo height={18} width={100} className={logoStyle} />
            </a>
        </Link>
    );
}

export default React.memo(HeaderTitle);
