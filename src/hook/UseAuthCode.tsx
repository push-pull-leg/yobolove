import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ErrorOutline } from "@mui/icons-material";
import { useSetRecoilState } from "recoil";
import EndpointEnum from "../enum/EndpointEnum";
import UseHttp from "./UseHttp";
import PostAuthCodeRequestInterface from "../interface/request/PostAuthCodeRequestInterface";
import PostAuthCodeResponseInterface from "../interface/response/PostAuthCodeResponseInterface";
import ResponseErrorCodeEnum from "../enum/ResponseErrorCodeEnum";
import AuthCodeProcessEnum from "../enum/AuthCodeProcessEnum";
import caregiverService from "../service/CaregiverService";
import centerService from "../service/CenterService";
import IconTypography from "../components/IconTypography";
import UseAlert from "./UseAlert";
import { InputInterface } from "../components/RecruitingsFilterDialog";
import GetAuthCodeAuthenticateResponseInterface from "../interface/response/GetAuthCodeAuthenticateResponseInterface";
import GetAuthCodeAuthenticateRequestInterface from "../interface/request/GetAuthCodeAuthenticateRequestInterface";
import AuthCodeRequestInterface from "../interface/request/AuthCodeRequestInterface";
import sectionStyle from "../styles/sectionStyle";
import Form from "../components/form/Form";
import Phone from "../components/form/Phone";
import Text from "../components/form/Text";
import ErrorException from "../exception/ErrorException";
import EventUtil from "../util/EventUtil";
import BadResponseInterface from "../interface/response/BadResponseInterface";
import ErrorCodeEnum from "../enum/ErrorCodeEnum";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import { Undefinable } from "../type/Undefinable";
import { toRem } from "../styles/options/Function";

dayjs.extend(duration);
/**
 * 문자인증 단계
 * @category Type
 * @union
 * "REQUEST_AUTH_CODE" - 문자인증요청 단계
 * "CONFIRM_AUTH_CODE" - 인증번호입력 단계
 */
type StepType = "REQUEST_AUTH_CODE" | "CONFIRM_AUTH_CODE";

/**
 * 접근 페이지 종류
 * "CAREGIVER_SIGNUP" - 구직자 > 회원가입페이지
 * "CAREGIVER_LOGIN" - 구직자 > 로그인
 * "CAREGIVER_WITHDRAWAL" - 구직자 > 회원탈퇴
 * "CENTER_SIGNUP" - 기관용 > 회원가입페이지
 * "CENTER_WITHDRAWAL" - 기관용 > 탈퇴하기
 * "CENTER_FIND_ID" - 기관용 > 아이디 찾기
 * "CENTER_FIND_PASSWORD" - 기관용 > 비밀번호 찾기
 * "CENTER_ADD_NUMBER" - 기관용 > 연락처 추가
 */
export type PageType =
    | "CAREGIVER_SIGNUP"
    | "CAREGIVER_LOGIN"
    | "CAREGIVER_WITHDRAWAL"
    | "CENTER_SIGNUP"
    | "CENTER_WITHDRAWAL"
    | "CENTER_FIND_ID"
    | "CENTER_FIND_PASSWORD"
    | "CENTER_ADD_NUMBER";

/**
 * UseAuthCode - Props
 */
