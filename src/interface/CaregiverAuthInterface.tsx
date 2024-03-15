/**
 * Caregiver 인증 데이터에 대한 객체 정의
 * @interface CaregiverAuthInterface
 */

interface CaregiverAuthInterface {
    phoneNum: string;
    uuid: string;
    accessToken: string;
    hasDesiredWork: boolean;
    message?: string | null;
    signUp?: boolean;
}

export default CaregiverAuthInterface;
