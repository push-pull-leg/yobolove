import { Box, Typography } from "@mui/material";
import { css } from "@emotion/css";
import Link from "next/link";
import { useMemo } from "react";
import theme from "../styles/Theme";
import EXTERNAL_SITE_URL_CONFIG from "../config/ExternalSiteUrlConfig";

const wrapperStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const countingPassWrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const purchasePassButtonStyles = css`
    text-align: center;
    font-size: 18px;
    padding: 4px 10px;
    color: ${theme.palette.primary.main};
    border: 2px solid rgba(255, 86, 124, 0.5);
    border-radius: 4px;

    &:hover {
        backgroundcolor: ${theme.palette.primary.light};
    }
`;

/**
 * 무한대를 나타내는 값을 변수화 함.
 */
const INFINITY = -1;

interface RecruitingRegistrationPassBoxProps {
    /**
     * '사용할 등록권'이 보여지는가
     */
    isCountingPassIntendedToUseNowShow?: boolean;
    /**
     * '등록권 구매'가 있는가? 그 위치는 어디인가?
     */
    passPurchaseButtonPosition?: "TOP" | "BOTTOM";
    /**
     * 등록권 홍보 문구가 있는가?
     */
    isPassPrPhraseShow?: boolean;
    /**
     * '현재 보유 등록권'의 갯수
     */
    passCount?: number | typeof INFINITY;
    /**
     * '사용할 등록권'의 갯수
     */
    numPassToUse?: number;
}

/**
 * 유료화 기능의 공통 컴포넌트 (분홍 박스)
 *
 * [피그마 시안](https://www.figma.com/file/vPPC16VClh27zfb1E9CiCN/%5B%ED%94%84%EB%A1%9C%EB%8D%95%ED%8A%B8%5D%EC%9B%90%ED%84%B0%EC%B9%98-%EA%B5%AC%EC%9D%B8-%EA%B3%B5%EA%B3%A0-%EB%93%B1%EB%A1%9D-%EC%84%9C%EB%B9%84%EC%8A%A4-%EA%B8%B0%ED%9A%8D%2F230103?node-id=3239-30057&t=ldoRM0OWUCL92bax-0)
 * @param isCountingPassIntendedToUseNowShow
 * @param isPassPrPhraseShow
 * @param passCount
 * @constructor
 */
function RecruitingRegistrationPassBox({
    isCountingPassIntendedToUseNowShow,
    passPurchaseButtonPosition,
    isPassPrPhraseShow,
    passCount,
    numPassToUse,
}: RecruitingRegistrationPassBoxProps) {
    /**
     * '등록권 구매' 버튼
     */
    const purchasePassButtonDom = useMemo(
        () => (
            <Link href={EXTERNAL_SITE_URL_CONFIG.ONETOUCH_PAYMENT_PAGE_URL} passHref>
                <a className={purchasePassButtonStyles} target="_blank" rel="noopener noreferrer">
                    등록권 구매
                </a>
            </Link>
        ),
        [],
    );

    return (
        <Box display="flex" flexDirection="column" gap={6} sx={{ backgroundColor: theme.palette.primary.light, p: 5 }}>
            <div className={wrapperStyle}>
                <Typography variant="overline">원터치 공고 등록권</Typography>
                {passPurchaseButtonPosition === "TOP" && purchasePassButtonDom}
            </div>
            <div className={countingPassWrapperStyle}>
                <div className={wrapperStyle}>
                    <Typography variant="body2">현재 보유 등록권</Typography>
                    <Typography variant="body2">{passCount === INFINITY ? "무제한" : `${passCount}개`}</Typography>
                </div>
                {isCountingPassIntendedToUseNowShow && (
                    <div className={wrapperStyle}>
                        <Typography variant="h4" fontWeight={600}>
                            사용할 등록권
                        </Typography>
                        <Typography variant="h4" fontWeight={600}>
                            {`${numPassToUse}개`}
                        </Typography>
                    </div>
                )}
                {passPurchaseButtonPosition === "BOTTOM" && purchasePassButtonDom}
                {isPassPrPhraseShow && (
                    <Typography variant="overline" display="flex" textAlign="center" justifyContent="center" color={theme.palette.primary.main}>
                        여기저기 공고를 등록하는데 드는 시간을
                        <br /> 10배 이상 줄여주는 원터치 구인공고 등록!
                    </Typography>
                )}
            </div>
        </Box>
    );
}

export default RecruitingRegistrationPassBox;

RecruitingRegistrationPassBox.defaultProps = {
    isCountingPassIntendedToUseNowShow: false,
    passPurchaseButtonPosition: undefined,
    isPassPrPhraseShow: false,
    passCount: false,
    numPassToUse: 1,
};