export type UseAuthCodePropsType = {
    /**
     * 페이지 타입
     */
    page: PageType;
    /**
     * 문자인증 핸드폰번호 text field 라벨
     */
    requestTitle?: string;
    /**
     * 문자 인증번호 입력 text field 라벨
     */
    inputTitle?: string;
    /**
     * 문자인증 프로세스 Enum. {@link AuthCodeProcessEnum}. 어느 상황에서 문자인증을 사용하는지 여부
     */
    authCodeProcess: AuthCodeProcessEnum;
    /**
     * 문자인증을 완료 한 후 {@link AuthCodeRequestInterface}를 넘기면서 해당 함수를 호출한다.
     * @param request {@link AuthCodeRequestInterface}
     */
    onComplete?: (request: AuthCodeRequestInterface) => void;
    /**
     * 중간에 인증관련가 발생한경우, 커스텀하게 처리하기 위한 콜백 함수. {@link BadResponseInterface} 를 넘기면서 해당 함수를 호출한다.
     * @param response {@link BadResponseInterface}
     */
    onError?: (response: BadResponseInterface) => void;
    /**
     * 해당 문자인증 UI의 최대 가로사이즈
     */
    maxWidth?: "xs" | "sm" | "md" | "lg";
    /**
     * iframe 이 아닌 하나의 페이지로 구성되어 있는지 여부. padding / margin 등의 레이아웃 작업에 관련되어 있음
     */
    isPage?: boolean;
    /**
     * 문자인증 안내 메시지
     */
    showGuideMessage?: boolean;
};
/**
 * 문자 인증 UI 에 사용하는 Custom Hook 입니다. 회원가입, 로그인, 비밀번호 찾기 등 여러 문자인증이 필요한 페이지에 사용된다.
 *
 * 진입 페이지, 최대 가로사이즈, 타이틀 등 기본적인 옵션을 넣어주고 render 함수를 불러오면 rendering 이 된다.
 *
 * component 와 커스텀 훅의 사이정도의 역할로 사용하고 있습니다.
 *
 * @param props
 * @category Hook
 */
