/**
 * 단일 구인공고를 조회하는 api 응답입니다.
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import RecruitingInterface from "../RecrutingInterface";

type UselessPropsType = "channels" | "status" | "contactNumber";

export interface GetRecruitingResponseDataInterface extends Omit<RecruitingInterface, UselessPropsType> {}

export default interface GetRecruitingResponseInterface extends ResponseInterface<GetRecruitingResponseDataInterface> {}
