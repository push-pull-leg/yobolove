import "dayjs/locale/ko";
import isbot from "isbot";

/**
 * 네이버 검색봇: Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/spd)
 * 네이버 앱: Mozilla/5.0 (Linux; Android 12; SM-S906N Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/90.0.4430.232 Whale/1.0.0.0 Crosswalk/26.90.3.26 Mobile Safari/537.36 NAVER(inapp; search; 1010; 11.15.2)
 */

const BOT_EXCLUDE_PATTERN: RegExp[] = [/Whale/];

/**
 * 분류가 어려운 유틸 메소드
 * @category Util
 */
class CommonUtil {
    /**
     * static class 는 직접 인스턴스화 불가능
     */
    private constructor() {
        throw new Error("cannot instantiate using a static class");
    }

    /**
     * 봇인지 판단하는 method. {@link BOT_EXCLUDE_PATTERN} : 직접 user agent 에서 bot false 설정
     * @param userAgent user agent
     */
    public static isBot(userAgent?: string): boolean {
        if (!userAgent) return false;

        for (let i = 0; i < BOT_EXCLUDE_PATTERN.length; i++) {
            if (BOT_EXCLUDE_PATTERN[i].test(userAgent)) {
                return false;
            }
        }

        return isbot(userAgent);
    }
}

export default CommonUtil;
