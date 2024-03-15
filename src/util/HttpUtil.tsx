import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";
import FormData from "form-data";
import EndpointEnum from "../enum/EndpointEnum";
import EndpointConfig from "../config/EndpointConfig";
import HttpException from "../exception/HttpException";
import "format-unicorn";
import ResponseInterface from "../interface/response/ResponseInterface";
import ResponseHeaderInterface from "../interface/response/ResponseHeaderInterface";
import ErrorException from "../exception/ErrorException";
import ErrorCodeEnum from "../enum/ErrorCodeEnum";
import HttpExceptionCodeEnum from "../enum/HttpExceptionCodeEnum";
import ServerEndpointEnum from "../enum/ServerEndpointEnum";
import ServerEndpointConfig from "../config/ServerEndpointConfig";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_HOST || "https://api.dev.yobolove.co.kr";
axios.defaults.withCredentials = true;
const queryString = require("query-string");

const adaptor = (endpointEnum: EndpointEnum) => {
    switch (endpointEnum) {
        case EndpointEnum.GET_RECRUITINGS:
            import("../mocks/response/get-recruitings");
            break;

        case EndpointEnum.GET_RECRUITING:
            import("../mocks/response/get-recruiting");
            break;

        case EndpointEnum.GET_RECRUITING_NEW_COUNT:
            import("../mocks/response/get-recruiting-new-count");
            break;

        case EndpointEnum.POST_AUTH_CODE:
            import("../mocks/response/post-auth-code");
            break;

        case EndpointEnum.GET_CAREGIVER_DESIRED_WORK:
            import("../mocks/response/get-caregiver-desired-work");
            break;

        case EndpointEnum.GET_CAREGIVER_ME:
            import("../mocks/response/get-caregiver-me");
            break;

        case EndpointEnum.GET_CAREGIVER_NOTIFICATION:
            import("../mocks/response/get-caregiver-notification");
            break;

        case EndpointEnum.POST_CAREGIVER_JWT_REFRESH:
            import("../mocks/response/post-caregiver-auth-refresh");
            break;

        case EndpointEnum.POST_CAREGIVER_DESIRED_WORK:
            import("../mocks/response/post-caregiver-desired-work");
            break;

        case EndpointEnum.POST_CAREGIVER_LOGIN:
            import("../mocks/response/post-caregiver-auth-signin");
            break;

        case EndpointEnum.POST_CAREGIVER_LOGOUT:
            import("../mocks/response/post-caregiver-auth-signout");
            break;

        case EndpointEnum.POST_CAREGIVER_SIGNUP:
            import("../mocks/response/post-caregiver-auth-signup");
            break;

        case EndpointEnum.POST_CAREGIVER_NOTIFICATION:
            import("../mocks/response/post-caregiver-notification");
            break;

        case EndpointEnum.PUT_CAREGIVER_DESIRED_WORK:
            import("../mocks/response/put-caregiver-desired-work");
            break;

        case EndpointEnum.DELETE_CAREGIVER_WITHDRAWAL:
            import("../mocks/response/delete-caregiver-auth-withdrawal");
            break;

        case EndpointEnum.GET_CAREGIVER_TERMS:
            import("../mocks/response/get-caregiver-terms");
            break;

        case EndpointEnum.GET_CAREGIVER_TERMS_AGREEMENT:
            import("../mocks/response/get-caregiver-terms-agreement");
            break;

        case EndpointEnum.GET_CAREGIVER_TERM_AGREEMENT:
            import("../mocks/response/get-caregiver-term-agreement");
            break;

        case EndpointEnum.POST_CAREGIVER_TERM_AGREEMENT:
            import("../mocks/response/post-caregiver-term-agreement");
            break;

        case EndpointEnum.GET_CENTER_TERMS:
            import("../mocks/response/get-center-terms");
            break;

        case EndpointEnum.GET_CENTER_TERMS_AGREEMENT:
            import("../mocks/response/get-center-terms-agreement");
            break;

        case EndpointEnum.GET_CENTER_TERM_AGREEMENT:
            import("../mocks/response/get-center-term-agreement");
            break;

        case EndpointEnum.POST_CENTER_TERM_AGREEMENT:
            import("../mocks/response/post-center-term-agreement");
            break;

        case EndpointEnum.POST_CAREGIVER_SNS_CALLBACK:
            import("../mocks/response/post-caregiver-auth-sns-callback");
            break;

        default:
            throw new ErrorException(ErrorCodeEnum.UNKNOWN_ENDPOINT, `일치하는 mocking 데이터가 없습니다 :: ${endpointEnum}`);
    }
};

