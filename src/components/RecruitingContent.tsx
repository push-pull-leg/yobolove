import { Box, Button, Card, CardContent, CardHeader, Chip, Divider, List, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import { CalendarToday, DirectionsRun } from "@mui/icons-material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import { css } from "@emotion/css";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import CallIcon from "@mui/icons-material/Call";
import Image from "next/image";
import { useSetRecoilState } from "recoil";
import Script from "next/script";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import nl2br from "react-nl2br";
import MoneyLogo from "../styles/images/img-icon-money.svg";
import { toRem } from "../styles/options/Function";
import DateUtil from "../util/DateUtil";
import { JobSummaryLabel } from "../enum/JobEnum";
import { PayTypeLabel } from "../enum/PayTypeEnum";
import ConverterUtil from "../util/ConverterUtil";
import { RecipientMotionStateLabel } from "../enum/RecipientMotionStateEnum";
import { RecipientCognitiveStateLabel } from "../enum/RecipientCognitiveState";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import EventUtil from "../util/EventUtil";
import RecruitingSkeleton from "./skeleton/RecruitingSkeleton";
import Error from "./Error";
import RecruitingService from "../service/RecruitingService";
import { GetRecruitingResponseDataInterface } from "../interface/response/GetRecruitingResponseInterface";

const moneyIconStyle = css`
    width: ${toRem(17)};
    height: ${toRem(17)};
    display: inline-block;
    vertical-align: bottom;
    fill: currentColor;
    color: #ff567c;
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: ${toRem(0.8)};
`;

const certTypeAndDateStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${toRem(8)};
`;

const linkWorknetStyle = css`
    vertical-align: middle;
    display: flex;
`;

const numberDialogTitleStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

/**
 * {@link RecruitingContent} props
 * @category PropsType
 */
type RecruitingDataProps = {
    /**
     * 구인공고데이터. undefined 이거나 loading 일 수 있다.
     * loading 의 경우, 데이터를 불러오는 중
     */
    recruiting: GetRecruitingResponseDataInterface | "loading" | undefined;
};

const specialRecruitings: Map<string, number> = new Map([
    ["e5b099bc48994288b90c1caf06383652", 5],
    ["aacb11ea9f0a4424ad14f90633d5e844", 10],
    ["b55bcc15f00047828843d81f1b416516", 10],
]);

/**
 * 구인상세 페이지/컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=4527%3A121437)
 * @category Component
 */
function RecruitingContent(recruitingData: RecruitingDataProps) {
    const { recruiting } = recruitingData;
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);
    const [map, setMap] = useState<ReactElement | undefined>(undefined);
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.up("sm"));
    const sendEvent = useCallback(() => {
        if (recruiting && recruiting !== "loading") {
            EventUtil.gtmEvent("click", "pathFinding", "recruitings", recruiting.uuid);
        }
    }, [recruiting]);

    const convertData = useMemo(() => {
        if (!recruiting || recruiting === "loading") {
            return null;
        }

        const addressData = (
            <>
                <ListItem disablePadding sx={{ mt: 9, mb: 3, flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography variant="body2" color="text.secondary">
                        근무지 상세 위치
                    </Typography>
                    <ListItemText data-cy="address" sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.priamry" }}>
                        {recruiting.address.roadAddressName}
                    </ListItemText>
                </ListItem>
                <KakaoMap data-cy="kakao-map" center={{ lat: recruiting.address.lat as number, lng: recruiting.address.lng as number }} style={{ width: "100%", height: "240px" }}>
                    <MapMarker position={{ lat: recruiting.address.lat as number, lng: recruiting.address.lng as number }} />
                </KakaoMap>
                <a
                    href={`https://map.naver.com/index.nhn?slng=&slat=&stext=&elng=${recruiting.address.lng}&elat=${recruiting.address.lat}&pathType=0&showMap=true&etext=${recruiting.address.roadAddressName}&menu=route`}
                    onClick={() => sendEvent()}
                    target="_blank"
                    rel="noreferrer"
                    data-cy="navigation-button"
                >
                    <Button
                        variant="outlined"
                        sx={{
                            border: "rgba(44,44,44,0.5) 1px solid",
                            color: "secondary.main",
                            width: "100%",
                            py: 1.5,
                            mt: 3,
                        }}
                    >
                        근무지 길찾기
                    </Button>
                </a>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 9, mt: 2 }}>
                    어르신 개인정보 보호를 위해 정확한 주소가 아닌 인근 장소 주소로 표시될 수 있어요.
                </Typography>
            </>
        );

        return {
            distance: RecruitingService.getDistanceText(recruiting),
            preferGender: RecruitingService.getPreferGenderText(recruiting?.preferCaregiverGender),
            needService: RecruitingService.getNeedServiceText(recruiting),
            addressData,
        };
    }, [recruiting]);

    useEffect(() => {
        if (typeof window !== "undefined" && window.kakao) {
            setMap(convertData?.addressData);
        }
    }, [convertData?.addressData]);

    const contactCenter = useCallback(() => {
        if (!recruiting || recruiting === "loading") return;

        EventUtil.gtmEvent("click", "number", "recruitings", recruiting.uuid);
        if (!recruiting.safetyNumber) {
            setDialogRecoil({
                open: true,
                title: (
                    <div className={numberDialogTitleStyle}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "3rem", mb: 3 }} />
                        <Typography variant="h4" data-cy="safety-number" color="text.primary">
                            연락처 확인 실패
                        </Typography>
                        <Typography variant="h5" color="text.primary">
                            연락처 정보를 불러오지 못했어요.
                            <br />
                            새로고침하거나 인터넷 종료 후 다시 시도해주세요.
                        </Typography>
                    </div>
                ),
                content: (
                    <Typography variant="body1" sx={{ color: "rgba(0,0,0,0.5)", textAlign: "center" }}>
                        오류가 계속 발생하는 경우 고객센터
                        <br />
                        (1661-7939)로 문의 바랍니다.
                    </Typography>
                ),
                hasCancelButton: false,
                hasConfirmButton: false,
            });
            return;
        }
        if (recruiting.safetyNumber) {
            if (isMdDown) {
                setDialogRecoil({
                    open: true,
                    title: (
                        <Typography variant="h2" data-cy="safety-number" color="text.primary">
                            {recruiting.safetyNumber.replace(/^(\d{3,4})(\d{4})(\d{4})$/, `$1-$2-$3`)}
                        </Typography>
                    ),
                    content: (
                        <Typography variant="body1" sx={{ color: "rgba(0,0,0,0.5)" }}>
                            0508번호도 안심하고 전화주세요! 채용 담당자님의 개인정보 보호를 위한 안심번호입니다.
                        </Typography>
                    ),
                    hasCancelButton: false,
                    confirmButtonStyle: "outlined",
                    hasConfirmButton: false,
                });
            } else {
                window.location.href = `tel:${recruiting.safetyNumber}`;
            }
        }
    }, [recruiting, isMdDown]);

    const contactWorknetCenter = useCallback(() => {
        if (!recruiting || recruiting === "loading") return;

        EventUtil.gtmEvent("click", "number", "recruitings", recruiting.uuid);
        if (isMdDown) {
            setDialogRecoil({
                open: true,
                title: (
                    <Typography variant="h2" data-cy="contact-number" color="text.primary">
                        {recruiting.safetyNumber?.replace(/^(\d{3,4})(\d{4})(\d{4})$/, `$1-$2-$3`)}
                    </Typography>
                ),
                hasCancelButton: false,
                confirmButtonStyle: "outlined",
            });
        } else {
            window.location.href = `tel:${recruiting.safetyNumber}`;
        }
    }, [recruiting, isMdDown]);

    const visitTimeDom = useMemo<string>(() => RecruitingService.getVisitTimeText(recruiting), [recruiting]);

    if (!recruiting) {
        return <Error />;
    }
    if (recruiting === "loading") {
        return <RecruitingSkeleton certTypeAndDateStyle={certTypeAndDateStyle} moneyIconStyle={moneyIconStyle} />;
    }
    if (recruiting.certType !== "YOBOLOVE") {
        return (
            <>
                <Script
                    type="text/javascript"
                    src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_KEY}&libraries=services,clusterer&autoload=false`}
                    strategy="lazyOnload"
                    onLoad={() => setMap(convertData?.addressData)}
                />
                <div data-cy="recruiting-content">
                    <Card
                        sx={{
                            borderRadius: 0,
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                        elevation={0}
                        raised={false}
                    >
                        <CardHeader
                            title={
                                <>
                                    <div className={certTypeAndDateStyle}>
                                        <Typography
                                            sx={{
                                                height: toRem(24),
                                                fontSize: toRem(14),
                                                mb: 2.5,
                                                pt: 1,
                                                color: "rgba(0, 0, 0, 0.87)",
                                            }}
                                        >
                                            일반공고
                                        </Typography>
                                        <Typography data-cy="date" color="secondary.dark" variant="body2">
                                            {DateUtil.toString(recruiting.openedDate, "M/D")}
                                        </Typography>
                                    </div>
                                    [{JobSummaryLabel.get(recruiting.job)}] {recruiting.address.roadAddressName}
                                </>
                            }
                            sx={{ p: 0, textAlign: "left", alignItems: "flex-start" }}
                        />
                        <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 2.5 } }}>
                            <ListItem sx={{ pt: 1.5, pb: 0, px: 0 }}>
                                <ListItemIcon>
                                    <DirectionsRun fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                                    {convertData?.distance}
                                </ListItemText>
                            </ListItem>
                            <ListItem sx={{ pt: 1.5, pb: 0, px: 0 }}>
                                <ListItemIcon>
                                    <CalendarToday fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText sx={{ m: 0 }} data-cy="visit-time" primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                                    {recruiting.workTime?.memo ? recruiting.workTime?.memo : "시간정보-상세내용 확인"}
                                </ListItemText>
                            </ListItem>
                            <ListItem sx={{ pt: 1.5, pb: 0, px: 0 }}>
                                <ListItemIcon>
                                    <MoneyLogo className={moneyIconStyle} />
                                </ListItemIcon>
                                <ListItemText data-cy="pay" sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                                    &nbsp;
                                    {recruiting.pay ? `${PayTypeLabel.get(recruiting.payType)} ${ConverterUtil.toCommaString(recruiting.pay)}원` : "급여정보-상세내용 확인"}
                                </ListItemText>
                            </ListItem>
                        </CardContent>
                        <Divider sx={{ pt: 4 }} />
                        <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 4 } }}>
                            <ListItem sx={{ padding: "0 0 1rem" }}>
                                <ListItemIcon>
                                    <HomeOutlinedIcon fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "kakaotalk.contrastText" }}>
                                    {recruiting.centerName ? recruiting.centerName : "-"}
                                </ListItemText>
                            </ListItem>
                            {recruiting.safetyNumber ? (
                                <Button
                                    startIcon={<CallIcon />}
                                    data-cy="contact-button"
                                    variant="contained"
                                    size="large"
                                    sx={{ width: "100%", py: 3, mb: 3 }}
                                    onClick={contactWorknetCenter}
                                >
                                    <Typography color="primary.contrastText" sx={{ fontSize: toRem(22), fontWeight: 500, pl: 2.5 }}>
                                        담당자 연락처 확인
                                    </Typography>
                                </Button>
                            ) : null}
                            <a
                                href={isMdDown ? recruiting?.infoUrl || undefined : recruiting?.mobileInfoUrl || undefined}
                                color="secondary.main"
                                className={linkWorknetStyle}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        border: "2px solid rgba(0, 0, 0, 0.87)",
                                        color: "secondary.main",
                                        width: "100%",
                                        py: 3,
                                        mb: 5,
                                    }}
                                >
                                    <Image src={`${process.env.NEXT_PUBLIC_CDN_HOST}/assets/images/worknet-logo.webp`} width={93} height={32} />
                                    <Typography color="text.primary" sx={{ fontSize: toRem(22), fontWeight: 500, pl: 2.5 }}>
                                        워크넷에서 확인
                                    </Typography>
                                </Button>
                            </a>
                            <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                                <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.5)" }}>
                                    모집요강
                                </Typography>
                                <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.primary" }}>
                                    {recruiting.memo ? nl2br(recruiting.memo) : "-"}
                                </ListItemText>
                            </ListItem>
                        </CardContent>
                    </Card>
                    {map}
                </div>
            </>
        );
    }

    return (
        <>
            <Script
                type="text/javascript"
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_KEY}&libraries=services,clusterer&autoload=false`}
                strategy="lazyOnload"
                onLoad={() => setMap(convertData?.addressData)}
            />
            <div data-cy="recruiting-content">
                <Card
                    sx={{
                        borderRadius: 0,
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                    elevation={0}
                    raised={false}
                >
                    <CardHeader
                        title={
                            <>
                                <div className={certTypeAndDateStyle}>
                                    <Box display="flex" sx={{ gap: toRem(2) }}>
                                        <Chip color="primary" role="status" label="요보사랑 인증" />
                                        {specialRecruitings.has(recruiting.uuid) && (
                                            <Chip color="info" role="status" label={`취업축하금 ${specialRecruitings.get(recruiting.uuid)}만원`} />
                                        )}
                                    </Box>
                                    <Typography data-cy="date" color="secondary.dark" variant="body2">
                                        {DateUtil.toString(recruiting.openedDate, "M/D")}
                                    </Typography>
                                </div>
                                {RecruitingService.getMainText(recruiting)}
                            </>
                        }
                        subheader={
                            <Typography variant="body2" color="kakaotalk.contrastText" sx={{ pt: 1.5 }}>
                                {RecruitingService.getSubTitle(recruiting)}
                            </Typography>
                        }
                        sx={{ p: 0, textAlign: "left", alignItems: "flex-start" }}
                    />
                    <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 2.5 } }}>
                        <ListItem sx={{ pt: 1.5, pb: 0, px: 0 }}>
                            <ListItemIcon>
                                <DirectionsRun fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                                {convertData?.distance}
                            </ListItemText>
                        </ListItem>
                        <ListItem sx={{ pt: 1.5, pb: 0, px: 0 }}>
                            <ListItemIcon>
                                <CalendarToday fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                                {visitTimeDom}
                            </ListItemText>
                        </ListItem>
                        <ListItem sx={{ pt: 1.5, pb: 0, px: 0 }}>
                            <ListItemIcon>
                                <MoneyLogo className={moneyIconStyle} />
                            </ListItemIcon>
                            <ListItemText data-cy="pay" sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                                {PayTypeLabel.get(recruiting.payType)} {ConverterUtil.toCommaString(recruiting.pay)}원
                            </ListItemText>
                        </ListItem>
                    </CardContent>
                    {specialRecruitings.has(recruiting.uuid) ? (
                        <Box py={2} my={4} bgcolor={theme.palette.info.light}>
                            <Typography color="info.dark" variant="body2" align="center">
                                60시간 근무 시<br />
                                <strong>취업축하금 {specialRecruitings.get(recruiting.uuid)}0,000원</strong>
                            </Typography>
                            <Typography color="text.secondary" variant="overline" mt={1} display="block" align="center">
                                취업축하금은 원천징수 후 요보사랑이 지급해드려요
                            </Typography>
                        </Box>
                    ) : (
                        <Divider sx={{ pt: 4 }} />
                    )}
                    <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 4 } }}>
                        <ListItem sx={{ padding: "0 0 0.375rem" }}>
                            <ListItemIcon>
                                <HomeOutlinedIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "kakaotalk.contrastText" }}>
                                {recruiting.centerName ? recruiting.centerName : "-"}
                            </ListItemText>
                        </ListItem>
                        <ListItem sx={{ padding: "0 0 1rem" }}>
                            <ListItemIcon>
                                <FaceOutlinedIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText sx={{ m: 0 }} data-cy="prefer-gender" primaryTypographyProps={{ variant: "body2", color: "kakaotalk.contrastText" }}>
                                {convertData?.preferGender}
                            </ListItemText>
                        </ListItem>
                        <Button data-cy="contact-button" startIcon={<CallIcon />} variant="contained" size="large" sx={{ width: "100%", py: 3, mb: 3 }} onClick={contactCenter}>
                            <Typography color="primary.contrastText" sx={{ fontSize: toRem(22), fontWeight: 500, pl: 2.5 }}>
                                담당자 연락처 확인
                            </Typography>
                        </Button>
                        <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.5)", mb: 5 }}>
                            0508번호도 안심하고 전화주세요! 채용 담당자님의 개인정보 보호를 위한 안심번호입니다.
                        </Typography>
                        {ConverterUtil.joinWithoutUndefined([
                            RecipientMotionStateLabel.get(recruiting.recipient?.motionState),
                            RecipientCognitiveStateLabel.get(recruiting.recipient?.cognitiveState),
                        ]) && (
                            <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "flex-start", pb: 4 }}>
                                <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.5)" }}>
                                    어르신 상태
                                </Typography>
                                <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.primary" }}>
                                    {ConverterUtil.joinWithoutUndefined([
                                        RecipientMotionStateLabel.get(recruiting.recipient?.motionState),
                                        RecipientCognitiveStateLabel.get(recruiting.recipient?.cognitiveState),
                                    ])}
                                </ListItemText>
                            </ListItem>
                        )}
                        {convertData?.needService && (
                            <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "flex-start", pb: 4 }}>
                                <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.5)" }}>
                                    필요서비스
                                </Typography>
                                <ListItemText sx={{ m: 0 }} data-cy="need-service" primaryTypographyProps={{ variant: "body2", color: "text.primary" }}>
                                    {convertData?.needService}
                                </ListItemText>
                            </ListItem>
                        )}
                        <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.5)" }}>
                                특이사항
                            </Typography>
                            <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.primary", sx: { wordBreak: "break-all" } }}>
                                {recruiting.memo ? nl2br(recruiting.memo) : "-"}
                            </ListItemText>
                        </ListItem>
                    </CardContent>
                </Card>
                {map}
            </div>
        </>
    );
}

export default React.memo(RecruitingContent);
