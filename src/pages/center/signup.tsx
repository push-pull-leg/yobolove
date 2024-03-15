import type { NextPage } from "next";
import React, { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Box, Button, Checkbox, IconButton, List, ListItem, ListItemIcon, ListItemText, Skeleton, Typography, useTheme } from "@mui/material";
import { ArrowForwardIos, CheckCircleOutline } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import TermsInterface from "../../interface/TermsInterface";
import DateUtil from "../../util/DateUtil";
import { popupRecoilState } from "../../recoil/PopupRecoil";
import sectionStyle from "../../styles/sectionStyle";
import Form from "../../components/form/Form";
import UseCenterService from "../../hook/UseCenterService";
import Text from "../../components/form/Text";
import { dialogRecoilState } from "../../recoil/DialogRecoil";
import Email from "../../components/form/Email";
import AuthenticatedPhone from "../../components/form/AuthenticatedPhone";
import File from "../../components/form/File";
import AuthCodeProcessEnum from "../../enum/AuthCodeProcessEnum";
import CenterSignupInterface from "../../interface/CenterSignupInterface";
import PasswordInput from "../../components/form/PasswordInput";
import IconTypography from "../../components/IconTypography";
import Tel from "../../components/form/Tel";
import UseAlert from "../../hook/UseAlert";
import UseTitle from "../../hook/UseTitle";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";
import usePreventMove from "../../hook/UsePreventMove";
import { Undefinable } from "../../type/Undefinable";
import Label from "../../components/form/Label";
import EventUtil from "../../util/EventUtil";

const ACCOUNT_ID_REGEX1 = /^(?=.*\d)(?=.*[a-z]).{5,20}$/;
const ACCOUNT_ID_REGEX2 = /^[a-z0-9]{5,20}$/;
const ID_NUM_LENGTH = 10;

/**
 * 기관용 서비스 - 회원가입신청
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1527%3A90269)
 * @category Page
 * @Center
 */
