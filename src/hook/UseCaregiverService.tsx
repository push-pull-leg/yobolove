import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import React, { useState } from "react";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import { caregiverRecoilState, defaultCaregiverRecoilStateInterface } from "../recoil/CaregiverRecoil";
import caregiverService from "../service/CaregiverService";
import JwtAccessTokenDataInterface from "../interface/JwtAccessTokenDataInterface";
import CaregiverDesiredWorkInterface from "../interface/CaregiverDesiredWorkInterface";
import EndpointEnum from "../enum/EndpointEnum";
import useHttp from "./UseHttp";
import PostCaregiverDesiredWorkResponseInterface from "../interface/response/PostCaregiverDesiredWorkResponseInterface";
import PostCaregiverDesiredWorkRequestInterface from "../interface/request/PostCaregiverDesiredWorkRequestInterface";
import GetCaregiverDesiredWorkResponseInterface from "../interface/response/GetCaregiverDesiredWorkResponseInterface";
import GetCaregiverNotificationResponseInterface from "../interface/response/GetCaregiverNotificationResponseInterface";
import PostCaregiverNotificationRequestInterface from "../interface/request/PostCaregiverNotificationRequestInterface";
import ResponseInterface from "../interface/response/ResponseInterface";
import NotificationValueEnum from "../enum/NotificationEnum";
import GetCaregiverTermAgreementResponseInterface from "../interface/response/GetCaregiverTermAgreementResponseInterface";
import TermsAgreementInterface from "../interface/TermsAgreementInterface";
import GetCaregiverTermAgreementRequestInterface from "../interface/request/GetCaregiverTermAgreementRequestInterface";
import PostCaregiverTermAgreementRequestInterface from "../interface/request/PostCaregiverTermAgreementRequestInterface";
import GetCaregiverMeResponseInterface from "../interface/response/GetCaregiverMeResponseInterface";
import CaregiverInformationInterface from "../interface/CaregiverInformationInterface";
import GetCaregiverTermsAgreementResponseInterface from "../interface/response/GetCaregiverTermsAgreementResponseInterface";
import GetCaregiverTermsRequestInterface from "../interface/request/GetCaregiverTermsRequestInterface";
import NotificationInterface from "../interface/NotificationInterface";
import GetCaregiverTermsResponseInterface from "../interface/response/GetCaregiverTermsResponseInterface";
import TermsInterface from "../interface/TermsInterface";
import GetCaregiverTermsAgreementRequestInterface from "../interface/request/GetCaregiverTermsAgreementRequestInterface";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import UseAlert from "./UseAlert";
import PostCaregiverLoginResponseInterface from "../interface/response/PostCaregiverLoginResponseInterface";
import PostCaregiverLoginRequestInterface from "../interface/request/PostCaregiverLoginRequestInterface";
import PostCaregiverSignupRequestInterface from "../interface/request/PostCaregiverSignupRequestInterface";
import PostCaregiverSignupResponseInterface from "../interface/response/PostCaregiverSignupResponseInterface";
import DeleteCaregiverWithdrawalRequestInterface from "../interface/request/DeleteCaregiverWithdrawalRequestInterface";
import KakaotalkIcon from "../styles/images/img-icon-kakaotalk.svg";
import ResponseErrorCodeEnum from "../enum/ResponseErrorCodeEnum";
import EventUtil from "../util/EventUtil";
import RecruitingsFilterUtil from "../util/RecruitingsFilterUtil";
import UtmService from "../service/UtmService";

const queryString = require("query-string");

/**
 * 구직자 관련된 서비스(로그인, 로그아웃, 회원가입, 희망근무조건 입력 등등)을 이용할 수 있는 Custom Hook 입니다.
 * UI 에서 직접 서비스나 기능을 호출하지 않고 해당 훅을 이용해서 호출해야합니다.
 * 기능 동작뿐만아니라 UI 에 대한 작동(alert, dialog 등)도 해당 파일에 정의합니다.
 * @category Hook
 */
