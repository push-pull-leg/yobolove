/**
 * 백엔드에서 정의한 Endpoint 를 Enum 형태로 사용합니다. METHOD_URI 형태입니다.
 *
 * @category Enum
 * @enum
 */
const enum EndpointEnum {
    /**
     * 인증코드 발송
     */
    POST_AUTH_CODE = "POST_AUTH_CODE",
    /**
     * 인증코드 발송 인증
     */
    GET_AUTH_CODE_AUTHENTICATE = "GET_AUTH_CODE_AUTHENTICATE",
    /**
     * 공고 리스트 불러오기
     */
    GET_RECRUITINGS = "GET_RECRUITINGS",
    /**
     * 단일 공고 불러오기
     */
    GET_RECRUITING = "GET_RECRUITING",
    /**
     * 새로운 구인공고 갯수가져오기
     */
    GET_RECRUITING_NEW_COUNT = "GET_RECRUITING_NEW_COUNT",
    /**
     * 로그인
     */
    POST_CAREGIVER_LOGIN = "POST_CAREGIVER_LOGIN",
    /**
     * 로그아웃
     */
    POST_CAREGIVER_LOGOUT = "POST_CAREGIVER_LOGOUT",
    /**
     * 회원가입
     */
    POST_CAREGIVER_SIGNUP = "POST_CAREGIVER_SIGNUP",
    /**
     * JWT refresh
     */
    POST_CAREGIVER_JWT_REFRESH = "POST_CAREGIVER_JWT_REFRESH",
    /**
     * 내 정보 받아오기
     */
    GET_CAREGIVER_ME = "GET_CAREGIVER_ME",
    /**
     * 알림정보 받아오기
     */
    GET_CAREGIVER_NOTIFICATION = "GET_CAREGIVER_NOTIFICATION",
    /**
     * 알림정보 설정하기
     */
    POST_CAREGIVER_NOTIFICATION = "POST_CAREGIVER_NOTIFICATION",
    /**
     * 희망근무조건 받아오기
     */
    GET_CAREGIVER_DESIRED_WORK = "GET_CAREGIVER_DESIRED_WORK",
    /**
     * 희망근무조건 수정하기
     */
    PUT_CAREGIVER_DESIRED_WORK = "PUT_CAREGIVER_DESIRED_WORK",
    /**
     * 희망근무조건 설정하기
     */
    POST_CAREGIVER_DESIRED_WORK = "POST_CAREGIVER_DESIRED_WORK",
    /**
     * 탈퇴하기
     */
    DELETE_CAREGIVER_WITHDRAWAL = "DELETE_CAREGIVER_WITHDRAWAL",

    /**
     * 이용약관 받아오기
     */
    GET_CAREGIVER_TERMS = "GET_CAREGIVER_TERMS",
    /**
     * 요양보호사 - 내 프로필에서 약관 조회
     */
    GET_CAREGIVER_TERMS_AGREEMENT = "GET_CAREGIVER_TERMS_AGREEMENT",
    /**
     * 요양보호사 - 약관 단일 조회
     */
    GET_CAREGIVER_TERM_AGREEMENT = "GET_CAREGIVER_TERM_AGREEMENT",
    /**
     * 요양보호사 - 약관 단일 동의
     */
    POST_CAREGIVER_TERM_AGREEMENT = "POST_CAREGIVER_TERM_AGREEMENT",
    /**
     * 요양보호사 sns 로그인
     */
    POST_CAREGIVER_SNS_CALLBACK = "POST_CAREGIVER_SNS_CALLBACK",

    /**
     *
     *
     *
     *
     * 센터 시작
     * 이용약관 받아오기
     */
    GET_CENTER_TERMS = "GET_CENTER_TERMS",
    /**
     * 요양보호사 - 내 프로필에서 약관 조회
     */
    GET_CENTER_TERMS_AGREEMENT = "GET_CENTER_TERMS_AGREEMENT",
    /**
     * 요양보호사 - 약관 단일 조회
     */
    GET_CENTER_TERM_AGREEMENT = "GET_CENTER_TERM_AGREEMENT",
    /**
     * 요양보호사 - 약관 단일 동의
     */
    POST_CENTER_TERM_AGREEMENT = "POST_CENTER_TERM_AGREEMENT",
    /**
     * 센터 패스워드 변경
     */
    PUT_CENTER_PASSWORD = "PUT_CENTER_PASSWORD",
    /**
     * 센터 패스워드 변경
     */
    PUT_CENTER_ANONYMOUS_PASSWORD = "PUT_CENTER_ANONYMOUS_PASSWORD",
    /**
     * 센터 회원가입
     */
    POST_CENTER_SIGNUP = "POST_CENTER_SIGNUP",
    /**
     * 센터 로그아웃
     */
    POST_CENTER_LOGOUT = "POST_CENTER_LOGOUT",
    /**
     * 센터 로그인
     */
    POST_CENTER_LOGIN = "POST_CENTER_LOGIN",
    /**
     * JWT refresh
     */
    POST_CENTER_JWT_REFRESH = "POST_CENTER_JWT_REFRESH",
    /**
     * ID 중복확인
     */
    GET_CENTER_ACCOUNT_ID_EXISTS = "GET_CENTER_ACCOUNT_ID_EXISTS",
    /**
     * 센터 아이디 찾기
     */
    GET_CENTER_ID = "GET_CENTER_ID",
    /**
     * 센터 기관기호 찾기
     */
    GET_CENTER_ID_NUM_EXISTS = "GET_CENTER_ID_NUM_EXISTS",
    /**
     * 센터 회원탈퇴
     */
    DELETE_CENTER_WITHDRAWAL = "DELETE_CENTER_WITHDRAWAL",
    /**
     * 센터 연락처 추가
     */
    POST_CENTER_CONTACTS_EXTRA = "POST_CENTER_CONTACTS_EXTRA",
    /**
     * 센터 연락처 삭제
     */
    DELETE_CENTER_CONTACTS_EXTRA = "DELETE_CENTER_CONTACTS_EXTRA",
    /**
     * 센터 연락처 조회
     */
    GET_CENTER_CONTACTS = "GET_CENTER_CONTACTS",
    /**
     * 기관 본인 상세정보 조회
     */
    GET_CENTER_ME_DETAIL = "GET_CENTER_ME_DETAIL",
    /**
     * 기관 본인 상세정보 수정
     */
    PUT_CENTER_ME_DETAIL = "PUT_CENTER_ME_DETAIL",
    /**
     * 기관 본인 정보 조회
     */
    GET_CENTER_ME = "GET_CENTER_ME",
    /**
     * 기관 증명서 정보 조회
     */
    GET_CENTER_ME_CERT_FILE = "GET_CENTER_ME_CERT_FILE",
    /**
     * 구인공고 단일 조회
     */
    GET_CENTER_RECRUITING = "GET_CENTER_RECRUITING",
    /**
     * 구인공고 내용 수정
     */
    PUT_CENTER_RECRUITING = "PUT_CENTER_RECRUITING",
    /**
     * 구인공고 상태 변경
     */
    PATCH_CENTER_RECRUITING = "PATCH_CENTER_RECRUITING",
    /**
     * 구인공고 목록조회
     */
    GET_CENTER_RECRUITINGS = "GET_CENTER_RECRUITINGS",
    /**
     * 구인공고 등록
     */
    POST_CENTER_RECRUITINGS = "POST_CENTER_RECRUITINGS",
    /**
     * 요약 정보 목록
     */
    GET_CENTER_RECRUITINGS_SIMPLE = "GET_CENTER_RECRUITINGS_SIMPLE",
    /**
     * 사이트맵 리스트 조회
     */
    GET_RECRUITINGS_SITEMAP = "GET_RECRUITINGS_SITEMAP",
    /**
     * 기관 추가정보 존재 여부 조회
     */
    GET_CENTER_MOREINFO_EXISTS = "GET_CENTER_MOREINFO_EXISTS",
    /**
     * 기관 추가 정보 등록하기
     */
    POST_MORE_INFO = "POST_MORE_INFO",
    /**
     * 센터 채용담당자 서명 파일 조회
     */
    GET_MORE_INFO_SIGNATURE_FILE = "GET_MORE_INFO_SIGNATURE_FILE",
    /**
     * 일자리 센터 정보 조회
     */
    GET_JOB_CENTER_INFO = "GET_JOB_CENTER_INFO",
    /**
     * 공고 재등록
     */
    PUT_REREGISTER_CENTER_RECRUITING = "PUT_REREGISTER_CENTER_RECRUITING",
    /**
     * 현재 보유 등록권의 갯수 조회
     */
    GET_CURRENT_PASS_AMOUNT = "GET_CURRENT_PASS_AMOUNT",
    /**
     * 공고에 대한 원터치 채널 선택 내역 조회
     */
    GET_RECRUITING_CHANNELS = "GET_RECRUITING_CHANNELS",
}

export default EndpointEnum;
