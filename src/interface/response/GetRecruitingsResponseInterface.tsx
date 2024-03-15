/**
 * 구인공고 목록을 조회하는 api 응답입니다. data 에 실제 구인공고(recruiting) 정보가 있고, pagination 을 위해 meta 태그가 required 입니다.
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import MetaInterface from "./MetaInterface";
import RecruitingSimpleInterface from "../RecruitingSimpleInterface";

export default interface GetRecruitingResponseInterface extends ResponseInterface<RecruitingSimpleInterface[]> {
    data: RecruitingSimpleInterface[];
    meta: MetaInterface;
}
