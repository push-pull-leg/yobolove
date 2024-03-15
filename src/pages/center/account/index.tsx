import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Divider, List, ListItem, ListItemIcon, ListItemText, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CorporateFare, LocalPhone, Lock } from "@mui/icons-material";
import { css } from "@emotion/css";
import WithCenterAuth from "../../../hoc/WithCenterAuth";
import CenterProfile from "../../../components/CenterProfile";
import UseCenterService from "../../../hook/UseCenterService";
import CenterAccountInterface from "../../../interface/CenterAccountInterface";
import { toRem } from "../../../styles/options/Function";
import TermsAgreementInterface from "../../../interface/TermsAgreementInterface";
import Terms from "../../../components/Terms";
import WithHeadMetaData from "../../../hoc/WithHeadMetaData";
import RecruitingRegistrationPassBox from "../../../components/RecruitingRegistrationPassBox";
import UsePassCount from "../../../hook/UsePassCount";

const titleStyle = css`
    padding-left: ${toRem(10)};
`;

/**
 * 기관용 서비스 - 계정정보
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A93537)
 * @category Page
 * @Center
 */
const Account: NextPage = function Account() {
    const { getMe, getMyTerms } = UseCenterService();
    const { passCount, isPassCountLoading } = UsePassCount();

    const [me, setMe] = useState<CenterAccountInterface | undefined>(undefined);
    const [termsList, setTermsList] = useState<TermsAgreementInterface[]>([]);

    const onMount = async () => {
        setMe(await getMe());
        setTermsList(await getMyTerms());
    };
    useEffect(() => {
        onMount();
    }, []);

    const termsListDom = useMemo(
        () =>
            termsList.map((termsAgreement: TermsAgreementInterface) => <Terms termsAgreement={termsAgreement} userType="CENTER" key={termsAgreement.terms.uuid} sx={{ px: 0 }} />),
        [termsList],
    );
    if (!me) {
        return (
            <CenterProfile>
                <Typography variant="h3">
                    <Skeleton variant="text" />
                </Typography>
            </CenterProfile>
        );
    }
    return (
        <CenterProfile sx={{ pt: 5, px: 4, maxWidth: toRem(440) }}>
            <Typography variant="h3" sx={{ mb: 3, px: 0 }}>
                {me.accountId}님
            </Typography>
            {!isPassCountLoading && <RecruitingRegistrationPassBox passPurchaseButtonPosition="BOTTOM" passCount={passCount} />}
            <Divider sx={{ mt: 5, mb: 3 }} />
            <List disablePadding>
                <Link href="/center/account/update-password" as="/기관/계정정보/비밀번호변경">
                    <ListItem button sx={{ px: 0 }}>
                        <ListItemIcon>
                            <Lock />
                        </ListItemIcon>
                        <ListItemText primary="비밀번호 변경" primaryTypographyProps={{ variant: "subtitle1", className: titleStyle }} />
                    </ListItem>
                </Link>
                <Link href="/center/account/info-center" as="/기관/계정정보/기관정보">
                    <ListItem button sx={{ px: 0 }}>
                        <ListItemIcon>
                            <CorporateFare />
                        </ListItemIcon>
                        <ListItemText primary="기관 정보" primaryTypographyProps={{ variant: "subtitle1", className: titleStyle }} />
                    </ListItem>
                </Link>
                <Link href="/center/account/contacts" as="/기관/계정정보/채용담당자연락처">
                    <ListItem button sx={{ px: 0 }}>
                        <ListItemIcon>
                            <LocalPhone />
                        </ListItemIcon>
                        <ListItemText primary="기관 전화번호" primaryTypographyProps={{ variant: "subtitle1", className: titleStyle }} />
                    </ListItem>
                </Link>
                <Divider sx={{ mt: 3, mb: 3 }} />
                {termsListDom}
            </List>
        </CenterProfile>
    );
};
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true);

export default WithHeadMetaData(Account);
