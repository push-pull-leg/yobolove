/**
 * 로그인 api 에 대한 response 구조. 받은 jwtTokenInterface 로 jwt 를 업데이트한다.
 *
 * @param data JwtTokenInterface
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import TermsInterface from "../TermsInterface";

export default interface GetCaregiverTermsResponseInterface extends ResponseInterface {
    data: TermsInterface[];
}
