import RecipientServiceLifeEnum from "../enum/RecipientServiceLifeEnum";
import RecipientServiceHomeEnum from "../enum/RecipientServiceHomeEnum";
import RecipientServiceCognitiveEnum from "../enum/RecipientServiceCognitiveEnum";
import RecipientServiceBodyEnum from "../enum/RecipientServiceBodyEnum";

interface RecipientServiceType {
    /**
     * 일상 지원(필요없을 경우 null)
     */
    lifeSet: RecipientServiceLifeEnum[];
    /**
     * 가사 지원(필요없을 경우 null)
     */
    homeSet: RecipientServiceHomeEnum[];
    /**
     * 인지활동 지원(필요없을 경우 null)
     */
    cognitiveSet: RecipientServiceCognitiveEnum[];
    /**
     * 신체활동 지원(필요없을 경우 null)
     */
    bodySet: RecipientServiceBodyEnum[];
}

export default RecipientServiceType;
