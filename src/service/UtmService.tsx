import { toCamel } from "snake-camel";
import UtmInterface, { UtmKeys } from "../interface/UtmInterface";

/**
 * Utm 을 관리하는 서비스. Utm 값을 저장하고, 가져오는등의 역할을 한다.
 * 기본정의가 페이지가 새로고침되거나 페이지가 종료되면 삭제되어야 되기 때문에 페이지가 살아있을 때만 사용하는 {@link sessionStorage} 를 사용한다.
 * @category Service
 */
class UtmService {
    /**
     * {@link UtmInterface} 에 있는 값들을 키로 해서 데이터를 저장함.
     * @private
     */
    private data: Map<keyof UtmInterface, string> = new Map<keyof UtmInterface, string>();

    private initialQuery: Partial<UtmInterface> = {};

    /**
     * 초기에 sessionStorage 가 사용가능하다면, sessionStorage 에 있는값을 메모리로 올려둔다.
     */
    constructor() {
        if (typeof window !== "undefined" && window.sessionStorage) {
            UtmKeys.forEach(utmKey => {
                const sessionData = window.sessionStorage.getItem(utmKey);
                if (sessionData) {
                    this.data.set(utmKey, sessionData);
                }
            });
        }
    }

    /**
     * 현재 쿼리값을 세션에 저장
     * @param query
     */

    public setFromQuery(query: object) {
        const camelQuery: { [key: string]: any } = toCamel({ ...query, ...this.initialQuery });
        UtmKeys.forEach(utmKey => {
            if (utmKey in camelQuery && camelQuery[utmKey]) {
                this.set(utmKey, camelQuery[utmKey].toString());
            }
        });
    }

    /**
     * data 에 있는 값을 UtmInterface 형식으로 변환해서 가져옴.
     */
    public getAll(): UtmInterface {
        return Object.fromEntries(this.data);
    }

    public get(key: keyof UtmInterface): string | undefined {
        return this.data.get(key);
    }

    /**
     * utm 값 저장하기.
     * @param key
     * @param value
     */
    public set(key: keyof UtmInterface, value: string) {
        this.data.set(key, value);
        if (typeof window !== "undefined" && window.sessionStorage) sessionStorage.setItem(key, value);
    }

    public remove(key: keyof UtmInterface) {
        this.data.delete(key);
        if (typeof window !== "undefined" && window.sessionStorage) sessionStorage.removeItem(key);
    }

    public setInitialQuery(query: Partial<UtmInterface>) {
        this.initialQuery = query;
    }
}

export default new UtmService();
