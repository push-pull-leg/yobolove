/**
 * 새로운 일자리 갯수
 *
 * @interface
 */
import ResponseInterface from "./ResponseInterface";

export default interface GetRecruitingNewCountResponseInterface extends ResponseInterface {
    data: {
        newCount: number;
    };
}
