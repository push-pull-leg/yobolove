class AddressUtil {
    /**
     * 괄호와 괄호 안의 문자들을 삭제
     * @param text
     */
    public static removeWordsWithBrackets(text: string): string {
        return text.replace(/\(([^)]+)\)/, "").trimEnd();
    }

    /**
     * URLString 형태로 변경된 주소를 다시 api 요청에 맞게 변환
     * @param text
     */
    public static toAddressFromURLString(text: string): string {
        const words = text.split("-");
        let address = "";
        for (let i = 0; i < words.length; i++) {
            if (Number(words[i]) && i !== words.length - 1) {
                address += `${words[i]}-`;
            } else address += `${words[i]} `;
        }
        return address;
    }
}

export default AddressUtil;
