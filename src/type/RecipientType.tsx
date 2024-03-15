import GenderEnum from "../enum/GenderEnum";
import RecipientMotionStateEnum from "../enum/RecipientMotionStateEnum";
import RecipientCognitiveState from "../enum/RecipientCognitiveState";

interface RecipientType {
    /**
     * 성별
     */
    gender: GenderEnum;
    /**
     * 수급자 등급
     */
    grade: number;
    /**
     * 수급자 나이
     */
    age: number;
    /**
     * 어르신 거동 상태
     */
    motionState: RecipientMotionStateEnum;
    /**
     * [요보사랑] 어르신 인지 상태
     */
    cognitiveState: RecipientCognitiveState;
}

export default RecipientType;
