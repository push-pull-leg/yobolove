/**
 * BadResponseInterface asd
 * @interface BadResponseInterface
 */
import ResponseErrorCodeEnum from "../../enum/ResponseErrorCodeEnum";

export default interface BadResponseInterface {
    error: {
        code: ResponseErrorCodeEnum;
        message: string;
    };
}
