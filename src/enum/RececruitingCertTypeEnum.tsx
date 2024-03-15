/**
 * 구인공고 인증 유형 Enum. 해당 구인공고가 최초 작성된 플랫폼이라고 생각하면 편하다.
 *
 * @category Enum
 * @enum
 */
const enum RecruitingCertTypeEnum {
    /**
     * 요보사랑 인증 공고
     */
    YOBOLOVE = "YOBOLOVE",
    /**
     * 워크넷 공고
     */
    WORKNET = "WORKNET",
    /**
     * 그 외 기타 공고
     */
    ETC = "ETC",
}

export default RecruitingCertTypeEnum;
