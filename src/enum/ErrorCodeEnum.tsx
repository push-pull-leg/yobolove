/**
 * 클라이언트 내부 에러 정의.
 *
 * @category Enum
 * @enum
 */
const enum ErrorCodeEnum {
    /**
     * 권한없음. 로그인 하지 않은 상태로 내정보 페이지 진입등, 권한이 없는 계정이 특정 권한에 대한 UI 접근 시도를 하려고 할 때 발생
     */
    UNAUTHORIZED_ERROR = "UNAUTHORIZED_ERROR",
    /**
     * 알수 없는 단계. 인증문자 전송 등 단계를 이용하는 UI 에서 알 수 없는 단계에 대한 정의
     */
    UNKNOWN_STEP = "UNKNOWN_STEP",
    /**
     * 알 수 없는 endpoint. 엔드 포인트가 Endpoint Config 에 정의 되어 있지 않을때 발생한다.
     */
    UNKNOWN_ENDPOINT = "UNKNOWN_ENDPOINT",
    /**
     * 유효하지 않은 parameter. uuid 등 query parameter 에 대한 검증을 진행해야되는 페이지에서 발생하는 에러
     */
    INVALID_QUERY_PARAMETER = "INVALID_QUERY_PARAMETER",
}

export default ErrorCodeEnum;
