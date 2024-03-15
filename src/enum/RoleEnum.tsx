/**
 * 사용자 역할 권한에 대한 Enum. 현재 사용하지는 않고 있다.
 *
 * @category Enum
 * @enum
 */
const enum RoleEnum {
    /**
     * 요양보호사 권한
     */
    ROLE_CAREGIVER = "ROLE_CAREGIVER",
    /**
     * 기관 권한
     */
    ROLE_CENTER = "ROLE_CENTER",
    /**
     * 관리자 권한
     */
    ROLE_ADMIN = "ROLE_ADMIN",
    /**
     * 게스트 권한
     */
    ROLE_GUEST = "ROLE_GUEST",
}

/**
 * @category EnumLabel
 */
export const RoleLabel: Map<RoleEnum, string> = new Map([
    [RoleEnum.ROLE_CAREGIVER, "요양보호사 권한"],
    [RoleEnum.ROLE_CENTER, "센터 권한"],
    [RoleEnum.ROLE_ADMIN, "관리자 권한"],
    [RoleEnum.ROLE_GUEST, "게스트 권한"],
]);

export default RoleEnum;
