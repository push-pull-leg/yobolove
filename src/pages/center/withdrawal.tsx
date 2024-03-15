import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Box, Button, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import Link from "next/link";
import UseCenterService from "../../hook/UseCenterService";
import UseAuthCode from "../../hook/UseAuthCode";
import DeleteCenterWithdrawalRequestInterface from "../../interface/request/DeleteCenterWithdrawalRequestInterface";
import CenterWithdrawalReasonEnum, { CenterWithdrawalReasonLabel } from "../../enum/CenterWithdrawalReasonEnum";
import DateUtil from "../../util/DateUtil";
import sectionStyle from "../../styles/sectionStyle";
import Checkbox from "../../components/form/Checkbox";
import Form from "../../components/form/Form";
import Text from "../../components/form/Text";
import UseTitle from "../../hook/UseTitle";
import AuthCodeProcessEnum from "../../enum/AuthCodeProcessEnum";
import AuthCodeRequestInterface from "../../interface/request/AuthCodeRequestInterface";
import WithCenterAuth from "../../hoc/WithCenterAuth";
import { Undefinable } from "../../type/Undefinable";

/**
 * 기관용 서비스 - 회원탈퇴
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1783%3A95632)
 * @category Page
 * @Center
 */
const Withdrawal: NextPage = function Withdrawal() {
    UseTitle("회원 탈퇴", "회원 탈퇴");
    const { withdrawal } = UseCenterService();
    const reasonsText = useRef<Undefinable>();
    const [agreedDate, setAgreedDate] = useState<string | undefined>(undefined);
    /**
     * 탈퇴 사유. {@link CenterWithdrawalReasonEnum} 배열형.
     */
    const [reasonsEnum, setReasonsEnum] = useState<CenterWithdrawalReasonEnum[]>([]);
    /**
     * 탈퇴 사유를 string 배열형으로 변경
     */
    const [reasons, setReasons] = useState<string[]>([]);
    /**
     * 탈퇴 과정 완료 여부
     */
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const { step, setDialogRecoil, render } = UseAuthCode({
        page: "CENTER_WITHDRAWAL",
        requestTitle: "휴대폰 번호를 인증해주세요.",
        authCodeProcess: AuthCodeProcessEnum.CENTER_WITHDRAWAL,
        onComplete: async (request: AuthCodeRequestInterface): Promise<void> => {
            setDialogRecoil({
                open: true,
                title: "탈퇴하시겠습니까?",
                content: "‘탈퇴하기’를 누르면 회원탈퇴가 진행됩니다.",
                confirmButtonText: "탈퇴하기",
                confirmButtonStyle: "outlined",
                hasCancelButton: true,
                onConfirm: async () => {
                    if (await withdrawal({ ...request, reasonList: reasons })) {
                        setIsCompleted(true);
                    }
                },
            });
        },
    });

    const agree = (): void => {
        setAgreedDate(DateUtil.getIsoString());
    };

    const handleChangeReasonEnum = (_name: string, value: CenterWithdrawalReasonEnum[]): void => {
        setReasonsEnum(value);
    };

    const handleChangeReason = (_name: string, value: string): void => {
        reasonsText.current = value;
    };

    /**
     * 탈퇴 사유 Enum 을 string 으로 변환.
     */
    const handleSubmit = (): void => {
        if (!reasonsEnum) return;

        const currentReasons: string[] = [
            ...reasonsEnum
                .filter(reasonEnum => reasonEnum !== CenterWithdrawalReasonEnum.DIRECTLY_WRITING)
                .map(reasonEnum => CenterWithdrawalReasonLabel.get(reasonEnum)?.title || ""),
        ];
        if (reasonsEnum.includes(CenterWithdrawalReasonEnum.DIRECTLY_WRITING) && reasonsText.current) {
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
                    탈퇴 후에는 요보사랑에서 제공되는 구인 서비스를 이용하실 수 없습니다.
                </Typography>
                <Button variant="contained" size="large" sx={{ mt: 9 }} onClick={agree}>
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
                <Form<DeleteCenterWithdrawalRequestInterface> onSubmit={handleSubmit} buttonText="다음">
                    <Typography variant="h3">더 나은 서비스를 위해 탈퇴하시는 이유를 알려주세요.</Typography>
                    <Checkbox<CenterWithdrawalReasonEnum> title={undefined} name="reasonEnum" data={CenterWithdrawalReasonLabel} required onChange={handleChangeReasonEnum} />
                    {reasonsEnum.includes(CenterWithdrawalReasonEnum.DIRECTLY_WRITING) ? (
                        <Text title="" name="reasonText" onChange={handleChangeReason} placeholder="직접입력" autoFocus />
                    ) : (
                        <div />
                    )}
                </Form>
            </Box>
        );
    }

    if (step === "CONFIRM_AUTH_CODE" && isCompleted) {
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
                <Link href="/">
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
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true);
export default Withdrawal;
