import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Box, List, ListItem, ListItemText, Skeleton, Typography } from "@mui/material";
import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { CorporateFare } from "@mui/icons-material";
import deepcopy from "deepcopy";
import sectionStyle from "../../../styles/sectionStyle";
import Form from "../../../components/form/Form";
import Text from "../../../components/form/Text";
import UseCenterService from "../../../hook/UseCenterService";
import File from "../../../components/form/File";
import AuthenticatedPhone from "../../../components/form/AuthenticatedPhone";
import AuthCodeProcessEnum from "../../../enum/AuthCodeProcessEnum";
import Email from "../../../components/form/Email";
import CenterInterface from "../../../interface/CenterInterface";
import Tel from "../../../components/form/Tel";
import UseTitle from "../../../hook/UseTitle";
import Label from "../../../components/form/Label";
import WithHeadMetaData from "../../../hoc/WithHeadMetaData";
import WithCenterAuth from "../../../hoc/WithCenterAuth";
import Address from "../../../components/form/Address";
import SignInputButton from "../../../components/SignInputButton";
import Base64ImageType, { Base64SignType } from "../../../type/Base64ImageType";
import SeverancePayTypeEnum, { SeverancePayTypeLabel } from "../../../enum/SeverancePayTypeEnum";
import Select from "../../../components/form/Select";
import ConverterUtil from "../../../util/ConverterUtil";
import CenterInformationInterface from "../../../interface/CenterInformationInterface";
import PutCenterMeDetailRequestInterface from "../../../interface/request/PutCenterMeDetailRequestInterface";
import EventUtil from "../../../util/EventUtil";

const ID_NUM_LENGTH = 10;

interface ListSubtitleProps {
    mt?: number;
    mb?: number;
    Icon: ReactNode;
    ListItemTextPrimary: string;
}

const USELESS_KEYS: (keyof CenterInformationInterface)[] = [
    "address",
    "addressDetail",
    "adminName",
    "recruiterName",
    "workerCount",
    "severancePayType",
    "adminEmail",
    "adminPhoneNum",
    "name",
    "codeAuthToken",
];

function ListSubtitle({ mt, mb, Icon, ListItemTextPrimary }: ListSubtitleProps) {
    return (
        <ListItem sx={{ p: 0, mt, mb }}>
            {Icon}
            <ListItemText primary={ListItemTextPrimary} primaryTypographyProps={{ variant: "h3" }} />
        </ListItem>
    );
}

/**
 * 기관용 서비스 - 기관정보변경
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A93589)
 * @category Page
 * @Center
 */
