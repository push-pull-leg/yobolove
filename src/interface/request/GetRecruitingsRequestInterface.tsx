/**
 * 희망근무조건 수정 api 입니다.
 *
 * @interface
 */

export default interface GetRecruitingsRequestInterface {
    address?: string;
    jobs?: string;
    isTemporary?: boolean;
    workTime?: string;
    nextToken?: string | null;
    prevToken?: string | null;
    size?: number;
    etc?: boolean;
}
