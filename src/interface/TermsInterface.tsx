/**
 * 이용약관 Interface
 * @category Main
 */
interface TermsInterface {
    /**
     * 이용약관 제목
     */
    title: string;
    /**
     * 설명
     */
    description: string;
    /**
     * 활용동의 상세설명
     */
    subTitle: string;
    /**
     * 이용약관 링크
     */
    url: string;
    /**
     * 이용약관 버전
     */
    version: string;
    /**
     * 이용약관 uuid
     */
    uuid: string;
    /**
     * 이용약관 활성화 여부(항상 true)
     */
    active: boolean;
    /**
     * 이용약관 필수/선택여부
     */
    required: boolean;
}

export default TermsInterface;
