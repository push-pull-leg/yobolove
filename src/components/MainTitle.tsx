import React from "react";
import { Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { titleRecoilState } from "../recoil/TitleRecoil";

/**
 * 메인 타이틀 관련 컴포넌트. {@link titleRecoilState} 리코일 데이터를 이용해서 main title 값을 글로벌로 관리해줌.
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1025%3A44508)
 * @category Component
 */
function MainTitle() {
    const titleRecoil = useRecoilValue(titleRecoilState);
    if (titleRecoil.mainTitle) {
        return (
            <Typography variant="h2" data-cy="main-title" color="text.primary" sx={{ pt: 6.5 }}>
                {titleRecoil.mainTitle}
            </Typography>
        );
    }
}

export default React.memo(MainTitle);
