/**
 * @param nextToken 다음페이지 토큰
 * @param prevToken 이전페이지 토큰
 * @param size 한페이지당 게시글 갯수
 * @interface
 */

export default interface GetCenterRecruitingsSimpleRequestInterface {
    nextToken?: string | null;
    prevToken?: string | null;
    size?: number;
}
