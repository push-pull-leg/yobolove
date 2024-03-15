/**
 * 와상환자 케어 가능 여부
 *
 * @category Enum
 * @enum
 */
const enum PossibleCareBedriddenEnum {
    /**
     * 가능
     */
    true = "true",
    /**
     * 불가능
     */
    false = "false",
}

/**
 * @category EnumLabel
 */
export const PossibleCareBedriddenLabel: Map<PossibleCareBedriddenEnum, string> = new Map([
    [PossibleCareBedriddenEnum.true, "가능"],
    [PossibleCareBedriddenEnum.false, "불가능"],
]);

export default PossibleCareBedriddenEnum;