const InfoCenter: NextPage = function Update() {
    UseTitle("기관 정보", "기관 정보");
    const { getMeDetail, updateMeDetail, getSignatureFile, getMeDetailCertFile } = UseCenterService();

    const [meDetail, setMeDetail] = useState<CenterInterface | undefined>(undefined);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [signFile, setSignFile] = useState<Base64SignType>();
    const [certFile, setCertFile] = useState<Base64ImageType>();

    const get = async () => {
        setMeDetail(await getMeDetail());
    };
    const reformattedForAPI = (request: CenterInformationInterface) => {
        const copyRequest = deepcopy(request);
        const { adminName, recruiterName, workerCount, severancePayType, adminEmail, adminPhoneNum, name, codeAuthToken } = copyRequest;
        const centerMoreInfo = meDetail.centerMoreInfo && {
            adminName,
            recruiterName,
            workerCount,
            severancePayType,
            address: { lotAddressName: request.address.lotAddressName, addressDetail: request.addressDetail },
        };
        const data: PutCenterMeDetailRequestInterface = {
            ...ConverterUtil.removeUselessProps(copyRequest, USELESS_KEYS),
            centerInformationUpdateDto: { adminEmail, adminPhoneNum, name, centerMoreInfo, codeAuthToken },
            recruiterSignatureFile: meDetail.centerMoreInfo && ConverterUtil.convertToFile(request.recruiterSignatureFile || signFile, "sign.png"),
        };
        return data;
    };

    const update = async (request: CenterInformationInterface): Promise<void> => {
        EventUtil.gtmEvent("click", "change", "cenModifying", "");

        await updateMeDetail(reformattedForAPI(request));
    };

    const onOpen = (): void => {
        setDisabled(true);
    };

    const onClose = (): void => {
        setDisabled(false);
    };
    const loadCertFile = async () => {
        const response = await getMeDetailCertFile();
        setCertFile(ConverterUtil.toBase64SignType(response.certFileAsBase64));
    };

    useLayoutEffect(() => {
        get();
        loadCertFile();
    }, []);

    useEffect(() => {
        const loadSignFile = async () => {
            if (meDetail?.centerMoreInfo) {
                const response = await getSignatureFile();
                setSignFile(ConverterUtil.toBase64SignType(response.signatureFileAsBase64));
            }
        };
        loadSignFile();
    }, [meDetail]);
    if (!meDetail || !certFile) {
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
        <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
            <ListSubtitle mb={9} Icon={<CorporateFare sx={{ mr: 2 }} />} ListItemTextPrimary="기관 정보" />
            <Form<CenterInformationInterface> buttonText="정보 변경" onSubmit={update} disabled={disabled} defaultValid={false}>
                <Text
                    title="기관 고유번호"
                    required
                    name="idNum"
                    placeholder="기관 고유번호"
                    defaultValue={meDetail.idNum}
                    maxLength={ID_NUM_LENGTH}
                    autoSubmit={false}
                    disabled
                    disableSpacing
                />
                <Text title="기관 이름" name="name" placeholder="기관 이름" required defaultValue={meDetail.name} />
                <File title="기관 고유번호증" name="certFile" placeholder="이미지 등록" required defaultValue={certFile} />

                <Label labelVariant="subtitle1" required title="기관 연락처" id="unknown" sx={{ mt: 7, mb: 0 }} />
                <Tel
                    title="기관 대표번호"
                    name="phoneNum"
                    placeholder="기관 대표번호"
                    required
                    disabled
                    labelStyle="input"
                    helperText="롱텀에 등록된 전화번호여야 합니다."
                    defaultValue={meDetail.phoneNum}
                />
                <AuthenticatedPhone
                    page="CENTER_SIGNUP"
                    title=""
                    name="adminPhoneNum"
                    requestTitle="휴대폰 번호를 인증해주세요."
                    placeholder="기관 대표자 휴대폰 번호"
                    required
                    helperText="기관 대표자님의 휴대폰으로 인증해주세요."
                    onOpen={onOpen}
                    onClose={onClose}
                    authCodeProcess={AuthCodeProcessEnum.CENTER_PHONE_NUM_UPDATE}
                    defaultValue={meDetail.adminPhoneNum}
                    completeMessage={
                        <Typography variant="caption" color="success.main">
                            본인인증 완료
                        </Typography>
                    }
                />

                <Email title="기관 대표자 이메일" name="adminEmail" placeholder="이메일 아이디" required defaultValue={meDetail.adminEmail} />
                {meDetail.centerMoreInfo && (
                    <>
                        <Box sx={{ gap: "6px" }} display="flex" flexDirection="column">
                            <Address title="기관 주소" required name="address" placeholder="주소 검색" data-cy="address" defaultValue={meDetail.centerMoreInfo?.address} />
                            <Text
                                name="addressDetail"
                                placeholder="기관 상세주소"
                                maxLength={50}
                                data-cy="addressDetail"
                                defaultValue={meDetail.centerMoreInfo?.address.addressDetail}
                            />
                        </Box>
                        <Text
                            title="기관 근로자 수"
                            name="workerCount"
                            placeholder="기관 근로자 수"
                            required
                            regExp={/^\d{0,3}$/}
                            data-cy="worker-count"
                            defaultValue={meDetail.centerMoreInfo?.workerCount.toString()}
                        />
                        <Select<SeverancePayTypeEnum>
                            title="퇴직급여 형태"
                            name="severancePayType"
                            required
                            data={SeverancePayTypeLabel}
                            defaultValue={meDetail.centerMoreInfo?.severancePayType}
                            data-cy="severance-pay-type"
                        />
                        <ListSubtitle mt={6} mb={3} Icon={<PersonIcon sx={{ mr: 2 }} />} ListItemTextPrimary="기관 담당자 정보" />
                        <Text
                            title="기관 대표자 이름"
                            name="adminName"
                            placeholder="기관 대표자 이름"
                            required
                            maxLength={20}
                            data-cy="admin-name"
                            defaultValue={meDetail.centerMoreInfo?.adminName}
                        />
                        <Text
                            title="구인 담당자 이름"
                            name="recruiterName"
                            placeholder="구인 담당자 이름"
                            required
                            maxLength={20}
                            data-cy="recruiter-name"
                            defaultValue={meDetail.centerMoreInfo?.recruiterName}
                        />

                        {signFile && <SignInputButton name="recruiterSignatureFile" title="구인 담당자 서명" required defaultValue={signFile} />}
                    </>
                )}
            </Form>
        </Box>
    );
};
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true);

export default WithHeadMetaData(InfoCenter);

ListSubtitle.defaultProps = {
    mt: 0,
    mb: 0,
};
