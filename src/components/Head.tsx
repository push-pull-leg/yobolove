import Head from "next/head";
import React from "react";

/**
 * {@link HeadMeta} props
 * @category PropsType
 */
export type HeadMetaDataType = {
    /**
     * 현재 URL
     */
    url?: string;
    /**
     * 페이지 Title
     */
    title?: string;
    /**
     * 페이지 description
     */
    description?: string;
    /**
     * 커스텀 JsonLD 데이터
     */
    productJsonLd?: string;
};

/**
 * SEO 를 위한 HEAD meta 데이터 컴포넌트
 *
 * @category Component
 */
function HeadMeta({ url, title, description, productJsonLd }: HeadMetaDataType) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="apple-mobile-web-app-title" content={title} />
            <link rel="canonical" href={url} />
            <link rel="alternate" hrefLang="ko" href={url} />
            {/* -- sns og tag --*/}
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {/* -- twitter og tag --*/}`
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:site" content={url} />
            {/* eslint-disable-next-line react/no-danger */}
            {productJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd }} key="product-jsonld" />}
        </Head>
    );
}

HeadMeta.defaultProps = {
    url: "https://yobolove.co.kr",
    title: "세상에서 가장 쉬운 요양보호사 일자리 찾기 요보사랑",
    description: "조건에 맞는 요양보호사 일자리만 무료로 보내주는 알림 서비스. 요양보호사구인구직. 요양사구인구직. 재가요양일자리.",
    productJsonLd: null,
};

export default HeadMeta;
