import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Box, Button, IconButton, List, ListItem, ListItemText, Skeleton, Typography } from "@mui/material";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import deepcopy from "deepcopy";
import { Add, Cancel } from "@mui/icons-material";
import Link from "next/link";
import { useSetRecoilState } from "recoil";
import UseCenterService from "../../../hook/UseCenterService";
import CenterContactInterface from "../../../interface/CenterContactInterface";
import sectionStyle from "../../../styles/sectionStyle";
import Phone from "../../../components/form/Phone";
import AuthenticatedPhone from "../../../components/form/AuthenticatedPhone";
import AuthCodeProcessEnum from "../../../enum/AuthCodeProcessEnum";
import { dialogRecoilState } from "../../../recoil/DialogRecoil";
import Tel from "../../../components/form/Tel";
import UseTitle from "../../../hook/UseTitle";
import WithHeadMetaData from "../../../hoc/WithHeadMetaData";
import WithCenterAuth from "../../../hoc/WithCenterAuth";
import EventUtil from "../../../util/EventUtil";

/**
 * 기관용 서비스 - 채용담당자 연락처
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A93720)
 * @category Page
 * @Center
 */
export const Contacts: NextPage = function Contacts() {
    UseTitle("기관 전화번호", "기관 전화번호");
    const { getContacts, addContact, removeContact } = UseCenterService();

    const setDialogRecoil = useSetRecoilState(dialogRecoilState);
    const [contacts, setContacts] = useState<CenterContactInterface | undefined>(undefined);

    /**
     * 연락처 추가 후 리프레시
     * @param extraPhoneNum
     */
    const refresh = (extraPhoneNum: string[]): void => {
        if (!contacts) return;
        const currentContact: CenterContactInterface = deepcopy(contacts);
        currentContact.extraPhoneNum = extraPhoneNum;
        setContacts(currentContact);
    };
    const get = async () => {
        setContacts(await getContacts());
    };

    const remove = async (phone: string) => {
        setDialogRecoil({
            open: true,
            title: `${phone}을 삭제할까요?`,
            content: (
                <>
                    <Typography>“삭제”를 누르면 연락처가 삭제되어 구인공고에서 사용할 수 없어요.</Typography>
                    <Typography color="primary">*삭제할 연락처가 구인공고에 현재 등록되어있다면, 해당 공고의 연락처는 대표자 휴대폰 번호로 자동 변경됩니다.</Typography>
                </>
            ),
            confirmButtonText: "삭제",
            hasCancelButton: true,
            onConfirm: async () => {
                const response = await removeContact({ extraPhoneNum: phone });
                if (contacts && response) {
                    refresh(response);
                }
            },
        });
    };

    /**
     * 연락처 추가 이벤트
     * @param _name
     * @param value
     * @param token
     */
    const onAdd = async (_name: string, value: string, token?: string) => {
        if (!token) return;
        const response = await addContact({ codeAuthToken: token, extraPhoneNum: value });
        if (contacts && response) {
            refresh(response);
        }
    };

    const handleOpenAddingPhoneNum = () => EventUtil.gtmEvent("click", "addNum", "cenNum", "");

    useEffect(() => {
        get();
    }, []);

    const extraPhone = useMemo<ReactElement | ReactElement[]>(() => {
        if (!contacts) return <div />;

        return contacts.extraPhoneNum.map((phone: string) => (
            <Phone
                key={phone}
                title=""
                name="phoneNum"
                placeholder=""
                required
                labelStyle="input"
                defaultValue={phone}
                disabled
                endAdornment={
                    <IconButton onClick={() => remove(phone)}>
                        <Cancel />
                    </IconButton>
                }
            />
        ));
    }, [contacts]);
    if (!contacts) {
        return (
            <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
                <List sx={{ width: "100%" }}>
                    <ListItem divider>
                        <ListItemText primary={<Skeleton variant="text" />} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Skeleton variant="text" />} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={<Skeleton variant="text" />} />
                    </ListItem>
                </List>
            </Box>
        );
    }
    return (
        <Box display="flex" height="100%" alignItems="left" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
                대표 연락처
            </Typography>
            <Tel title="기관 대표 전화번호" name="phoneNum" placeholder="기관 대표번호" required labelStyle="input" defaultValue={contacts.phoneNum} disabled />
            <br />
            <Phone title="기관 대표자 휴대폰번호" name="phoneNum" placeholder="기관 대표자 휴대폰번호" required labelStyle="input" defaultValue={contacts.adminPhoneNum} disabled />

            <Link href="/center/account/info-center" as="/기관/계정정보/기관정보" passHref>
                <a>
                    <Button variant="text" color="primary">
                        대표 연락처 변경하기 →
                    </Button>
                </a>
            </Link>

            <Typography variant="subtitle1" sx={{ mt: 9, mb: 2 }}>
                추가한 연락처
            </Typography>
            {extraPhone}
            <AuthenticatedPhone
                page="CENTER_ADD_NUMBER"
                title=""
                requestTitle="연락처에 추가할 휴대폰 번호를 인증해주세요."
                name="adminPhoneNum"
                placeholder="연락처 추가"
                startAdornment={<Add color="action" />}
                endAdornment={<div />}
                onChange={onAdd}
                required
                authCodeProcess={AuthCodeProcessEnum.CENTER_EXTRA_CONTACT}
                resetOnChange
                onOpen={handleOpenAddingPhoneNum}
            />
        </Box>
    );
};

export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true);
export default WithHeadMetaData(Contacts);
