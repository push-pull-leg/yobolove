/**
 * 회원가입 api 에 대한 response 구조. 받은 jwtTokenInterface 로 jwt 를 업데이트한다.
 *
 * @param data JwtTokenInterface
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import CenterAuthInterface from "../CenterAuthInterface";

export default interface PostCenterSignupResponseInterface extends ResponseInterface {
    data: CenterAuthInterface;
}
