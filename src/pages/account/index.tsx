import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { Box, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Skeleton, Typography, useTheme } from "@mui/material";
import { Notifications, WorkOutline } from "@mui/icons-material";
import { css } from "@emotion/css";
import Link from "next/link";
import dayjs from "dayjs";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import CaregiverInformationInterface from "../../interface/CaregiverInformationInterface";
import sectionStyle from "../../styles/sectionStyle";
import UseCaregiverService from "../../hook/UseCaregiverService";
import { toRem } from "../../styles/options/Function";
import NotificationInterface from "../../interface/NotificationInterface";
import WithCaregiverAuth from "../../hoc/WithCaregiverAuth";
import TermsAgreementInterface from "../../interface/TermsAgreementInterface";
import Terms from "../../components/Terms";
import UseTitle from "../../hook/UseTitle";
import { dialogRecoilState } from "../../recoil/DialogRecoil";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";
import EventUtil from "../../util/EventUtil";

const titleStyle = css`
    padding-left: ${toRem(10)};
`;

/**
 * 구직자서비스 - 내정보
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A73953)
 * @category Page
 * @Caregiver
 */
const Account: NextPage = function Account() {
    UseTitle("내 정보", "내 정보");
    const { logout, getMe, getMyTerms, getNotification } = UseCaregiverService();
    const theme = useTheme();
    const router = useRouter();
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);
    const [me, setMe] = useState<CaregiverInformationInterface | undefined>(undefined);
    const [notification, setNotification] = useState<NotificationInterface | undefined>(undefined);
    const [termsList, setTermsList] = useState<TermsAgreementInterface[]>([]);

    const caregiverLogout = (): void => {
        logout("/");
    };

    const onMount = async () => {
        setMe(await getMe());
        setNotification(await getNotification());
        setTermsList(await getMyTerms());
    };
    const withdrawal = (): void => {
        setDialogRecoil({
            open: true,
            title: "일자리 알림을 받고 싶지 않다면 원하는 기간 동안 중단할 수 있어요.",
            hasCancelButton: true,
            confirmButtonText: "회원 탈퇴",
            cancelButtonText: "일자리 알림 중단",
            hasCloseButton: true,
            flexDirection: "column",
            confirmButtonStyle: "outlined",
            cancelButtonStyle: "contained",
            onConfirm: () => {
                router.push("/withdrawal");
            },
            onCancel: () => {
                router.push("/account/notification", "/내정보/맞춤일자리알림");
            },
        });
    };

    useEffect(() => {
        onMount();
    }, []);

    const buttonStyle = useMemo<string>(
        () => css`
            color: ${theme.palette.text.disabled};

            &:hover {
                color: ${theme.palette.text.primary};
            }
        `,
        [],
    );
    const termsListDom = useMemo(
        () => termsList.map((termsAgreement: TermsAgreementInterface) => <Terms termsAgreement={termsAgreement} userType="CAREGIVER" key={termsAgreement.terms.uuid} />),
        [termsList],
    );

    const notificationAction = useMemo<ReactElement>(() => {
        if (!notification?.notificationDate) {
            return (
                <Typography variant="body2" color="error">
                    중단됨
                </Typography>
            );
        }

        const date = dayjs(notification.notificationDate, "YYYY-MM-DD");
        if (date.isBefore(dayjs())) {
            return (
                <Typography variant="body2" color="primary">
                    수신중
                </Typography>
            );
        }
        return (
            <Typography variant="body2" color="primary">
                {`${date.format("YY/M/D")} 수신예정`}
            </Typography>
        );
    }, [notification]);

    const openDesiredWork = () => {
        EventUtil.gtmEvent("click", "work", "mypage", "0");
    };

    if (!me || !termsList) {
        return (
            <>
                <Box display="flex" height="100%" alignItems="left" flexDirection="column" {...sectionStyle({ textAlign: "left" }, "sm", true)}>
                    <Typography variant="h3" sx={{ pt: 5, pb: 5 }}>
                        <Skeleton variant="text" />
                    </Typography>
                    <Divider />
                    <List disablePadding>
                        <ListItem>
                            <ListItemIcon>
                                <Notifications />
                            </ListItemIcon>
                            <ListItemText primary={<Skeleton variant="text" />} primaryTypographyProps={{ variant: "subtitle1", className: titleStyle }} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <WorkOutline />
                            </ListItemIcon>
                            <ListItemText primary={<Skeleton variant="text" />} primaryTypographyProps={{ variant: "subtitle1", className: titleStyle }} />
                        </ListItem>
                        <Divider />
                    </List>
                </Box>
                <Box flex="none" alignItems="center" width="100%" textAlign="center" sx={{ backgroundColor: "background.default" }}>
                    <Box display="flex" flexDirection="row" {...sectionStyle({ pt: 5, pb: 5, textAlign: "left", margin: "0 auto" }, "lg")}>
                        <Button variant="text" size="small" color="inherit" className={buttonStyle} onClick={caregiverLogout}>
                            로그아웃
                        </Button>
                        <Link href="/withdrawal">
                            <a>
                                <Button variant="text" size="small" color="inherit" className={buttonStyle}>
                                    회원탈퇴
                                </Button>
                            </a>
                        </Link>
                    </Box>
                </Box>
            </>
        );
    }
    return (
        <>
            <Box display="flex" height="100%" alignItems="left" flexDirection="column" {...sectionStyle({ textAlign: "left" }, "sm", true)}>
                <Typography variant="h3" sx={{ pt: 5, pb: 5 }}>
                    {me.phoneNum}님
                </Typography>
                <Divider />
                <List disablePadding>
                    <Link href="/account/notification" as="/내정보/맞춤일자리알림">
                        <ListItem button secondaryAction={notificationAction}>
                            <ListItemIcon>
                                <Notifications />
                            </ListItemIcon>
                            <ListItemText primary="맞춤 일자리 알림" primaryTypographyProps={{ variant: "subtitle1", className: titleStyle }} />
                        </ListItem>
                    </Link>
                    <Link href="/account/desired-work" as="/내정보/희망근무조건">
                        <ListItem button onClick={() => openDesiredWork()}>
                            <ListItemIcon>
                                <WorkOutline />
                            </ListItemIcon>
                            <ListItemText primary="희망 근무조건" primaryTypographyProps={{ variant: "subtitle1", className: titleStyle }} />
                        </ListItem>
                    </Link>
                    <Divider />
                    {termsListDom}
                </List>
            </Box>

            <Box flex="none" alignItems="center" width="100%" textAlign="center" sx={{ backgroundColor: "background.default" }}>
                <Box display="flex" flexDirection="row" {...sectionStyle({ pt: 5, pb: 5, px: 0, textAlign: "left", margin: "0 auto" }, "lg")}>
                    <Button variant="text" size="small" color="inherit" className={buttonStyle} onClick={caregiverLogout}>
                        로그아웃
                    </Button>
                    <Button variant="text" size="small" color="inherit" className={buttonStyle} onClick={withdrawal}>
                        회원탈퇴
                    </Button>
                </Box>
            </Box>
        </>
    );
};
export default WithHeadMetaData(Account);

export const getServerSideProps: GetServerSideProps = WithCaregiverAuth(undefined, true);
