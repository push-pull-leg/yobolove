/**
 * jwt token 의 파싱된 데이터에 대한 값
 * @interface JwtAccessTokenDataInterface
 */
import RoleEnum from "../enum/RoleEnum";

interface JwtAccessTokenDataInterface {
    /**
     * 요양보호사는 핸드폰번호, 기관인 경우 accountId 가 됨.
     */
    sub: string;
    /**
     * 요양보호사 / 기관 uuid
     */
    uuid?: string;
    /**
     * role enum
     */
    role: RoleEnum;
    /**
     * issued at: 발급일시(ts)
     */
    iat: number;
    /**
     * expired at: 만료일시(ts)
     */
    exp: number;
}

export default JwtAccessTokenDataInterface;
