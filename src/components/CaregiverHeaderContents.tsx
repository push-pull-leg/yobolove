import { Box, Button, Hidden, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { AccountCircle } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { css } from "@emotion/css";
import Logo from "../styles/images/img-yobologo-combi1.svg";
import { HeaderPropsType } from "../type/HeaderPropsType";
import UseCaregiverService from "../hook/UseCaregiverService";
import HeaderTitle from "./HeaderTitle";
import { MenuType } from "../type/MenuType";
import LinkedTab from "./LinkedTab";

const logoStyle = css`
    vertical-align: top;
`;

/**
 * 구직자용 헤더 메뉴 리스트
 */
export const CaregiverHeaderMenu: MenuType[] = [
    {
        title: "요보사랑 홈",
        href: "/",
        as: "/",
        isTab: false,
    },
    {
        title: "일자리 알림",
        href: "/account/notification",
        as: "/내정보/맞춤일자리알림",
        isTab: true,
    },
    {
        title: "구인게시판",
        href: "/recruitings",
        as: "/게시판",
        isTab: true,
    },
    {
        title: "기관용 서비스",
        href: "/center",
        as: "/기관",
        isTab: false,
    },
];

/**
 * 구직자용 헤더 메뉴 탭 리스트
 */
const LINKED_TABS_INFO = CaregiverHeaderMenu.filter(({ isTab }) => isTab);

/**
 *  구직자용 Header 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1025%3A44508)
 * @category Component
 */
function CaregiverHeaderContents(props: HeaderPropsType) {
    const { isLoggedIn } = UseCaregiverService();
    const { menuStyle } = props;

    return (
        <>
            <Box flex={1} display="flex" flexWrap="nowrap" data-cy="caregiver-header" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                <Hidden mdDown>
                    <Box flex={1} textAlign="left" display="flex" alignItems="center" justifyContent="left" gap={4} className={menuStyle}>
                        <Link href="/" passHref>
                            <a>
                                <Logo height={18} width={100} className={logoStyle} />
                            </a>
                        </Link>
                        <LinkedTab items={LINKED_TABS_INFO} />
                        <Link href="/center" as="/기관" passHref>
                            <a>
                                <Typography variant="h6" role="menuitem">
                                    기관용 서비스
                                </Typography>
                            </a>
                        </Link>
                    </Box>
                </Hidden>
                <Hidden mdUp>
                    <Box flex={1} textAlign="center" display="flex" alignItems="center" justifyContent="center" gap={4}>
                        <HeaderTitle />
                    </Box>
                </Hidden>
            </Box>
            {isLoggedIn() ? (
                <>
                    <Hidden mdDown>
                        <Link href="/account" as="/내정보" passHref>
                            <a>
                                <Button variant="text" role="button" data-cy="login-icon" startIcon={<AccountCircle />}>
                                    내정보
                                </Button>
                            </a>
                        </Link>
                    </Hidden>
                    <Hidden mdUp>
                        <Link href="/account" as="/내정보" passHref>
                            <IconButton role="button" data-cy="login-icon">
                                <AccountCircle />
                            </IconButton>
                        </Link>
                    </Hidden>
                </>
            ) : (
                <>
                    <Hidden mdDown>
                        <Link href="/login" as="/시작하기" passHref>
                            <a>
                                <Button variant="text" role="button" data-cy="login-icon" startIcon={<AccountCircleOutlinedIcon />}>
                                    로그인
                                </Button>
                            </a>
                        </Link>
                    </Hidden>
                    <Hidden mdUp>
                        <Link href="/login" as="/시작하기" passHref>
                            <a>
                                <IconButton role="button" data-cy="login-icon">
                                    <AccountCircleOutlinedIcon />
                                </IconButton>
                            </a>
                        </Link>
                    </Hidden>
                </>
            )}
        </>
    );
}

export default CaregiverHeaderContents;
