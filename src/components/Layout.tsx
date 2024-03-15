import { ReactElement } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Container, Hidden } from "@mui/material";
import Theme from "../styles/Theme";
import { toRemWithUnit } from "../styles/options/Function";
import Footer from "./Footer";
import Popup from "./Popup";
import MainTitle from "./MainTitle";
import Loading from "./Loading";
import Header from "./Header";
import Dialog from "./Dialog";
import Alert from "./Alert";

/**
 * {@link Layout} props
 * @category PropsType
 */
type LayoutPropsType = {
    /**
     * 메인 영역에 들어갈 children 입니다.
     */
    children: ReactElement;
};
/**
 * Next-js 에서 사용하는 기본 레이아웃입니다. Html head 부분이 공통적으로 들어가고 header 와 main 부분을 렌더링합니다.
 * 외부 스크립트 및 SEO 관련 공통 설정들을 여기에 넣어주세요.
 * 기본 document title 은 APP_NAME v APP _VERSION 입니다.
 * @category Layout
 */

export default function Layout(props: LayoutPropsType) {
    const { children } = props;
    return (
        <ThemeProvider theme={Theme}>
            <Header />
            <Box
                sx={{
                    minHeight: { xs: toRemWithUnit(12), sm: toRemWithUnit(14), md: toRemWithUnit(16) },
                }}
            />
            <Container
                sx={{
                    flex: 1,
                    p: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
                disableGutters
                maxWidth={false}
                component="main"
            >
                <Hidden mdDown>
                    <MainTitle />
                </Hidden>
                {children}
            </Container>
            <Footer />
            <Dialog />
            <Alert />
            <Loading />
            <Popup />
        </ThemeProvider>
    );
}
