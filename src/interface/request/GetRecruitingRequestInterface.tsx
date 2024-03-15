/**
 * 단일 구인 공고 조회 request 객체. uuid로 조회.
 *
 * @interface
 */

export default interface GetRecruitingRequestInterface {
    uuid: string;
    lotAddressName?: string;
}
