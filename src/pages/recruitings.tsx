import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { css } from "@emotion/css";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import isbot from "isbot";
import { useRecoilValue } from "recoil";
import GetRecruitingsResponseInterface from "../interface/response/GetRecruitingsResponseInterface";
import UseHttp from "../hook/UseHttp";
import RecruitingsComponent from "../components/Recruitings";
import EndpointEnum from "../enum/EndpointEnum";
import { toRem } from "../styles/options/Function";
import MetaInterface from "../interface/response/MetaInterface";
import RecruitingsFilterDialog from "../components/RecruitingsFilterDialog";
import RecruitingsFilterDataInterface from "../interface/RecruitingsFilterDataInterface";
import GetRecruitingsRequestInterface from "../interface/request/GetRecruitingsRequestInterface";
import RecruitingSimpleInterface from "../interface/RecruitingSimpleInterface";
import { JobLabel } from "../enum/JobEnum";
import recruitingsFilterService, { initFilterData } from "../service/RecruitingsFilterService";
import Error from "../components/Error";
import HttpUtil from "../util/HttpUtil";
import RecruitingsFilterUtil from "../util/RecruitingsFilterUtil";
import HttpException from "../exception/HttpException";
import sectionStyle from "../styles/sectionStyle";
import UseTitle from "../hook/UseTitle";
import { UseObserver } from "../hook/UseObserver";
import WithHeadMetaData from "../hoc/WithHeadMetaData";
import SessionInterface from "../interface/SessionInterface";
import GetCaregiverDesiredWorkResponseInterface from "../interface/response/GetCaregiverDesiredWorkResponseInterface";
import WithCaregiverAuth from "../hoc/WithCaregiverAuth";
import EventUtil from "../util/EventUtil";
import { recruitingsFilterDataRecoilState } from "../recoil/RecruitingsFilteDatarRecoil";
import UseNudge from "../hook/UseNudge";
import UseCaregiverService from "../hook/UseCaregiverService";
import RecruitingsFilterGuide from "../components/recruitings/RecruitingsFilterGuide";
import Loading from "../components/Loading";
import ConverterUtil from "../util/ConverterUtil";
import AddressUtil from "../util/AddressUtil";

const filterButton = css`
    margin: 2rem 0 2.75rem;
    display: inline-block;
`;

/**
 * 리스트 타입 : 인증 / 일반
 */
type RecruitingListType = "CERTIFIED" | "NORMAL";

/**
 * filter 조건을 위한 type.
 * text: filter 하단 텍스트
 * variant : 필터 버튼 variant
 */
type FilterConditionType = {
    text: string;
    variant: "outlined" | "contained";
    bg: "transparent" | "secondary.main";
    color: "secondary" | "common.white";
};

/**
 * certifiedMeta 인증된 구인공고 meta response meta
 * normalMeta 일반 구인공고 meta response
 */
let certifiedMeta: MetaInterface | undefined | never;
let normalMeta: MetaInterface | undefined | never;

/**
 * RecruitingsPropsType : SSR 에서 데이터를 받을 수도 있음.
 */
type RecruitingsPropsType = {
    /**
     * Query Params 에서 받아온 초기 filter Data
     */
    initialFilterData?: RecruitingsFilterDataInterface;
    /**
     * 인증 공고 response
     */
    initialCertifiedRecruitingsResponse?: GetRecruitingsResponseInterface | "loading";
    /**
     * 일반 공고 response
     */
    initialNormalRecruitingsResponse?: GetRecruitingsResponseInterface | "loading";
};

/**
 * 구인게시판
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A79584)
 * @category Page
 */
