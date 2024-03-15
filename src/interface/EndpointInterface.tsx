import { Method } from "axios";

/**
 * REST API 엔드포인트 Interface
 * @interface EndpointInterface
 */
interface EndpointInterface {
    /**
     * 도메인 이후의 URI 정보
     */
    uri: string;
    /**
     * Http Method. GET/POST/PUT/DELETE/PATCH
     */
    method: Method;
    /**
     * showLoading : 로딩 보여줄지 여부
     */
    showLoading?: boolean;
    /**
     * showMessage : 메세지를 보여줄지 여부
     */
    showMessage?: boolean;
    /**
     * contentType
     */
    contentType?: string;
}

export default EndpointInterface;
