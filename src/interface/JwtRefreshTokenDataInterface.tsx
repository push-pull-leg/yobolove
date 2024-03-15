/**
 * jwt token 의 파싱된 데이터에 대한 값
 * @interface JwtRefreshTokenDataInterface
 */

interface JwtRefreshTokenDataInterface {
    /**
     * sub
     */
    sub: string;
    /**
     * issued at: 발급일시(ts)
     */
    iat: number;
    /**
     * expired at: 만료일시(ts)
     */
    exp: number;
}

export default JwtRefreshTokenDataInterface;