function Recruitings(props: RecruitingsPropsType) {
    /**
     * 로그인 여부를 확인한 결과
     */
    const { isLoggedIn } = UseCaregiverService();

    UseTitle("구인게시판");
    /**
     * OBSERVER INTERSECTION 을 위한 element ref
     */
    const getCertifiedResponseTarget = useRef<HTMLUListElement>(null);
    const getNormalResponseTarget = useRef<HTMLUListElement>(null);
    const { initialFilterData, initialCertifiedRecruitingsResponse = "loading", initialNormalRecruitingsResponse = "loading" } = props;
    const recruitingsFilterDataRecoil = useRecoilValue(recruitingsFilterDataRecoilState);
    const { httpRequest } = UseHttp();
    const { setFromRecruitings } = UseNudge();

    /**
     * 인증 공고 response state
     */
    const [certifiedRecruitingsResponse, setCertifiedRecruitingsResponse] = useState<GetRecruitingsResponseInterface | undefined | "loading">(initialCertifiedRecruitingsResponse);
    /**
     * 일반 공고 response state
     */
    const [normalRecruitingsResponse, setNormalRecruitingsResponse] = useState<GetRecruitingsResponseInterface | undefined | "loading">(initialNormalRecruitingsResponse);

    /**
     * 인증 공고의 공고 list > inf scroll
     */
    const [certifiedRecruitings, setCertifiedRecruitings] = useState<RecruitingSimpleInterface[]>(
        certifiedRecruitingsResponse && certifiedRecruitingsResponse !== "loading" ? certifiedRecruitingsResponse.data : [],
    );
    /**
     * 일반 공고의 공고 list > inf scroll
     */
    const [normalRecruitings, setNormalRecruitings] = useState<RecruitingSimpleInterface[]>(
        normalRecruitingsResponse && normalRecruitingsResponse !== "loading" ? normalRecruitingsResponse.data : [],
    );

    /**
     * filter data 를 filterdialog에서 받은 그대로 사용함.
     */
    const [filterData, setFilterData] = useState<RecruitingsFilterDataInterface>(recruitingsFilterDataRecoil || initialFilterData || initFilterData);
    const [openFilter, setOpenFilter] = useState<boolean>(false);

    const close = useCallback(() => {
        setOpenFilter(false);
    }, []);
    const open = useCallback((gtmValue: string) => {
        setOpenFilter(true);
        EventUtil.gtmEvent("click", "filterOpen", "board", gtmValue);
    }, []);

    /**
     * 실제 데이터를 요청하는 부분. CERTIFIED / NORMAL 두가지 를 선택적으로 넣을 수 있게 함.
     *
     * @param recruitingListType CERTIFIED : 인증공고, NORMAL : 일반공고
     * @param token 페이징을 위한 토큰, backend 에서 주는 값을 그대로 사용.
     * @param tokenType 토큰 타입(next: 다음페이지, prev: 이전페이지)
     * @param size 한페이지에 몇개나 넣을건지. 20이 디폴트
     * @param isClear 새로고침의 경우 true 로 놓고 전부 리셋한다.
     */
    const getRecruitings = async (
        recruitingListType: RecruitingListType,
        token: string | undefined = undefined,
        isClear: boolean = true,
        tokenType: "next" | "prev" = "next",
        size: number = 20,
    ): Promise<void> => {
        if (recruitingListType === "CERTIFIED") {
            setCertifiedRecruitingsResponse("loading");
        } else if (recruitingListType === "NORMAL") {
            setNormalRecruitingsResponse("loading");
        }
        const params: GetRecruitingsRequestInterface = RecruitingsFilterUtil.getRequestByFilterData(recruitingsFilterService.getData(), { size });
        if (token) {
            if (tokenType === "next") {
                params.nextToken = token;
            } else {
                params.prevToken = token;
            }
        }
        params.etc = recruitingListType === "NORMAL";

        let setRecruitings: (recruitings: RecruitingSimpleInterface[]) => void;
        let setRecruitingsResponse: (recruitings?: GetRecruitingsResponseInterface) => void;
        let originalRecruitings: RecruitingSimpleInterface[];

        /**
         * list type에 따라서 callback 할 함수 및 변수들
         */
        if (recruitingListType === "CERTIFIED") {
            setRecruitingsResponse = setCertifiedRecruitingsResponse;
            setRecruitings = setCertifiedRecruitings;
            originalRecruitings = certifiedRecruitings;
        } else {
            setRecruitingsResponse = setNormalRecruitingsResponse;
            setRecruitings = setNormalRecruitings;
            originalRecruitings = normalRecruitings;
        }

        let response: GetRecruitingsResponseInterface;
        try {
            response = await httpRequest<GetRecruitingsResponseInterface, GetRecruitingsRequestInterface>(EndpointEnum.GET_RECRUITINGS, params);
        } catch (httpError) {
            if (httpError instanceof HttpException) {
                const badResponse = httpError.getResponse();
                setRecruitingsResponse(badResponse as GetRecruitingsResponseInterface);
            } else {
                setRecruitingsResponse(undefined);
            }
            return;
        }

        setRecruitingsResponse(response);
        if (!response || "error" in response) {
            return;
        }
        if (recruitingListType === "CERTIFIED") {
            certifiedMeta = response.meta;
        } else {
            normalMeta = response.meta;
        }

        if (isClear) {
            setRecruitings(response.data);
        } else if (tokenType === "next") {
            setRecruitings([...originalRecruitings, ...response.data]);
        } else {
            setRecruitings([...response.data, ...originalRecruitings]);
        }
    };

    const filterCondition = useMemo<FilterConditionType>(() => {
        let addressFilter: string | undefined;
        let jobsFilter: string | undefined;
        let timeFilter: string | undefined;
        let temporaryFilter: string | undefined;
        if (filterData?.address) {
            addressFilter = AddressUtil.removeWordsWithBrackets(filterData.address?.lotAddressName);
        }
        if (filterData.jobs && filterData.jobs.length > 0) {
            const jobsArray = [];
            for (let i = 0; i < filterData?.jobs?.length; i += 1) {
                jobsArray.push(JobLabel.get(filterData.jobs[i]));
            }
            jobsFilter = `${jobsArray.join("·")}`;
        }
        if (filterData?.isTemporary === true) {
            temporaryFilter = "임시대근";
        }
        if (filterData?.workTime) {
            timeFilter = `${filterData.workTime.startAt}~${filterData.workTime.endAt}`;
        }
        if (!filterData.address && !filterData.workTime && (filterData.jobs?.length === 0 || !filterData.jobs) && !filterData?.isTemporary) {
            return {
                text: "원하는 조건에 맞는 공고만 보려면 눌러주세요",
                variant: "outlined",
                bg: "transparent",
                color: "secondary",
            };
        }
        return {
            text: ConverterUtil.joinWithoutUndefined([addressFilter, jobsFilter, temporaryFilter, timeFilter]),
            variant: "contained",
            bg: "secondary.main",
            color: "common.white",
        };
    }, [filterData]);

    /**
     * 최초 filterdialog의 mount가 완료되면 해당 데이터를 가져온다.
     * recruitings의 mount가 아닌 filterdiloag의 mount이벤트에서 해야지 실제 paras 혹은 recoil에 있는 데이터를 가져올 수 있음.(인증공고 한정)
     * 초기값이 없으면 csr방식으로 요청
     * @param currentFilterData
     */
    const onLoad = (currentFilterData: RecruitingsFilterDataInterface) => {
        setFilterData(currentFilterData);
        if (initialCertifiedRecruitingsResponse === "loading") getRecruitings("CERTIFIED");
        if (initialNormalRecruitingsResponse === "loading") getRecruitings("NORMAL");
    };

    /**
     * 일반공고는 mount 상관없이 그냥 바로 가져올 수 있음.
     */
    useEffect(() => {
        setFromRecruitings(true);
        certifiedMeta = undefined;
        normalMeta = undefined;
        return () => {
            certifiedMeta = undefined;
            normalMeta = undefined;
        };
    }, []);

    /**
     * 무한 스크롤 구현
     */
    const observeCertifiedRecruitings = UseObserver({
        target: getCertifiedResponseTarget,
        onIntersect: () => {
            if (certifiedMeta?.nextToken) {
                getRecruitings("CERTIFIED", certifiedMeta.nextToken, false);
            }
        },
        targetArray: certifiedRecruitings,
        loadLocation: 10,
    });

    const observeNormalRecruitings = UseObserver({
        target: getNormalResponseTarget,
        onIntersect: () => {
            if (normalMeta?.nextToken) {
                getRecruitings("NORMAL", normalMeta?.nextToken, false);
            }
        },
        targetArray: normalRecruitings,
        loadLocation: 10,
    });

    /**
     * 값이 변경될때마다 인증 공고를 받아온다
     * @param currentFilterData
     */
    const onChange = async (currentFilterData: RecruitingsFilterDataInterface) => {
        setFilterData(currentFilterData);

        observeCertifiedRecruitings.setPageSize(0);
        observeNormalRecruitings.setPageSize(0);
        await getRecruitings("CERTIFIED");
        await getRecruitings("NORMAL");
    };

    const certifiedRecruitingsDom = useMemo(() => {
        if (!certifiedRecruitingsResponse) {
            return <Error />;
        }

        if (!certifiedRecruitings.length) {
            return (
                <RecruitingsFilterGuide
                    openFilter={() => open("noContent")}
                    isLoggedIn={isLoggedIn()}
                    hasNormalRecruitings={!!normalRecruitings.length}
                    isRecruitingsLoading={(certifiedRecruitingsResponse === "loading" || normalRecruitingsResponse === "loading") && !normalRecruitings.length}
                />
            );
        }

        return <RecruitingsComponent recruitings={certifiedRecruitings} ref={getCertifiedResponseTarget} variant="normal" />;
    }, [certifiedRecruitingsResponse, certifiedRecruitings, isLoggedIn(), normalRecruitings.length, normalRecruitingsResponse]);

    const normalRecruitingsDom = useMemo(() => {
        if (!normalRecruitingsResponse) {
            return <Error />;
        }

        if (normalRecruitingsResponse === "loading" && !normalRecruitings.length) return <Loading />;

        return <RecruitingsComponent recruitings={normalRecruitings} ref={getNormalResponseTarget} variant="normal" />;
    }, [normalRecruitingsResponse, normalRecruitings]);

    return (
        <Container
            component="section"
            sx={{
                backgroundColor: "#FAFAFA",
                px: {
                    xs: 0,
                    sm: 0,
                },
                pb: 24,
                justifyContent: "center",
                display: "flex",
            }}
            maxWidth={false}
        >
            <Box
                display="flex"
                height="100%"
                alignItems="flex-start"
                flexDirection="column"
                {...sectionStyle(
                    {
                        px: 0,
                        py: 0,
                        textAlign: "left",
                    },
                    "lg",
                )}
            >
                <RecruitingsFilterDialog initialFilterData={filterData} onChange={onChange} open={openFilter} onClose={close} onLoad={onLoad} />
                <Box {...sectionStyle()}>
                    <div className={filterButton}>
                        <Button
                            onClick={() => open("0")}
                            role="status"
                            startIcon={<FilterAltIcon fontSize="large" sx={{ color: filterCondition.color }} />}
                            variant={filterCondition.variant}
                            color="secondary"
                            sx={{ backgroundColor: filterCondition.bg, color: filterCondition.color }}
                        >
                            근무조건 필터
                        </Button>
                        <br />
                        <Typography variant="body2" sx={{ color: "rgba(0, 0, 0, 0.87)", display: "inline-block", pt: 2 }}>
                            {filterCondition.text}
                        </Typography>
                    </div>
                    {(certifiedRecruitingsResponse === "loading" || (normalRecruitingsResponse === "loading" && !normalRecruitings.length) || !!certifiedRecruitings.length) && (
                        <Typography
                            sx={{
                                fontSize: { sm: toRem(16), md: toRem(18) },
                                fontWeight: 600,
                                color: "rgba(0, 0, 0, 0.9)",
                                mb: 3,
                            }}
                        >
                            요보사랑 인증 공고
                        </Typography>
                    )}
                </Box>
                {certifiedRecruitingsDom}
                {(normalRecruitingsResponse === "loading" || !!normalRecruitings.length) && (
                    <Typography
                        sx={{
                            maxWidth: toRem(1024),
                            fontSize: { sm: toRem(16), md: toRem(18) },
                            fontWeight: 600,
                            color: "rgba(0, 0, 0, 0.9)",
                            mt: 20,
                            pl: {
                                xs: 4,
                                sm: 4,
                                md: 8,
                                lg: 8,
                            },
                            mb: 3,
                        }}
                    >
                        유사한 조건의 공고
                    </Typography>
                )}
                {normalRecruitingsDom}
            </Box>
        </Container>
    );
}

