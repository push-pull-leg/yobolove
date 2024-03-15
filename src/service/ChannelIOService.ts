export interface Settings {
    /**
     * ChannelIO 사이트에서 발급 받은 pluginKey
     */
    pluginKey: string;
    /**
     * 사용자의 아이디
     */
    memberId?: string;
    /**
     * 사용자의 프로필 정보
     *   name: 이름
     *   mobileNumber: 전화번호
     */
    profile?: {
        name?: string;
        mobileNumber?: string;
    };
}

class ChannelIOService {
    constructor() {
        this.loadScript();
    }

    // eslint-disable-next-line class-methods-use-this
    loadScript() {
        const w = window;
        if (w.ChannelIO) {
            return;
        }
        const ch = (...args: any[]) => {
            ch.c(args);
        };
        ch.q = [] as any[];
        ch.c = (args: any) => {
            ch.q.push(args);
        };
        w.ChannelIO = ch;

        function l() {
            if (w.ChannelIOInitialized) {
                return;
            }
            w.ChannelIOInitialized = true;
            const s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
            const x = document.getElementsByTagName("script")[0];
            if (x.parentNode) {
                x.parentNode.insertBefore(s, x);
            }
        }

        if (document.readyState === "complete") {
            l();
        } else {
            w.addEventListener("DOMContentLoaded", l);
            w.addEventListener("load", l);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    boot(settings: Settings, callbackFn?: (error: any, user: any) => void) {
        window.ChannelIO("boot", settings, callbackFn);
    }

    // eslint-disable-next-line class-methods-use-this
    shutdown() {
        window.ChannelIO("shutdown");
    }

    // eslint-disable-next-line class-methods-use-this
    addShowMessengerEventListener(eventListener: () => void) {
        window.ChannelIO("onShowMessenger", eventListener);
    }

    // eslint-disable-next-line class-methods-use-this
    removeAllEventListener() {
        window.ChannelIO("clearCallbacks");
    }
}

export default ChannelIOService;
