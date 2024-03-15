/**
 * @param data.accessToken jwt accessToken
 * @interface
 */
import ResponseInterface from "./ResponseInterface";

export default interface PostCenterAuthRefreshResponseInterface extends ResponseInterface {
    data: {
        accessToken: string;
    };
}
