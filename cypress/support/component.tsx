// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import "@testing-library/cypress/add-commands";
import "@cypress/code-coverage/support";
// Import commands.js using ES2015 syntax:
import "./commands";
import inViewport from "./inViewport";

// Alternatively you can use CommonJS syntax:
// require('./commands')
import { mount } from "cypress/react";
import Theme from "../../src/styles/Theme";
import { ThemeProvider } from "@mui/material";
import { MutableSnapshot, RecoilRoot, RecoilState, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ReactElement, ReactNode } from "react";
import "../../src/styles/global.scss";
import "@mobiscroll/react/dist/css/mobiscroll.react.scss";
import { titleRecoilState } from "../../src/recoil/TitleRecoil";
import UseTitle from "../../src/hook/UseTitle";
import UsePopup from "../../src/hook/UsePopup";
import UseNudge from "../../src/hook/UseNudge";
import { caregiverRecoilState, CaregiverRecoilType } from "../../src/recoil/CaregiverRecoil";
import UseAlert from "../../src/hook/UseAlert";
import RoleEnum from "../../src/enum/RoleEnum";
import UtmService from "../../src/service/UtmService";
import UseLoading from "../../src/hook/UseLoading";
import { popupRecoilState } from "../../src/recoil/PopupRecoil";
import PostCaregiverLoginRequestInterface from "../../src/interface/request/PostCaregiverLoginRequestInterface";
import UseCaregiverService from "../../src/hook/UseCaregiverService";
import JwtAccessTokenDataInterface from "../../src/interface/JwtAccessTokenDataInterface";
import { centerRecoilState } from "../../src/recoil/CenterRecoil";
import UseAuthCode, { UseAuthCodePropsType } from "../../src/hook/UseAuthCode";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }

        interface Chainable {
            mountWithoutRecoil: typeof mount;
            mountWithLogin: typeof mount;
            mountWithCenterLogin: typeof mount;
        }
    }
}

type RecoilObserverPropsType = {
    children: ReactElement | string;
    recoilState: RecoilState<any>;
    value: object;
};

type TitleRecoilStateType = {
    children?: ReactElement | string;
    headerTitle?: string;
    mainTitle?: string;
};

type TextDisplayPopsType = {
    first?: string;
    second?: string;
    third?: string;
    firth?: string;
};

type UsePopupRecoilStateType = {
    title: string;
    src?: string;
    component?: ReactElement;
    onClose?: () => void;
    children: ReactElement | string;
};

type AlertRecoilStateType = {
    title: string;
    content?: string;
    hasIcon?: boolean;
    children: ReactElement | string;
};

type UseNudgeTestPropsType = {
    condition: string;
    utm: string;
    fromRecruitingsSession: boolean;
    numOfOpenRecruitingContentSession?: number;
    children: ReactElement | string;
    clear?: boolean;
};

type UseLoadingTestPropsType = {
    children: ReactElement | string;
};

type PopupRecoilStateType = {
    open: boolean;
    title?: string;
    src?: string;
    component?: ReactElement;
    onClose?: () => void;
    children: ReactElement | string;
    trigger?: boolean;
};

type CaregiverServicePropsType = {
    testProps: PostCaregiverLoginRequestInterface;
    children: ReactElement | string;
};

interface UseAuthCodeTestPropsType extends UseAuthCodePropsType {
    children?: ReactElement | string;
}

export function CreateRouter() {
    return {
        pathname: "/recruitings",
        route: "/",
        query: {},
        asPath: "/",
        components: {},
        isFallback: false,
        basePath: "",
        events: { emit: cy.spy().as("emit"), off: cy.spy().as("off"), on: cy.spy().as("on") },
        push: cy.spy().as("push"),
        replace: cy.spy().as("replace"),
        reload: cy.spy().as("reload"),
        back: cy.spy().as("back"),
        prefetch: cy.stub().as("prefetch").resolves(),
        beforePopState: cy.spy().as("beforePopState"),
    };
}

export function RecoilObserver(props: RecoilObserverPropsType) {
    const { children, recoilState, value } = props;
    const [, setRecoil] = useRecoilState(recoilState);
    const click = () => {
        setRecoil(value);
    };
    return (
        <>
            <button onClick={click} id={"trigger"}>
                trigger
            </button>
            {children}
        </>
    );
}

export function TitleRecoilState(props: TitleRecoilStateType) {
    const { headerTitle, mainTitle, children } = props;
    const setTitleRecoil = useSetRecoilState(titleRecoilState);
    setTitleRecoil({
        headerTitle: headerTitle,
        mainTitle: mainTitle,
    });
    return <>{children}</>;
}

export function PopupRecoilState(props: PopupRecoilStateType) {
    const { open, title, src, component, onClose, children, trigger } = props;
    const setPopupRecoil = useSetRecoilState(popupRecoilState);
    const click = () => {
        setPopupRecoil({
            open: true,
            title: title,
            src: src,
            component: component,
            onClose: onClose,
        });
    };
    return (
        <>
            {trigger ? (
                <button onClick={click} id={"trigger"}>
                    trigger
                </button>
            ) : (
                <></>
            )}
            {children}
        </>
    );
}

export function UseTitleTest(props: TitleRecoilStateType) {
    const { headerTitle, mainTitle } = props;
    UseTitle(headerTitle, mainTitle);
    const titleRecoil = useRecoilValue(titleRecoilState);
    return (
        <>
            <h1 data-cy="main-title">{titleRecoil.mainTitle}</h1>
            <h3 data-cy="header-title">{titleRecoil.headerTitle}</h3>
        </>
    );
}

