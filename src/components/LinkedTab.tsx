import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Tab, Tabs, Typography } from "@mui/material";
import { css } from "@emotion/css";
import { MenuType } from "../type/MenuType";
import { toRemWithUnit } from "../styles/options/Function";
import { palette } from "../styles/options";

const linkedAStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: inherit;
    width: 100%;
`;

const tabsStyle = css`
    gap: ${toRemWithUnit(4)};
`;

/**
 * 선택된 Tab컴포넌트 value의 타입
 * - false라면, 어떤 탭도 선택되지 않은 것
 * */
type TabIndexType = number | false;
/**
 * Tab 컴포넌트들의 속성
 */
type LinkedTabPropsType = {
    items: MenuType[];
};

/**
 * 탭 (Nextjs의 Link 컴포넌트와 a태그로 구성)
 *
 * [피그마 시안] https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%5B%ED%94%84%EB%A1%9C%EB%8D%95%ED%8A%B8%5D%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1989%3A100569&t=fOGnsOoWxNurWTal-0
 * @category Component
 * */
function LinkedTab({ items }: LinkedTabPropsType) {
    const { asPath, pathname } = useRouter();

    const selectedTabIndex: TabIndexType = useMemo(() => items.findIndex(({ as, href }) => decodeURI(asPath).includes(as) || pathname.includes(href)) + 1 || false, [pathname]);

    return (
        <Tabs value={selectedTabIndex} aria-label="linked tabs" classes={{ flexContainer: tabsStyle }} TabIndicatorProps={{ sx: { height: 3 } }}>
            {items.map(({ href, title, as, onClick }, idx) => (
                <Tab
                    key={title}
                    label={
                        <Link href={href} as={as} passHref>
                            <a className={linkedAStyle} data-cy="conditional-link">
                                <Typography variant="h6" role="menuitem" color="inherit">
                                    {title}
                                </Typography>
                            </a>
                        </Link>
                    }
                    sx={{
                        height: toRemWithUnit(16),
                        color: palette.text?.primary,
                        p: 0,
                    }}
                    value={idx + 1}
                    onClick={onClick}
                />
            ))}
        </Tabs>
    );
}

export default LinkedTab;
