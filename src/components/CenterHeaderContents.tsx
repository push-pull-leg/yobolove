import { Box, Button, Hidden, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { AccountCircle } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { HeaderPropsType } from "../type/HeaderPropsType";
import UseCenterService from "../hook/UseCenterService";
import HeaderTitle from "./HeaderTitle";
import LinkedTab from "./LinkedTab";
import { MenuType } from "../type/MenuType";
import StorageUtil from "../util/StorageUtil";
import RecruitingSessionStorageKeys from "../enum/RecruitingSessionStorageKeys";
import EventUtil from "../util/EventUtil";

/**
 * 기관용 헤더 메뉴 리스트
 */
export const CenterHeaderMenu: MenuType[] = [
    {
        title: "인력찾기 홈",
        href: "/center",
        as: "/기관",
        isTab: false,
    },
    {
        title: "공고등록",
        href: "/기관/구인공고등록",
        as: "/기관/구인공고등록",
        isTab: true,
        onClick: () => {
            StorageUtil.removeItem([RecruitingSessionStorageKeys.WRITTEN_RECRUITING_CONTENT, RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL]);

            EventUtil.gtmEvent("click", "recruit", "center", "메뉴(공고등록) - menu");
        },
    },
    {
        title: "구직자용 서비스",
        href: "/",
        as: "/",
        isTab: false,
    },
];

/**
 * 기관용 헤더 메뉴 탭 리스트
 */
const LINKED_TABS_INFO = CenterHeaderMenu.filter(({ isTab }) => isTab);

const handleClickLoginButton = () => EventUtil.gtmEvent("click", "upLogin", "center", "0");

/**
 * 기관용 Header 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1025%3A44508)
 * @category Component
 */
function CenterHeaderContents(props: HeaderPropsType) {
    const { isLoggedIn } = UseCenterService();
    const { menuStyle } = props;

    return (
        <>
            <Box flex={1} display="flex" flexWrap="nowrap" overflow="hidden" data-cy="center-header" whiteSpace="nowrap" textOverflow="ellipsis">
                <Hidden mdDown>
                    <Box flex={1} textAlign="left" display="flex" data-cy="header-wrapper" alignItems="center" justifyContent="left" gap={4} className={menuStyle}>
                        <Link href="/center" as="/기관" passHref>
                            <a data-cy="main-link">
                                <Typography color="primary" sx={{ fontWeight: 600 }}>
                                    요보사랑 인력찾기
                                </Typography>
                            </a>
                        </Link>
                        <LinkedTab items={LINKED_TABS_INFO} />
                        <Link href="/" passHref>
                            <a data-cy="caregiver-link">
                                <Typography variant="h6" role="menuitem">
                                    구직자 서비스
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
                        <Link href="/center/account" as="/기관/계정정보" passHref>
                            <a data-cy="my-info-link">
                                <Button variant="text" role="button" data-cy="login-button" startIcon={<AccountCircle />}>
                                    내정보
                                </Button>
                            </a>
                        </Link>
                    </Hidden>
                    <Hidden mdUp>
                        <Link href="/center/account" as="/기관/계정정보" passHref>
                            <a>
                                <IconButton role="button" data-cy="login-button">
                                    <AccountCircle />
                                </IconButton>
                            </a>
                        </Link>
                    </Hidden>
                </>
            ) : (
                <>
                    <Hidden mdDown>
                        <Link href="/center/login" as="/기관/로그인" passHref>
                            <a data-cy="login">
                                <Button variant="text" role="button" data-cy="login-button" startIcon={<AccountCircleOutlinedIcon />} onClick={handleClickLoginButton}>
                                    로그인
                                </Button>
                            </a>
                        </Link>
                    </Hidden>
                    <Hidden mdUp>
                        <Link href="/center/login" as="/기관/로그인" passHref>
                            <a data-cy="login">
                                <IconButton role="button" data-cy="login-button">
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

export default CenterHeaderContents;
