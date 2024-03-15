import SessionInterface from "./src/interface/SessionInterface";
import UtmInterface from "./src/interface/UtmInterface";

declare module "iron-session" {
    interface IronSessionData {
        caregiver: SessionInterface | undefined;
        center: SessionInterface | undefined;
        utm: UtmInterface | undefined;
    }

    interface IncomingMessage {
        cookies: {};
    }
}

declare global {
    interface Window {
        Kakao: any;
        kakao: any;
        click: any;
        load: any;
        submit: any;
        change: any;
        select: any;
        dataLayer: Record<string, unknown>[];
        gtag: any;
        /**
         * 채널톡
         */
        ChannelIO: any;
        /**
         * 채널톡 초기화 여부. 채널톡 내부에서 사용함
         */
        ChannelIOInitialized: boolean;

        /**
         * GTM event action
         */
        [key: "click" | "change" | "submit" | "select"]: Function;
    }
}
