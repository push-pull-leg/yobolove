/**
 * 임시대근 여부 Enum
 *
 * @category Enum
 * @enum
 */
const enum IsTemporaryEnum {
    true = "true",
    false = "false",
}

/**
 * @category EnumLabel
 */
export const IsTemporaryLabel: Map<IsTemporaryEnum, string> = new Map([
    [IsTemporaryEnum.true, "임시대근만"],
    [IsTemporaryEnum.false, "미포함"],
]);

export default IsTemporaryEnum;
