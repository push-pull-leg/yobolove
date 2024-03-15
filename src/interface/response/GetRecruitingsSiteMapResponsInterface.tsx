/**
 * 사이트맵을 만들끼 위한구인공고 목록을 조회하는 api 응답입니다.
 * data 에 유효기간이 지나지 않은 실제 구인공고(recruiting)의 uuid, addressTitle 이 있고, pagination 을 위해 meta 태그가 required 입니다.
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import MetaInterface from "./MetaInterface";
import RecruitingSiteMapInterface from "../RecruitingSiteMapInterface";

export default interface GetRecruitingsSiteMapResponseInterface extends ResponseInterface<RecruitingSiteMapInterface[]> {
    data: RecruitingSiteMapInterface[];
    meta: MetaInterface;
}
