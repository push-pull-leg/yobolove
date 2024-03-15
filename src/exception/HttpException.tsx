import { AxiosError } from "axios";
import ResponseInterface from "../interface/response/ResponseInterface";
import HttpExceptionCodeEnum from "../enum/HttpExceptionCodeEnum";

/**
 * HttpUtil 관련 예외처리. 통신에서 발생한 모든 예외에 대한 정의
 *
 * @category Exception
 */
export default class HttpException extends Error {
    /**
     * 관련 에러 메세지
     */
    public message: string;

    /**
     * {@link HttpExceptionCodeEnum}
     * @private
     */
    private readonly code: HttpExceptionCodeEnum;

    /**
     * 관련 Error
     * @private
     */
    private readonly error: AxiosError | unknown;

    /**
     * {@link ResponseInterface}
     * @private
     */
    private readonly response;

    /**
     *
     * @param code {@link HttpExceptionCodeEnum} Http 관련 예외 Enum.
     * @param message 관련 에러 메세지
     * @param error Http 관련 에러(현재는 Axios Error)
     * @param response {@link ResponseInterface} 만약 response 가 있으면 해당 http response 를 가져옴
     */
    constructor(code: HttpExceptionCodeEnum, message: string, error: AxiosError | unknown, response?: ResponseInterface) {
        super(message);
        Object.setPrototypeOf(this, HttpException.prototype);

        this.code = code;
        this.message = message;
        this.error = error;
        this.response = response;
    }

    /**
     * response 값
     * @return {@link ResponseInterface}
     */
    public getResponse(): ResponseInterface | undefined {
        return this.response;
    }
}
