import { Head, Html, Main, NextScript } from "next/document";
import React from "react";

const metaName = "요보사랑";
const cdnHost = "https://kslab.cdn.ntruss.com";
export default function Document() {
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";
    return (
        <Html lang="ko" translate="no">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preload" href={`${cdnHost}/tech/yobolove/assets/fonts/Pretendard-Regular.subset.woff2`} as="font" crossOrigin="true" />
                <link rel="preload" href={`${cdnHost}/tech/yobolove/assets/fonts/Pretendard-Medium.subset.woff2`} as="font" crossOrigin="true" />
                <link rel="stylesheet" href={`${cdnHost}/tech/yobolove/assets/css/pretendard-subset.css`} as="style" crossOrigin="true" />
                <link href="/manifest.json" rel="manifest" />
                <link href={`${cdnHost}/tech/yobolove/assets/images/favicon.ico`} rel="shortcut icon" sizes="64x64" type="image/png" />
                <link href={`${cdnHost}/tech/yobolove/assets/images/apple-icon-120x120.png`} rel="apple-touch-icon" sizes="120x120" type="image/png" />
                <link href={`${cdnHost}/tech/yobolove/assets/images/apple-icon-152x152.png`} rel="apple-touch-icon" sizes="152x152" type="image/png" />
                <link href={`${cdnHost}/tech/yobolove/assets/images/apple-icon-180x180.png`} rel="apple-touch-icon" sizes="180x180" type="image/png" />
                <meta name="naver-site-verification" content="52a9eba5488d1b778bc7f68ea91a690843285d2f" />
                <meta charSet="utf-8" />
                <meta name="Date" content="2022-00-00TO00:00:+09:00" />
                <meta name="author" content="요보사랑" />
                <meta name="copyright" content="한국시니어연구소" />
                <meta name="google" content="notranslate" />
                <meta content="#FFFFFF" name="theme-color" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta httpEquiv="Expires" content="-1" />
                <meta httpEquiv="Cache-Control" content="no-cache" />
                <meta httpEquiv="Copyright" content="한국시니어연구소" />
                <meta httpEquiv="Build" content="date" />
                <meta name="application-name" content={metaName} />

                <meta content="yes" name="apple-mobile-web-app-capable" />
                <meta
                    name="keywords"
                    content="요양보호사 구직, 요양보호사 취업, 요보사랑, 요양보호사 구인구직, 요양보호사 모집, 요양보호사 일자리, 요양보호사 구인, 요양사, 요양보호사, 요양보호사 취직, 요양사 일자리, 요보사"
                />
                {/* -- sns og tag --*/}
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="ko_KR" />
                <meta property="og:image" content={`${cdnHost}/tech/yobolove/assets/images/yobo-ogimage.png`} />
                <meta property="og:site_name" content={metaName} />
                {/* -- twitter og tag --*/}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:image" content={`${cdnHost}/tech/yobolove/assets/images/yobo-ogimage.png`} />
            </Head>
            <body>
                <noscript
                    dangerouslySetInnerHTML={{
                        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"/>`,
                    }}
                />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
