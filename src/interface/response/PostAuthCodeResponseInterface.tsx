/**
 * 문자인증 요청 api 에 대한 response 정의입니다.
 * 20220901 기준 아직 정의가 더 필요합니다.
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import AuthCodeInterface from "../AuthCodeInterface";

export default interface PostAuthCodeResponseInterface extends ResponseInterface {
    data: AuthCodeInterface;
}
