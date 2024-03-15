import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useState } from "react";
import { Check } from "@mui/icons-material";
import { Typography } from "@mui/material";
import JwtAccessTokenDataInterface from "../interface/JwtAccessTokenDataInterface";
import centerService from "../service/CenterService";
import { centerRecoilState, defaultCenterRecoilStateInterface } from "../recoil/CenterRecoil";
import useHttp from "./UseHttp";
import PostCenterLoginResponseInterface from "../interface/response/PostCenterLoginResponseInterface";
import PostCenterLoginRequestInterface from "../interface/request/PostCenterLoginRequestInterface";
import EndpointEnum from "../enum/EndpointEnum";
import TermsInterface from "../interface/TermsInterface";
import GetCenterTermsResponseInterface from "../interface/response/GetCenterTermsResponseInterface";
import GetCenterTermsRequestInterface from "../interface/request/GetCenterTermsRequestInterface";
import PostCenterSignupRequestInterface from "../interface/request/PostCenterSignupRequestInterface";
import ResponseInterface from "../interface/response/ResponseInterface";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import GetCenterIdNumExistsRequestInterface from "../interface/request/GetCenterIdNumExistsRequestInterface";
import GetCenterAccountIdExistsRequestInterface from "../interface/request/GetCenterAccountIdExistsRequestInterface";
import CenterSignupInterface from "../interface/CenterSignupInterface";
import PutCenterAnonymousPasswordRequestInterface from "../interface/request/PutCenterAnonymousPasswordRequestInterface";
import GetCenterMeResponseInterface from "../interface/response/GetCenterMeResponseInterface";
import TermsAgreementInterface from "../interface/TermsAgreementInterface";
import GetCenterTermAgreementRequestInterface from "../interface/request/GetCenterTermAgreementRequestInterface";
import GetCenterTermAgreementResponseInterface from "../interface/response/GetCenterTermAgreementResponseInterface";
import PostCenterTermAgreementRequestInterface from "../interface/request/PostCenterTermAgreementRequestInterface";
import GetCenterTermsAgreementResponseInterface from "../interface/response/GetCenterTermsAgreementResponseInterface";
import GetCenterTermsAgreementRequestInterface from "../interface/request/GetCenterTermsAgreementRequestInterface";
import PutCenterPasswordRequestInterface from "../interface/request/PutCenterPasswordRequestInterface";
import CenterAccountInterface from "../interface/CenterAccountInterface";
import PutCenterMeDetailRequestInterface from "../interface/request/PutCenterMeDetailRequestInterface";
import GetCenterMeDetailResponseInterface from "../interface/response/GetCenterMeDetailResponseInterface";
import CenterInterface from "../interface/CenterInterface";
import GetCenterMeCertFileResponseInterface from "../interface/response/GetCenterMeCertFileResponseInterface";
import CenterMeCertFileInterface from "../interface/CenterMeCertFileInterface";
import GetCenterContactsResponseInterface from "../interface/response/GetCenterContactsResponseInterface";
import CenterContactInterface from "../interface/CenterContactInterface";
import PostCenterContactsExtraRequestInterface from "../interface/request/PostCenterContactsExtraRequestInterface";
import PostCenterContactsExtraResponseInterface from "../interface/response/PostCenterContactsExtraResponseInterface";
import DeleteCenterContactsExtraRequestInterface from "../interface/request/DeleteCenterContactsExtraRequestInterface";
import DeleteCenterContactsExtraResponseInterface from "../interface/response/DeleteCenterContactsExtraResponseInterface";
import GetCenterRecruitingsSimpleResponseInterface from "../interface/response/GetCenterRecruitingsSimpleResponseInterface";
import GetCenterRecruitingsSimpleRequestInterface from "../interface/request/GetCenterRecruitingsSimpleRequestInterface";
import PatchCenterRecruitingRequestInterface from "../interface/request/PatchCenterRecruitingRequestInterface";
import GetCenterRecruitingRequestInterface from "../interface/request/GetCenterRecruitingRequestInterface";
import UseAlert from "./UseAlert";
import DeleteCenterWithdrawalRequestInterface from "../interface/request/DeleteCenterWithdrawalRequestInterface";
import GetCenterIdRequestInterface from "../interface/request/GetCenterIdRequestInterface";
import GetCenterIdResponseInterface from "../interface/response/GetCenterIdResponseInterface";
import PostCenterSignupResponseInterface from "../interface/response/PostCenterSignupResponseInterface";
import ResponseErrorCodeEnum from "../enum/ResponseErrorCodeEnum";
import PostCenterMoreInfoRequestInterface from "../interface/request/PostCenterMoreInfoRequestInterface";
import SubmitToConfirmCenterRecruitingContentInterface from "../interface/SubmitToConfirmCenterRecruitingContentInterface";
import RecipientServiceType from "../type/RecipientServiceType";
import RecipientType from "../type/RecipientType";
import RawCenterRecruitingContentInterface from "../interface/RawCenterRecruitingContentInterface";
import HolidayType from "../type/HolidayType";
import { GetCenterSignatureFileResponseInterface } from "../interface/response/GetCenterSignatureFileResponseInterface";
import {
    CenterBasicChannelOptionAPIEnum,
    CenterBasicChannelOptionEnum,
    CenterOneTouchChannelAPIOptions,
    CenterOneTouchChannelOptionsAPIEnum,
} from "../enum/CenterOneTouchChannelOptionsEnum";
import IconTypography from "../components/IconTypography";
import ConverterUtil from "../util/ConverterUtil";
import GetJobCenterInfoRequestInterface from "../interface/request/GetJobCenterInfoRequestInterface";
import GetJobCenterInfoResponseInterface, { GetJobCenterInfoResponseDataInterface } from "../interface/request/GetJobCenterInfoResponseInterface";
import AddressType from "../type/AddressType";
import GetCenterRecruitingResponseInterface, { GetCenterRecruitingResponseDataInterface } from "../interface/response/GetCenterRecruitingResponseInterface";
import PutCenterRecruitingRequestInterface from "../interface/request/PutCenterRecruitingRequestInterface";
import PostCenterRecruitingRequestInterface from "../interface/request/PostCenterRecruitingRequestInterface";
import PostCenterRecruitingResponseInterface, { PostCenterRecruitingResponseDataInterface } from "../interface/response/PostCenterRecruitingResponseInterface";
import PutForReregisterCenterRecruitingRequestInterface from "../interface/request/PutForReregisterCenterRecruitingRequestInterface";
import PutForReregisterCenterRecruitingResponseInterface, {
    PutForReregisterCenterRecruitingResponseDataInterface,
} from "../interface/response/PutForReregisterCenterRecruitingResponseInterface";
import RecruitingSessionStorageKeys from "../enum/RecruitingSessionStorageKeys";
import StorageUtil from "../util/StorageUtil";
import GetCurrentPassAmountResponseInterface from "../interface/response/GetCurrentPassAmountResponseInterface";
import SelectedChannelsType from "../type/SelectedChannelsType";
import SelectedChannelsAPIType from "../type/SelectedChannelsAPIType";
import GetRecruitingRequestInterface from "../interface/request/GetRecruitingRequestInterface";
import GetRecruitingResponseInterface, { GetRecruitingResponseDataInterface } from "../interface/response/GetRecruitingResponseInterface";
import UseRecruitingModal from "./UseRecuritingModal";
import GetCenterRecruitingChannelsResponseInterface from "../interface/request/GetCenterRecruitingChannelsResponseInterface";
import GetCenterRecruitingChannelsRequestInterface from "../interface/request/GetCenterRecruitingChannelsRequestInterface";
import UseLoading from "./UseLoading";
import HttpException from "../exception/HttpException";
import EventUtil from "../util/EventUtil";

