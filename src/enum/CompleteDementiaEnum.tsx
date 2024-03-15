/**
 * 치매교육 이수 여부 Enum
 *
 * @category Enum
 * @enum
 */
const enum CompleteDementiaEnum {
    true = "true",
    false = "false",
}

/**
 * @category EnumLabel
 */
export const CompleteDementiaLabel: Map<CompleteDementiaEnum, string> = new Map([
    [CompleteDementiaEnum.true, "이수"],
    [CompleteDementiaEnum.false, "미이수"],
]);

export default CompleteDementiaEnum;
