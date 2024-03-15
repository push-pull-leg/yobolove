import JobEnum from "../enum/JobEnum";
import GenderEnum from "../enum/GenderEnum";
import PayTypeEnum from "../enum/PayTypeEnum";
import AddressType from "../type/AddressType";
import { WorkTimeType } from "../type/WorkTimeType";
import RecruitingStatusEnum from "../enum/RecruitingStatusEnum";
import RecruitingCertTypeEnum from "../enum/RececruitingCertTypeEnum";
import RecipientServiceType from "../type/RecipientServiceType";
import RecipientType from "../type/RecipientType";
import HolidayType from "../type/HolidayType";
import SelectedChannelsAPIType from "../type/SelectedChannelsAPIType";

/**
 * V2 API spec에서 구인공고에 관련하여 사용되는 Interface
 * @category Main
 */
export default interface RecruitingInterface {
    /**
     * 고유 아이디
     */
    uuid: string;
    /**
     * 구인공고 게시 주체
     */
    certType: RecruitingCertTypeEnum;
    /**
     * 근무 유형
     */
    job: JobEnum;
    /**
     * 급여 유형
     */
    payType: PayTypeEnum;
    /**
     * 급여 액수
     */
    pay: number;
    /**
     * [요보사랑] 선호 요양보호사 성별(남녀 상관없을 경우 null)
     */
    preferCaregiverGender: GenderEnum | null;
    /**
     * 임시 대근 여부
     */
    isTemporary: boolean;
    /**
     * 수급자 주소 데이터
     */
    address: AddressType;
    /**
     * 근무 시간관련 데이터
     */
    workTime: WorkTimeType | null;
    /**
     * 휴무일
     */
    holiday?: HolidayType;
    /**
     * 수급자
     */
    recipient?: RecipientType;
    /**
     * 어르신 필요 서비스
     */
    recipientService?: RecipientServiceType;
    /**
     * 수급자 메모
     */
    memo: string | null;
    /**
     * 등록일(YYYY-MM-DD)
     */
    openedDate: string;
    /**
     * 마감일자 / 만료일(YYYY-MM-DD)
     */
    expiredDate: string;
    /**
     * 실제 기관번호
     */
    contactNumber: string | null;
    /**
     * 채널
     */
    channels: SelectedChannelsAPIType;
    /**
     * 구인공고 상태
     */
    status: RecruitingStatusEnum;
    /**
     * 출발주소(from)을 넣고 구인공고를 조회했을 때, 해당주소로 부터 해당 공고까지의 m 단위의 거리
     */
    distance: number;
    /**
     * 워크넷 authNo
     */
    authNo?: string;
    /**
     * 워크넷 공고 url
     */
    infoUrl?: string;
    /**
     * 워크넷 공고 모바일 url
     */
    mobileInfoUrl?: string;

    /**
     * 기관 안심번호
     */
    safetyNumber: string;
    /**
     * 공고 게시 센터명
     */
    centerName: string | null;
    /**
     * 상세주소
     */
    addressDetail?: string;
}
