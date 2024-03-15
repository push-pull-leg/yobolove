class StorageUtil {
    public static setItem = <T>(keyName: string, value: T) => {
        sessionStorage.setItem(keyName, JSON.stringify(value));
    };

    public static getItem = <T>(keyName: string): T => {
        const value = sessionStorage.getItem(keyName);
        return value && JSON.parse(value);
    };

    /**
     * keyName이 단일 string이면 하나만 삭제
     *
     * keyName이 배열이면 배열을 돌며 배열안에 있는 key 값들을 삭제
     * @param keyName
     */
    public static removeItem = (keyName: string | string[]) => {
        if (typeof keyName !== "object") {
            sessionStorage.removeItem(keyName);
        } else {
            keyName.forEach(key => sessionStorage.removeItem(key));
        }
    };
}

export default StorageUtil;
