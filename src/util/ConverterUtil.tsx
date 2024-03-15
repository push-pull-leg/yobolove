import "dayjs/locale/ko";
import deepcopy from "deepcopy";
import AddressType from "../type/AddressType";
import { Base64SignType } from "../type/Base64ImageType";

const COMMA_REGEX = /\B(?=(\d{3})+(?!\d))/g;

/**
 * 타입 캐스팅, 필터링 등 데이터 구조 변경 관련 Util 입니다.
 * @category Util
 */
class ConverterUtil {
    /**
     * static class 는 직접 인스턴스화 불가능
     */
    private constructor() {
        throw new Error("cannot instantiate using a static class");
    }

    /**
     * URI path 로 기관용 서비스인지 판단
     * @param pathname URI pathname
     */
    public static isCenterPath(pathname?: string): boolean {
        if (!pathname) return false;

        return pathname.includes("/center") || pathname.includes("/기관") || pathname.includes("/%EA%B8%B0%EA%B4%80");
    }

    /**
     * Number 형변수를 세자리 단위마다 컴마가 있는 문자형으로 변환하는 method
     *
     * @example
     * ConverterUtil.toCommaString(1234567) // 1,234,567
     *
     * @param number
     * @return string
     */
    public static toCommaString(number: number): string {
        return number.toString().replace(COMMA_REGEX, ",");
    }

    /**
     * Map 에서 value 값으로 key 값을 가져오는 method. 없으면 undefined
     *
     * @param map 가준 Map
     * @param value 검색할 value 값
     */
    public static getKeyByValueOfMap<T = string>(map: Map<T, string>, value: string): T | undefined {
        let result;
        map.forEach((currentValue: string, key: T) => {
            if (currentValue === value) {
                result = key;
            }
        });
        return result;
    }

    /**
     * Map 을 key 기준으로 filtering 해주는 method.
     * @param map 기준 Map
     * @param funnel filtering 할 key array
     */
    public static filterMap<T = string>(map: Map<T, string>, funnel: T[]): Map<T, string> {
        const filteredMap = new Map<T, string>();
        map.forEach((value: string, key: T) => {
            if (funnel.includes(key)) {
                filteredMap.set(key, value);
            }
        });
        return filteredMap;
    }

    /**
     * 숫자를 Map<string, string> 형태로 변환 해주는 method.
     * @param startNumber 시작숫자
     * @param endNumber 종료숫자
     * @param prefix label 접두사
     * @param postfix label 접미사
     *
     * @example
     * ```typescript
     * ConverterUtil.getNumberMap(1, 2, "prefix", "postfix") // ["1": "prefix1postfix", "2": "prefix2postfix"]
     * ConverterUtil.getNumberMap(3, 6) // ["3": "3", "4": "4", "5": "5", "6": "6"]
     * ```
     */
    public static getNumberMap(startNumber: number, endNumber: number, prefix?: string, postfix?: string): Map<string, string> {
        const data = new Map<string, string>();
        for (let i = startNumber; i <= endNumber; i++) {
            if (prefix) {
                data.set(i.toString(), postfix ? `${prefix}${i}${postfix}` : `${prefix}${i}`);
            } else {
                data.set(i.toString(), postfix ? `${i}${postfix}` : `${i}`);
            }
        }
        return data;
    }

    /**
     * 프로덕트(요보사랑)의 version(package.json)에서 rc를 제거
     * @param version
     */
    public static convertVersionOfProduct(version: string) {
        return process.env.NODE_ENV === "production" ? version.split("-")[0] : version;
    }

    /**
     * 주소를 "서울특별시 강남구 역삼동" 형식으로 바꿔주는 메소드
     * @param address
     */
    public static convertSimpleAddress(address: AddressType, isIncludeRegionFirstDepth = true): string | undefined {
        if (!address) {
            return undefined;
        }
        return `${isIncludeRegionFirstDepth ? address.regionFirstDepth : ""} ${address.regionSecondDepth} ${address.regionThirdDepth}`.trim();
    }

    /**
     * 객체에서 불필요한 key와 value를 지워주는 함수
     * @param request
     * @param uselessProps
     */
    public static removeUselessProps = <T extends Record<string, any>>(request: T, uselessProps: (keyof T)[]) => {
        const copiedRequest = deepcopy(request);
        uselessProps.forEach(uselessProp => delete copiedRequest[uselessProp]);

        return copiedRequest;
    };

    /**
     * request에서 list에 있는 key와 일치하는 값만 가져와서 객체로 만들어주는 함수
     */
    public static bindPropsIntoObj = <T extends object, K extends Record<string, any>>(
        request: K,
        list: (keyof K)[],
        objName: string,
        isNull?: boolean,
    ): { [key: string]: T | null } => {
        if (isNull) return { [objName]: null };

        const result: T = list.reduce(
            (acc, key) => ({
                ...acc,
                [key]: request[key],
            }),
            {} as T,
        );

        return { [objName]: result };
    };

    public static isTargetSomeInArr = <T,>(targetArr: T[], comparedArr: T[]): boolean => targetArr.some(element => comparedArr.includes(element));

    /**
     * 서명 base64Type => File 변환하는 method
     * @param dataUrl
     * @param filename
     */
    public static convertToFile = (dataUrl: string, filename: string): null | File => {
        try {
            if (typeof window === "undefined") return undefined;
            const arrayData = dataUrl.split(",");
            const mimeType = arrayData?.[0].match(/:(.*?);/)?.[1];
            if (!mimeType) return null;
            const src = Buffer.from(arrayData[1], "base64").toString("binary");
            const { length } = src;
            const u8arr = new Uint8Array(length);
            for (let i = 0; i < length; i++) {
                u8arr[i] = src.charCodeAt(i);
            }
            const file = new File([u8arr], filename, { type: mimeType });
            if (!file) return null;
            return file;
        } catch (e) {
            console.error(e);
        }
        return null;
    };

    /**
     * 백엔드에서 받은 string 타입을 base64Type 변경해 서명 파일이 제대로 표시 되도록 함
     * @param data
     * @param imageType
     */
    public static toBase64SignType = (data: string, imageType: "png" | "jpeg" = "png"): Base64SignType => `data:image/${imageType};base64,${data}`;

    public static joinWithoutUndefined = (itemList: string[], joinText = " / "): string => itemList.filter(item => item !== undefined).join(joinText);

    public static isNumber(value: unknown): value is number {
        return Number.isFinite(value);
    }

    /**
     * enum 배열을 Label 배열로 변환 시켜주는 메소드
     */
    public static convertEnumToLabelValue = <TEnum, TLabelValue>(enumTarget: TEnum[], label: Map<TEnum, TLabelValue>): TLabelValue[] => enumTarget.map(eachEl => label.get(eachEl));

    /**
     * 개행문자 처리 메소드
     * @param paragraph
     */
    public static newLineToBr = (paragraph: string) => paragraph?.replace(/\n/g, "<br/>");
}

export default ConverterUtil;
