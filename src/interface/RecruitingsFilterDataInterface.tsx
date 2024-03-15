import AddressType from "../type/AddressType";
import JobEnum from "../enum/JobEnum";
import { WorkTimeType } from "../type/WorkTimeType";

/**
 * 구인공고 게시판 필터 데이터
 * @interface RecruitingsFilterDataInterface
 */

interface RecruitingsFilterDataInterface {
    address?: AddressType;
    jobs?: JobEnum[];
    isTemporary?: boolean;
    workTime?: WorkTimeType;
}

export default RecruitingsFilterDataInterface;
