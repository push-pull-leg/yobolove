import EndpointInterface from "../interface/EndpointInterface";
import ServerEndpointEnum from "../enum/ServerEndpointEnum";

/**
 * URI 기본 prefix 값. 일반적으로 버전정보가 들어간다.
 */
const PREFIX = "api";

/**
 * 엔드포인트별 속성값.
 */
const ServerEndpointConfig: Map<ServerEndpointEnum, EndpointInterface> = new Map([
    [
        ServerEndpointEnum.POST_CAREGIVER_LOGIN,
        {
            uri: `/${PREFIX}/caregivers/login`,
            method: "POST",
        },
    ],
    [
        ServerEndpointEnum.POST_CENTER_LOGIN,
        {
            uri: `/${PREFIX}/centers/login`,
            method: "POST",
        },
    ],
    [
        ServerEndpointEnum.DELETE_CAREGIVER_LOGOUT,
        {
            uri: `/${PREFIX}/caregivers/logout`,
            method: "DELETE",
        },
    ],
    [
        ServerEndpointEnum.DELETE_CENTER_LOGOUT,
        {
            uri: `/${PREFIX}/centers/logout`,
            method: "DELETE",
        },
    ],
]);
export default ServerEndpointConfig;
