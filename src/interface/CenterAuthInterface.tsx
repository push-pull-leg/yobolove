/**
 * 센터 로그인 정보
 * @interface CenterAuthInterface
 */
export default interface CenterAuthInterface {
    accessToken: string;
    accountId: string;
    name: string;
    idNum: string;
    adminPhoneNum: string;
    adminEmail: string;
    message: string;
}
