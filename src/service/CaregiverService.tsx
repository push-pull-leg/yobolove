import AuthService from "./AuthService";
import EndpointEnum from "../enum/EndpointEnum";

/**
 * Client-Side 구직자용 관련 서비스. 구직자 관련 UI independent 한 기능 수행.
 * 현재 UseCaregiverService 와 거의 비슷한 기능을 하고 있음. 현재는 {@link AuthService}이외에 따로 정의된 기능은 없음.
 * @category Service
 * @Caregiver
 */
class CaregiverService extends AuthService {
    constructor() {
        super("CAREGIVER", EndpointEnum.POST_CAREGIVER_JWT_REFRESH);
    }
}

export default new CaregiverService();
