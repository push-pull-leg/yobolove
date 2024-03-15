import { Box, Card, CardContent, CardHeader, Chip, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import React, { ReactElement, useCallback, useMemo } from "react";
import { CalendarToday, DirectionsRun } from "@mui/icons-material";
import { css } from "@emotion/css";
import { useRecoilValue } from "recoil";
import Link from "next/link";
import DateUtil from "../util/DateUtil";
import ConverterUtil from "../util/ConverterUtil";
import MoneyLogo from "../styles/images/img-icon-money.svg";
import { toRem, toRemWithUnit } from "../styles/options/Function";
import { PayTypeLabel } from "../enum/PayTypeEnum";
import RecruitingSimpleInterface from "../interface/RecruitingSimpleInterface";
import RecruitingCertTypeEnum from "../enum/RececruitingCertTypeEnum";
import breakpoints from "../styles/options/Breakpoints";
import { recruitingsFilterDataRecoilState } from "../recoil/RecruitingsFilteDatarRecoil";
import EventUtil from "../util/EventUtil";
import GetRecruitingRequestInterface from "../interface/request/GetRecruitingRequestInterface";
import RecruitingsFilterUtil from "../util/RecruitingsFilterUtil";
import UseNudge from "../hook/UseNudge";
import CommonUtil from "../util/CommonUtil";
import RecruitingService from "../service/RecruitingService";
import UseCenterService from "../hook/UseCenterService";
import UseRecruitingModal from "../hook/UseRecuritingModal";

const certTypeAndDateStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${toRem(8)};
`;

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

const addressTitleStyle = css`
    @media (min-width: ${Number(breakpoints.values?.sm)}px) {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
`;

/**
 * 구인공고 onClick 을 위한 wrapper
 * bot 인 경우 href 가 있는 a 태그로 감싼다.
 * bot 이 아닌경우, openPopup 으로 팝업형태의 구인공고를 연다.
 *
 * @category Component
 */
function Wrapper(props: {
    /**
     * ㅁㄴㅇㅁㄴ
     */
    children: ReactElement;
    /**
     * 팝업 열기 method
     * @param from
     */
    openRecruiting: (from?: string) => void;
    /**
     * 주소 쿼리 데이터
     */
    getAddressData: (isQuery?: boolean) => { to: string; from: string };
    /**
     * 구인공고 데이터
     */
    recruiting: RecruitingSimpleInterface;
}) {
    const { children, openRecruiting, getAddressData, recruiting } = props;
    if (typeof window !== "undefined" && navigator && !CommonUtil.isBot(navigator.userAgent)) {
        const addressData = getAddressData(false);
        return (
            <div role="presentation" onClick={() => openRecruiting(addressData?.from)} style={{ cursor: "pointer" }}>
                {children}
            </div>
        );
    }

    const addressData = getAddressData(true);
    return (
        <Link href={`/요양보호사구인/${addressData?.to}/${recruiting.uuid}${addressData?.from}`} passHref>
            <a role="link" style={{ width: "100%" }}>
                {children}
            </a>
        </Link>
    );
}

/**
 * {@link Recruiting} props
 * @category PropsType
 */
type RecruitingPropsType = {
    /**
     * 구인공고
     */
    recruiting: RecruitingSimpleInterface;
    /**
     * recruiting style 입니다.
     * @union
     * "simple" - 홈화면에서 쓰는 작은 레이아웃
     * "normal" - 일반 레이아웃
     */
    variant?: "normal" | "simple";
};

/**
 * 리스트형 구인공고 - 단일 구인공고 컴포넌트
 *
 * [피그마 시안: simple variant](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1502%3A74627)
 *
 * [피그마 시안: normal variant](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=2559%3A113831)
 * @category Component
 */
const specialRecruitings: Map<string, number> = new Map([
    ["e5b099bc48994288b90c1caf06383652", 5],
    ["aacb11ea9f0a4424ad14f90633d5e844", 10],
    ["b55bcc15f00047828843d81f1b416516", 10],
]);

function Recruiting(props: RecruitingPropsType) {
    const { recruiting, variant } = props;
    const { handleCloseRecruitingPopup } = UseNudge();
    const filterData = useRecoilValue(recruitingsFilterDataRecoilState);
    const { getRecruitingDetail } = UseCenterService();
    const { openRecruitingDetailModal } = UseRecruitingModal();

    const clickContents = () => {
        EventUtil.gtmEvent("click", "viewDetail", "recruitings", recruiting.uuid);
    };

    /**
     * 구인상세에서 사용할 query 데이터 가져오기
     * 구인공고의 address.roadAddressName 데이터를 도착(to) 데이터로,
     * filterData 의 근무지역 데이터가 있는경우, 해당 데이터를 출발(from) 데이터로 변환
     */
    const getAddressData = useCallback(
        (isQuery = false) => {
            const roadAddressName = recruiting.address?.roadAddressName;
            const lotAddressName = filterData?.address?.lotAddressName;

            if (!isQuery) {
                return {
                    to: roadAddressName || "",
                    from: lotAddressName || "",
                };
            }

            const querifiedTo = RecruitingsFilterUtil.toURLString(roadAddressName);
            const querifiedFrom = RecruitingsFilterUtil.toURLString(lotAddressName);

            return { to: querifiedTo, from: lotAddressName ? `?from=${querifiedFrom}` : "" };
        },
        [recruiting.address, filterData],
    );

    /**
     * 팝업형태의 구인공고 열기
     * {@link EndpointEnum.GET_RECRUITING} 호출해서 구인정보 가져온 후, {@link RecruitingContent} 컴포넌트를 구성해서 팝업으로 띄움
     *
     * @param from 검색 시작 주소
     */
    const openRecruiting = async (from?: string): Promise<void> => {
        if (!recruiting) {
            return;
        }
        EventUtil.gtmEvent("click", "home", "recruitings", recruiting.uuid, "/");
        let params: GetRecruitingRequestInterface = { uuid: recruiting.uuid };
        if (from) {
            params = { ...params, lotAddressName: from };
        }
        const recruitingResponse = await getRecruitingDetail(params);

        if (!recruitingResponse) {
            return;
        }
        openRecruitingDetailModal(recruitingResponse, undefined, handleCloseRecruitingPopup);
    };

    if (variant === "simple") {
        return (
            <Wrapper recruiting={recruiting} openRecruiting={openRecruiting} getAddressData={getAddressData}>
                <Card
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        border: "1px  solid  rgba(0, 0, 0, 0.12)",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                    elevation={0}
                    raised={false}
                >
                    <CardHeader
                        title={
                            <>
                                <Typography data-cy="date" color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                                    {DateUtil.toString(recruiting.openedDate, "M/D")}
                                </Typography>
                                {ConverterUtil.convertSimpleAddress(recruiting.address) || recruiting.address.roadAddressName}
                            </>
                        }
                        titleTypographyProps={{ variant: "body1", role: "heading", "data-cy": "title" }}
                        sx={{ p: 0, textAlign: "left", height: `${toRem(79)}`, alignItems: "flex-start", overflow: "hidden" }}
                    />
                    <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 2.5 } }}>
                        <ListItem disablePadding sx={{ mt: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", height: toRemWithUnit(6) }}>
                            <ListItemIcon>
                                <CalendarToday fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "secondary.dark" }}>
                                {useMemo<string>(() => RecruitingService.getVisitTimeText(recruiting), [recruiting])}
                            </ListItemText>
                        </ListItem>
                        <ListItem disablePadding sx={{ mt: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", height: toRemWithUnit(6) }}>
                            <ListItemIcon>
                                <MoneyLogo className={moneyIconStyle} />
                            </ListItemIcon>
                            <ListItemText sx={{ m: 0 }} data-cy="pay" primaryTypographyProps={{ variant: "body2", color: "secondary.dark" }}>
                                {PayTypeLabel.get(recruiting.payType)}
                                &nbsp;
                                {ConverterUtil.toCommaString(recruiting.pay)}원
                            </ListItemText>
                        </ListItem>
                    </CardContent>
                </Card>
            </Wrapper>
        );
    }
    const title = useMemo<ReactElement>(() => {
        if (recruiting.certType === RecruitingCertTypeEnum.YOBOLOVE) {
            return (
                <div className={certTypeAndDateStyle}>
                    <Box display="flex" sx={{ gap: toRem(2) }}>
                        <Chip color="primary" role="status" label="요보사랑 인증" />
                        {specialRecruitings.has(recruiting.uuid) && <Chip color="info" role="status" label={`취업축하금 ${specialRecruitings.get(recruiting.uuid)}만원`} />}
                    </Box>
                    <Typography data-cy="date" color="secondary.dark" variant="body2">
                        {DateUtil.toString(recruiting.openedDate, "M/D")}
                    </Typography>
                </div>
            );
        }
        return (
            <div className={certTypeAndDateStyle}>
                <Typography sx={{ height: toRem(24), fontSize: toRem(14), pt: 1, color: "rgba(0, 0, 0, 0.87)" }}>일반공고</Typography>
                <Typography data-cy="date" color="secondary.dark" variant="body2">
                    {DateUtil.toString(recruiting.openedDate, "M/D")}
                </Typography>
            </div>
        );
    }, [recruiting.certType]);

    return (
        <Wrapper recruiting={recruiting} openRecruiting={openRecruiting} getAddressData={getAddressData}>
            <Card
                sx={{
                    p: {
                        xs: 4,
                        sm: 4,
                        md: 8,
                        lg: 8,
                    },
                    borderRadius: 0,
                    width: "100%",
                    boxSizing: "border-box",
                }}
                onClick={() => clickContents()}
                elevation={0}
                raised={false}
            >
                <CardHeader
                    title={title}
                    titleTypographyProps={{ variant: "subtitle2", role: "heading", "data-cy": "title" }}
                    subheaderTypographyProps={{ variant: "body2", sx: { mt: 1 }, "data-cy": "sub-title" }}
                    sx={{ p: 0 }}
                    data-cy="title-wrapper"
                />
                <Typography variant="subtitle2" role="heading" data-cy="title" className={addressTitleStyle}>
                    {useMemo<string>(() => RecruitingService.getMainText(recruiting), [recruiting.isTemporary, recruiting.certType, recruiting.job, recruiting.address])}
                </Typography>
                <Typography variant="body2" role="heading" color="text.primary" sx={{ mt: 1, height: toRem(23.4) }} data-cy="sub-title" className={addressTitleStyle}>
                    {useMemo<string>(
                        () => RecruitingService.getSubTitle(recruiting),
                        [recruiting?.certType, recruiting?.recipient?.grade, recruiting?.recipient?.age, recruiting?.recipient?.gender],
                    )}
                </Typography>
                <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 2.5 } }}>
                    <ListItem disablePadding sx={{ height: toRemWithUnit(6) }}>
                        <ListItemIcon>
                            <DirectionsRun fontSize="small" color="primary" />
                        </ListItemIcon>

                        <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                            {useMemo<string>(() => RecruitingService.getDistanceText(recruiting), [recruiting.distance])}
                        </ListItemText>
                    </ListItem>
                    <ListItem disablePadding sx={{ mt: 1, height: toRemWithUnit(6), sx: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }}>
                        <ListItemIcon>
                            <CalendarToday fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            sx={{ m: 0 }}
                            primaryTypographyProps={{
                                variant: "body2",
                                color: "text.secondary",
                                sx: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
                            }}
                        >
                            {useMemo<string>(() => RecruitingService.getVisitTimeText(recruiting), [recruiting])}
                        </ListItemText>
                    </ListItem>
                    <ListItem disablePadding sx={{ mt: 1, height: toRemWithUnit(6) }}>
                        <ListItemIcon>
                            <MoneyLogo className={moneyIconStyle} />
                        </ListItemIcon>
                        <ListItemText
                            data-cy="pay"
                            sx={{ m: 0 }}
                            primaryTypographyProps={{
                                variant: "body2",
                                color: "text.secondary",
                                sx: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
                            }}
                        >
                            {PayTypeLabel.get(recruiting.payType)}
                            &nbsp;
                            {ConverterUtil.toCommaString(recruiting.pay)}원
                        </ListItemText>
                    </ListItem>
                </CardContent>
            </Card>
        </Wrapper>
    );
}

Recruiting.defaultProps = {
    variant: "normal",
};
export default React.memo(Recruiting);
