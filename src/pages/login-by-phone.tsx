import type { NextPage } from "next";
import { useRouter } from "next/router";
import UseAuthCode from "../hook/UseAuthCode";
import UseCaregiverService from "../hook/UseCaregiverService";
import UseTitle from "../hook/UseTitle";
import AuthCodeProcessEnum from "../enum/AuthCodeProcessEnum";
import AuthCodeRequestInterface from "../interface/request/AuthCodeRequestInterface";
import WithHeadMetaData from "../hoc/WithHeadMetaData";

/**
 * 휴대폰 로그인
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1502%3A74837)
 * @category Page
 * @Caregiver
 */
const LoginByPhone: NextPage = function Signup() {
    UseTitle("요양보호사 로그인", "로그인");
    const router = useRouter();
    const { login } = UseCaregiverService();
    const { render } = UseAuthCode({
        page: "CAREGIVER_LOGIN",
        requestTitle: "휴대폰 번호로 간편하게 로그인할 수 있어요.",
        authCodeProcess: AuthCodeProcessEnum.CAREGIVER_SIGN_IN,
        onComplete: async (request: AuthCodeRequestInterface): Promise<void> => {
            await login(request, "redirect-uri" in router.query && router.query["redirect-uri"] ? router.query["redirect-uri"].toString() : "/");
        },
        showGuideMessage: true,
    });

    return render();
};
export default WithHeadMetaData(LoginByPhone);