export function UsePopupTest(props: UsePopupRecoilStateType) {
    const { title, children, src, component, onClose } = props;
    const { openPopup, closePopup } = UsePopup();
    const open = () => {
        openPopup(title, src, component, onClose);
    };
    const close = () => {
        closePopup();
    };
    return (
        <>
            <button data-cy="open-button" onClick={open}>
                open
            </button>
            <button data-cy="close-button" style={{ position: "absolute", zIndex: "99999" }} onClick={close}>
                close
            </button>
            {children}
        </>
    );
}

export function UseAlertTest(props: AlertRecoilStateType) {
    const { title, children, content, hasIcon } = props;
    const { openAlert, closeAlert } = UseAlert();
    const open = () => {
        openAlert(title, content, hasIcon);
    };
    const close = () => {
        closeAlert();
    };
    return (
        <>
            <button data-cy="open-button" onClick={open}>
                open
            </button>
            <button data-cy="close-button" style={{ position: "absolute", zIndex: "99999" }} onClick={close}>
                close
            </button>
            {children}
        </>
    );
}

export function UseLoadingTest({ children }: UseLoadingTestPropsType) {
    const { openLoading, closeLoading } = UseLoading();
    const open = () => {
        openLoading();
    };
    const close = () => {
        closeLoading();
    };
    return (
        <>
            <button data-cy="open-button" onClick={open}>
                open
            </button>
            <button data-cy="close-button" style={{ position: "absolute", zIndex: "99999" }} onClick={close}>
                close
            </button>
            {children}
        </>
    );
}

export function UseNudgeTest(props: UseNudgeTestPropsType) {
    const { utm, fromRecruitingsSession, numOfOpenRecruitingContentSession, children, clear } = props;
    const { handleMountedInHome, handleCloseRecruitingPopup, setFromRecruitings } = UseNudge();
    const test = () => {
        UtmService.remove("utmSource");
        UtmService.set("utmSource", utm);
        setFromRecruitings(fromRecruitingsSession);
        sessionStorage.setItem("numOfOpenRecruitingContent", String(numOfOpenRecruitingContentSession));
        if (clear) {
            sessionStorage.clear();
        }
        handleMountedInHome();
    };

    return (
        <>
            <button data-cy="test-button" onClick={test}>
                test
            </button>
            {children}
        </>
    );
}

export function UseAuthCodeTest(props: UseAuthCodeTestPropsType) {
    const { page, requestTitle, inputTitle, authCodeProcess, onComplete, onError, maxWidth, isPage, showGuideMessage, children } = props;
    const { step, phoneNum, render } = UseAuthCode({
        page,
        requestTitle,
        authCodeProcess,
        inputTitle,
        onComplete,
        onError,
        maxWidth,
        isPage,
        showGuideMessage,
    });

    return (
        <>
            <button data-cy="phone-num" onClick={() => alert(phoneNum.current)}>
                phoneNum
            </button>
            {render()}
            {children}
        </>
    );
}

type TestType = {
    children: ReactNode;
    returnCaregiverService: Omit<keyof ReturnType<typeof UseCaregiverService>, "isLoading" | "caregiverRecoil">;
    args: any;
};

export function TextDisplay(props: TextDisplayPopsType) {
    return (
        <>
            <p data-cy="first">{props.first}</p>
            <p data-cy="second">{props.second}</p>
            <p data-cy="third">{props.third}</p>
            <p data-cy="firth">{props.firth}</p>
        </>
    );
}

Cypress.Commands.add("mount", (component, options) => {
    // Wrap any parent components needed
    return mount(
        <RecoilRoot>
            <ThemeProvider theme={Theme}>{component}</ThemeProvider>
        </RecoilRoot>,
        options,
    );
});

Cypress.Commands.add("mountWithLogin", (component, options) => {
    const initializeState = (snapshot: MutableSnapshot): void => {
        const caregiverRecoilData: CaregiverRecoilType = {
            tokenData: {
                exp: 1670920637,
                iat: 1670913437,
                role: RoleEnum.ROLE_CAREGIVER,
                sub: "010-5038-5902",
            },
            auth: {
                phoneNum: "",
                uuid: "",
                accessToken: "",
                hasDesiredWork: false,
                message: undefined,
            },
        };
        snapshot.set(caregiverRecoilState, caregiverRecoilData);
    };

    return mount(
        <RecoilRoot initializeState={initializeState}>
            <ThemeProvider theme={Theme}>{component}</ThemeProvider>
        </RecoilRoot>,
        options,
    );
});

Cypress.Commands.add("mountWithCenterLogin", (component, options) => {
    const initializeState = (snapshot: MutableSnapshot): void => {
        const caregiverRecoilData: JwtAccessTokenDataInterface = {
            sub: "example",
            role: RoleEnum.ROLE_CENTER,
            exp: 1670920637,
            iat: 1670913437,
        };
        snapshot.set(centerRecoilState, caregiverRecoilData);
    };

    return mount(
        <RecoilRoot initializeState={initializeState}>
            <ThemeProvider theme={Theme}>{component}</ThemeProvider>
        </RecoilRoot>,
        options,
    );
});

Cypress.Commands.add("mountWithoutRecoil", (component, options) => {
    // Wrap any parent components needed
    return mount(component, options);
});

before(() => {
    chai.use(inViewport);
});

// Example use:
// cy.mount(<MyComponent />)
