/**
 * 서비스(급여) 유형 Enum
 *
 * @category Enum
 * @enum
 */
const enum JobEnum {
    /**
     * 방문요양
     */
    VISIT_CARE = "VISIT_CARE",
    /**
     * 입주요양
     */
    HOME_CARE = "HOME_CARE",
    /**
     * 시설요양
     */
    FACILITY = "FACILITY",
    /**
     * 방문목욕
     */
    VISIT_BATH = "VISIT_BATH",
    /**
     * 주야간 보호
     */
    DAY_AND_NIGHT = "DAY_AND_NIGHT",
}

/**
 * 일반적으로 사용
 * @category EnumLabel
 */
export const JobLabel: Map<JobEnum, string> = new Map([
    [JobEnum.VISIT_CARE, "방문요양"],
    [JobEnum.HOME_CARE, "입주요양"],
    [JobEnum.VISIT_BATH, "방문목욕"],
    [JobEnum.FACILITY, "시설요양"],
    [JobEnum.DAY_AND_NIGHT, "주야간보호"],
]);

/**
 * 근무조건 필터에서 사용
 * @category EnumLabel
 */
export const JobFilterLabel: Map<JobEnum, string> = new Map([
    [JobEnum.VISIT_CARE, "방문요양"],
    [JobEnum.HOME_CARE, "입주요양"],
    [JobEnum.VISIT_BATH, "방문목욕"],
    [JobEnum.FACILITY, "시설요양"],
    [JobEnum.DAY_AND_NIGHT, "주야간보호"],
]);

/**
 * 구인게시판 카드, 구인상세에서 사용
 * @category EnumLabel
 */
export const JobCategoryLabel: Map<JobEnum, string> = new Map([
    [JobEnum.VISIT_CARE, "방문요양"],
    [JobEnum.HOME_CARE, "입주요양"],
    [JobEnum.VISIT_BATH, "방문목욕"],
    [JobEnum.FACILITY, "시설요양"],
    [JobEnum.DAY_AND_NIGHT, "주야간"],
]);
export const JobSummaryLabel: Map<JobEnum, string> = new Map([
    [JobEnum.VISIT_CARE, "방문"],
    [JobEnum.HOME_CARE, "입주"],
    [JobEnum.VISIT_BATH, "목욕"],
    [JobEnum.FACILITY, "시설"],
    [JobEnum.DAY_AND_NIGHT, "주야간"],
]);

/**
 * getSubTitle 사용
 */
export const JobSubTitle: Map<JobEnum, string> = new Map([
    [JobEnum.FACILITY, "시설 어르신 돌봄"],
    [JobEnum.DAY_AND_NIGHT, "주야간보호센터 어르신 돌봄"],
]);

export default JobEnum;
