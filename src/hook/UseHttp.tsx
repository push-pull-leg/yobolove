import EndpointEnum from "../enum/EndpointEnum";
import HttpUtil from "../util/HttpUtil";
import HttpException from "../exception/HttpException";
import Endpoints from "../config/EndpointConfig";
import ResponseInterface from "../interface/response/ResponseInterface";
import ErrorException from "../exception/ErrorException";
import UseLoading from "./UseLoading";
import UseAlert from "./UseAlert";
import ResponseErrorCodeEnum from "../enum/ResponseErrorCodeEnum";
import ErrorCodeEnum from "../enum/ErrorCodeEnum";

/**
 * UI 컴포넌트에서 통신관련 기능을 사용하고 싶을 때 import 하는 Custom Hook 입니다. UI 컴포넌트에서는 직접 {@link HttpUtil}을 불러오면 안되고 해당 hook 을 사용해야 합니다.
 * @category Hook
 */
export default function UseHttp() {
    const { openLoading, closeLoading } = UseLoading();
    const { openAlert } = UseAlert();

    /**
     * Http 요청. showLoading 가 true 면, loading 보여준후 {@link HttpUtil} 을 실행. 통신이 끝난 후, showMessage 처리.
     * @param endpointEnum 요청할 Endpoint
     * @param params http request body
     * @param headers http request headers
     * @param excludeErrorCodeEnum showMessage: true 인 EndPoint 임에도 특정 ErrorCodeEnum 에서는 alert 를 보여주지 않고 싶다면 해당 ErrorCodeEnum 를 넘김
     * @param onErrorInterrupter 에러 처리를 커스텀으로 처리하는 경우에 사용
     *      return true인 경우, httpRequest에 구현된 기본 error 처리를 무시함
     *      return false인 경우, httpRequest에 구현된 기본 error 처리를 실행
     */
    const httpRequest = async <T extends ResponseInterface = ResponseInterface, D extends object = object>(
        endpointEnum: EndpointEnum,
        params?: D,
        headers?: object,
        excludeErrorCodeEnum?: ResponseErrorCodeEnum[],
        onErrorInterrupter?: (error: HttpException) => boolean,
    ): Promise<T> => {
        const endpoint = Endpoints.get(endpointEnum);
        if (!endpoint) {
            throw new ErrorException(ErrorCodeEnum.UNKNOWN_ENDPOINT, "알 수 없는 endpoint 입니다.");
        }
        /**
         * endpoint 가 showLoading 이면 openLoading
         */
        if (endpoint.showLoading) {
            openLoading();
        }
        try {
            const response = await HttpUtil.request<T, D>(endpointEnum, params, headers);
            if (endpoint.showLoading) {
                closeLoading();
            }
            return response;
        } catch (httpError) {
            let showMessage: boolean = true;
            if (endpoint.showMessage !== undefined) {
                showMessage = endpoint.showMessage;
            }
            if (endpoint.showLoading) {
                closeLoading();
            }

            if (onErrorInterrupter && httpError instanceof HttpException) {
                const response = httpError.getResponse();

                if (onErrorInterrupter(httpError)) {
                    return response as T;
                }
            }

            /**
             * error 가 있는 response. 즉, 백엔드에서 error 를 정의해서 response 를 준 경우, exception 처리가 아닌 badResponse 형태로 넘김.
             * 그외에는 전부 throw HttpError 로 바로 예외넘김.
             */
            if (httpError instanceof HttpException) {
                const response = httpError.getResponse();
                if (response && "error" in response) {
                    const { error } = response;
                    /**
                     * 에러메세지를 띄워야 하는 경우 && 실제 메세지가 있는 경우에는 openAlert 를 통해서 에러를 띄운다.
                     */
                    if (error.message && showMessage) {
                        const errorMessage = error.message;
                        if (excludeErrorCodeEnum && excludeErrorCodeEnum.length > 0) {
                            if (!excludeErrorCodeEnum.includes(response.error.code)) {
                                openAlert(errorMessage);
                            }
                        } else {
                            openAlert(errorMessage);
                        }
                    }
                    return response as T;
                }
            }
            throw httpError;
        }
    };
    return { httpRequest };
}
