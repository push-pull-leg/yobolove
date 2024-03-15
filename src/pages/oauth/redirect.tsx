import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import PagePropsInterface from "../../interface/PagePropsInterface";
import SessionInterface from "../../interface/SessionInterface";
import CaregiverAuthService from "../../server/CaregiverAuthService";
import UseCaregiverService from "../../hook/UseCaregiverService";
import Error from "../../components/Error";
import EventUtil from "../../util/EventUtil";
import UseLoading from "../../hook/UseLoading";

/**
 * 구직자서비스 - 카카오로그인
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1502%3A74837)
 * @category Page
 * @Caregiver
 */
const Redirect: NextPage = function Redirect(props: PagePropsInterface) {
    const { caregiverSession } = props;
    const { loginWithToken } = UseCaregiverService();
    const { openLoading, closeLoading } = UseLoading();
    const router = useRouter();

    /**
     * gssp 에서 받은 세션 정보르 client 로그인 실행.
     * UI 작업을 막기 위해 로딩창 띄움.
     * 로그인이 성공하면 일단 내정보 페이지로 이동한 후, 최초 회원가입이면 희망근무조건 페이지로 이동.
     * 이 모든 과정은 sync 로 처리해야함.
     * @Gtm
     */
    const login = async () => {
        if (!caregiverSession) return;

        openLoading();
        await loginWithToken(caregiverSession.accessToken, caregiverSession.refreshToken, "/", caregiverSession.hasDesiredWork);

        if (caregiverSession.signUp) {
            EventUtil.gtmEvent("submit", "question", "signup", "kakao");
            await router.push("/account/desired-work", "/내정보/희망근무조건");
        }

        /**
         * 희망근무 조건을 저장한적이 없으면 희망근무조건 페이지로 이동
         */
        if (!caregiverSession.hasDesiredWork) {
            await router.push("/account/desired-work", "/내정보/희망근무조건");
        }

        closeLoading();
    };
    useEffect(() => {
        login();
    }, []);

    if (!caregiverSession) return <Error title="인증에 실패했습니다." />;

    return <div />;
};

/**
 * 구직자 세선정보를 query parameter 에 있는 code 에서 가져옴.
 * code 가 없거나 제대로 세션 데이터를 불러오지 못하면 401 에러 리턴
 * @param context
 * @Gssp
 */
export const getServerSideProps: GetServerSideProps = async context => {
    const { query, res } = context;
    const { code } = query;
    if (!code) {
        res.statusCode = 401;
        return { props: {} };
    }

    const caregiverSession: SessionInterface | undefined = await CaregiverAuthService.getAuthorizedSessionByCode(context, code.toString());
    if (!caregiverSession) {
        res.statusCode = 401;
        return { props: {} };
    }
    return { props: { caregiverSession } };
};

export default Redirect;
