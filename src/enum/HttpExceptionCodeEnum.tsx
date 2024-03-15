/**
 * HTTP 관련 예외 code enum. HttpUtil 에서 사용. 새로운 케이스가 생기면 해당 Enum 을 추가해주세요
 *
 * @category Enum
 * @enum
 */
const enum HttpExceptionCodeEnum {
    /**
     * 네트워크 상태 안좋음
     */
    NETWORK_ERROR = "NETWORK_ERROR",
    /**
     * 백엔드에서 보내주는 에러. response 있는경우
     */
    KNOWN_ERROR = "KNOWN_ERROR",
    /**
     * 알 수 없는 에러.
     */
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    /**
     * response 없음
     */
    NO_RESPONSE = "NO_RESPONSE",
}

export default HttpExceptionCodeEnum;
