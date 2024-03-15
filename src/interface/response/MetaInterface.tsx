/**
 * response 의 보조데이터인 meta에 대한 interface
 * @interface MetaInterface
 */
interface MetaInterface {
    /**
     * 다음 페이지 토큰
     */
    nextToken: string;
    /**
     * 이전 페이지 토큰
     */
    prevToken: string;
}

export default MetaInterface;