Recruitings.defaultProps = {
    initialFilterData: undefined,
    initialCertifiedRecruitingsResponse: undefined,
    initialNormalRecruitingsResponse: undefined,
};

export const getServerSideProps: GetServerSideProps = WithCaregiverAuth(async (context: GetServerSidePropsContext, caregiver: SessionInterface) => {
    const { req, query } = context;
    const userAgent = typeof navigator === "undefined" ? req.headers["user-agent"] : navigator.userAgent;
    // 만약에 caregiver 가 있다면, 희망근무조건을 미리 불러온다.
    let filterData: RecruitingsFilterDataInterface = {};
    if (caregiver) {
        try {
            const desiredWorkResponse = await HttpUtil.request<GetCaregiverDesiredWorkResponseInterface>(
                EndpointEnum.GET_CAREGIVER_DESIRED_WORK,
                {},
                { Authorization: `Bearer ${caregiver.accessToken}` },
            );
            if (desiredWorkResponse && !("error" in desiredWorkResponse)) {
                filterData = {
                    address: desiredWorkResponse.data.address,
                    jobs: desiredWorkResponse.data.caregiverDesiredJobSet,
                    isTemporary: false,
                    workTime: desiredWorkResponse.data.desiredWorkTime,
                };
            }
            // eslint-disable-next-line no-empty
        } catch (e) {}
    }

    const queryKeys = ["근무지역", "근무형태", "임시대근", "근무시간"];
    if (queryKeys.some(i => Object.keys(query).includes(i))) {
        filterData = RecruitingsFilterUtil.getFilterDataByQueryParams(query);
    }

    // SSR 에서는 recoil 이 없으니까 초기 query string 값을 파싱해서  FilterDataInterface 로 변경해서 가져온다 > 이 값을 recruitings 까지 가져간다.
    if (isbot(userAgent)) {
        // 봇이면 ssr 에서 데이터를 미리 넘겨준다. certifiedResponse에서는 초기화한 filter data 를 request data 로 변환해서 호출
        let certifiedRecruitingsResponse: GetRecruitingsResponseInterface | undefined;
        let normalRecruitingsResponse: GetRecruitingsResponseInterface | undefined;
        try {
            certifiedRecruitingsResponse = await HttpUtil.request<GetRecruitingsResponseInterface, GetRecruitingsRequestInterface>(
                EndpointEnum.GET_RECRUITINGS,
                RecruitingsFilterUtil.getRequestByFilterData(filterData, { size: 20 }),
            );
            // eslint-disable-next-line no-empty
        } catch (e) {}
        try {
            normalRecruitingsResponse = await HttpUtil.request<GetRecruitingsResponseInterface, GetRecruitingsRequestInterface>(EndpointEnum.GET_RECRUITINGS, {
                size: 20,
            });
            // eslint-disable-next-line no-empty
        } catch (e) {}
        return { props: { certifiedRecruitingsResponse, normalRecruitingsResponse, initialFilterData: filterData } };
    }
    return { props: { initialFilterData: filterData } };
});

export default WithHeadMetaData(Recruitings);
