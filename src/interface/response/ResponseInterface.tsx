import MetaInterface from "./MetaInterface";
import BadResponseInterface from "./BadResponseInterface";
import ResponseHeaderInterface from "./ResponseHeaderInterface";

/**
 * 정상적인 http response 구조입니다.
 *
 * @param data data 에는 기본적인 데이터. 각 endpoint 마다 구조가 다 다릅니다. Generic 을 통해 타입 재정의를 해줍니다.
 * @param meta? pagination 등의 기타 정보가 들어있습니다.
 * @interface ResponseInterface
 */

export default interface ResponseInterface<T = any> extends BadResponseInterface {
    data: T;
    meta?: MetaInterface;
    headers?: ResponseHeaderInterface;
}
