import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Box, Button, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import Link from "next/link";
import sectionStyle from "../styles/sectionStyle";
import DateUtil from "../util/DateUtil";
import CaregiverWithdrawalReasonEnum, { CaregiverWithdrawalReasonLabel } from "../enum/CaregiverWithdrawalReasonEnum";
import Text from "../components/form/Text";
import DeleteCaregiverWithdrawalRequestInterface from "../interface/request/DeleteCaregiverWithdrawalRequestInterface";
import Form from "../components/form/Form";
import UseAuthCode from "../hook/UseAuthCode";
import Checkbox from "../components/form/Checkbox";
import UseCaregiverService from "../hook/UseCaregiverService";
import UseTitle from "../hook/UseTitle";
import AuthCodeProcessEnum from "../enum/AuthCodeProcessEnum";
import AuthCodeRequestInterface from "../interface/request/AuthCodeRequestInterface";
import WithCaregiverAuth from "../hoc/WithCaregiverAuth";
import { Undefinable } from "../type/Undefinable";

/**
 * 구직자서비스 - 회원탈퇴
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A90075)
 * @category Page
 * @Caregiver
 */
const Withdrawal: NextPage = function Withdrawal() {
    UseTitle("회원 탈퇴", "회원 탈퇴");
    const { withdrawal } = UseCaregiverService();
    const reasonsText = useRef<Undefinable>();
    const [agreedDate, setAgreedDate] = useState<Undefinable>();
    const [reasonsEnum, setReasonsEnum] = useState<CaregiverWithdrawalReasonEnum[]>([]);
    const [reasons, setReasons] = useState<string[]>([]);
    const [completed, setCompleted] = useState<boolean>(false);
    const { step, setDialogRecoil, render } = UseAuthCode({
        page: "CAREGIVER_WITHDRAWAL",
        requestTitle: "휴대폰 번호를 인증해주세요.",
        authCodeProcess: AuthCodeProcessEnum.CAREGIVER_WITHDRAWAL,
        onComplete: async (request: AuthCodeRequestInterface): Promise<void> => {
            setDialogRecoil({
                open: true,
                title: "탈퇴하시겠습니까?",
                content: "‘탈퇴하기’를 누르면 회원 탈퇴가 진행됩니다.",
                confirmButtonText: "탈퇴하기",
                hasCancelButton: true,
                confirmButtonStyle: "outlined",
                onConfirm: async () => {
                    if (await withdrawal({ ...request, reasonList: reasons })) {
                        setCompleted(true);
                    }
                },
            });
        },
    });

    const agree = (): void => {
        setAgreedDate(DateUtil.getIsoString());
    };

    const handleChangeReasonEnum = (_name: string, value: CaregiverWithdrawalReasonEnum[]): void => {
        setReasonsEnum(value);
    };

    const handleChangeReason = (_name: string, value: string): void => {
        reasonsText.current = value;
    };

    const handleSubmit = (): void => {
        if (!reasonsEnum) return;

        const currentReasons: string[] = [
            ...reasonsEnum
                .filter(reasonEnum => reasonEnum !== CaregiverWithdrawalReasonEnum.DIRECTLY_WRITING)
                .map(reasonEnum => CaregiverWithdrawalReasonLabel.get(reasonEnum)?.title || ""),
        ];
        if (reasonsEnum.includes(CaregiverWithdrawalReasonEnum.DIRECTLY_WRITING) && reasonsText.current) {
            currentReasons.push(reasonsText.current);
        }

        setReasons(currentReasons);
    };

    if (!agreedDate) {
        return (
            <Box
                display="flex"
                height="100%"
                alignItems="center"
                flexDirection="column"
                {...sectionStyle(
                    {
                        textAlign: "left",
                    },
                    "sm",
                    true,
                )}
            >
                <Typography variant="h3">요보사랑을 정말 탈퇴하시겠습니까?</Typography>
                <Typography variant="subtitle2" sx={{ pt: 5 }}>
                    탈퇴 후에는 요보사랑에서 제공되는 알림톡 수신 서비스를 받으실 수 없습니다.
                </Typography>
                <Button variant="contained" size="large" sx={{ mt: 9 }} onClick={agree} fullWidth>
                    탈퇴 진행
                </Button>
            </Box>
        );
    }
    if (reasons.length === 0) {
        return (
            <Box
                display="flex"
                height="100%"
                alignItems="center"
                flexDirection="column"
                {...sectionStyle(
                    {
                        textAlign: "left",
                    },
                    "sm",
                    true,
                )}
            >
                <Form<DeleteCaregiverWithdrawalRequestInterface> onSubmit={handleSubmit} buttonText="다음">
                    <Typography variant="h3">더 나은 서비스를 위해 탈퇴하시는 이유를 알려주세요.</Typography>
                    <Checkbox<CaregiverWithdrawalReasonEnum> title={undefined} name="reasonEnum" data={CaregiverWithdrawalReasonLabel} required onChange={handleChangeReasonEnum} />
                    {reasonsEnum.includes(CaregiverWithdrawalReasonEnum.DIRECTLY_WRITING) ? (
                        <Text title="" name="reasonText" onChange={handleChangeReason} placeholder="직접입력" autoFocus />
                    ) : (
                        <div />
                    )}
                </Form>
            </Box>
        );
    }
    if (step === "CONFIRM_AUTH_CODE" && completed) {
        return (
            <Box
                display="flex"
                height="100%"
                alignItems="center"
                flexDirection="column"
                {...sectionStyle(
                    {
                        textAlign: "left",
                    },
                    "sm",
                    true,
                )}
            >
                <Typography variant="h3">회원탈퇴완료</Typography>
                <Typography variant="body1" sx={{ pt: 2, mb: 9 }}>
                    요보사랑을 이용해주셔서 감사합니다.
                </Typography>
                <Link href="/" passHref>
                    <a style={{ textDecoration: "underline" }}>
                        <Typography variant="caption" color="text.secondary">
                            홈 화면으로 돌아가기
                        </Typography>
                    </a>
                </Link>
            </Box>
        );
    }

    return render();
};
export default Withdrawal;

export const getServerSideProps: GetServerSideProps = WithCaregiverAuth(undefined, true);
