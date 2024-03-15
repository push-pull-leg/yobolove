import type { NextPage } from "next";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import { useSetRecoilState } from "recoil";
import React from "react";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import Form from "../components/form/Form";
import Input from "../components/form/Text";
import Select from "../components/form/Select";
import Radio from "../components/form/Radio";
import Phone from "../components/form/Phone";
import MultipleSelect from "../components/form/MultipleSelect";
import Address from "../components/form/Address";
import Date from "../components/form/Date";
import TimeRange from "../components/form/TimeRange";
import Agree from "../components/form/Agree";
import Email from "../components/form/Email";
import PostCaregiverLoginRequestInterface from "../interface/request/PostCaregiverLoginRequestInterface";
import UseAlert from "../hook/UseAlert";
import UseLoading from "../hook/UseLoading";
import UsePopup from "../hook/UsePopup";
import NumberInput from "../components/form/NumberInput";
import Tel from "../components/form/Tel";

const data = new Map();
data.set("ios", "ios");
data.set("material", "material");
data.set("windows", "windows");
/**
 * 홈페이지
 * URI : /
 * 로그인 optional
 *
 * @type NextPage
 * @category page
 * @function Home
 * @link https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1007%3A44585
 * @return ReactElement
 */

const Components: NextPage = function Components() {
    const { openAlert } = UseAlert();
    const { openLoading } = UseLoading();
    const { openPopup } = UsePopup();
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    const openDialog = () => {
        setDialogRecoil({
            open: true,
            title: "test title1",
            content: "text content2",
            caption: "test caption3",
            hasCancelButton: true,
            hasCloseButton: false,
        });
    };
    return (
        <>
            <Typography variant="h1">페이지 테스트</Typography>
            <Link href="/login">로그인페이지</Link>
            <br />
            <Link href="/login-by-phone">핸드폰번호로 로그인하기 페이지</Link>
            <br />
            <Typography variant="h3">기관용</Typography>
            <Link href="/center/find" as="/기관/계정찾기" passHref>
                계정찾기
            </Link>
            <br />
            <Link href="/center/find-id" as="/기관/아이디찾기" passHref>
                아이디찾기
            </Link>
            <br />
            <Link href="/center/find-password" as="/기관/비밀번호찾기" passHref>
                비밀번호찾기
            </Link>
            <br />
            <Typography variant="h1">Button Component</Typography>
            <Button variant="contained" onClick={openDialog}>
                다이얼로그 테스트
            </Button>
            <br />
            <Button variant="outlined" onClick={() => openAlert("alert 테스트")}>
                Alert 테스트
            </Button>
            <br />
            <Button variant="text" onClick={() => openLoading()}>
                Loading 테스트
            </Button>
            <br />
            <Button variant="text" onClick={() => openPopup("네이버", "https://naver.com")}>
                popup 테스트
            </Button>

            <br />
            <br />
            <Typography variant="h1">Card</Typography>
            <Box
                sx={{
                    p: 0,
                    mx: {
                        xs: -4,
                        sm: -6,
                        md: -8,
                    },
                }}
            />
            <br />
            <br />
            <Typography variant="h1">Form</Typography>
            <Form<PostCaregiverLoginRequestInterface> buttonText="다음">
                <Tel name="telInput" />
                <NumberInput name="NumberInput" maxLength={4} />
                <Input title="텍스트필드" name="text" placeholder="텍스트필드를 입력해주세요" required />
                <Input title="비밀번호필드" name="password" type="password" placeholder="비밀번호필드를 입력해주세요" />
                <Phone title="핸드폰필드" defaultValue="01011122222" name="phone" placeholder="핸드폰필드를 입력해주세요" required labelStyle="input" />
                <Address title="주소선택" name="address" placeholder="주소를 선택해주세요" />
                <Select title="셀렉박스" name="select" placeholder="셀렉박스를 입력해주세요" defaultValue="" data={data} required />
                <MultipleSelect title="멀티셀렉박스" name="multipleSelect" placeholder="셀렉박스를 입력해주세요" defaultValue={["ios", "material"]} data={data} required />
                <Date title="날짜선택" name="date" placeholder="날짜를 선택해주세요" required />
                <TimeRange title="근무" name="timerange" placeholder="시간범위선택를 선택해주세요" />
                <Radio title="라디오박스" name="radio" placeholder="라디오박스를 입력해주세요" defaultValue="material" data={data} required />
                <Radio title="라디오박스" name="radio" placeholder="라디오박스를 입력해주세요" defaultValue="material" data={data} row />
            </Form>
            <Agree title="안녕하세요~" name="agree" />
            <Email title="이메일" name="email" required={false} />
        </>
    );
};
export default Components;
