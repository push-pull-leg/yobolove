/**
 * 회원가입 api 에 대한 response 구조. 받은 jwtTokenInterface 로 jwt 를 업데이트한다.
 *
 * @param data JwtTokenInterface
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CaregiverDesiredWorkInterface from "../CaregiverDesiredWorkInterface";

// TODO: [잘 동작하는지 확인] 이유: CaregiverDesiredWorkInterface 수정
export default interface PostCaregiverDesiredWorkResponseInterface extends ResponseInterface {
    data: CaregiverDesiredWorkInterface;
}