const Signup: NextPage = function Signup() {
    UseTitle("기관 회원가입", "가입신청");
    const { setAllowMove } = usePreventMove("가입신청을 그만두시겠어요?", "뒤로 가면 작성했던 내용이 사라집니다.");
    const router = useRouter();
    const { openAlert } = UseAlert();
    const { isLoading, signup, getTerms, getIdNumExists, getAccountIdExists } = UseCenterService();
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);
    const theme = useTheme();

    const idNum = useRef<Undefinable>();
    const [agreedDate, setAgreedDate] = useState<Undefinable>();
    const [termsUuidList, setTermsUuidList] = useState<string[]>([]);
    const [termsList, setTermsList] = useState<TermsInterface[]>([]);

    const [idNumHelperText, setIdNumHelperText] = useState<ReactElement | undefined>(undefined);

    const getAccountIdHelperText = (isRegexPassed: boolean, isAccountIdExist: boolean) => (
        <>
            <IconTypography
                icon={<CheckCircleOutline fontSize="small" sx={{ color: isRegexPassed ? theme.palette.success.main : theme.palette.secondary.light }} />}
                label="5~20자 이내의 영문 소문자, 숫자"
            />
            <IconTypography
                icon={<CheckCircleOutline fontSize="small" sx={{ color: isAccountIdExist ? theme.palette.secondary.light : theme.palette.success.main }} />}
                label="이미 사용중인 아이디가 아니어야 함"
            />
        </>
    );
    const [accountIdHelperText, setAccountIdHelperText] = useState<ReactElement | undefined>(getAccountIdHelperText(false, true));
    const [completePhoneNum, setCompletePhoneNum] = useState<Undefinable>();
    const [disabled, setDisabled] = useState<boolean>(false);
    const [accountIdValid, setAccountIdValid] = useState<boolean>(false);

    async function getCenterTerms(): Promise<void> {
        setTermsList(await getTerms());
    }

    useEffect(() => {
        getCenterTerms();
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

        EventUtil.gtmEvent("click", "next", "cenSignup", "0");
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

    const checkAccountIdExists = async (): Promise<boolean> => {
        if (!idNum.current) return false;
        const isIdNumExists = await getIdNumExists(idNum.current);
        if (!isIdNumExists) {
            setIdNumHelperText(
                <Typography color="success.main" variant="caption">
                    가입가능한 번호 입니다.
                </Typography>,
            );
            return true;
        }
        setIdNumHelperText(undefined);
        setDialogRecoil({
            open: true,
            title: "이미 가입된 고유번호 입니다.",
            content: "계정 정보가 기억나지 않으신다면 “계정 찾기”를 진행해주세요.",
            confirmButtonText: "계정찾기",
            confirmButtonStyle: "outlined",
            cancelButtonText: "이전으로",
            hasCancelButton: true,
            onConfirm: () => {
                router.push("/center/find");
            },
        });
        return false;
    };

    const idNumValid = async (value: string | undefined): Promise<boolean> => {
        idNum.current = value;

        if (value && value.length === ID_NUM_LENGTH) checkAccountIdExists();

        setIdNumHelperText(
            <Typography color="success.main" variant="caption">
                정확한 고유번호를 입력해주세요.
            </Typography>,
        );

        return false;
    };

    const onAccountIdChange = async (_name: string, value: string | undefined) => {
        if (!value) {
            setAccountIdHelperText(getAccountIdHelperText(false, true));
            setAccountIdValid(false);
            DateUtil.clearTimer();
            return;
        }

        const checkAccountIdRegex = ACCOUNT_ID_REGEX1.test(value) && ACCOUNT_ID_REGEX2.test(value);
        await DateUtil.sleep(200);
        const isAccountIdExists = await getAccountIdExists(value);

        if (isAccountIdExists) {
            openAlert("이미 사용 중인 아이디 입니다.", "다른 아이디를 입력해주세요.");
        }

        if (isAccountIdExists || !checkAccountIdRegex) {
            setAccountIdHelperText(getAccountIdHelperText(checkAccountIdRegex, isAccountIdExists));
            setAccountIdValid(true);
            return;
        }
        setAccountIdHelperText(getAccountIdHelperText(true, false));
        setAccountIdValid(true);
    };

    const onSubmit = async (request: CenterSignupInterface) => {
        EventUtil.gtmEvent("click", "apply", "cenSignup", "");

        // 회원가입
        await signup(request, (phoneNum: string): void => {
            setCompletePhoneNum(phoneNum);
            setAllowMove(true);
        });
    };

    const onOpen = (): void => {
        setDisabled(true);
    };

    const onClose = (): void => {
        setDisabled(false);
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
            <Box display="flex" height="100%" alignItems="left" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
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
    if (completePhoneNum) {
        return (
            <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    가입 승인 대기중입니다.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    {completePhoneNum}로 확인 연락을 드릴게요. 확인 후 가입이 완료됩니다.
                </Typography>
                <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
                    *영업일 기준 1일 이내로 연락을 드릴 예정입니다.
                </Typography>
                <Link href="/center" as="/기관" passHref>
                    <a style={{ textDecoration: "underline", marginTop: 36 }}>
                        <Typography variant="caption" color="text.secondary">
                            홈 화면으로 돌아가기
                        </Typography>
                    </a>
                </Link>
            </Box>
        );
    }

    return (
        <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
            <Form<CenterSignupInterface>
                buttonText="가입 신청"
                onSubmit={onSubmit}
                disabled={disabled}
                parameter={{ agreedDate, termsUuidList }}
                onChange={() => {
                    setAllowMove(false);
                }}
            >
                <Text
                    title="기관 고유번호"
                    name="idNum"
                    placeholder="기관 고유번호"
                    required
                    maxLength={ID_NUM_LENGTH}
                    autoSubmit={false}
                    helperText={idNumHelperText}
                    onValidate={idNumValid}
                    regExp={/^[0-9]+$/}
                    disableSpacing
                    description="설치신고번호가 아니에요!"
                />

                <Text
                    title="아이디"
                    name="accountId"
                    placeholder="아이디"
                    required
                    onChange={onAccountIdChange}
                    valid={accountIdValid}
                    helperText={accountIdHelperText}
                    disableSpacing
                />

                <Label title="비밀번호" id="accountPwdTitle" required sx={{ mb: 0 }} />
                <PasswordInput name="accountPwd" />

                <Typography variant="h3" sx={{ mt: 12 }}>
                    기관 정보를 입력해주세요.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0 }}>
                    롱텀에 등록된 정보를 정확히 입력하셔야 가입 승인될 수 있어요.
                </Typography>

                <Text title="기관 이름" name="name" placeholder="기관이름" required />

                <File title="기관 고유번호증" name="certFile" placeholder="이미지 등록" required description="설치신고증이 아니에요!" />

                <Tel
                    title="기관 대표 전화번호"
                    name="phoneNum"
                    placeholder="기관 대표 전화번호"
                    required
                    helperText={
                        <Typography variant="caption" color="text.secondary">
                            롱텀에 등록된 전화번호여야 합니다.
                        </Typography>
                    }
                />

                <AuthenticatedPhone
                    page="CENTER_SIGNUP"
                    title="기관 대표자 휴대폰 번호"
                    requestTitle="휴대폰 번호를 인증해주세요."
                    name="adminPhoneNum"
                    placeholder="대표자 휴대폰 인증"
                    required
                    helperText="기관 대표자님의 휴대폰으로 인증해주세요."
                    onOpen={onOpen}
                    onClose={onClose}
                    authCodeProcess={AuthCodeProcessEnum.CENTER_SIGN_UP}
                    completeMessage={
                        <Typography variant="caption" color="success.main">
                            본인인증 완료
                        </Typography>
                    }
                />

                <Email title="기관 대표자 이메일" name="adminEmail" placeholder="이메일 아이디" required />
            </Form>
        </Box>
    );
};
export default WithHeadMetaData(Signup);
