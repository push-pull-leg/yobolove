/**
 * jwt token 데이터에 대한 객체 정의
 * @interface JwtTokenInterface
 */

interface JwtTokenInterface {
    accessToken: string;
    hasDesiredWork?: boolean;
}

export default JwtTokenInterface;
