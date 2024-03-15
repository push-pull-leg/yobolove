import { GetServerSideProps } from "next";
import dayjs from "dayjs";
import HttpUtil from "../../util/HttpUtil";
import EndpointEnum from "../../enum/EndpointEnum";
import GetRecruitingsSiteMapResponseInterface from "../../interface/response/GetRecruitingsSiteMapResponsInterface";
import StaticSiteMapConfig from "../../config/StaticSiteMapConfig";
import RecruitingSiteMapInterface from "../../interface/RecruitingSiteMapInterface";

type SiteMapDataType = {
    loc: string;
    lastmod: string;
    priority: number;
    changefreq: string;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    let response: GetRecruitingsSiteMapResponseInterface;
    const siteMapData: SiteMapDataType[] = StaticSiteMapConfig.map<SiteMapDataType>(staticData => ({
        loc: staticData,
        lastmod: dayjs().format("YYYY-MM-DD"),
        priority: 0.7,
        changefreq: "daily",
    }));

    const buildSiteMapXml = (fields: SiteMapDataType[]): string => {
        const content = fields
            .map(fieldData => {
                const field = Object.entries(fieldData).map(([key, value]) => {
                    if (!value) return "";
                    return `<${key}>${value}</${key}>`;
                });

                return `<url>${field.join("")}</url>`;
            })
            .join("");

        return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${content}</urlset>`;
    };

    let recruitingData: RecruitingSiteMapInterface[] = [];
    try {
        response = await HttpUtil.request(EndpointEnum.GET_RECRUITINGS_SITEMAP, undefined, { "Accept-Encoding": "gzip" });
        if (!("error" in response)) {
            recruitingData = response.data;
        }
        // eslint-disable-next-line no-empty
    } catch (e) {}

    for (let i = 0; i < recruitingData.length; i += 1) {
        siteMapData.push({
            loc: `${process.env.NEXT_PUBLIC_SITE_URL}/요양보호사구인/${recruitingData[i].addressTitle.replaceAll(/[&<>"']/g, "")}/${recruitingData[i].uuid}`,
            lastmod: dayjs().format("YYYY-MM-DD"),
            priority: 0.7,
            changefreq: "daily",
        });
    }

    res.setHeader("Content-Type", "text/xml");
    res.write(buildSiteMapXml(siteMapData));
    res.end();
    return { props: {} };
};

// Default export to prevent next.js errors
// @ts-ignore
function SitemapXML() {
    return null;
}

export default SitemapXML;
