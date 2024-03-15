import EndpointInterface from "../interface/EndpointInterface";
import EndpointEnum from "../enum/EndpointEnum";

/**
 * URI 기본 prefix 값. 일반적으로 버전정보가 들어간다.
 */
enum PREFIX {
    V1 = "v1",
    V2 = "v2",
}

/**
 * 엔드포인트별 속성값.
 */
const EndpointConfig: Map<EndpointEnum, EndpointInterface> = new Map([
    /**
     * 구직자용 API 정의
     */
    [
        EndpointEnum.GET_RECRUITINGS,
        {
            uri: `/${PREFIX.V2}/recruitings/simple`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_RECRUITING,
        {
            uri: `/${PREFIX.V2}/recruitings/{uuid}`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_RECRUITING_NEW_COUNT,
        {
            uri: `/${PREFIX.V2}/recruitings/new-count`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.POST_CAREGIVER_LOGIN,
        {
            uri: `/${PREFIX.V2}/caregivers/auth/signin`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_CAREGIVER_LOGOUT,
        {
            uri: `/${PREFIX.V2}/caregivers/auth/signout`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_CAREGIVER_SIGNUP,
        {
            uri: `/${PREFIX.V2}/caregivers/auth/signup`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_AUTH_CODE,
        {
            uri: `/${PREFIX.V2}/auth/code`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.GET_AUTH_CODE_AUTHENTICATE,
        {
            uri: `/${PREFIX.V2}/auth/code/authenticate`,
            method: "GET",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_CAREGIVER_JWT_REFRESH,
        {
            uri: `/${PREFIX.V2}/caregivers/auth/refresh`,
            method: "POST",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CAREGIVER_ME,
        {
            uri: `/${PREFIX.V2}/caregivers/me`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CAREGIVER_NOTIFICATION,
        {
            uri: `/${PREFIX.V2}/caregivers/notification`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.POST_CAREGIVER_NOTIFICATION,
        {
            uri: `/${PREFIX.V2}/caregivers/notification`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.GET_CAREGIVER_DESIRED_WORK,
        {
            uri: `/${PREFIX.V2}/caregivers/desired-work`,
            method: "GET",
            showLoading: false,
            showMessage: false,
        },
    ],
    [
        EndpointEnum.PUT_CAREGIVER_DESIRED_WORK,
        {
            uri: `/${PREFIX.V2}/caregivers/desired-work`,
            method: "PUT",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_CAREGIVER_DESIRED_WORK,
        {
            uri: `/${PREFIX.V2}/caregivers/desired-work`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.DELETE_CAREGIVER_WITHDRAWAL,
        {
            uri: `/${PREFIX.V2}/caregivers/auth/withdrawal`,
            method: "DELETE",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.GET_CAREGIVER_TERMS,
        {
            uri: `/${PREFIX.V2}/caregivers/terms`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CAREGIVER_TERMS_AGREEMENT,
        {
            uri: `/${PREFIX.V2}/caregivers/terms/agreement`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.POST_CAREGIVER_SNS_CALLBACK,
        {
            uri: `/${PREFIX.V2}/caregivers/auth/{providerType}/callback`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.GET_CAREGIVER_TERM_AGREEMENT,
        {
            uri: `/${PREFIX.V2}/caregivers/terms/{uuid}/agreement`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.POST_CAREGIVER_TERM_AGREEMENT,
        {
            uri: `/${PREFIX.V2}/caregivers/terms/{uuid}/agreement`,
            method: "POST",
            showLoading: true,
        },
    ],

    /**
     * 센터용 API 정의
     */
    [
        EndpointEnum.GET_CENTER_TERMS,
        {
            uri: `/${PREFIX.V2}/centers/terms`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CENTER_TERMS_AGREEMENT,
        {
            uri: `/${PREFIX.V2}/centers/terms/agreement`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CENTER_TERM_AGREEMENT,
        {
            uri: `/${PREFIX.V2}/centers/terms/{uuid}/agreement`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.POST_CENTER_TERM_AGREEMENT,
        {
            uri: `/${PREFIX.V2}/centers/terms/{uuid}/agreement`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.PUT_CENTER_PASSWORD,
        {
            uri: `/${PREFIX.V2}/centers/auth/password`,
            method: "PUT",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.PUT_CENTER_ANONYMOUS_PASSWORD,
        {
            uri: `/${PREFIX.V2}/centers/auth/anonymous/password`,
            method: "PUT",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_CENTER_SIGNUP,
        {
            uri: `/${PREFIX.V2}/centers/auth/signup`,
            method: "POST",
            showLoading: true,
            contentType: "multipart/form-data",
        },
    ],
    [
        EndpointEnum.POST_CENTER_LOGOUT,
        {
            uri: `/${PREFIX.V2}/centers/auth/signout`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_CENTER_LOGIN,
        {
            uri: `/${PREFIX.V2}/centers/auth/signin`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_CENTER_JWT_REFRESH,
        {
            uri: `/${PREFIX.V2}/centers/auth/refresh`,
            method: "POST",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CENTER_ACCOUNT_ID_EXISTS,
        {
            uri: `/${PREFIX.V2}/centers/auth/{accountId}/exists`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CENTER_ID,
        {
            uri: `/${PREFIX.V2}/centers/auth/id`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CENTER_ID_NUM_EXISTS,
        {
            uri: `/${PREFIX.V2}/centers/auth/id-num/{idNum}/exists`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.DELETE_CENTER_WITHDRAWAL,
        {
            uri: `/${PREFIX.V2}/centers/auth/withdrawal`,
            method: "DELETE",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_CENTER_CONTACTS_EXTRA,
        {
            uri: `/${PREFIX.V2}/centers/contacts/extra`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.DELETE_CENTER_CONTACTS_EXTRA,
        {
            uri: `/${PREFIX.V2}/centers/contacts/extra`,
            method: "DELETE",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.GET_CENTER_CONTACTS,
        {
            uri: `/${PREFIX.V2}/centers/contacts`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CENTER_ME_DETAIL,
        {
            uri: `/${PREFIX.V2}/centers/me/detail`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.PUT_CENTER_ME_DETAIL,
        {
            uri: `/${PREFIX.V2}/centers/me/detail`,
            method: "PUT",
            showLoading: true,
            contentType: "multipart/form-data",
        },
    ],
    [
        EndpointEnum.GET_CENTER_ME,
        {
            uri: `/${PREFIX.V2}/centers/me`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CENTER_ME_CERT_FILE,
        {
            uri: `/${PREFIX.V2}/centers/me/cert-file`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CENTER_RECRUITING,
        {
            uri: `/${PREFIX.V2}/centers/recruitings/{uuid}`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.PUT_CENTER_RECRUITING,
        {
            uri: `/${PREFIX.V2}/centers/recruitings/{uuid}`,
            method: "PUT",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.PUT_REREGISTER_CENTER_RECRUITING,
        {
            uri: `/${PREFIX.V2}/centers/recruitings/{uuid}/re-registration`,
            method: "PUT",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.PATCH_CENTER_RECRUITING,
        {
            uri: `/${PREFIX.V2}/centers/recruitings/{uuid}/status`,
            method: "PATCH",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.GET_CENTER_RECRUITINGS,
        {
            uri: `/${PREFIX.V2}/centers/recruitings`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.POST_CENTER_RECRUITINGS,
        {
            uri: `/${PREFIX.V2}/centers/recruitings`,
            method: "POST",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.GET_CENTER_RECRUITINGS_SIMPLE,
        {
            uri: `/${PREFIX.V2}/centers/recruitings/simple`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_RECRUITINGS_SITEMAP,
        {
            uri: `/${PREFIX.V2}/recruitings/sitemap`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CENTER_MOREINFO_EXISTS,
        {
            uri: `/${PREFIX.V2}/centers/more-info/exists`,
            method: "GET",
            showLoading: true,
        },
    ],
    [
        EndpointEnum.POST_MORE_INFO,
        {
            uri: `/${PREFIX.V2}/centers/more-info`,
            method: "POST",
            showLoading: true,
            contentType: "multipart/form-data",
        },
    ],
    [
        EndpointEnum.GET_MORE_INFO_SIGNATURE_FILE,
        {
            uri: `/${PREFIX.V2}/centers/more-info/signature-file`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_JOB_CENTER_INFO,
        {
            uri: `/${PREFIX.V2}/centers/recruitings/{uuid}/worknet-history`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_CURRENT_PASS_AMOUNT,
        {
            uri: `/${PREFIX.V2}/centers/tickets/count`,
            method: "GET",
            showLoading: false,
        },
    ],
    [
        EndpointEnum.GET_RECRUITING_CHANNELS,
        {
            uri: `/${PREFIX.V2}/centers/recruitings/{uuid}/channels`,
            method: "GET",
            showLoading: true,
        },
    ],
]);
export default EndpointConfig;
