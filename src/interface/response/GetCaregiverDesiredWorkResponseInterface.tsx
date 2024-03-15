/**
 * 내 정보 api 에 대한 response 구조.
 *
 * @param data CaregiverDesiredWorkInterface
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CaregiverDesiredWorkInterface from "../CaregiverDesiredWorkInterface";

// TODO: [잘 동작하는지 확인] 이유: CaregiverDesiredWorkInterface 수정
export default interface GetCaregiverDesiredWorkResponseInterface extends ResponseInterface {
    data: CaregiverDesiredWorkInterface;
}
