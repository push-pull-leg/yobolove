/**
 * 내부 API 에서 정의한 ServerEndpoint 를 Enum 형태로 사용합니다. METHOD_URI 형태입니다.
 *
 * @category Enum
 */
const enum ServerEndpointEnum {
    /**
     * 구직자 로그인
     */
    POST_CAREGIVER_LOGIN = "POST_CAREGIVER_LOGIN",
    /**
     * 기관 로그인
     */
    POST_CENTER_LOGIN = "POST_CENTER_LOGIN",
    /**
     * 구직자 로그아웃
     */
    DELETE_CAREGIVER_LOGOUT = "DELETE_CAREGIVER_LOGOUT",
    /**
     * 기관 로그아웃
     */
    DELETE_CENTER_LOGOUT = "DELETE_CENTER_LOGOUT",
}

export default ServerEndpointEnum;