/**
 * HTTP 호출을 위한 UTIL 입니다.
 * @category Util
 */
class HttpUtil {
    /**
     * static class 는 직접 인스턴스화 불가능
     */
    private constructor() {
        throw new Error("cannot instantiate using a static class");
    }

    /**
     * HTTP 통신 호출
     * ### 1. Mocking Enabled 이면 해당 모킹 데이터 import
     *
     * ### 2. {@link EndpointConfig} 에서 맞는 {@link EndpointEnum} 을 선택. 없으면 exception throw
     *
     * ### 3. params 가 같이 넘어왔을 경우, uri 자체에 있는 변수 (ex) uuid) 를 대입해서 uri 를 구성.
     * @example
     * ```shell
     * URI: /caregivers/{uuid}
     * Params: {uuid:"123"}
     * => /caregivers/123
     * ```
     * GET method 인 경우, query parameter 형식으로 변환
     *
     * ### 4. header 구성.
     * 기본 content-type 은 application/json 이고 특별히 endpoint 설정에서 contentType 이 있을 경우, 해당 타입을 설정.
     * 추가적인 header 있으면 같이 넘김
     *
     * ### 5. body 구성
     * contentType 이 multipart/form-data 일 경우(파일전송), formData 를 따로 설정해서 넘김
     * 아닌경우, object 화 시켜서 넘김
     *
     * ### 5. AxiosConfig 설정한후 http 요청 실행
     *
     * ### 6. Exception 처리
     * @throws HttpException {@link HttpExceptionCodeEnum.UNKNOWN_ERROR} 에러가 비어있거나 알수 없는 에러인 경우.(예외처리 불가능)
     * @throws HttpException {@link HttpExceptionCodeEnum.NO_RESPONSE} error.response 가 비어있는 경우.
     * @throws HttpException {@link HttpExceptionCodeEnum.KNOWN_ERROR} error.response 가 있고, 해당 내용들이 백엔드에서 지정한 아는 에러인 경우(로그인시 비밀번호가 다름)
     * @throws HttpException {@link HttpExceptionCodeEnum.NETWORK_ERROR} 그 외의 에러인 경우. 일반적으로 통신연결이 안되어있거나 느린경우 해당 예외처리
     *
     * ### 7. 받은 response 를 같이 넘김 Generic({@link ResponseInterface}) 타입으로 변환 한 후 return
     *
     * @param endpointEnum EndpointEnum 값. 새로운 Endpoint 가 추가되었을 때는 {@link EndpointEnum} 및 {@link EndpointConfig}에 추가해서 사용합니다.
     * @param params Request Body 입니다. 해당 Endpoint 에 맞는 Request Interface
     * @param headers Request Header. 일반적으로 Authorization 토큰 넘김
     * @return {@link ResponseInterface}
     * @throws {@link HttpException}
     */
    public static async request<T extends ResponseInterface = ResponseInterface, D extends object = object>(endpointEnum: EndpointEnum, params?: D, headers?: object): Promise<T> {
        if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
            console.log("try to mocking");
            adaptor(endpointEnum);
        }

        const endpoint = EndpointConfig.get(endpointEnum);
        if (!endpoint) {
            throw new ErrorException(ErrorCodeEnum.UNKNOWN_ENDPOINT, "알 수 없는 endpoint 입니다.");
        }