function UseCaregiverService() {
    const [dialogRecoil, setDialogRecoil] = useRecoilState(dialogRecoilState);
    const router = useRouter();
    const { openAlert, closeAlert } = UseAlert();
    const { httpRequest } = useHttp();
    /**
     * 구직자 정보 recoil 저장
     */
    const [caregiverRecoil, setCaregiverRecoil] = useRecoilState(caregiverRecoilState);
    /**
     * 로딩중 여부를 직접 관리. 모든 통신 전에 isLoading = true 로 해놓고 통신이 끝나면 isLoading = false 로 변경한다.
     */
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Authorization (jwt)정보가 있는 헤더
     */
    const getHeaders = (): object => (caregiverService.getAccessToken() ? { Authorization: `Bearer ${caregiverService.getAccessToken()}` } : {});

    /**
     * 로그인 Method. 로그인 api 통신 성공시 {@link caregiverService}.login method 를 호출한다.
     * @param request 로그인 API request
     * @param link 로그인 후 이동할 링크
     */
    const login = async (request: PostCaregiverLoginRequestInterface, link?: string): Promise<void> => {
        const response = await httpRequest<PostCaregiverLoginResponseInterface, PostCaregiverLoginRequestInterface>(EndpointEnum.POST_CAREGIVER_LOGIN, request);

        if ("error" in response) {
            /**
             * 회원가입이 되어 있지 않은 핸드폰번호의 경우, 회원가입 관련 팝업 발생
             */
            if (response.error.code === ResponseErrorCodeEnum.NOT_FOUND_CAREGIVER) {
                closeAlert();
                setDialogRecoil({
                    open: true,
                    title: "고객님의 번호로 등록된 계정 정보가 없습니다.",
                    content: "지금 바로 가입하여 요보사랑 일자리 알림서비스를 이용해보세요!",
                    confirmButtonText: "휴대폰 회원가입",
                    confirmButtonStyle: "outlined",
                    flexDirection: "column",
                    hasCancelButton: true,
                    cancelButton: (
                        <Button
                            startIcon={<KakaotalkIcon />}
                            variant="contained"
                            color="kakaotalk"
                            sx={{ mt: 4 }}
                            size="large"
                            fullWidth
                            onClick={() => {
                                setDialogRecoil({ open: false });
                                router.push("/시작하기");
                            }}
                        >
                            카카오톡 회원가입/로그인
                        </Button>
                    ),
                    onConfirm: async () => {
                        await router.push("/회원가입");
                    },
                });
            }
            return;
        }

        /**
         * 로그인 성공 후, Alert 띄우고 login 실행. Link 있으면 router 이동
         */
        openAlert("로그인 완료", `${request.phoneNum}님, 환영합니다!`);
        const jwtTokenData: JwtAccessTokenDataInterface | undefined = await caregiverService.login(
            response.data.accessToken,
            response.headers?.refresh,
            response.data.hasDesiredWork,
        );
        if (jwtTokenData) {
            setCaregiverRecoil({
                tokenData: jwtTokenData,
                auth: response.data,
            });
        }
        /**
         * 희망 근무 조건을 저장한적이 없으면 희망근무조건 페이지로 이동
         */
        if (!response.data.hasDesiredWork) {
            await router.push("/account/desired-work", "/내정보/희망근무조건");
            return;
        }
        if (link) await router.push(link);
    };

    /**
     * 직접 로그인이 아닌 토큰으로 로그인하기. 일반적으로 카카오톡 로그인 같이 로그인 시점과 토큰을 받는 시점이 다를 경우 사용한다.
     * @param accessToken JWT access token
     * @param refreshToken JWT refresh token
     * @param link 로그인후 이동할 링크
     * @param currentHasDesiredWork 희망근무조건 설정 여부
     */
    const loginWithToken = async (accessToken: string, refreshToken?: string | null, link?: string, currentHasDesiredWork?: boolean): Promise<void> => {
        const jwtTokenData: JwtAccessTokenDataInterface | undefined = await caregiverService.login(accessToken, refreshToken, currentHasDesiredWork);
        if (jwtTokenData) {
            /**
             * 토큰 로그인의 경우, auth 정보가 없어서 hasDesiredWork 를 제외한 나머지를 default 로 입력해준다.
             */
            setCaregiverRecoil({
                tokenData: jwtTokenData,
                auth: {
                    phoneNum: "",
                    uuid: "",
                    accessToken: "",
                    hasDesiredWork: Boolean(currentHasDesiredWork),
                    message: undefined,
                },
            });
        }
        if (link) await router.push(link);
    };

    /**
     * 회원가입 요청. request 는 통신 규약 그대로 넘기고 회원가입 후에 이동할 Link 가 있으면 link에 넘기면 됩니다
     * @param request
     * @param link 이동할 link
     * @gtm
     */
    const signup = async (request: PostCaregiverSignupRequestInterface, link?: string): Promise<void> => {
        const response = await httpRequest<PostCaregiverSignupResponseInterface, PostCaregiverSignupRequestInterface>(EndpointEnum.POST_CAREGIVER_SIGNUP, {
            ...request,
            ...UtmService.getAll(),
        });
        if ("error" in response) {
            return;
        }
        /**
         * 회원가입 > 이미 가입된 회원이면 alert title, content 를 다르게 띄워준다.
         * 회원가입 일 때만 gtm event 를 띄워준다.
         */

        if (!response.data.signUp) {
            openAlert("로그인 완료", `${request.phoneNum}님, 이미 가입된 번호입니다. 환영합니다!`);
        } else {
            openAlert("회원가입완료", `${request.phoneNum}님, 환영합니다!`);
            EventUtil.gtmEvent("submit", "question", "signup", "phone");
        }

        /**
         * 로그인 및 recoil 데이터 입력
         */
        const jwtTokenData: JwtAccessTokenDataInterface | undefined = await caregiverService.login(
            response.data.accessToken,
            response.headers?.refresh,
            response.data.hasDesiredWork,
        );
        if (jwtTokenData) {
            setCaregiverRecoil({
                tokenData: jwtTokenData,
                auth: response.data,
            });
        }

        /**
         * 이미 회원가입을 한 회원이 회원가입을 할 때에는 시작하기 화면이 아닌 홈 화면으로 이동해야함
         */
        if (!response.data.signUp) {
            await router.push("/");
            return;
        }
        /**
         * 이미 가입된 회원이고 희망근무조건을 저장한적이 없으면 희망근무 조건 페이지로 이동
         */
        if (!response.data.hasDesiredWork) {
            await router.push("/account/desired-work", "/내정보/희망근무조건");
            return;
        }

        if (link) await router.push(link);
    };

    /**
     * 로그아웃 method.
     * recoil 데이터를 default data 로 넣어주고, caregiverService 에서 logout method 호출
     * @param link 로그아웃 후, 이동할 링크. 없으면 루트로 이동
     */
    const logout = async (link?: string): Promise<void> => {
        setCaregiverRecoil(defaultCaregiverRecoilStateInterface);
        await caregiverService.logout();
        await router.push(link || "/");
    };

    /**
     * 회원탈퇴 Method. 회원탈퇴 api 를 호출하고 성공하면 로그아웃 method 를 호출해서 데이터를 삭제한다.
     * @param request
     */
    const withdrawal = async (request: DeleteCaregiverWithdrawalRequestInterface): Promise<boolean> => {
        const response = await httpRequest<ResponseInterface, DeleteCaregiverWithdrawalRequestInterface>(EndpointEnum.DELETE_CAREGIVER_WITHDRAWAL, request, getHeaders());
        if ("error" in response) {
            return false;
        }

        await logout();

        return true;
    };

    /**
     * 로그인 되어있는지 여부. UI 적용을 고려해 recoil 데이터를 기준으로 판단한다.
     */
    const isLoggedIn = (): boolean => {
        if (!caregiverRecoil || !caregiverRecoil.tokenData) return false;
        return Boolean(caregiverRecoil.tokenData.iat);
    };

    /**
     * 희망근무조건이 있는지 여부. UI 적용을 고려해 recoil 데이터를 기준으로 판단한다.
     */
    const hasDesiredWork = (): boolean => {
        if (!caregiverRecoil) return false;
        return caregiverRecoil.auth.hasDesiredWork;
    };

    /**
     * 희망근무조건 조회. 최초 회원가입시 희망근무조건이 없을떄, 404 response 를 주기 때문에 try/catch 로 exception 에 대해서도 처리 할 수 있어야 한다.
     */
    // TODO: [잘 동작하는지 확인] 이유: CaregiverDesiredWorkInterface 수정
    const getDesiredWork = async (): Promise<CaregiverDesiredWorkInterface | undefined> => {
        setIsLoading(true);
        try {
            const desiredWorkResponse = await httpRequest<GetCaregiverDesiredWorkResponseInterface>(EndpointEnum.GET_CAREGIVER_DESIRED_WORK, {}, getHeaders());
            setIsLoading(false);
            return desiredWorkResponse.data;
        } catch (e) {
            setIsLoading(false);
            return undefined;
        }
    };

    /**
     * 카카오톡 공유하기. object type 은 feed 로 템플릿을 사용하지 않고 컨텐츠를 직접 구성해서 전달한다.
     * @param link 공유할 링크
     */
    const kakaoShare = (link: string): void => {
        if (typeof window === "undefined") return;

        if (!window.Kakao) return;

        window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
                title: "요양보호사 구인구직은 일자리 찾아주는 요보사랑",
                description: "쉬운 요양보호사 일자리 찾기, 원하는 조건의 일자리만 무료로 알림 받아보세요",
                imageUrl: `${process.env.NEXT_PUBLIC_CDN_HOST}/assets/images/img-yobo-kakaoshare.png`,
                link: {
                    mobileWebUrl: link,
                    webUrl: link,
                },
            },
            buttons: [
                {
                    title: "일자리 알림 신청",
                    link: {
                        mobileWebUrl: link,
                        webUrl: link,
                    },
                },
            ],
        });
    };

    /**
     * 희망근무조건 저장하기
     * @param desiredWork 희망근무조건
     * @param endpointEnum 희망근무조건이 없을때 {@link EndpointEnum.POST_CAREGIVER_DESIRED_WORK} 를 호출하고, 있을 때는 {@link EndpointEnum.PUT_CAREGIVER_DESIRED_WORK} 를 호출한다.
     */
    // TODO: [잘 동작하는지 확인] 이유: CaregiverDesiredWorkInterface 수정
    const setDesiredWork = async (desiredWork: CaregiverDesiredWorkInterface, endpointEnum: EndpointEnum): Promise<void> => {
        const caregiverDesiredWorkResponse = await httpRequest<PostCaregiverDesiredWorkResponseInterface, PostCaregiverDesiredWorkRequestInterface>(
            endpointEnum,
            desiredWork,
            getHeaders(),
        );
        if ("error" in caregiverDesiredWorkResponse) {
            return;
        }

        /**
         * 희망근무조건 수정인경우, 단순 alert 만 띄워주고 아니면, dialog 를 띄워주고 게시판으로 이동한다.
         */
        if (endpointEnum === EndpointEnum.PUT_CAREGIVER_DESIRED_WORK) {
            openAlert("근무조건이 변경되었습니다.", "변경된 조건에 맞는 일자리를 보내드릴게요!");
            await router.push("/내정보");
        } else {
            const queryParams: string = queryString.stringify(RecruitingsFilterUtil.getQueryParamsByDesiredWork(desiredWork));
            const uri = `/게시판?${queryParams}`;
            setDialogRecoil({
                open: true,
                title: "일자리 알림 신청 완료",
                content: "선생님의 조건에 꼭 맞는 일자리 정보를 카카오톡으로 전달드릴게요",
                hasCancelButton: true,
                confirmButtonText: "구인공고 둘러보기",
                cancelButtonText: "지인에게 알려주기",
                confirmButtonStyle: "outlined",
                flexDirection: "column",
                onConfirm: () => {
                    EventUtil.gtmEvent("click", "board", "work", "0");
                },
                onCancel: () => {
                    kakaoShare(`${process.env.NEXT_PUBLIC_SITE_URL}/?utm_source=kakaoshare`);
                    EventUtil.gtmEvent("click", "share", "work", "0");
                },
                onClose: () => {
                    EventUtil.gtmEvent("click", "share", "work", "0");
                },
            });
            router.push(uri);
        }
        /**
         * 희망근무조건 정보를 recoil 업데이트 해줌
         */
        setCaregiverRecoil({
            tokenData: caregiverRecoil.tokenData,
            auth: { ...caregiverRecoil.auth, hasDesiredWork: true },
        });
    };

    /**
     * 알림정보 예약 일시에 따른 NotificationValue Enum 가져오는 method 입니다.
     * date 가 null 일때 {@link NotificationValueEnum.ABORTED}
     * date 가 현재 시점보다 이전일 때 {@link NotificationValueEnum.SUBSCRIBED}
     * date 가 현재 시점보다 이후일 때 {@link NotificationValueEnum.RESERVED}
     * @param date 알림정보 에약
     */
    const getNotificationValueByDate = (date?: string | null): NotificationValueEnum => {
        if (!date) return NotificationValueEnum.ABORTED;

        if (dayjs(`${date} 00:00:00`, "YYYY-MM-DD HH:mm:ss").isBefore(dayjs())) {
            return NotificationValueEnum.SUBSCRIBED;
        }
        return NotificationValueEnum.RESERVED;
    };

    /**
     * 일자리 알림 수신 여부 가져오기
     */
    const getNotification = async (): Promise<NotificationInterface | undefined> => {
        setIsLoading(true);
        const notificationResponse = await httpRequest<GetCaregiverNotificationResponseInterface>(EndpointEnum.GET_CAREGIVER_NOTIFICATION, {}, getHeaders());
        setIsLoading(false);
        if ("error" in notificationResponse) {
            return undefined;
        }
        return notificationResponse.data;
    };

    /**
     * 일자리 알림 수신 여부 저장하기. api 호출 성공시, 알림 상태에 따라서 alert title/content 를 다르게 설정한다.
     * @param request
     */
    const setNotification = async (request: PostCaregiverNotificationRequestInterface): Promise<void> => {
        const notificationResponse = await httpRequest<ResponseInterface, PostCaregiverNotificationRequestInterface>(
            EndpointEnum.POST_CAREGIVER_NOTIFICATION,
            request,
            getHeaders(),
        );
        if ("error" in notificationResponse) {
            return;
        }
        const currentNotificationValueNum = getNotificationValueByDate(request.notificationDate);
        let title = "일자리 알림 등록 완료";
        let content = "꼭 맞는 일자리 알림을 보내드릴게요!";
        if (currentNotificationValueNum === NotificationValueEnum.RESERVED) {
            title = "일자리 알림 예약 완료";
            content = `${dayjs(request.notificationDate).format("YYYY년 MM월 DD일").toString()}부터 보내드릴게요!`;
        } else if (currentNotificationValueNum === NotificationValueEnum.ABORTED) {
            title = "일자리 알림 중단 완료";
            content = "알림을 원하시면 언제든 변경 가능해요!";
        }
        openAlert(title, content);
        await router.push("/account");
    };

    /**
     * 단일 이용약관 조회. 이용약관 정보 뿐만 아니고 해당 이용약관에 대한 동의 여부(일시) 까지 return
     * @param request
     */
    const getTermsAgreement = async (request: GetCaregiverTermAgreementRequestInterface): Promise<TermsAgreementInterface | undefined> => {
        setIsLoading(true);
        const termsAgreementResponse = await httpRequest<GetCaregiverTermAgreementResponseInterface>(EndpointEnum.GET_CAREGIVER_TERM_AGREEMENT, request, getHeaders());
        setIsLoading(false);
        if ("error" in termsAgreementResponse) {
            return undefined;
        }

        return termsAgreementResponse.data;
    };

    /**
     * 단일 이용약관 동의/비동의 저장하기. {@link EndpointEnum.POST_CAREGIVER_TERM_AGREEMENT} 호출
     * @param request
     * @param termsAgreement
     */
    const setTermsAgreement = async (request: PostCaregiverTermAgreementRequestInterface, termsAgreement: TermsAgreementInterface | undefined): Promise<void> => {
        if (!termsAgreement) return;

        const termsAgreementResponse = await httpRequest<GetCaregiverTermAgreementResponseInterface>(EndpointEnum.POST_CAREGIVER_TERM_AGREEMENT, request, getHeaders());
        if ("error" in termsAgreementResponse) {
            return;
        }

        if (request.agreedDate) {
            openAlert("동의 완료", `${termsAgreement.terms.title}가 완료되었습니다.\n(동의 일자:${request.agreedDate})`);
        } else {
            openAlert("동의 철회 완료", `${termsAgreement.terms.title}가 철회되었습니다.`);
        }
    };

    /**
     * 내 정보 받아오기. {@link EndpointEnum.GET_CAREGIVER_ME} 호출
     */
    const getMe = async (): Promise<CaregiverInformationInterface | undefined> => {
        const meResponse = await httpRequest<GetCaregiverMeResponseInterface>(EndpointEnum.GET_CAREGIVER_ME, {}, getHeaders());
        if ("error" in meResponse) {
            return undefined;
        }
        return meResponse.data;
    };

    /**
     * 내정보 화면에서 보여줄 이용약관 내역 조회하기. {@link EndpointEnum.GET_CAREGIVER_TERMS_AGREEMENT} 호출
     */
    const getMyTerms = async (): Promise<TermsAgreementInterface[] | []> => {
        const termsResponse = await httpRequest<GetCaregiverTermsAgreementResponseInterface, GetCaregiverTermsAgreementRequestInterface>(
            EndpointEnum.GET_CAREGIVER_TERMS_AGREEMENT,
            { isShowProfile: true },
            getHeaders(),
        );
        if ("error" in termsResponse) {
            return [];
        }

        return termsResponse.data;
    };

    /**
     * 회원가입을 위한 일반 이용약관 조회하기 {@link EndpointEnum.GET_CAREGIVER_TERMS} 호출
     */
    const getTerms = async (): Promise<TermsInterface[] | []> => {
        setIsLoading(true);
        const termsResponse = await httpRequest<GetCaregiverTermsResponseInterface, GetCaregiverTermsRequestInterface>(EndpointEnum.GET_CAREGIVER_TERMS);
        setIsLoading(false);
        if ("error" in termsResponse) {
            return [];
        }
        return termsResponse.data;
    };

    return {
        isLoading,
        setIsLoading,
        hasDesiredWork,
        login,
        loginWithToken,
        signup,
        withdrawal,
        logout,
        isLoggedIn,
        getDesiredWork,
        setDesiredWork,
        getNotification,
        setNotification,
        getNotificationValueByDate,
        getTermsAgreement,
        setTermsAgreement,
        getMe,
        getMyTerms,
        getTerms,
        caregiverRecoil,
        dialogRecoil,
    };
}

export default UseCaregiverService;
