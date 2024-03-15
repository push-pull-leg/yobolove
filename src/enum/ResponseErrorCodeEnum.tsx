/**
 * [백엔드 에러 코드 정의](https://github.com/kseniorlab/yobolove-backend/blob/main/src/main/java/com/kslab/yobolove/error/ErrorCode.java)
 * 새로운 케이스가 생기면 해당 Enum 을 추가해주세요. 단, 굳이 내부에서 사용하지 않는 에러는 정의할 필요 없습니다.
 *
 * @category Enum
 * @enum
 */
const enum ResponseErrorCodeEnum {
    /**
     * 알 수 없는 에러
     */
    SPRING_MVC_EXCEPTION = "SPRING_MVC_EXCEPTION",
    /**
     * 서버오류
     */
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    /**
     * 다른 센터의 구인공고에 접근 했을 때
     */
    ACCESS_DENIED_RECRUITING = "ACCESS_DENIED_RECRUITING",
    /**
     * 이미 존재하는 요양보호사
     */
    ALREADY_EXIST_CAREGIVER = "ALREADY_EXIST_CAREGIVER",
    /**
     * 기관 가입신청: 이미 존재하는 기관기호
     */
    ALREADY_EXIST_CENTER = "ALREADY_EXIST_CENTER",
    /**
     * 기관 가입신청: 이미 존재하는 고유번호
     */
    ALREADY_EXIST_ID_NUM = "ALREADY_EXIST_ID_NUM",
    /**
     * 기관 로그인: 아이디, 비밀번호 맞지 않음
     */
    BAD_CREDENTIALS_CENTER_ACCOUNT = "BAD_CREDENTIALS_CENTER_ACCOUNT",
    /**
     * 코드 생성 최대 횟수 제한
     */
    EXCEEDED_CODE_GENERATION = "EXCEEDED_CODE_GENERATION",
    /**
     * 코드 인증 최대 횟수 제한
     */
    EXCEEDED_CODE_CERTIFICATION = "EXCEEDED_CODE_CERTIFICATION",
    /**
     * 코드 인증시간이 지남
     */
    EXPIRED_CODE = "EXPIRED_CODE",
    /**
     * 코드 인증번호가 맞지 않음
     */
    FAILED_CODE_AUTHENTICATION = "FAILED_CODE_AUTHENTICATION",
    /**
     * 알림톡 요청이 실패함
     */
    FAILED_ALIMTALK_SEND = "FAILED_ALIMTALK_SEND",
    /**
     * 파일 업로드 실패
     */
    FAILED_FILE_UPLOAD = "FAILED_FILE_UPLOAD",
    /**
     * 활성화 되지 않은 기관계정
     */
    INACTIVE_CENTER_ACCOUNT = "INACTIVE_CENTER_ACCOUNT",
    /**
     * ACCESS JWT 이 유효하지 않음
     */
    INVALID_JSON_WEB_TOKEN = "INVALID_JSON_WEB_TOKEN",
    /**
     * REFRESH JWT 이 유효하지 않음
     */
    INVALID_REFRESH_JSON_WEB_TOKEN = "INVALID_REFRESH_JSON_WEB_TOKEN",
    /**
     * 허용되지 않은 구인 공고 변경 상태 선택지
     */
    NOT_ALLOWED_CHANGE_RECRUITING_STATUS = "NOT_ALLOWED_CHANGE_RECRUITING_STATUS",
    /**
     * 허용되지 않은 파일 타입
     */
    NOT_ALLOWED_FILE_TYPE = "NOT_ALLOWED_FILE_TYPE",
    /**
     * 허용되지 않은 희망근무조건 선택지
     */
    NOT_ALLOWED_CHANGE_NOTIFICATION = "NOT_ALLOWED_CHANGE_NOTIFICATION",
    /**
     * 구인공고 없음
     */
    NOT_FOUND_RECRUITING = "NOT_FOUND_RECRUITING",
    /**
     * 요양보호사 없음
     */
    NOT_FOUND_CAREGIVER = "NOT_FOUND_CAREGIVER",
    /**
     * 희망 근무조건 없음(최초 회원가입시 없음)
     */
    NOT_FOUND_CAREGIVER_DESIRED_WORK = "NOT_FOUND_CAREGIVER_DESIRED_WORK",
    /**
     * 기관 없음
     */
    NOT_FOUND_CENTER = "NOT_FOUND_CENTER",
    /**
     * 구인공고 조회 실패
     */
    FAILED_PROCESS_PAGE_TOKEN = "FAILED_PROCESS_PAGE_TOKEN",
    /**
     * 해당 휴대폰 번호로 가입된 기관을 찾을 수 없음
     */
    NOT_FOUND_CENTER_BY_ADMIN_PHONE_NUM = "NOT_FOUND_CENTER_BY_ADMIN_PHONE_NUM",
    /**
     * 원터치 등록권이 없음.
     */
    INVALID_ONE_TOUCH_TICKET_COUNT = "INVALID_ONE_TOUCH_TICKET_COUNT",
}

export default ResponseErrorCodeEnum;