const RECIPIENT_SERVICE_LIST: (keyof RawCenterRecruitingContentInterface)[] = ["lifeSet", "homeSet", "cognitiveSet", "bodySet"];
const RECIPIENT_LIST: (keyof RawCenterRecruitingContentInterface)[] = ["gender", "grade", "age", "motionState", "cognitiveState"];
const WORKTIME_LIST: (keyof RawCenterRecruitingContentInterface)[] = ["timeRange", "directWriteWorkHourMemo", "weeklyWorkHours"];
const HOLIDAY_LIST: (keyof RawCenterRecruitingContentInterface)[] = ["unit", "days"];

export const USELESS_ADDRESS_PROPS: (keyof AddressType)[] = [
    "regionFirstDepth",
    "regionSecondDepth",
    "regionThirdDepth",
    "regionAdminThirdDepth",
    "zipCode",
    "lng",
    "lat",
    "roadAddressName",
];

/**
 * 기관 관련된 서비스(로그인, 로그아웃, 회원가입 등등)을 이용할 수 있는 Custom Hook 입니다.
 * UI 에서 직접 서비스나 기능을 호출하지 않고 해당 훅을 이용해서 호출해야합니다.
 * 기능 동작뿐만아니라 UI 에 대한 작동(alert, dialog 등)도 해당 파일에 정의합니다.
 * @category Hook
 */
