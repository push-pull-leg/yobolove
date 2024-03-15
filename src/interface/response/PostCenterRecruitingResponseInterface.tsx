/**
 * @param uuid uuid
 * @interface
 */
import ResponseInterface from "./ResponseInterface";

export interface PostCenterRecruitingResponseDataInterface {
    uuid: string;
}

export default interface PostCenterRecruitingResponseInterface extends ResponseInterface<PostCenterRecruitingResponseDataInterface> {}
