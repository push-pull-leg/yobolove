type AddressType = {
    /**
     * 지번주소
     */
    lotAddressName: string;
    /**
     * 도로명 주소
     */
    roadAddressName?: string;
    /**
     * 상세 주소
     */
    addressDetail?: string;
    /**
     * 도/시 이름
     */
    regionFirstDepth?: string;
    /**
     * 군/구 이름
     */
    regionSecondDepth?: string;
    /**
     * 법정동 명칭
     */
    regionThirdDepth?: string;
    /**
     * 행정동 명칭
     */
    regionAdminThirdDepth?: string;
    /**
     * 위도
     */
    lat?: number;
    /**
     * 경도
     */
    lng?: number;
    /**
     * 우편번호
     */
    zipCode?: string;
};

export default AddressType;
