import React, { forwardRef, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Carousel } from "react-responsive-carousel";
import { useMediaQuery, useTheme } from "@mui/material";
import { css } from "@emotion/css";
import { toRem } from "../styles/options/Function"; // requires a loader
import Recruiting from "./Recruiting";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import breakpoints from "../styles/options/Breakpoints";
import RecruitingSimpleInterface from "../interface/RecruitingSimpleInterface";

const carouselStyle = css`
    ul.slider {
        padding-left: ${toRem(16)};
        padding-right: ${toRem(16)};
        @media (min-width: ${Number(breakpoints.values?.sm)}px) {
            padding-left: ${toRem(24)};
            padding-right: ${toRem(24)};
        }
    }

    li.slide {
        margin-right: ${toRem(8)};
    }
`;

const normalStyle = css`
    display: grid;
    width: 100%;
    max-width: ${toRem(Number(breakpoints.values?.lg))};
    grid-gap: ${toRem(8)};
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    @media screen and (max-width: ${Number(breakpoints.values?.md)}px) {
        grid-template-columns: repeat(1, minmax(0, 1fr));
        @media (min-width: ${Number(breakpoints.values?.sm)}px) {
        }
    }
`;

const simpleStyle = css`
    display: grid;
    width: 100%;
    max-width: ${toRem(Number(breakpoints.values?.lg))};
    gap: ${toRem(8)};
    padding: 0;
    margin: 0 auto;
    grid-template-columns: repeat(3, minmax(0, 1fr));
`;

/**
 * {@link Recruitings} props
 * @category PropsType
 */
type RecruitingPropsType = {
    /**
     * 구인공고 리스트
     */
    recruitings: RecruitingSimpleInterface[];
    /**
     * recruiting style 입니다.
     * @union
     * "simple" - 홈화면에서 쓰는 작은 레이아웃
     * "normal" - 일반 레이아웃
     */
    variant?: "normal" | "simple";
};

/**
 * 리스트형 구인공고 컴포넌트
 *
 * [피그마 시안: simple variant](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1502%3A74627)
 *
 * [피그마 시안: normal variant](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=2559%3A113831)
 * @category Component
 */
// TODO: [페이지 동작 여부 확인 필요] 이유: Recruiting 컴포넌트 interface 수정
const Recruitings = forwardRef((props: RecruitingPropsType, ref: React.Ref<HTMLUListElement> | undefined) => {
    const theme = useTheme();
    const { recruitings, variant } = props;
    const isMdDown = useMediaQuery(theme.breakpoints.up("md"));
    if (variant === "simple" && !isMdDown) {
        return (
            <Carousel
                showArrows={false}
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                className={carouselStyle}
                centerMode
                centerSlidePercentage={66.67}
                width="100%"
                autoPlay={false}
                autoFocus={false}
                emulateTouch
            >
                {recruitings.map((recruiting: RecruitingSimpleInterface) => (
                    <Recruiting recruiting={recruiting} variant={variant} key={`${recruiting.uuid}_${uuidv4()}`} />
                ))}
            </Carousel>
        );
    }
    if (variant === "simple" && isMdDown) {
        return (
            <ul className={simpleStyle} role="listbox">
                {recruitings.map((recruiting: RecruitingSimpleInterface) => (
                    <Recruiting recruiting={recruiting} variant={variant} key={`${recruiting.uuid}_${uuidv4()}`} />
                ))}
            </ul>
        );
    }

    return (
        <ul className={normalStyle} role="listbox" ref={ref}>
            {recruitings.map((recruiting: RecruitingSimpleInterface) => (
                <Recruiting recruiting={recruiting} variant={variant} key={`${recruiting.uuid}_${uuidv4()}`} />
            ))}
        </ul>
    );
});

Recruitings.defaultProps = {
    variant: "normal",
};
export default memo(Recruitings);
