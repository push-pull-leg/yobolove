const Dotenv = require("dotenv-webpack");
const withPWA = require("next-pwa");
const TerserPlugin = require("terser-webpack-plugin");
const { withSentryConfig } = require("@sentry/nextjs");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const nextConfig = {
    sentry: {
        hideSourceMaps: true,
    },
    /**
     * 기존 요보사랑 주소 redirect
     */
    async redirects() {
        return [
            {
                source: "/applyform",
                destination: "/",
                permanent: true,
            },
            {
                source: "/privacy",
                destination: "/",
                permanent: true,
            },
            {
                source: "/modify",
                destination: "/",
                permanent: true,
            },
        ];
    },

    /**
     * seo 를 위한 한글주소 rewrite mapping
     */
    async rewrites() {
        return [
            {
                source: `/${encodeURI("런칭이벤트")}`,
                destination: "/event/launch-event",
            },
            {
                source: `/${encodeURI("게시판")}`,
                destination: "/recruitings",
            },
            {
                source: `/${encodeURI("요양보호사구인")}/:to/:uuid*`,
                destination: "/recruitings/:uuid*?to=:to",
            },
            {
                source: `/${encodeURI("시작하기")}`,
                destination: "/login",
            },
            {
                source: `/${encodeURI("휴대폰로그인")}`,
                destination: "/login-by-phone",
            },
            {
                source: `/${encodeURI("회원가입")}`,
                destination: "/signup",
            },
            {
                source: `/${encodeURI("내정보")}`,
                destination: "/account",
            },
            {
                source: `/${encodeURI("내정보")}/${encodeURI("맞춤일자리알림")}`,
                destination: "/account/notification",
            },
            {
                source: `/${encodeURI("내정보")}/${encodeURI("희망근무조건")}`,
                destination: "/account/desired-work",
            },
            {
                source: `/${encodeURI("기관")}`,
                destination: "/center",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("로그인")}`,
                destination: "/center/login",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("가입신청")}`,
                destination: "/center/signup",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("계정찾기")}`,
                destination: "/center/find",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("아이디찾기")}`,
                destination: "/center/find-id",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("비밀번호찾기")}`,
                destination: "/center/find-password",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("계정정보")}`,
                destination: "/center/account",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("계정정보")}/${encodeURI("비밀번호변경")}`,
                destination: "/center/account/update-password",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("계정정보")}/${encodeURI("기관정보")}`,
                destination: "/center/account/info-center",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("계정정보")}/${encodeURI("채용담당자연락처")}`,
                destination: "/center/account/contacts",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("나의공고")}`,
                destination: "/center/recruitings",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("구인공고등록")}`,
                destination: "/center/recruitings/create",
            },
            {
                source: `/${encodeURI("구인공고등록")}/${encodeURI("추가정보")}`,
                destination: "/center/recruitings/onetouch-info",
            },
            {
                source: `/${encodeURI("공고등록")}/${encodeURI("채널선택")}`,
                destination: "/center/recruitings/onetouch-channel",
            },
            {
                source: `/${encodeURI("구인공고등록")}/${encodeURI("추가정보")}`,
                destination: "/center/recruitings/onetouch-info",
            },
            {
                source: `/${encodeURI("구인공고등록")}/${encodeURI("최종확인")}`,
                destination: "/center/recruitings/confirm",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("계정정보")}/${encodeURI("기관전화번호")}`,
                destination: "/center/account/info-contact",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("나의공고")}/:uuid/${encodeURI("공고수정")}`,
                destination: "/center/recruitings/:uuid/edit",
            },
            {
                source: `/${encodeURI("기관")}/${encodeURI("나의공고")}/:uuid/${encodeURI("공고재등록")}`,
                destination: "/center/recruitings/:uuid/repost",
            },
        ];
    },
    pwa: {
        dest: "public",
        disable: process.env.NODE_ENV !== "production",
        register: true,
    },
    /**
     * reactStrictMode true 의 경우 rendering 을 2번씩 합니다.
     */
    reactStrictMode: false,
    /**
     * SSG, SSR 을 사용하기 위한 serverless 옵션
     */
    serverless: true,
    /**
     * prod 배포시에 source mag 을 보여주지 않습니다.
     */
    productionBrowserSourceMaps: false,
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
    httpAgentOptions: {
        keepAlive: true,
    },
    images: {
        domains: ["kslab.cdn.ntruss.com"],
    },
    pageExtensions: ["ts", "tsx", "js", "jsx"],
    swcMinify: false,
    webpack: (config, { dev, isServer }) => {
        /**
         * dotenv 를 기본적으로 로드합니다.
         */
        config.plugins.push(new Dotenv());
        if (isServer && !dev) {
            // eslint-disable-next-line no-param-reassign
            config.optimization = {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        parallel: true,
                        terserOptions: {
                            output: { comments: false },
                            mangle: true,
                            compress: true,
                            sourceMap: false,
                        },
                        extractComments: false,
                    }),
                ],
            };
        }
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
};
const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withBundleAnalyzer(withPWA(withSentryConfig(nextConfig, sentryWebpackPluginOptions)));