        let url = endpoint.uri;
        let objectParams = {};
        if (params !== undefined) {
            objectParams = params as object;
            /**
             * /users/{userId} / {userId : 1} > /users/1 형태로 format 합니다.
             */
            url = url.formatUnicorn(objectParams);
            /**
             * Get Method 의 경우에는 parameter 를 query string build 한 다음에 get parameter 형식으로 바꿔줍니다.
             */
            if (endpoint.method === "GET") {
                url += `?${queryString.stringify(objectParams)}`;
                url = queryString.exclude(url, ["uuid"]);
            }
        }
        /**
         * 파일 변수가 있는 경우 formData 로 넘겨야합니다.(Multipart)
         */
        const requestHeaders: AxiosRequestHeaders = {
            "content-type": endpoint.contentType || "application/json",
            ...headers,
        };

        let requestData;
        if (endpoint.contentType === "multipart/form-data") {
            const formData = new FormData();
            Object.entries(objectParams).forEach((value: [string, any]) => {
                if (typeof value[1] === "object" && !(value[1] instanceof File)) {
                    formData.append(value[0], JSON.stringify(value[1]));
                } else {
                    formData.append(value[0], value[1]);
                }
            });
            requestData = formData;
        } else {
            requestData = Object.keys(objectParams).length === 0 ? null : objectParams;
        }

        const axiosConfig: AxiosRequestConfig = {
            method: endpoint.method,
            url,
            data: requestData || undefined,
            withCredentials: true,
            responseType: "json",
            headers: requestHeaders,
        };

        if (process.env.NODE_ENV !== "production") {
            console.info(`%c REQUEST of ${endpointEnum}`, "font-weight:bold;color:orange", axiosConfig);
        }
        let axiosResponse: AxiosResponse;
        try {
            axiosResponse = await axios(axiosConfig);
        } catch (e: AxiosError | unknown) {
            console.warn(e);
            if (!e || !(e instanceof Object) || !("response" in e)) {
                throw new HttpException(HttpExceptionCodeEnum.UNKNOWN_ERROR, "알 수 없는 에러입니다.", e);
            }

            const { response, message } = e;
            if (!response) {
                throw new HttpException(HttpExceptionCodeEnum.NO_RESPONSE, "서버로부터 응답을 받지 못했습니다.", e);
            }
            const { data } = response;
            if (data !== undefined) {
                const badResponse: ResponseInterface = data;
                let errorMessage = "unknown error";
                if (badResponse.error !== undefined) {
                    errorMessage = badResponse.error.message;
                } else if (message !== undefined) {
                    errorMessage = message;
                }
                throw new HttpException(HttpExceptionCodeEnum.KNOWN_ERROR, errorMessage, e, badResponse);
            }
            throw new HttpException(HttpExceptionCodeEnum.NETWORK_ERROR, "통신상태가 좋지 않습니다", e as AxiosError);
        }
        const resultResponse: T = axiosResponse.data;

        resultResponse.headers = axiosResponse.headers as ResponseHeaderInterface;
        if (process.env.NODE_ENV !== "production") {
            console.info(`%c RESPONSE of ${endpointEnum}`, "font-weight:bold;color:RoyalBlue", {
                resultResponse,
                endpoint,
                requestData,
            });
        }
        return resultResponse;
    }

    public static async serverRequest(serverEndpointEnum: ServerEndpointEnum, body?: string): Promise<void> {
        const serverEndpointConfig = ServerEndpointConfig.get(serverEndpointEnum);
        if (!serverEndpointEnum) {
            throw new ErrorException(ErrorCodeEnum.UNKNOWN_ENDPOINT, "알 수 없는 server - endpoint 입니다.");
        }
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/${serverEndpointConfig?.uri}`, {
                method: serverEndpointConfig?.method,
                mode: "same-origin",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });
            // eslint-disable-next-line no-empty
        } catch (e) {
            console.log(e);
        }
    }
}

export default HttpUtil;