const UseAuthCode = (props: UseAuthCodePropsType) => {
    const { page, showGuideMessage, inputTitle, requestTitle, authCodeProcess, onComplete, onError, maxWidth = "sm", isPage = false } = props;
    const { openAlert } = UseAlert();
    const { httpRequest } = UseHttp();
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    /**
     * 임시 핸드폰 번호.
     */
    const phoneNum = useRef<Undefinable>(undefined);

    /**
     * 현재 인증문자가 만료가 되었느냐 여부
     */
    const isExpired = useRef<boolean>(false);

    /**
     * 인증번호 Input. 인증번호 요청시 해당 ref 를 통해 직접 setValue 함.
     */
    const authCodeInput = useRef<InputInterface<string>>(null);

    /**
     * 문자 인증 단계
     */
    const [step, setStep] = useState<StepType>("REQUEST_AUTH_CODE");

    /**
     * 문자인증 요청 시 만료시간(초). 요청전, 인증완료 시에는 undefined
     */
    const [expiredSecond, setExpiredSecond] = useState<number | undefined>(undefined);

    /**
     * 문자인증번호 입력 하단에 있는 helperText
     */
    const [autoCodeMessage, setAutoCodeMessage] = useState<ReactElement | undefined>(undefined);

    /**
     * Http 통신을 위한 헤더정보 가져오기. 문자인증은 요양보호사, 기관용 두가지 다 사용되기 때문에 공통 UI 에서 사용한다.
     * @return object
     */
    const getHeaders = useCallback((): object => {
        if (page.includes("CENTER")) {
            return centerService.getAccessToken() ? { Authorization: `Bearer ${centerService.getAccessToken()}` } : {};
        }
        return caregiverService.getAccessToken() ? { Authorization: `Bearer ${caregiverService.getAccessToken()}` } : {};
    }, [page]);

    /**
     * 문자 인증을 요청하는 Method. 핸드폰번호와 문자인증 프로세스({@link AuthCodeProcessEnum})를 같이 넘긴다.
     *
     * @param request {@link PostAuthCodeRequestInterface}
     * @return boolean 성공/실패
     */
    const requestAuthCode = useCallback(
        async (request: PostAuthCodeRequestInterface): Promise<boolean> => {
            isExpired.current = false;

            const response = await httpRequest<PostAuthCodeResponseInterface, PostAuthCodeRequestInterface>(EndpointEnum.POST_AUTH_CODE, {
                ...request,
                process: authCodeProcess,
            });

            /**
             * 백엔드 에러 발생 처리
             */
            if (response.error) {
                /**
                 * 문자인증 생성 제한에 걸리면 커스텀 메세지 Alert 열기
                 */
                if (response.error.code === ResponseErrorCodeEnum.EXCEEDED_CODE_GENERATION) {
                    openAlert("재발송 횟수 초과", "보안을 위해 입력이 중지됩니다. 계정 정보를 확인하시려면 고객센터(1661-7939)로 문의해주시길 바랍니다.", false);
                }

                /**
                 * 그 외 메세지 들은 문자인증번호 하단 Helper Text 보여줌
                 */
                if (response.error.message) {
                    setAutoCodeMessage(<IconTypography label={response.error.message} labelColor="error" />);
                }
                return false;
            }

            /**
             * 발송이 성공하더라도 Notification Message 라는 field 가 있으면 helper text 보여줌
             */
            if (response.data.notificationMessage) {
                setAutoCodeMessage(
                    <>
                        <Typography variant="caption" color="primary" sx={{ mb: 2 }} display="block">
                            *인증번호 발송에 10초 이상 소요가능
                        </Typography>
                        <IconTypography
                            icon={<ErrorOutline fontSize="small" color="inherit" />}
                            label={response.data.notificationMessage}
                            typographyVariant="body2"
                            labelColor="text.secondary"
                        />
                    </>,
                );
            }

            /**
             * 성공시 만료여부 리셋
             */
            isExpired.current = false;

            /**
             * 서버에서 준 expiredAt(timestamp) 를 기준으로 현재 timestamp 와의 차이를 seconds 로 해서 만료시간(초)를 set 한다.
             */
            const expiredTimestamp = dayjs(response.data.expireAt).unix();
            const nowTimestamp = dayjs().unix();
            if (expiredTimestamp - nowTimestamp > 0) {
                setExpiredSecond(expiredTimestamp - nowTimestamp);
            } else {
                setExpiredSecond(undefined);
            }

            /**
             * 문자 인증 성공 단계로 이동
             */
            setStep("CONFIRM_AUTH_CODE");
            return true;
        },
        [isExpired.current, authCodeProcess],
    );

    /**
     * 문자인증 요청 확인 Method. Dialog 를 띄워서 실제로 인증 문자를 보낼지 확인함. 확인누르면 requestAuthCode Method 호출. 회원가입일 경우, Gtm Event 발생
     *
     * @param request {@link PostAuthCodeRequestInterface}
     * @category Method
     * @gtm
     */
    const onSubmitAuthCode = useCallback(
        async (request: PostAuthCodeRequestInterface): Promise<void> => {
            setDialogRecoil({
                open: true,
                title: page === "CENTER_SIGNUP" ? `${request.phoneNum}가 고객님의 번호가 맞으신가요?` : `${request.phoneNum}로 인증 문자를 보냅니다.`,
                content: "본인의 휴대폰 번호가 맞다면 ‘인증번호 받기’를 눌러주세요.",
                confirmButtonText: "인증번호 받기",
                hasCancelButton: true,
                onConfirm: async () => {
                    if (await requestAuthCode(request)) authCodeInput?.current?.setValue("");
                    if (page === "CENTER_SIGNUP") EventUtil.gtmEvent("click", "receive", "signup", "0", "/회원가입");
                },
            });
        },
        [phoneNum.current, authCodeInput],
    );

    /**
     * 인증문자 받고 인증번호 입력하는 Method. 핸드폰 번호와 인증번호, 인증프로세스를 보내면서 조회한다.
     * @param request {@link GetAuthCodeAuthenticateRequestInterface}
     */
    const onSubmitConfirmCode = useCallback(
        async (request: GetAuthCodeAuthenticateRequestInterface): Promise<void> => {
            /**
             * 입력한 핸드폰 번호가 없으면 호출하지 않음.
             */
            if (!phoneNum.current) return;

            /**
             * 인증번호 입력시간이 지나면 호출하지 않음.
             */
            if (isExpired.current) {
                openAlert("인증시간이 지났어요", "다시받기를 눌러주세요");
                return;
            }

            /**
             * 실제 API 호출
             */
            const response = await httpRequest<GetAuthCodeAuthenticateResponseInterface, GetAuthCodeAuthenticateRequestInterface>(
                EndpointEnum.GET_AUTH_CODE_AUTHENTICATE,
                { ...request, process: authCodeProcess },
                getHeaders(),
            );

            /**
             * 백엔드 에러 발생 처리
             */
            if (response.error) {
                let { message } = response.error;
                /**
                 * {@link ResponseErrorCodeEnum.FAILED_CODE_AUTHENTICATION} 인 경우, 따로 메세지를 보여주고 아닌 경우, 백엔드에서 주는 메세지를 보여줌
                 */
                if (response.error.code === ResponseErrorCodeEnum.FAILED_CODE_AUTHENTICATION) {
                    message = "인증번호가 맞지 않아요. 다시 입력해주세요.";
                }
                setAutoCodeMessage(
                    <Typography data-cy="error-message" color="error">
                        {message}
                    </Typography>,
                );

                /**
                 * onError props 가 있을 경우, 해당 BadResponse 를 콜백 해줌.
                 */
                if (onError) {
                    onError(response);
                }
                return;
            }

            /**
             * 만료시간을 리셋
             */
            setExpiredSecond(undefined);

            /**
             * onComplete props 가 있는 경우 phoneNum, codeAuthToken 을  넘김.
             */
            onComplete?.({ phoneNum: phoneNum.current, codeAuthToken: response.data.token });
        },
        [phoneNum.current, isExpired.current, authCodeProcess],
    );

    /**
     * 인증시간이 지났을 때 재발송 Method
     * @gtm
     */
    const resubmitAuthCode = async () => {
        if (page === "CAREGIVER_SIGNUP") EventUtil.gtmEvent("click", "resend", "signup", "0");

        if (!phoneNum.current) {
            openAlert("핸드폰번호를 입력해주세요");
            return;
        }
        await onSubmitAuthCode({ phoneNum: phoneNum.current });
    };

    /**
     * 만료시간(초)를 분:초 로 변경해서 rendering 항목에 보여줌. 1초에 한번씩 불러오기 때문에, useMemo 를 통해서 메모라이즈 필수.
     *
     * {@link dayjs.duration} 을 통해 초 > 기간변수 로 변경해준 후에 mm:ss 포맷으로 변경해줌. [dayjs duration](https://day.js.org/docs/en/durations/format)
     */
    const authCodeEndAdornment = useMemo<ReactElement | undefined>(() => {
        if (step === "REQUEST_AUTH_CODE") return undefined;

        if (!expiredSecond) return undefined;

        if (expiredSecond <= 0) return undefined;

        return (
            <Typography color="primary" sx={{ fontWeight: 400 }}>
                {dayjs(dayjs.duration(expiredSecond, "seconds").asMilliseconds()).locale("ko").format("mm:ss")}
            </Typography>
        );
    }, [expiredSecond, step]);

    /**
     * expiredSecond 가 0 보다 클 때, 1초씩 시간을 줄여가면서 AuthCodeMessage 를 업데이트함.
     *
     * 0보다 작아지게 되면 인증시간이 지났다고 알려주고, isExpired 를 true 로 변경함.
     */
    useEffect(() => {
        if (expiredSecond === undefined) return () => {};
        const timer = setInterval(() => {
            if (expiredSecond - 1 < 0) {
                setAutoCodeMessage(<Typography color="textSecondary">인증시간이 지났어요. 재발송 버튼을 눌러주세요.</Typography>);
                isExpired.current = true;
                clearInterval(timer);
            } else {
                setExpiredSecond(expiredSecond - 1);
            }
        }, 1000);
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [expiredSecond]);

    const render = () => {
        switch (step) {
            case "REQUEST_AUTH_CODE": {
                return (
                    <Box
                        display="flex"
                        height="100%"
                        alignItems="center"
                        flexDirection="column"
                        data-cy="phone-auth"
                        {...sectionStyle({ pt: 8, pb: toRem(148), textAlign: "left" }, maxWidth, isPage)}
                    >
                        <Form<PostAuthCodeRequestInterface> buttonText="인증번호 받기" onSubmit={onSubmitAuthCode}>
                            <Phone
                                title={requestTitle}
                                name="phoneNum"
                                placeholder="휴대폰 번호"
                                required
                                labelVariant="h3"
                                onChange={(_name: string, value: string) => {
                                    phoneNum.current = value;
                                }}
                            />
                        </Form>
                        <Typography variant="caption" color="text.secondary" role="note" sx={{ mt: 2, fontWeight: 400 }}>
                            문자 메시지로 인증번호를 보내드릴게요.
                        </Typography>
                    </Box>
                );
            }
            case "CONFIRM_AUTH_CODE": {
                return (
                    <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ py: 8, textAlign: "left" }, maxWidth, isPage)}>
                        <Form<GetAuthCodeAuthenticateRequestInterface> onSubmit={onSubmitConfirmCode}>
                            <Phone
                                title={inputTitle || "인증번호를 입력해주세요."}
                                name="phoneNum"
                                placeholder="휴대폰 번호"
                                required
                                labelVariant="h3"
                                button={
                                    <Button variant="outlined" color="primary" onClick={resubmitAuthCode}>
                                        재발송
                                    </Button>
                                }
                                defaultValue={phoneNum.current}
                                onChange={(_name: string, value: string) => {
                                    phoneNum.current = value;
                                }}
                            />
                            <Text
                                type="tel"
                                name="authCode"
                                placeholder="인증번호 6자리"
                                maxLength={6}
                                autoFocus={false}
                                helperText={autoCodeMessage}
                                endAdornment={authCodeEndAdornment}
                                innerRef={authCodeInput}
                            />
                        </Form>
                        {!showGuideMessage || (
                            <Box component="div" sx={{ bgcolor: "primary.light", width: "100%", borderRadius: toRem(8), p: toRem(16), mt: toRem(24) }}>
                                <Typography color="primary.main" variant="h5" sx={{ fontWeight: "700", mb: toRem(7) }}>
                                    잠깐! 인증이 어려우신가요?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: toRem(7) }}>
                                    ①문자로 인증번호 확인
                                </Typography>
                                <Typography variant="body2" sx={{ mb: toRem(7) }}>
                                    ②번호 확인 후 요보사랑으로 돌아오기
                                    <br />
                                    (갤럭시 폰은 화면 아래 lll 버튼 누르기)
                                </Typography>
                                <Typography variant="body2" sx={{ mb: toRem(12) }}>
                                    ③<strong>“인증번호 6자리”</strong>에 인증번호 입력
                                </Typography>
                                <Typography variant="caption" sx={{ borderBottom: "1px solid" }} color="text.secondary">
                                    <a href="https://pf.kakao.com/_WikWK/chat" target="_blank" rel="noreferrer">
                                        도움이 필요하면 고객센터 문의하기
                                    </a>
                                </Typography>
                            </Box>
                        )}
                    </Box>
                );
            }
            default: {
                throw new ErrorException(ErrorCodeEnum.UNKNOWN_STEP, "알 수 없는 단계 입니다.");
            }
        }
    };

    return {
        /**
         * 현재 단계
         */
        step,

        /**
         * 입력한 핸드폰 번호
         */
        phoneNum,

        /**
         * dialog recoil 재사용
         */
        setDialogRecoil,

        /**
         * 핸드폰번호 입력, 문자인증번호 등 실제 rendering 부분
         */
        render,
    };
};

/**
 * @hidden
 */
UseAuthCode.defaultProps = {
    confirmCodeEndpoint: undefined,
    inputTitle: "인증번호를 입력해주세요.",
    requestTitle: undefined,
    authCodeProcess: undefined,
    callback: undefined,
    onError: undefined,
    maxWidth: "sm",
    isPage: false,
    showGuideMessage: false,
};

export default UseAuthCode;
