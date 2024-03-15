import "../styles/global.scss";
import "@mobiscroll/react/dist/css/mobiscroll.react.scss";
import { AppContext, AppProps } from "next/app";
import { MutableSnapshot, RecoilRoot } from "recoil";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import ConverterUtil from "../util/ConverterUtil";
import Layout from "../components/Layout";
import PACKAGE from "../../package.json";
import SessionInterface from "../interface/SessionInterface";
import CaregiverService from "../service/CaregiverService";
import { caregiverRecoilState, CaregiverRecoilType, defaultCaregiverRecoilStateInterface } from "../recoil/CaregiverRecoil";
import CaregiverAuthService from "../server/CaregiverAuthService";
import CenterAuthService from "../server/CenterAuthService";
import CenterService from "../service/CenterService";
import { centerRecoilState, defaultCenterRecoilStateInterface } from "../recoil/CenterRecoil";
import UtmService from "../service/UtmService";
import UseChannelIO from "../hook/UseChannelIO";
import EventUtil from "../util/EventUtil";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    import("../mocks");
}

console.info(`%c${PACKAGE.name} v${ConverterUtil.convertVersionOfProduct(PACKAGE.version)} ${process.env.NODE_ENV}`, "font-size:24px;font-weight:100;color:royalblue");

interface AuthAppProps extends AppProps {
    caregiverSession?: SessionInterface;
    centerSession?: SessionInterface;
    errorMessage?: string;
}

/**
 * 메인 렌더링 화면입니다. global provider, consumer 등을 여기에 설정해주세요
 * @function
 *
 * @param props AppProps
 *
 * @return ReactElement
 */

let initializeCaregiver = false;
let initializeCenter = false;

function App({ Component, pageProps, caregiverSession, centerSession }: AuthAppProps) {
    const router = useRouter();
    const { boot, shutdown, addShowMessengerEventListener, removeAllEventListener } = UseChannelIO({
        pluginKey: process.env.NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY || "",
    });

    if (process.env.NODE_ENV !== "production") console.log("APP INITIAL", caregiverSession, centerSession);

    if (!initializeCaregiver && caregiverSession) {
        if (process.env.NODE_ENV !== "production") console.log("APP INITIALIZE caregiver 2", caregiverSession);
        CaregiverService.login(caregiverSession.accessToken, caregiverSession.refreshToken, true);
        initializeCaregiver = true;
    }

    if (!initializeCenter && centerSession) {
        if (process.env.NODE_ENV !== "production") console.log("APP INITIALIZE center 2", centerSession);
        CenterService.login(centerSession.accessToken, centerSession.refreshToken);
        initializeCenter = true;
    }

    useEffect(() => {
        /**
         * utm 저장
         */
        // if (router) {
        //     UtmService.setFromQuery(router.query);
        // }
        const handleRouteChange = (url?: string) => {
            if (typeof window !== "undefined" && window.gtag) {
                window.gtag("config", process.env.NEXT_PUBLIC_GA4_ID, {
                    page_path: url,
                });
            }
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        router.events.on("hashChangeComplete", handleRouteChange);
        // 채널톡 시작
        boot();
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
            router.events.off("hashChangeComplete", handleRouteChange);
            // 채널톡 종료
            shutdown();
        };
    }, []);

    useEffect(() => {
        if (router.query) {
            if (router.query !== UtmService.getAll()) {
                UtmService.setFromQuery(router.query);
            }
        }
        // 채널톡, 아이콘 클릭 이벤트 전송
        addShowMessengerEventListener(() => {
            EventUtil.gtmEvent("click", "channeltalk", router.pathname, "");
        });
        return () => {
            removeAllEventListener();
        };
    }, [router.pathname]);

    const initializeState = (snapshot: MutableSnapshot): void => {
        let caregiverRecoilData: CaregiverRecoilType;
        if (caregiverSession) {
            caregiverRecoilData = {
                tokenData: caregiverSession.accessTokenData,
                auth: {
                    phoneNum: "",
                    uuid: "",
                    accessToken: "",
                    hasDesiredWork: Boolean(caregiverSession.hasDesiredWork),
                    message: undefined,
                },
            };
        } else {
            caregiverRecoilData = defaultCaregiverRecoilStateInterface;
        }
        snapshot.set(caregiverRecoilState, caregiverRecoilData);
        snapshot.set(centerRecoilState, centerSession ? centerSession.accessTokenData : defaultCenterRecoilStateInterface);
    };

    return (
        <>
            <Head>
                <script
                    id="head-script-for-gtm-userid"
                    dangerouslySetInnerHTML={{
                        __html: `import("https://openfpcdn.io/fingerprintjs/v3").then(e=>e.load()).then(e=>e.get()).then(e=>{window.userId=e.visitorId,function(e,t,n,a,r){e[a]=e[a]||[],e[a].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var s=t.getElementsByTagName(n)[0],g=t.createElement(n);g.async=!0,g.src="https://www.googletagmanager.com/gtm.js?id="+r+("dataLayer"!=a?"&l="+a:""),s.parentNode.insertBefore(g,s)}(window,document,"script","dataLayer","${process.env.NEXT_PUBLIC_GTM_ID}")});`,
                    }}
                />
            </Head>
            <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","${process.env.NEXT_PUBLIC_GA4_ID}",{page_path:window.location.pathname});`,
                }}
            />
            <RecoilRoot initializeState={initializeState} override>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </RecoilRoot>
        </>
    );
}

App.getInitialProps = async (context: AppContext) => {
    if (!context?.ctx?.req?.url) {
        return {};
    }
    const caregiverSession: SessionInterface | undefined = await CaregiverAuthService.getAuthorizedSession(context);
    const centerSession: SessionInterface | undefined = await CenterAuthService.getAuthorizedSession(context);
    return { caregiverSession, centerSession };
};

App.defaultProps = {
    caregiverSession: undefined,
    centerSession: undefined,
    errorMessage: undefined,
};

export default App;
