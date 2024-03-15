import { css } from "@emotion/css";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import { toRem, toRemWithUnit } from "../styles/options/Function";
import Logo from "../styles/images/img-yobologo-combi1.svg";
import KakaotalkIcon from "../styles/images/img-icon-kakaotalk.svg";
import palette from "../styles/options/Palette";
import EventUtil from "../util/EventUtil";
import PACKAGE from "../../package.json";
import UsePopup from "../hook/UsePopup";
import ConverterUtil from "../util/ConverterUtil";

const footerStyle = css`
    display: flex;
    justify-content: center;
    background-color: ${palette.background?.default || ""};
`;

const termsStyle = css`
    display: flex;
    gap: ${toRem(20)};
`;

const TERMS_DOMAIN = "https://agreement.yobolove.co.kr";

/**
 * Footer 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=2004%3A101051)
 * @category Component
 */
function Footer() {
    const { openPopup } = UsePopup();

    const { isCenterPath } = ConverterUtil;
    const router = useRouter();
    const isCenter = isCenterPath(router.pathname);

    return (
        <footer className={footerStyle}>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "lg",
                    minHeight: { sm: toRemWithUnit(14), md: toRemWithUnit(16) },
                    px: { xs: 4, sm: 6, md: 8 },
                    py: { xs: 8, sm: 8, md: 9 },
                    display: "flex",
                    gap: {
                        xs: 7,
                        sm: 7,
                    },
                    justifyContent: "space-between",
                    flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "row",
                    },
                    overflow: "hidden",
                }}
            >
                <div style={{ width: toRem(300) }}>
                    <Link href="/" passHref>
                        <a>
                            <Logo height={23} width={128} />
                        </a>
                    </Link>
                    <Typography variant="body2" sx={{ mt: 3 }}>
                        요보사랑 고객센터 (평일 09:30~17:30)
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1.5 }}>
                        <a href="https://pf.kakao.com/_WikWK/chat" onClick={() => EventUtil.gtmEvent("click", "talk", "home", "footer", "/")} target="_blank" rel="noreferrer">
                            <KakaotalkIcon /> 카카오톡 문의
                        </a>
                    </Typography>
                </div>
                <div style={{ flex: 1 }}>
                    <div className={termsStyle}>
                        <Typography
                            role="button"
                            variant="overline"
                            sx={{ cursor: "pointer" }}
                            onClick={() => openPopup("개인정보처리방침", isCenter ? `${TERMS_DOMAIN}/privacy7` : `${TERMS_DOMAIN}/privacy1`)}
                        >
                            개인정보처리방침
                        </Typography>
                        <Typography
                            role="button"
                            variant="overline"
                            sx={{ cursor: "pointer" }}
                            onClick={() => openPopup("서비스이용약관", isCenter ? `${TERMS_DOMAIN}/privacy8` : `${TERMS_DOMAIN}/privacy2`)}
                        >
                            서비스이용약관
                        </Typography>
                    </div>
                    <Typography variant="overline" sx={{ mt: 4, textTransform: "none" }} display="block" color="text.secondary">
                        (주)한국시니어연구소
                    </Typography>
                    <Typography variant="overline" sx={{ mt: 4, textTransform: "none" }} display="block" color="text.secondary">
                        대표:이진열 ｜ 주소:서울 강남구 테헤란로2길 27 패스트파이브 빌딩 1304호
                    </Typography>
                    <Typography variant="overline" sx={{ textTransform: "none" }} display="block" color="text.secondary">
                        이메일:hello@kslab.co.kr ｜ 카카오톡:@요보사랑
                    </Typography>
                    <Typography variant="overline" sx={{ textTransform: "none" }} display="block" color="text.secondary">
                        사업자등록번호:690-87-01308 ｜ 직업정보제공사업 신고번호:J1200020220026
                    </Typography>
                    <Typography variant="overline" sx={{ textTransform: "none" }} display="block" color="text.secondary">
                        Copyright © 2019 Korea Senior Lab.Co.,Ltd.
                    </Typography>
                    <Typography variant="overline" sx={{ mt: 1, textTransform: "none" }} display="block" color="text.disabled">
                        버전 정보(v{ConverterUtil.convertVersionOfProduct(PACKAGE.version)})
                    </Typography>
                </div>
            </Box>
        </footer>
    );
}

export default React.memo(Footer);
