import ErrorCodeEnum from "../enum/ErrorCodeEnum";

/**
 * 앱 내부에서 발생하는 예외처리.
 *
 * @category Exception
 */
export default class ErrorException extends Error {
    /**
     * 생성자 정의
     * @param code {@link ErrorCodeEnum} 내부 에러코드(Enum)
     * @param message 관련 에러 메세지
     * @param error 관련되서 발생한 다른 Exception 이 있으면 같이 넘긴다.(없으면 안넘김)
     */
    constructor(public code: ErrorCodeEnum, public message: string, public error?: Error | unknown | undefined) {
        super(message);
        Object.setPrototypeOf(this, ErrorException.prototype);
    }

    /**
     * @return 에러메세지
     */
    public getMessage(): string {
        return this.message;
    }
}
