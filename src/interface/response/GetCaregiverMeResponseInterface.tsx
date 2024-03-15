/**
 * 내 정보 api 에 대한 response 구조.
 *
 * @param data CaregiverInformationInterface
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CaregiverInformationInterface from "../CaregiverInformationInterface";

export default interface GetCaregiverMeResponseInterface extends ResponseInterface {
    data: CaregiverInformationInterface;
}