function UseCenterService() {
    const router = useRouter();
    const { openAlert } = UseAlert();
    const { httpRequest } = useHttp();
    const { openLoading, closeLoading } = UseLoading();
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);
    const { openRecruitingDetailModal } = UseRecruitingModal();
    /**
     * 기관 정보 recoil 저장
     */
    const [centerRecoil, setCenterRecoil] = useRecoilState(centerRecoilState);
    /**
     * 로딩중 여부를 직접 관리. 모든 통신 전에 isLoading = true 로 해놓고 통신이 끝나면 isLoading = false 로 변경한다.
     */
    const [isLoading, setIsLoading] = useState<boolean>(true);
    /**
     * Authorization (jwt)정보가 있는 헤더
     */
    const getHeaders = () => centerService.getHeaders();

    /**
     * 기관 추가정보 존재 여부 확인 API
     */
    const getIsExistedCenterMoreInfo = async () => {
        const response = await httpRequest<ResponseInterface<boolean>>(EndpointEnum.GET_CENTER_MOREINFO_EXISTS, {}, getHeaders());

        if ("error" in response) {
            return undefined;
        }

        return response.data;
    };

    /**
     * 비밀번호 변경(비로그인). 비밀번호 변경 완료시 dialog 를 띄워 주면서 로그인 페이지로 이동
     * @param request
     */
    const updateAnonymousPassword = async (request: PutCenterAnonymousPasswordRequestInterface): Promise<boolean> => {
        try {
            const response = await httpRequest<ResponseInterface, PutCenterAnonymousPasswordRequestInterface>(EndpointEnum.PUT_CENTER_ANONYMOUS_PASSWORD, request, getHeaders());
            if ("error" in response) {
                return false;
            }

            setDialogRecoil({
                open: true,
                title: "비밀번호 변경 완료",
                content: "새로운 비밀번호로 로그인해주세요",
                confirmButtonText: "확인",
                hasCancelButton: false,
                onConfirm: () => {
                    router.push("/center/login", "/기관/로그인");
                },
            });
            return true;
        } catch (e) {
            return false;
        }
    };
    /**
     * 단일 구인공고 상세조회
     * @param params
     */
    const getRecruitingDetail = async (params: GetRecruitingRequestInterface): Promise<GetRecruitingResponseDataInterface | undefined> => {
        const response = await httpRequest<GetRecruitingResponseInterface, GetRecruitingRequestInterface>(EndpointEnum.GET_RECRUITING, params);
        if ("error" in response) return undefined;
        return response.data;
    };
    /**
     * 기관용 로그인. 아이디/비밀번호로 로그인. {@link EndpointEnum.POST_CENTER_LOGIN} 호출. 비활성화 된 센터인 경우 dialog 를 띄워준다.
     * @param request
     * @param link 로그인 후 이동할 링크
     */
    const login = async (request: PostCenterLoginRequestInterface, link?: string): Promise<PostCenterLoginResponseInterface | undefined> => {
        const response = await httpRequest<PostCenterLoginResponseInterface, PostCenterLoginRequestInterface>(EndpointEnum.POST_CENTER_LOGIN, request, undefined, [
            ResponseErrorCodeEnum.INACTIVE_CENTER_ACCOUNT,
        ]);
        if ("error" in response) {
            if (response.error.code === ResponseErrorCodeEnum.INACTIVE_CENTER_ACCOUNT) {
                setDialogRecoil({
                    open: true,
                    title: "가입 승인 대기중",
                    content: "기관 대표 전화번호로 확인 연락을 드릴게요. 연락 확인 후 가입이 완료됩니다.",
                    caption: "영업일 기준 1일 이내로 연락을 드릴 예정입니다.",
                    confirmButtonText: "확인",
                    hasCancelButton: false,
                    onConfirm: () => {},
                });
            }
            return response;
        }

        /**
         * CenterService 의 login 호출 후, recoil 에 center 정보 입력
         */
        const jwtTokenData: JwtAccessTokenDataInterface | undefined = await centerService.login(response.data.accessToken, response.headers?.refresh);
        if (jwtTokenData) {
            setCenterRecoil(jwtTokenData);
        }
        openAlert("로그인완료", `${response.data.name} 담당자님, 환영합니다.`);

        if (link) await router.push(link);

        return response;
    };

    /**
     * 회원가입 신청. {@link EndpointEnum.POST_CENTER_SIGNUP} 호출. 성공시 dialog 띄워줌.
     * @param request
     * @param callback
     */
    const signup = async (request: CenterSignupInterface, callback: (phoneNum: string) => void): Promise<void> => {
        const signupRequest: PostCenterSignupRequestInterface = {
            centerSignupDto: request,
            certFile: request.certFile,
        };
        const response = await httpRequest<PostCenterSignupResponseInterface, PostCenterSignupRequestInterface>(EndpointEnum.POST_CENTER_SIGNUP, signupRequest);
        if ("error" in response) {
            return;
        }
        setDialogRecoil({
            open: true,
            title: "가입 신청 완료",
            content: `${request.phoneNum}로 확인 연락을 드릴게요. 연락 확인 후 가입이 완료됩니다.`,
            caption: "영업일 기준 1일 이내로 연락을 드릴 예정입니다.",
            confirmButtonText: "확인",
            hasCancelButton: false,
            onConfirm: () => {
                callback(request.phoneNum);
            },
        });
    };

    /**
     * 로그아웃
     * @param link 로그아웃 후 이동할 링크
     */
    const logout = async (link?: string): Promise<void> => {
        setCenterRecoil(defaultCenterRecoilStateInterface);
        await centerService.logout();
        await router.push(link || "/기관");
    };

    /**
     * 회원 탈퇴. {@link EndpointEnum.DELETE_CENTER_WITHDRAWAL} 호출
     * @param request
     */
    const withdrawal = async (request: DeleteCenterWithdrawalRequestInterface): Promise<boolean> => {
        const response = await httpRequest<ResponseInterface, DeleteCenterWithdrawalRequestInterface>(EndpointEnum.DELETE_CENTER_WITHDRAWAL, request, getHeaders());

        if ("error" in response) {
            return false;
        }

        await logout();
        return true;
    };

    /**
     * 로그인 여부
     */
    const isLoggedIn = (): boolean => {
        if (!centerRecoil) return false;
        return Boolean(centerRecoil.iat);
    };

    /**
     * 사용중인 기관 고유번호인지 확인. {@link EndpointEnum.GET_CENTER_ID_NUM_EXISTS} 호출
     * @param idNum 확인할 고유번호
     */
    const getIdNumExists = async (idNum: string): Promise<boolean> => {
        const response = await httpRequest<ResponseInterface, GetCenterIdNumExistsRequestInterface>(EndpointEnum.GET_CENTER_ID_NUM_EXISTS, { idNum });
        if ("error" in response) {
            return false;
        }
        return response.data;
    };

    /**
     * 사용중인 기관 아이디인지 확인. {@link EndpointEnum.GET_CENTER_ACCOUNT_ID_EXISTS} 호출
     * @param accountId 확인할 id
     */
    const getAccountIdExists = async (accountId: string): Promise<boolean> => {
        const response = await httpRequest<ResponseInterface, GetCenterAccountIdExistsRequestInterface>(EndpointEnum.GET_CENTER_ACCOUNT_ID_EXISTS, {
            accountId,
        });
        if ("error" in response) {
            return false;
        }
        return response.data;
    };

    /**
     * 헤더정보(jwt)를 통해 내 정보 조회하기. {@link EndpointEnum.GET_CENTER_ME} 조회
     */
    const getMe = async (): Promise<CenterAccountInterface | undefined> => {
        const response = await httpRequest<GetCenterMeResponseInterface>(EndpointEnum.GET_CENTER_ME, {}, getHeaders());
        if ("error" in response) {
            return undefined;
        }
        return response.data;
    };

    /**
     * 단일 이용약관 조회. 이용약관 정보 뿐만 아니고 해당 이용약관에 대한 동의 여부(일시) 까지 return. {@link EndpointEnum.GET_CENTER_TERM_AGREEMENT} 조회
     * @param request
     */
    const getTermsAgreement = async (request: GetCenterTermAgreementRequestInterface): Promise<TermsAgreementInterface | undefined> => {
        setIsLoading(true);
        const response = await httpRequest<GetCenterTermAgreementResponseInterface>(EndpointEnum.GET_CENTER_TERM_AGREEMENT, request, getHeaders());
        setIsLoading(false);
        if ("error" in response) {
            return undefined;
        }
        return response.data;
    };

    /**
     * 단일 이용약관 동의/비동의 저장하기. {@link EndpointEnum.POST_CENTER_TERM_AGREEMENT} 호출
     * @param request
     * @param termsAgreement
     */
    const setTermsAgreement = async (request: PostCenterTermAgreementRequestInterface, termsAgreement: TermsAgreementInterface | undefined): Promise<void> => {
        if (!termsAgreement) return;

        const response = await httpRequest<GetCenterTermAgreementResponseInterface>(EndpointEnum.POST_CENTER_TERM_AGREEMENT, request, getHeaders());
        if ("error" in response) {
            return;
        }

        if (request.agreedDate) {
            openAlert("동의 완료", `${termsAgreement.terms.title}가 완료되었습니다.\n(동의 일자:${request.agreedDate})`);
        } else {
            openAlert("동의 철회 완료", `${termsAgreement.terms.title}가 철회되었습니다.`);
        }
    };

    /**
     * 내정보 화면에서 보여줄 이용약관 내역 조회하기. {@link EndpointEnum.GET_CENTER_TERMS_AGREEMENT} 호출
     */
    const getMyTerms = async (): Promise<TermsAgreementInterface[] | []> => {
        const response = await httpRequest<GetCenterTermsAgreementResponseInterface, GetCenterTermsAgreementRequestInterface>(
            EndpointEnum.GET_CENTER_TERMS_AGREEMENT,
            { isShowProfile: true },
            getHeaders(),
        );
        if ("error" in response) {
            return [];
        }

        return response.data;
    };

    /**
     * 회원가입을 위한 일반 이용약관 조회하기 {@link EndpointEnum.GET_CENTER_TERMS} 호출
     */
    const getTerms = async (): Promise<TermsInterface[] | []> => {
        setIsLoading(true);
        const response = await httpRequest<GetCenterTermsResponseInterface, GetCenterTermsRequestInterface>(EndpointEnum.GET_CENTER_TERMS);

        setIsLoading(false);
        if ("error" in response) {
            return [];
        }
        return response.data;
    };

    /**
     * 비밀번호 변경하기. {@link EndpointEnum.PUT_CENTER_PASSWORD} 호출
     * @param request
     */
    const updatePassword = async (request: PutCenterPasswordRequestInterface): Promise<ResponseInterface | undefined> => {
        const response = await httpRequest<ResponseInterface, PutCenterPasswordRequestInterface>(EndpointEnum.PUT_CENTER_PASSWORD, request, getHeaders());
        if (!("error" in response)) {
            openAlert("비밀번호 변경 완료");
            await router.push("/center/account");
        }
        return response;
    };

    /**
     * 기관내용 수정페이지에서 호출할 내정보 {@link EndpointEnum.GET_CENTER_ME_DETAIL} 호출
     */
    const getMeDetail = async (): Promise<CenterInterface | undefined> => {
        const response = await httpRequest<GetCenterMeDetailResponseInterface, GetCenterTermsAgreementRequestInterface>(EndpointEnum.GET_CENTER_ME_DETAIL, {}, getHeaders());
        if ("error" in response) {
            return undefined;
        }

        return response.data;
    };

    /**
     * 기관내용 수정페이지에서 호출할 기관증명서 이미지. {@link EndpointEnum.GET_CENTER_ME_CERT_FILE} 호출
     */
    const getMeDetailCertFile = async (): Promise<CenterMeCertFileInterface | undefined> => {
        const response = await httpRequest<GetCenterMeCertFileResponseInterface>(EndpointEnum.GET_CENTER_ME_CERT_FILE, {}, getHeaders());
        if ("error" in response) {
            return undefined;
        }

        return response.data;
    };

    /**
     * 기관정보 수정하기. {@link EndpointEnum.PUT_CENTER_ME_DETAIL} 호출. 파일 전송을 위해 application/json 이 아닌 multipart 로 전송해야됨.
     * 그래서 request 를 새로운 centerInformationUpdateDto 로 변경하고, file 도 따로 구성해서 request 를 한다.
     * @param request
     */
    const updateMeDetail = async (request: PutCenterMeDetailRequestInterface): Promise<boolean> => {
        const response = await httpRequest<ResponseInterface, PutCenterMeDetailRequestInterface>(EndpointEnum.PUT_CENTER_ME_DETAIL, request, getHeaders());
        if ("error" in response) {
            return false;
        }
        openAlert("기관 정보 변경 완료");
        return true;
    };

    /**
     * 연락처 수정 페이지에서 호출할 현재 추가 연락처 정보들. {@link EndpointEnum.GET_CENTER_CONTACTS} 호출
     */
    const getContacts = async (): Promise<CenterContactInterface | undefined> => {
        const response = await httpRequest<GetCenterContactsResponseInterface>(EndpointEnum.GET_CENTER_CONTACTS, {}, getHeaders());
        if ("error" in response) {
            return undefined;
        }
        return response.data;
    };

    /**
     * 연락처 추가. {@link EndpointEnum.POST_CENTER_CONTACTS_EXTRA} 호출
     */
    const addContact = async (request: PostCenterContactsExtraRequestInterface): Promise<string[] | undefined> => {
        const response = await httpRequest<PostCenterContactsExtraResponseInterface, PostCenterContactsExtraRequestInterface>(
            EndpointEnum.POST_CENTER_CONTACTS_EXTRA,
            request,
            getHeaders(),
        );
        if ("error" in response) {
            return undefined;
        }
        openAlert("새로운 연락처 등록 완료");
        return response.data;
    };

    /**
     * 연락처 삭제. {@link EndpointEnum.DELETE_CENTER_CONTACTS_EXTRA} 호출
     */
    const removeContact = async (request: DeleteCenterContactsExtraRequestInterface): Promise<string[] | undefined> => {
        const response = await httpRequest<DeleteCenterContactsExtraResponseInterface, DeleteCenterContactsExtraRequestInterface>(
            EndpointEnum.DELETE_CENTER_CONTACTS_EXTRA,
            request,
            getHeaders(),
        );
        if ("error" in response) {
            return undefined;
        }
        return response.data;
    };

    /**
     * 내정보 > 나의공고에서 호출할 기관용 구인공고 리스트. {@link EndpointEnum.GET_CENTER_RECRUITINGS_SIMPLE} 호출
     * @param request
     */
    const getRecruitingsSimple = async (request: GetCenterRecruitingsSimpleRequestInterface): Promise<GetCenterRecruitingsSimpleResponseInterface | undefined> => {
        setIsLoading(true);
        const response = await httpRequest<GetCenterRecruitingsSimpleResponseInterface, GetCenterRecruitingsSimpleRequestInterface>(
            EndpointEnum.GET_CENTER_RECRUITINGS_SIMPLE,
            request,
            getHeaders(),
        );

        setIsLoading(false);
        if ("error" in response) {
            return undefined;
        }
        return response;
    };

    /**
     * 개별 구인공고 조회. 구인공고 수정/재등록 페이지에서 사용. {@link EndpointEnum.GET_CENTER_RECRUITING} 호출
     * @param request
     */
    const getRecruiting = async (request: GetCenterRecruitingRequestInterface): Promise<GetCenterRecruitingResponseDataInterface | undefined> => {
        setIsLoading(true);
        const response = await httpRequest<GetCenterRecruitingResponseInterface, GetCenterRecruitingRequestInterface>(EndpointEnum.GET_CENTER_RECRUITING, request, getHeaders());

        setIsLoading(false);

        if ("error" in response) {
            return undefined;
        }

        return response.data;
    };

    /**
     * 일자리센터 정보 가져오기
     */
    const getJobCenterInfo = async (request: GetJobCenterInfoRequestInterface): Promise<GetJobCenterInfoResponseDataInterface> => {
        openLoading();
        const response = await httpRequest<GetJobCenterInfoResponseInterface, GetJobCenterInfoRequestInterface>(EndpointEnum.GET_JOB_CENTER_INFO, request, getHeaders());
        closeLoading();

        if ("error" in response) {
            return undefined;
        }

        return response.data;
    };

    /**
     * {@link PutCenterRecruitingRequestInterface} 이나 {@link PostCenterRecruitingRequestInterface}의 데이터 구조를 서버에 맞게 재 설정함.
     * @param request
     */
    const reformatRecruitingRequest = (request: RawCenterRecruitingContentInterface): SubmitToConfirmCenterRecruitingContentInterface => {
        const requestRemovedUselessProps = ConverterUtil.removeUselessProps(request, [
            ...RECIPIENT_LIST,
            ...RECIPIENT_SERVICE_LIST,
            ...WORKTIME_LIST,
            ...HOLIDAY_LIST,
            "isDirectVisitTime",
        ]);

        /**
         * '근무 요일/시간'필드가 작성형인지 여부
         */
        const isDirectWriteFieldWrittenType = request?.isDirectVisitTime || request.isTemporary;
        const workTimeObj = {
            startAt: isDirectWriteFieldWrittenType ? null : request?.timeRange?.startAt,
            endAt: isDirectWriteFieldWrittenType ? null : request?.timeRange?.endAt,
            days: isDirectWriteFieldWrittenType ? null : request?.timeRange?.days,
            memo: isDirectWriteFieldWrittenType ? request?.directWriteWorkHourMemo : null,
            weeklyWorkHours: isDirectWriteFieldWrittenType ? request?.weeklyWorkHours : null,
        };

        /**
         * holiday가 있는지 여부
         */
        const hasHoliday = !!request?.unit;

        /**
         * 각 항목별로 formatting한 객체를 변수에 담음
         */
        const workTime = {
            workTime: !!request?.timeRange || !!request.directWriteWorkHourMemo ? workTimeObj : null,
        };
        const homeCare =
            request.job === "HOME_CARE" ? ConverterUtil.bindPropsIntoObj<HolidayType, RawCenterRecruitingContentInterface>(request, HOLIDAY_LIST, "holiday", !hasHoliday) : {};
        const recipient = request?.gender ? ConverterUtil.bindPropsIntoObj<RecipientType, RawCenterRecruitingContentInterface>(request, RECIPIENT_LIST, "recipient") : {};
        const recipientService = request?.bodySet
            ? ConverterUtil.bindPropsIntoObj<RecipientServiceType, RawCenterRecruitingContentInterface>(request, RECIPIENT_SERVICE_LIST, "recipientService")
            : {};

        return {
            ...requestRemovedUselessProps,
            ...workTime,
            ...homeCare,
            ...recipient,
            ...recipientService,
        };
    };

    /**
     * 개별 구인공고 수정. {@link EndpointEnum.PUT_CENTER_RECRUITING} 호출
     * @param request
     */
    const updateRecruiting = async (request: RawCenterRecruitingContentInterface, uuid: string): Promise<void> => {
        const formattedRequest = {
            ...reformatRecruitingRequest(request),
            address: ConverterUtil.removeUselessProps(request.address, USELESS_ADDRESS_PROPS),
            uuid,
        };

        const response = await httpRequest<ResponseInterface<string>, PutCenterRecruitingRequestInterface>(EndpointEnum.PUT_CENTER_RECRUITING, formattedRequest, getHeaders());

        const isSucceeded = !("error" in response);

        if (isSucceeded) {
            openAlert("공고 수정 완료");
            router.push("/center/recruitings");
        }
    };

    /**
     * 개별 구인공고 상태 변경. 성공, 마감 2가지 선택. {@link EndpointEnum.PATCH_CENTER_RECRUITING} 호출
     * @param request
     */
    const updateRecruitingStatus = async (request: PatchCenterRecruitingRequestInterface): Promise<boolean> => {
        const response = await httpRequest<ResponseInterface<string>, PatchCenterRecruitingRequestInterface>(EndpointEnum.PATCH_CENTER_RECRUITING, request, getHeaders());

        const isSucceeded = !("error" in response);

        return isSucceeded;
    };

    /**
     * 공고 (재)등록을 위해 request를 formatting함.
     *
     * basicChannel에서 요보사랑은 무조건 들어가기 때문에 알림톡만 있는지 체크
     * @param request
     * @param selectedChannels
     */
    const reformatCreateOrReregisterRecruitingRequest = (request: SubmitToConfirmCenterRecruitingContentInterface, selectedChannels: SelectedChannelsType) => {
        const basicChannelSet = selectedChannels.basicChannelSet?.includes(CenterBasicChannelOptionEnum.SEND_ALIMTALK_TO_JOBSEEKR)
            ? [CenterBasicChannelOptionAPIEnum.ALIMTALK]
            : [];
        const oneTouchChannelSet: CenterOneTouchChannelOptionsAPIEnum[] = selectedChannels.oneTouchChannelSet?.reduce((results, channel) => {
            if (CenterOneTouchChannelAPIOptions.get(channel)) {
                results.push(...CenterOneTouchChannelAPIOptions.get(channel));
            }
            return results;
        }, [] as CenterOneTouchChannelOptionsAPIEnum[]);

        return {
            ...request,
            address: { lotAddressName: request.address.lotAddressName, addressDetail: "" },
            channels: { basicChannelSet, oneTouchChannelSet },
        };
    };

    /**
     * 공고 (재)등록을 요청하고 응답 받는 로직
     * @param endPoint
     * @param request
     * @param selectedChannels
     */
    const postOrPutRecruiting = async <
        TResponseData,
        TResponse extends ResponseInterface,
        TRequest extends PutForReregisterCenterRecruitingRequestInterface | PostCenterRecruitingRequestInterface,
    >(
        endPoint: EndpointEnum,
        request: SubmitToConfirmCenterRecruitingContentInterface,
        selectedChannels: SelectedChannelsType,
    ): Promise<TResponseData> => {
        const formattedRequest = reformatCreateOrReregisterRecruitingRequest(request, selectedChannels) as TRequest;

        const isOnetouchChannelSelected = selectedChannels.oneTouchChannelSet.length;

        const handleRunOutOfPassErrorInterrupter = (error: HttpException) => {
            const errorCode = error?.getResponse()?.error.code;
            const isRunOutOfPass = errorCode === ResponseErrorCodeEnum.INVALID_ONE_TOUCH_TICKET_COUNT;

            if (!isRunOutOfPass) return false;

            StorageUtil.removeItem([RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL]);
            router.push({ pathname: "/center/recruitings/onetouch-channel", query: { isCameBackCauseRunOutOfPass: true } }, "/공고등록/채널선택");
            return true;
        };

        const response = await httpRequest<TResponse, TRequest>(
            endPoint,
            formattedRequest,
            getHeaders(),
            undefined,
            isOnetouchChannelSelected ? handleRunOutOfPassErrorInterrupter : undefined,
        );

        if ("error" in response) {
            return undefined;
        }

        /**
         * 공고 (재)등록 성공 시, sessionStorage의 값들(작성했던 공고 내용, 선택했던 채널들) 삭제
         */
        StorageUtil.removeItem([RecruitingSessionStorageKeys.WRITTEN_RECRUITING_CONTENT, RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL]);

        return response.data;
    };

    /**
     * 현재 보유 등록권의 갯수 조회
     */
    const getCurrentPassAmount = async (): Promise<number> => {
        const response = await httpRequest<GetCurrentPassAmountResponseInterface>(EndpointEnum.GET_CURRENT_PASS_AMOUNT, undefined, getHeaders());

        if ("error" in response) {
            return undefined;
        }

        return response.data;
    };

    /**
     * 구인공고 (재)등록 dialog 를 띄워서 실제로 등록할건지 확인 후, {@link EndpointEnum.POST_CENTER_RECRUITINGS} 호출. 등록이 완료되면 상황에 맞게 dialog 를 띄운다.
     *
     * 서버에 요청을 보낼때 구인공고 등록시에는 addressDetail 입력할 ui가 없으므로 무조건 빈 문자열로 보낸다
     *
     * 요청 성공시 나의 공고로 이동과 동시에 다이얼로그를 표시하며, 등록된 공고 확인하기 버튼을 누르면 모달로 해당 공고의 상세 내용이 표시된다.
     * @param request
     * @param selectedChannels
     */
    const createOrReregisterRecruiting = async (request: SubmitToConfirmCenterRecruitingContentInterface, selectedChannels: SelectedChannelsType): Promise<void> => {
        setDialogRecoil({
            open: true,
            title: "구인공고를 등록하시겠습니까?",
            hasCancelButton: true,
            onConfirm: async (): Promise<void> => {
                EventUtil.gtmEvent("click", "confirm", "cenRecruitingsConfirm", "0");

                let response: PutForReregisterCenterRecruitingResponseDataInterface | PostCenterRecruitingResponseDataInterface;

                /**
                 * 재등록일 경우
                 */
                if ("uuid" in request) {
                    response = await postOrPutRecruiting<
                        PutForReregisterCenterRecruitingResponseDataInterface,
                        PutForReregisterCenterRecruitingResponseInterface,
                        PutForReregisterCenterRecruitingRequestInterface
                    >(EndpointEnum.PUT_REREGISTER_CENTER_RECRUITING, request, selectedChannels);
                } else {
                    /**
                     * 등록일 경우
                     */
                    response = await postOrPutRecruiting<PostCenterRecruitingResponseDataInterface, PostCenterRecruitingResponseInterface, PostCenterRecruitingRequestInterface>(
                        EndpointEnum.POST_CENTER_RECRUITINGS,
                        request,
                        selectedChannels,
                    );
                }

                if (!response) return;

                StorageUtil.removeItem([RecruitingSessionStorageKeys.WRITTEN_RECRUITING_CONTENT, RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL]);

                await router.replace("/기관/나의공고");

                EventUtil.gtmEvent("change", "popup", "popupRecruitingsComplete", "0");
                setDialogRecoil({
                    open: true,
                    title: <Typography variant="h3">구인공고 등록이 완료되었습니다!</Typography>,
                    content: (
                        <>
                            <IconTypography icon={<Check fontSize="small" color="success" />} label="모든 채널에 등록되기까지 5분 이상 걸릴 수 있어요." typographyVariant="body2" />
                            <IconTypography
                                sx={{ mt: 2 }}
                                icon={<Check fontSize="small" color="success" />}
                                label={
                                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                        저녁 6시 이후에 등록하면 <strong>일자리센터·실시간 알림 발송</strong>은 다음날 오전 9시 이후에 등록돼요.
                                    </Typography>
                                }
                                typographyVariant="body2"
                            />
                        </>
                    ),
                    cancelButtonText: "등록된 공고 확인하기",
                    confirmButtonText: "닫기",
                    hasCancelButton: true,
                    flexDirection: "column",
                    onCancel: async () => {
                        EventUtil.gtmEvent("click", "check", "popupRecruitingsComplete", "0");

                        const recruiting = await getRecruitingDetail({ uuid: response.uuid });
                        openRecruitingDetailModal(recruiting);
                    },
                    confirmButtonStyle: "outlined",
                });
            },
        });
    };

    /**
     * 아이디 찾기 페이지에서 호출. {@link EndpointEnum.GET_CENTER_ID} 조회
     * @param request
     */
    const findId = async (request: GetCenterIdRequestInterface): Promise<CenterAccountInterface | undefined> => {
        const response = await httpRequest<GetCenterIdResponseInterface, GetCenterIdRequestInterface>(EndpointEnum.GET_CENTER_ID, request, getHeaders());
        if ("error" in response) {
            return undefined;
        }
        return response.data;
    };
    /**
     * 기관 추가 정보 등록 페이지에서 호출
     * @param request
     *
     */
    const createCenterMoreInfo = async (request: PostCenterMoreInfoRequestInterface): Promise<void> => {
        const response = await httpRequest<ResponseInterface<string>, PostCenterMoreInfoRequestInterface>(EndpointEnum.POST_MORE_INFO, request, getHeaders());
        if ("error" in response) {
            return;
        }
        await router.replace("/center/recruitings/confirm", "/구인공고등록/최종확인");
        setDialogRecoil({
            open: true,
            title: "기관 추가정보 등록 완료",
            content: "등록하신 정보는 [내 정보] > [기관정보]에서 변경하실 수 있어요.",
            hasCancelButton: false,
        });
    };
    /**
     * 센터 채용 담당자 서명 파일 조회
     */
    const getSignatureFile = async () => {
        const response = await httpRequest<ResponseInterface<GetCenterSignatureFileResponseInterface>, undefined>(
            EndpointEnum.GET_MORE_INFO_SIGNATURE_FILE,
            undefined,
            getHeaders(),
        );
        if ("error" in response) {
            return undefined;
        }
        return response.data;
    };

    /**
     * 공고에 대한 원터치 채널 선택 내역 조회
     * @param uuid
     */
    const getRecruitingChannels = async (uuid: string): Promise<SelectedChannelsAPIType> => {
        const response = await httpRequest<GetCenterRecruitingChannelsResponseInterface, GetCenterRecruitingChannelsRequestInterface>(
            EndpointEnum.GET_RECRUITING_CHANNELS,
            { uuid },
            getHeaders(),
        );
        if ("error" in response) {
            return undefined;
        }

        return response.data.channels;
    };

    return {
        isLoading,
        setIsLoading,
        login,
        signup,
        withdrawal,
        logout,
        isLoggedIn,
        getTerms,
        getIdNumExists,
        getAccountIdExists,
        updateAnonymousPassword,
        getMe,
        getMyTerms,
        getTermsAgreement,
        setTermsAgreement,
        updatePassword,
        getMeDetail,
        getMeDetailCertFile,
        updateMeDetail,
        getContacts,
        addContact,
        removeContact,
        getRecruitingsSimple,
        getRecruiting,
        updateRecruitingStatus,
        findId,
        getIsExistedCenterMoreInfo,
        createCenterMoreInfo,
        reformatRecruitingRequest,
        getSignatureFile,
        createOrReregisterRecruiting,
        updateRecruiting,
        getJobCenterInfo,
        getCurrentPassAmount,
        getRecruitingChannels,
        getRecruitingDetail,
    };
}

export default UseCenterService;
