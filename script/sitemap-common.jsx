const fs = require("fs");

// eslint-disable-next-line import/no-extraneous-dependencies
const prettier = require("prettier");

// eslint-disable-next-line import/no-extraneous-dependencies
const kebabCase = require("kebab-case");

const getDate = new Date().toISOString();

const DOMAIN = "https://dev.kslab.team";

const formatted = sitemap => prettier.format(sitemap, { parser: "html" });

(async () => {
    const { globbySync } = await import("globby");
    const pages = globbySync([
        // include
        "./src/pages/**/*.tsx",
        "./src/pages/*.tsx", // exclude
        "!./src/pages/_*.tsx",
        "!./src/components/*.tsx",
        "!./src/components/**/*.tsx",
    ]);

    const pagesSitemap = `
    ${pages
        .map(page => {
            const path = page
                .replace("./src/pages/", "")
                .replace(".tsx", "")
                .replace(/\/index/g, "");
            let routePath = path === "index" ? "" : path;
            const tmp = kebabCase(routePath).split("/");
            if (tmp.length > 1) {
                routePath = tmp
                    .map(tag => {
                        if (tag.substring(0, 1) === "-") {
                            return tag.substring(1);
                        }
                        return tag;
                    })
                    .join("/");
            }
            return `
          <url>
            <loc>${DOMAIN}/${routePath}</loc>
            <lastmod>${getDate}</lastmod>
          </url>
        `;
        })
        .join("")}
  `;

    const generatedSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
      ${pagesSitemap}
    </urlset>
  `;

    const formattedSitemap = [formatted(generatedSitemap)];
    fs.writeFileSync("./public/sitemap-options.xml", formattedSitemap[0], "utf8");
})();
