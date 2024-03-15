/**
 * 문자인증 response 에 대한 interface
 * @interface AuthCodeInterface
 */

interface AuthCodeInterface {
    phoneNum: string;
    generatedCnt: number;
    maxGenerationCnt: number;
    attemptCnt: number;
    maxAttemptCnt: number;
    createAt: string;
    expireAt: string;
    notificationMessage: string;
}

export default AuthCodeInterface;
