/**
 * 인증된 사용자 넘겨받음
 * @interface PagePropsInterface
 */
import SessionInterface from "./SessionInterface";

interface PagePropsInterface {
    caregiverSession?: SessionInterface;
}

export default PagePropsInterface;
