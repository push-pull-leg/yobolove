import { HeadMetaDataType } from "../components/Head";

/**
 * SITE URL
 */
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * URI 별 headMeta 정의.
 */
const HeadMetaDataConfig: Map<string, HeadMetaDataType> = new Map([
    [
        "/",
        {
            title: "요양보호사 구인구직, 취업은 일자리 찾아주는 요보사랑",
            url: `${baseUrl}`,
            description: "요양보호사 구인구직, 요양보호사 취업이 어렵다면, 조건에 맞고 나에게 가까운 요양보호사 일자리를 소개해드리는 요보사랑을 이용해보세요.",
        },
    ],
    [
        "/recruitings",
        {
            title: "요양보호사 일자리 게시판-요보사랑",
            url: `${baseUrl}/게시판`,
            description: "최신 요양보호사 일자리 정보를 무료로 확인하실 수 있습니다. 요양보호사 구인구직 정보 보고, 요양보호사 취업에 성공해보세요.",
        },
    ],
    [
        "/login",
        {
            title: "시작하기-요보사랑",
            url: `${baseUrl}/시작하기`,
            description: "요양보호사 구인구직 서비스 요보사랑을 카카오톡이나 휴대폰 번호로 쉽게 시작할 수 있습니다.",
        },
    ],
    [
        "/login-by-phone",
        {
            title: "로그인-요보사랑",
            url: `${baseUrl}/휴대폰로그인`,
            description: "요양보호사 구인구직 서비스 요보사랑을 휴대폰 인증 한번으로 로그인하세요. 희망하는 근무조건에 맞는 일자리를 쉽게 찾아볼 수 있습니다.",
        },
    ],
    [
        "/signup",
        {
            title: "회원가입-요보사랑",
            url: `${baseUrl}/회원가입`,
            description: "요양보호사 구직 서비스 요보사랑 이용을 위해 개인정보처리방침 및 서비스 이용 약관에 동의해주세요.",
        },
    ],
    [
        "/account",
        {
            title: "요양보호사 내 정보-요보사랑",
            url: `${baseUrl}/내정보`,
            description: "일자리 알림 수신 여부와 희망 근무조건을 수정하여 더 적합한 요양보호사 일자리 정보를 받아보실 수 있습니다.",
        },
    ],
    [
        "/account/desired-work",
        {
            title: "요양보호사 희망근무조건-요보사랑",
            url: `${baseUrl}/내정보/희망근무조건`,
            description: "요양보호사 구인구직에 필요한 희망 근무조건을 입력, 수정하여 더 적합한 요양보호사 구직 정보를 받아보세요.",
        },
    ],
    [
        "/account/notification",
        {
            title: "요양보호사 맞춤 일자리 알림-요보사랑",
            url: `${baseUrl}/내정보/희망근무조건`,
            description: "요양보호사 구직 정보를 1개월 후부터 받고 싶다면, 알림 수신 예약 기능을 활용해보세요. 1개월 후 뿐만 아니라 직접 날짜 지정도 가능합니다.",
        },
    ],
    [
        "/recruitings/[recruitingUuid]",
        {
            title: undefined,
            url: undefined,
            description: undefined,
            productJsonLd: undefined,
        },
    ],
    [
        "/center",
        {
            title: "요양보호사 구인은 요보사랑, 조건에 꼭 맞는 요양보호사를 빠르게 매칭",
            url: `${baseUrl}/기관`,
            description: "요양보호사 구인이 어려웠다면, 요보사랑에 구인 정보를 등록해보세요. 알림톡 한 번으로 누구나 쉽게 요양보호사를 채용할 수 있습니다.",
        },
    ],
    [
        "/center/login",
        {
            title: "로그인-요보사랑",
            url: `${baseUrl}/기관/로그인`,
            description: "요양보호사 구인구직 서비스 요보사랑에 로그인하고 요양보호사 채용해보세요.",
        },
    ],
    [
        "/center/signup",
        {
            title: "가입신청-요보사랑",
            url: `${baseUrl}/기관/가입신청`,
            description: "요양보호사 구인구직 서비스 요보사랑에 가입하여 요양보호사 채용 솔루션을 이용해보세요.",
        },
    ],
    [
        "/center/find",
        {
            title: "가입신청-계정정보-요보사랑",
            url: `${baseUrl}/기관/계정찾기`,
            description: "요양보호사 구인구직 서비스 요보사랑의 계정 정보가 기억이 안나신다면, 아이디 찾기나 비밀번호 찾기를 이용해주세요.",
        },
    ],
    [
        "/center/find-id",
        {
            title: "아이디 찾기-요보사랑",
            url: `${baseUrl}/기관/아이디찾기`,
            description: "요양보호사 구인구직 서비스 요보사랑에 등록하신 아이디를 등록하실 때 입력했던 휴대폰 번호로 찾아보세요.",
        },
    ],
    [
        "/center/find-password",
        {
            title: "비밀번호 찾기-요보사랑",
            url: `${baseUrl}/기관/비밀번호찾기`,
            description: "요양보호사 구인구직 서비스 요보사랑에 등록하신 비밀번호를 등록하실 때 입력했던 휴대폰 번호로 찾아보세요.",
        },
    ],
    [
        "/center/account",
        {
            title: "기관 계정정보-요보사랑",
            url: `${baseUrl}/기관/계정정보`,
            description: "요양보호사 구인구직 서비스 요보사랑에 등록되어있는 기관정보, 채용 담당자 연락처를 수정하거나, 비밀번호를 변경할 수 있습니다.",
        },
    ],
    [
        "/center/account/update-password",
        {
            title: "기관 비밀번호 변경-요보사랑",
            url: `${baseUrl}/기관/계정정보/비밀번호변경`,
            description: "요양보호사 구인구직 서비스 요보사랑에서 사용하실 비밀번호를 변경할 수 있습니다.",
        },
    ],
    [
        "/center/account/info-center",
        {
            title: "기관정보-요보사랑",
            url: `${baseUrl}/기관/계정정보/기관정보`,
            description: "요양보호사 채용을 진행할 기관의 기관정보를 수정할 수 있습니다.",
        },
    ],
    [
        "/center/account/info-contact",
        {
            title: "기관 전화번호-요보사랑",
            url: `${baseUrl}/기관/계정정보/기관전화번호`,
            description: "요양보호사 채용을 진행할 기관의 채용 담당자 연락처를 확인할 수 있습니다.",
        },
    ],
    [
        "/center/recruitings",
        {
            title: "기관 나의공고-요보사랑",
            url: `${baseUrl}/기관/나의공고`,
            description: "진행 중이거나, 진행했던 요양보호사 구인구직, 요양보호사 채용 정보 내역을 확인하고 수정할 수 있습니다.",
        },
    ],
    [
        "/center/recruitings/[recruitingUuid]",
        {
            title: "요양보호사 구인 공고 작성-요보사랑",
            url: `${baseUrl}/center/recruitings/create`,
            description: "요양보호사 구인을 위한 구인정보를 등록해주세요. 요양보호사가 일하게 될 일자리의 근무형태를 입력해주세요.",
        },
    ],
    [
        "/event/launch-event",
        {
            title: "요보사랑 개편 기념 신규 가입 이벤트",
            url: `${baseUrl}/event/launch-event`,
            description: "최신 요양보호사 일자리 무료 알림과 상품권도 받을 수 있는 요보사랑 가입 이벤트",
        },
    ],
]);

export default HeadMetaDataConfig;
