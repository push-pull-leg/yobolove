/**
 * 인증 데이터에 대한 객체 정의
 * @interface AuthInterface
 */

interface AuthInterface {
    login(): void;

    logout(): void;
}

export default AuthInterface;
