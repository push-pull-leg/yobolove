import { useSetRecoilState } from "recoil";
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import { toRem } from "../styles/options/Function";
import UseKakao from "./UseKakao";
import KakaotalkIcon from "../styles/images/img-icon-kakaotalk.svg";
import UtmService from "../service/UtmService";
import UseCaregiverService from "./UseCaregiverService";
import EventUtil from "../util/EventUtil";

/**
 * 유저에게 넛지를 주는 기능들이 모여있음.
 * 현재 시점에서 넛지관련기능은
 * ### 1. 특정 조건에 따라 내부 세션 데이터가 변경되고,
 * ### 2. 해당 세션 데이터와 조건에 따라 특정 동작이 트리거 되는 형태임.
 * @category Hook
 */
export default function UseNudge() {
    const { login, loadScript } = UseKakao();
    const { isLoggedIn } = UseCaregiverService();
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    const clickNudgePhoneButton = () => {
        EventUtil.gtmEvent("click", "start", "signupPopupRecruitings", "signup", "/게시판");
        EventUtil.gtmEvent("click", "start", "signupPopupHome", "signup", "/");
        setDialogRecoil((prevState: any) => ({ ...prevState, open: false }));
    };

    const clickNudgeKakaoButton = async () => {
        EventUtil.gtmEvent("click", "start", "signupPopupRecruitings", "kakaotalk", "/게시판");
        EventUtil.gtmEvent("click", "start", "signupPopupHome", "kakaotalk", "/");
        await login();
    };

    function setNumOfOpenRecruitingContent(value: number) {
        sessionStorage.setItem("numOfOpenRecruitingContent", String(value));
    }

    function getNumOfOpenRecruitingContent(): number | undefined {
        if (sessionStorage.getItem("numOfOpenRecruitingContent") === null) return undefined;

        return Number(sessionStorage.getItem("numOfOpenRecruitingContent"));
    }

    function setFromRecruitings(value: boolean) {
        sessionStorage.setItem("fromRecruitings", String(value));
    }

    function getFromRecruitings(): boolean | undefined {
        if (sessionStorage.getItem("fromRecruitings") === null) {
            return undefined;
        }
        return sessionStorage.getItem("fromRecruitings") === "true";
    }

    /**
     * 회원가입 관련 Dialog 발생
     */
    const openSignupModal = () => {
        loadScript();
        setTimeout(() => {
            setDialogRecoil({
                open: true,
                title: (
                    <>
                        <Typography variant="h3" color="text.primary" sx={{ textAlign: "center", mb: 2 }}>
                            나의 맞춤 일자리가 생기면
                            <br />
                            먼저 알려드릴게요
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ textAlign: "center" }}>
                            가입 한 번으로
                            <br />
                            원하는 조건의 일자리 정보를
                            <br />
                            <strong>카톡/문자로 편하게 받을 수 있어요.</strong>
                        </Typography>
                    </>
                ),
                content: (
                    <>
                        <Button
                            startIcon={<KakaotalkIcon />}
                            variant="contained"
                            sx={{ mt: 7, py: toRem(13) }}
                            color="kakaotalk"
                            fullWidth
                            onClick={() => clickNudgeKakaoButton()}
                            data-cy="kakao-login"
                        >
                            카카오톡 회원가입/로그인
                        </Button>
                        <Link href="/signup" as="/회원가입" passHref>
                            <a style={{ width: "100%" }} data-cy="phone-login">
                                <Button fullWidth variant="outlined" data-cy="phone-login-button" color="secondary" onClick={clickNudgePhoneButton} sx={{ mt: 4, py: toRem(13) }}>
                                    휴대폰 회원가입/로그인
                                </Button>
                            </a>
                        </Link>
                    </>
                ),
                hasCloseButton: true,
                hasCancelButton: false,
                hasConfirmButton: false,
            });
        }, 200);
    };

    /**
     * 구인공고 팝업 닫힐때 이벤트 발생.
     * numOfOpenRecruitingContent 횟수 추가.
     * 첫번 쨰 혹은 5번째 면 회원가입 팝업 발생
     */
    const handleCloseRecruitingPopup = () => {
        const utmSource = UtmService.get("utmSource");
        if (typeof window === "undefined" || !window.sessionStorage || utmSource === "kakaotalk" || isLoggedIn()) return;

        let numOfOpenRecruitingContent = getNumOfOpenRecruitingContent();
        if (!numOfOpenRecruitingContent) {
            numOfOpenRecruitingContent = 0;
        }
        numOfOpenRecruitingContent++;
        setNumOfOpenRecruitingContent(numOfOpenRecruitingContent);
        if (numOfOpenRecruitingContent === 1 || numOfOpenRecruitingContent === 5) {
            openSignupModal();
            EventUtil.gtmEvent("change", "signupPopup", "recruitings", numOfOpenRecruitingContent.toString());
        }
    };

    /**
     * 홈에서 mounted 될 때 이벤트 핸들러
     * 구인공고 팝업 횟수가 5개 미만일때, 아예 열어보지 않았거나 게시판을 거쳤다면 팝업 발생
     */
    const handleMountedInHome = () => {
        const utmSource = UtmService.get("utmSource");
        if (typeof window === "undefined" || !window.sessionStorage || utmSource === "kakaotalk" || isLoggedIn()) return;

        let numOfOpenRecruitingContent = getNumOfOpenRecruitingContent();
        if (numOfOpenRecruitingContent === undefined) {
            numOfOpenRecruitingContent = 0;
            setNumOfOpenRecruitingContent(0);
        }
        const fromRecruitings = getFromRecruitings();
        if (numOfOpenRecruitingContent < 5 && fromRecruitings) {
            openSignupModal();
            setFromRecruitings(false);
            EventUtil.gtmEvent("change", "signupPopup", "home", "0", "/");
        }
    };

    return { handleMountedInHome, handleCloseRecruitingPopup, setFromRecruitings };
}
