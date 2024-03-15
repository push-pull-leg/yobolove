import AuthService from "./AuthService";
import EndpointEnum from "../enum/EndpointEnum";

/**
 * Client-Side 기관용 관련 서비스. 구직자 관련 UI independent 한 기능 수행.
 * 현재 UseCenterService 와 거의 비슷한 기능을 하고 있음. 현재는 {@link AuthService}이외에 따로 정의된 기능은 없음.
 * @category Service
 * @Center
 */
class CenterService extends AuthService {
    constructor() {
        super("CENTER", EndpointEnum.POST_CENTER_JWT_REFRESH);
    }
}

export default new CenterService();
