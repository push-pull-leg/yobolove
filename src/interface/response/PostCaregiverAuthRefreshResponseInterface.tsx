/**
 * jwt refresh response 입니다. jwt token이 만료되기 전에 해당 api를 호출해서 만료를 방지합니다.
 *
 * @interface
 */
import ResponseInterface from "./ResponseInterface";
import JwtTokenInterface from "../JwtTokenInterface";

export default interface PostCaregiverAuthRefreshResponseInterface extends ResponseInterface {
    data: JwtTokenInterface;
}
