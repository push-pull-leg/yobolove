import AddressType from "../type/AddressType";
import { Base64SignType } from "../type/Base64ImageType";
import SeverancePayTypeEnum from "../enum/SeverancePayTypeEnum";

export default interface CenterMoreInfoInterface {
    /**
     * 기관 대표자 이름
     */
    adminName: string;
    /**
     * 구인 담당자 이름
     */
    recruiterName: string;
    /**
     * 기관 주소
     */
    address: AddressType;
    /**
     * 기관 근로자 수
     */
    workerCount: number;
    /**
     * 퇴직 급여 형태
     */
    severancePayType: SeverancePayTypeEnum;
    /**
     * 상세 주소
     */
    addressDetail?: string;
    /**
     * 서명
     */
    recruiterSignatureFile?: Base64SignType;
}
