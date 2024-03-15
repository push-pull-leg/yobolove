import AddressType from "../type/AddressType";
import GenderEnum from "../enum/GenderEnum";
import JobEnum from "../enum/JobEnum";
import { WorkTimeType } from "../type/WorkTimeType";

/**
 * 희망근무조건 데이터 구조
 * @category Main
 */
// TODO: [잘 동작하는지 확인] 이유: CaregiverDesiredWorkInterface 수정
interface CaregiverDesiredWorkInterface {
    /**
     * 요양보호사 주소
     */
    address?: AddressType;
    /**
     * 요양보호사 성별
     */
    gender?: GenderEnum;
    /**
     * 선호 수급자 성별
     */
    preferCareGender?: GenderEnum | null;
    /**
     * 최대 이동시간
     */
    possibleDistanceMinute?: number;
    /**
     * 희망 근무시간
     */
    desiredWorkTime?: WorkTimeType;
    /**
     * 희망 서비스 유형
     */
    caregiverDesiredJobSet?: JobEnum[];
    /**
     * 치매교육 이수여부
     */
    isCompleteDementia?: boolean;
    /**
     * 요양보호사 시험 통과 여부
     */
    isPassCareTest?: boolean;
    /**
     * 와상환자 케어가능 여부
     */
    isPossibleCareBedridden?: boolean;
}

export default CaregiverDesiredWorkInterface;
