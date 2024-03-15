import { useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { titleRecoilState } from "../recoil/TitleRecoil";

/**
 * 페이지별 헤더타이틀, 메인타이틀 설정하는 Custom Hook.
 * mount 초기에 타이틀을 설정해줌.
 * {@link titleRecoilState} 이용
 *
 * @param headerTitle 모바일 기준 헤더 타이틀
 * @param mainTitle PC 기준 메인 컨텐츠 타이틀
 * @constructor
 * @category Hook
 */
function UseTitle(headerTitle?: string, mainTitle?: string) {
    const setTitleRecoil = useSetRecoilState(titleRecoilState);

    /**
     * 페이지별 헤더타이틀, 메인타이틀 동적으로 설정하기
     * @param currentHeaderTitle 모바일 기준 헤더 타이틀
     * @param currentMainTitle PC 기준 메인 컨텐츠 타이틀
     */
    const setTitle = (currentHeaderTitle?: string, currentMainTitle?: string) => {
        setTitleRecoil({
            headerTitle: currentHeaderTitle,
            mainTitle: currentMainTitle,
        });
    };
    useEffect(() => {
        if (headerTitle || mainTitle) {
            setTitleRecoil({
                headerTitle,
                mainTitle,
            });
        }
        return () => {
            setTitleRecoil({
                headerTitle: undefined,
                mainTitle: undefined,
            });
        };
    }, []);
    return { setTitle };
}

export default UseTitle;
