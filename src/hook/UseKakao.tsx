import UtmInterface from "../interface/UtmInterface";
import utmService from "../service/UtmService";
import UseAlert from "./UseAlert";
import EventUtil from "../util/EventUtil";

const KAKAO_SCRIPT_URL = "https://developers.kakao.com/sdk/js/kakao.js";
/**
 * 카카오 관련 Custom Hook
 * 스크립트를 미리 로딩하거나 로그인을 함
 * @category Hook
 * @Caregiver
 */
export default function UseKakao() {
    const { openAlert } = UseAlert();

    /**
     * 스크립트 dynamic load 함수.
     * ### 1. CSR 아니면 return
     * ### 2. {@link window.kakao} 가 이미 정의가 되어있으면 return;
     * ### 3. script 를 동적으로 생성한 후, onload 이벤트를 통해서 kakao init
     */
    const loadScript = () => {
        if (typeof window === "undefined" || !window) return;

        if (window.Kakao) return;

        const script = document.createElement("script");
        script.src = KAKAO_SCRIPT_URL;
        script.async = false;
        script.onload = () => window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_CLIENT_KEY);
        document.body.appendChild(script);
    };

    /**
     * 카카오 로그인
     */
    const login = async () => {
        if (typeof window === "undefined" || !window) return;

        loadScript();
        if (!window.Kakao?.Auth) {
            openAlert("카카오 로그인을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        try {
            const utm: UtmInterface = utmService.getAll();
            if (utm) {
                await fetch(`${window.location.origin}/api/caregivers/utm`, {
                    method: "POST",
                    mode: "same-origin",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(utm),
                });
            }
            // eslint-disable-next-line no-empty
        } catch (e) {
            console.log(e);
        }

        window.Kakao.Auth.authorize({
            redirectUri: `${window.location.origin}${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`,
            scope: "phone_number, plusfriends",
        });
        EventUtil.gtmEvent("click", "start", "login", "kakaotalk", "/시작하기");
    };

    return { login, loadScript };
}
