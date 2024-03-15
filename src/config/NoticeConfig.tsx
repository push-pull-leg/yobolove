import { Typography } from "@mui/material";
import React from "react";
import { Dayjs } from "dayjs";
import NoticeInterface from "../interface/NoticeInterface";
import { zUseNoticeEffectPopup } from "../styles/options/ZIndex";

class NoticeConfig {
    static optionFunctionMap = new Map<string, Function>();

    static noticeList: NoticeInterface[] = [
        {
            showingPeriods: { TEST_PERIOD: ["2023-02-27 10:00", "2023-02-28 13:59"], LIVE_PERIOD: ["2023-02-22 10:00", "2023-03-02 10:00"] },
            id: "TERMS_CHANGE",
            title: "요보사랑 이용약관 변경 안내",
            content: (
                <>
                    <Typography variant="body2" color="text.primary">
                        안녕하세요, 요보사랑입니다.
                        <br />
                        구직자 및 기관 회원의 이용약관 일부 내용이 변경되어 주요 내용을 사전에 알려드립니다.
                        <br />
                        수정된 약관은 <strong>2023년 3월 2일자</strong>로 적용될 예정이니 변경된 약관을 확인하시고 이용에 참고 부탁드립니다.
                        <br />
                        <br />
                        <Typography
                            variant="body2"
                            onClick={() => {
                                this.optionFunctionMap.get("openPopup")?.(
                                    "약관 변경 내역 안내",
                                    "https://agreement.yobolove.co.kr/change_230223",
                                    undefined,
                                    undefined,
                                    zUseNoticeEffectPopup,
                                );
                            }}
                            sx={{
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            변경된 약관 내용 확인하기
                        </Typography>
                    </Typography>
                    <br />
                    <Typography variant="overline">
                        안내받으신 후 30일 이내에 별도 의사를 표시하시지 않는 경우 동의한 것으로 간주하여 변경된 약관 및 개인정보처리방침이 적용됩니다.
                    </Typography>
                </>
            ),
            confirmButtonText: "닫기",
            bottomSubButtonText: "다시 보지 않기",
            isNeverShowNoticeButtonShowing: true,
        },
        {
            showingPeriods: { TEST_PERIOD: ["2023-02-28 14:00", "2023-02-28 14:15"], LIVE_PERIOD: ["2023-03-03 00:00", "2023-03-03 19:00"] },
            id: "CUSTOMER_CENTER_OFF",
            title: "3월 3일 고객센터 임시 휴무 안내",
            content: (
                <Typography variant="body2" color="text.primary">
                    안녕하세요,
                    <br />
                    요보사랑 고객경험팀입니다.
                    <br />
                    요보사랑 서비스의 재정비를 위해 <strong>3월 3일 금요일 하루동안</strong> 고객센터가 휴무입니다. 채팅 상담 남겨주시면 3월 6일부터 순차적으로 상담 도와드릴게요.
                    감사합니다🤗
                    <br />
                    <br />
                    <strong>요보사랑 고객경험팀 드림</strong>
                </Typography>
            ),
            confirmButtonText: "확인",
        },
    ];

    static getPeriod(notice: NoticeInterface, isLive: boolean): string[] {
        return notice.showingPeriods[isLive ? "LIVE_PERIOD" : "TEST_PERIOD"];
    }

    static getNotice(now: Dayjs, optionFunction: Record<string, Function>, isLive: boolean = true): NoticeInterface | undefined {
        Object.keys(optionFunction).forEach(key => {
            this.optionFunctionMap.set(key, optionFunction[key]);
        });

        return this.noticeList.find(notice => {
            const period = this.getPeriod(notice, isLive);
            return now.isBetween(period[0], period[1]);
        });
    }
}

export default NoticeConfig;
