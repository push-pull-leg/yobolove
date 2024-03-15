import type { NextPage } from "next";
import { Box, Button, Checkbox, IconButton, List, ListItem, ListItemIcon, ListItemText, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { ArrowForwardIos } from "@mui/icons-material";
import sectionStyle from "../styles/sectionStyle";
import TermsInterface from "../interface/TermsInterface";
import { popupRecoilState } from "../recoil/PopupRecoil";
import DateUtil from "../util/DateUtil";
import UseAuthCode from "../hook/UseAuthCode";
import UseCaregiverService from "../hook/UseCaregiverService";
import UseTitle from "../hook/UseTitle";
import AuthCodeProcessEnum from "../enum/AuthCodeProcessEnum";
import AuthCodeRequestInterface from "../interface/request/AuthCodeRequestInterface";
import WithHeadMetaData from "../hoc/WithHeadMetaData";
import EventUtil from "../util/EventUtil";
import { Undefinable } from "../type/Undefinable";

/**
 * 구직자서비스 - 휴대폰 회원가입
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A72680)
 * @category Page
 * @Caregiver
 */
const Signup: NextPage = function Signup() {
    UseTitle("요양보호사 회원가입", "회원가입");
    const { isLoading, signup, getTerms } = UseCaregiverService();
    const [agreedDate, setAgreedDate] = useState<Undefinable>();
    const [termsUuidList, setTermsUuidList] = useState<string[]>([]);
    const [termsList, setTermsList] = useState<TermsInterface[]>([]);
    const { render } = UseAuthCode({
        page: "CAREGIVER_SIGNUP",
        requestTitle: "일자리 알림을 받을 휴대폰 번호를 입력해주세요.",
        authCodeProcess: AuthCodeProcessEnum.CAREGIVER_SIGN_UP,
        onComplete: async (request: AuthCodeRequestInterface): Promise<void> => {
            if (!agreedDate) return;
            await signup({ ...request, agreedDate, termsUuidList }, "/account/desired-work");
        },
        showGuideMessage: true,
    });

    async function getCaregiverTerms(): Promise<void> {
        setTermsList(await getTerms());
    }

    useEffect(() => {
        getCaregiverTerms();
    }, []);

    const toggleTerms = (terms: TermsInterface): void => {
        const currentTermsUuidList = termsUuidList.slice(0);
        const index = currentTermsUuidList.indexOf(terms.uuid);
        if (index >= 0) {
            currentTermsUuidList.splice(index, 1);
        } else {
            currentTermsUuidList.push(terms.uuid);
        }
        setTermsUuidList(currentTermsUuidList);
    };

    const checkAllTerms = (): void => {
        if (termsUuidList.length === termsList.length) {
            setTermsUuidList([]);
        } else {
            setTermsUuidList(termsList.map(({ uuid }) => uuid));
        }
    };

    const agreeTerms = (): void => {
        setAgreedDate(DateUtil.getIsoString());
        EventUtil.gtmEvent("click", "next", "signup", "0");
    };

    const isValidAgreementButton = (): boolean => {
        if (termsList.length === 0) return false;

        const requiredTermsList: TermsInterface[] = termsList.filter((terms: TermsInterface) => terms.required);
        const requiredTermsUuidList: string[] = requiredTermsList.map((terms: TermsInterface) => terms.uuid);
        return requiredTermsUuidList.every((elem: string) => termsUuidList.includes(elem));
    };

    const setPopupRecoil = useSetRecoilState(popupRecoilState);

    const openTermsPopup = (title: string, src: string) => {
        setPopupRecoil({
            open: true,
            title,
            src,
        });
    };

    const termsListDom = useMemo(() => {
        if (isLoading) {
            return (
                <>
                    <ListItem divider>
                        <ListItemText primary={<Skeleton variant="text" />} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Skeleton variant="text" />} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Skeleton variant="text" />} />
                    </ListItem>
                </>
            );
        }
        return termsList.map((terms: TermsInterface) => (
            <ListItem
                key={terms.uuid}
                button
                dense
                secondaryAction={
                    <IconButton onClick={() => openTermsPopup(terms.title, terms.url)}>
                        <ArrowForwardIos color="action" fontSize="small" />
                    </IconButton>
                }
            >
                <ListItemIcon sx={{ alignSelf: "flex-start" }}>
                    <Checkbox
                        onClick={() => toggleTerms(terms)}
                        edge="start"
                        checked={termsUuidList.includes(terms.uuid)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": terms.title }}
                    />
                </ListItemIcon>
                <ListItemText
                    onClick={() => toggleTerms(terms)}
                    id={`terms-${terms.title}`}
                    primary={terms.required ? `(필수)${terms.title}` : `(선택)${terms.title}`}
                    primaryTypographyProps={{ variant: "body2" }}
                    secondary={terms.description}
                    secondaryTypographyProps={{ variant: "overline", color: "text.secondary" }}
                />
            </ListItem>
        ));
    }, [isLoading, termsUuidList, termsList]);
    if (!agreedDate) {
        return (
            <Box display="flex" height="100%" alignItems="left" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm")}>
                <Typography variant="h3" sx={{ mt: 5 }}>
                    요보사랑에 오신 것을 환영합니다!
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    요보사랑 일자리 알림을 이용하기 위해 필요한 약관에 동의해주세요.
                </Typography>
                <List sx={{ mt: 7.5 }}>
                    <ListItem button dense divider onClick={() => checkAllTerms()}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={termsUuidList.length === termsList.length && termsList.length > 0}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ "aria-labelledby": "약관에 전체 동의" }}
                            />
                        </ListItemIcon>
                        <ListItemText id="terms-list-check-all" primary="약관에 전체동의" primaryTypographyProps={{ variant: "h5", sx: { fontWeight: 600 } }} />
                    </ListItem>
                    {termsListDom}
                </List>
                <Button variant="contained" color="primary" onClick={agreeTerms} sx={{ mt: 5, mb: 5 }} size="large" disabled={!isValidAgreementButton()}>
                    다음
                </Button>
            </Box>
        );
    }

    return render();
};
export default WithHeadMetaData(Signup);
