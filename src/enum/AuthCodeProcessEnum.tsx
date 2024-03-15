/**
 * 인증문자발송시 어떤 프로세스중에 요청했는지 명시하는 인자. 회원가입인증시 이미 회원가입이 되어있을 때 등을 검증한다.
 *
 * @category Enum
 * @enum
 */
const enum AuthCodeProcessEnum {
    /**
     * 구직자용 > 로그인
     */
    CAREGIVER_SIGN_IN = "CAREGIVER_SIGN_IN",
    /**
     * 구직자용 > 회원가입
     */
    CAREGIVER_SIGN_UP = "CAREGIVER_SIGN_UP",
    /**
     * 구직자용 > 회원탈퇴
     */
    CAREGIVER_WITHDRAWAL = "CAREGIVER_WITHDRAWAL",
    /**
     * 기관용 > 회원가입
     */
    CENTER_SIGN_UP = "CENTER_SIGN_UP",
    /**
     * 기관용 > 연락처 추가
     */
    CENTER_EXTRA_CONTACT = "CENTER_EXTRA_CONTACT",
    /**
     * 기관용 > 아이디 찾기
     */
    CENTER_FIND_ID = "CENTER_FIND_ID",
    /**
     * 기관용 > 전화번호 수정
     */
    CENTER_PHONE_NUM_UPDATE = "CENTER_PHONE_NUM_UPDATE",
    /**
     * 기관용 > 비밀번호 변경
     */
    CENTER_ANONYMOUS_PWD_UPDATE = "CENTER_ANONYMOUS_PWD_UPDATE",
    /**
     * 기관용 > 회원탈퇴
     */
    CENTER_WITHDRAWAL = "CENTER_WITHDRAWAL",
}

export default AuthCodeProcessEnum;
