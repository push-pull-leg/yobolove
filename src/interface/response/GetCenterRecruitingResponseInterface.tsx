import ResponseInterface from "./ResponseInterface";
import RecruitingInterface from "../RecrutingInterface";

type UselessPropsType = "channels" | "distance" | "safetyNumber";

export interface GetCenterRecruitingResponseDataInterface extends Omit<RecruitingInterface, UselessPropsType> {}

export default interface GetCenterRecruitingResponseInterface extends ResponseInterface<GetCenterRecruitingResponseDataInterface> {}
