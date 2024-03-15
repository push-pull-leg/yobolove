/**
 * SITE URL
 */
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * 생성할 SiteMap List
 */
const StaticSiteMapConfig = [
    `${baseUrl}`,
    `${baseUrl}/center`,
    `${baseUrl}/account/center/find`,
    `${baseUrl}/account/center/find-id`,
    `${baseUrl}/center/find-password`,
    `${baseUrl}/center/login`,
    `${baseUrl}/center/recruitings`,
    `${baseUrl}/center/signup`,
    `${baseUrl}/center/withdrawal`,
    `${baseUrl}/login`,
    `${baseUrl}/login-by-phone`,
    `${baseUrl}/oauth/redirect`,
    `${baseUrl}/recruitings`,
    `${baseUrl}/signup`,
    `${baseUrl}/withdrawal`,
    `${baseUrl}/center/recruitings/create`,
    `${baseUrl}/게시판`,
    `${baseUrl}/시작하기`,
    `${baseUrl}/휴대폰로그인`,
    `${baseUrl}/회원가입`,
    `${baseUrl}/기관`,
    `${baseUrl}/기관/로그인`,
    `${baseUrl}/기관/가입신청`,
    `${baseUrl}/기관/계정찾기`,
    `${baseUrl}/기관/아이디찾기`,
    `${baseUrl}/기관/비밀번호찾기`,
    `${baseUrl}/기관/구인공고등록`,
];

export default StaticSiteMapConfig;
