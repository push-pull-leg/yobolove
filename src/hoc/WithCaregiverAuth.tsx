import { GetServerSidePropsContext } from "next";
import CaregiverAuthService from "../server/CaregiverAuthService";

/**
 * Server Side 구직자 인증 Hoc.
 *
 * 인증이 필요한 페이지에 대해서 검증한 후 로그인이 안되어있으면 redirect 시키고, query parameter 가 필요한 페이지에서 해당 parameter 가 없으면 redirect 시킨다.
 *
 * @param getServerSideProps gssp
 * @param needAuthorized 로그인 필요여부
 * @param needParameters 필요한 query parameter 리스트
 * @category Hoc
 */
export default function WithCaregiverAuth(getServerSideProps?: any, needAuthorized: boolean = false, needParameters: string[] = []) {
    return async (context: GetServerSidePropsContext) => {
        const { isAuthorized, caregiver } = await CaregiverAuthService.isAuthorized(context.req, context.res);
        if (!isAuthorized && needAuthorized) {
            return {
                redirect: {
                    permanent: false,
                    source: `/시작하기`,
                    destination: `/login`,
                },
                props: {},
            };
        }

        if (needParameters.length > 0) {
            for (let i = 0; i < needParameters.length; i++) {
                const needParameter = needParameters[i];
                if (!(needParameter in context.query)) {
                    return {
                        redirect: {
                            permanent: false,
                            source: "/",
                            destination: "/",
                        },
                        props: {},
                    };
                }
            }
        }

        if (getServerSideProps) {
            const getServerSidePropsData = await getServerSideProps(context, caregiver);
            if ("props" in getServerSidePropsData) {
                return {
                    props: {
                        ...getServerSidePropsData.props,
                        caregiver,
                    },
                };
            }
        }
        return {
            props: {
                caregiver,
            },
        };
    };
}
