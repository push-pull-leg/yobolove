import MoveJobOffUnitEnum from "../enum/MoveJobOffUnitEnum";

type HolidayType = {
    /**
     * 종류
     */
    unit: MoveJobOffUnitEnum;
    /**
     * 횟수
     */
    days: number;
};

export default HolidayType;
