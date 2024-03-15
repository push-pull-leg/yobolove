import Link from "next/link";
import React, { memo, ReactNode, useMemo } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import sectionStyle from "../../styles/sectionStyle";
import EventUtil from "../../util/EventUtil";

type EmptyYoboRecruitingMsgPropsType = {
    /**
     * 로그인 되었는지 여부
     */
    isLoggedIn: boolean;
    /**
     * 유사한 조건의 공고 있는지 여부
     */
    hasNormalRecruitings: boolean;
    /**
     * 근무조건 필터 모달창을 여는 메소드
     */
    openFilter: () => void;
    /**
     * 모든(요보사랑, 유사 조건) 공고의 로딩중 여부
     */
    isRecruitingsLoading: boolean;
};

/**
 * 요보사랑 공고 없을 경우 보여지는 메세지
 * [피그마 시안](https://www.figma.com/file/KZuFXtExUsaJG62QMS8FSa/%5B%ED%94%84%EB%A1%9C%EB%8D%95%ED%8A%B8%5D%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%EC%8A%A4%ED%94%84%EB%A6%B0%ED%8A%B8?node-id=691%3A13737&t=0hlX6TSz0zrOB2tM-0)
 * @category Component
 */
function RecruitingsFilterGuide({ isLoggedIn, hasNormalRecruitings, openFilter, isRecruitingsLoading }: EmptyYoboRecruitingMsgPropsType) {
    const getMessage = useMemo<ReactNode>(() => {
        if (!isLoggedIn) return "맞춤 공고가 생기면 카톡/문자로 알려드릴게요!";

        return hasNormalRecruitings ? (
            "원하는 조건과 유사한 공고를 보여드릴게요!"
        ) : (
            <>
                더 많은 공고를 볼 수 있게
                <br /> <strong>근무조건 필터</strong>를 변경해보면 어떨까요?
            </>
        );
    }, [isLoggedIn, hasNormalRecruitings]);

    const clickJobAlertBtn = () => {
        EventUtil.gtmEvent("click", "apply", "board", "noContent");
    };

    const buttonDom = useMemo(() => {
        if (!isLoggedIn) {
            return (
                <Link href="/account" as="/내정보" passHref>
                    <a>
                        <Button variant="contained" size="medium" endIcon={<ArrowForwardIcon />} fullWidth color="primary" onClick={clickJobAlertBtn}>
                            일자리 알림 신청
                        </Button>
                    </a>
                </Link>
            );
        }

        if (hasNormalRecruitings) return null;

        return (
            <Button variant="outlined" size="medium" onClick={openFilter} color="secondary" fullWidth>
                근무조건 필터 변경
            </Button>
        );
    }, [isLoggedIn, hasNormalRecruitings]);

    return (
        <Box
            {...sectionStyle(
                {
                    textAlign: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                },
                "sm",
            )}
            display="flex"
            flexDirection="column"
        >
            {isRecruitingsLoading ? (
                <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
                    <CircularProgress size={80} thickness={4} />
                </Box>
            ) : (
                <>
                    <Typography variant="body2">
                        조건에 꼭 맞는 공고가 현재 없어요. <br />
                        {getMessage}
                    </Typography>
                    {buttonDom}
                </>
            )}
        </Box>
    );
}

export default memo(RecruitingsFilterGuide);
