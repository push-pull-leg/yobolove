import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { useBeforeunload } from "react-beforeunload";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import { Undefinable } from "../type/Undefinable";

/**
 * UI 컴포넌트에서 이동을 막는 custom hook 입니다. allowMove 가 TRUE 일경우, 이동가능. FALSE 일 경우, 이동 불가능
 * 이동불가능 상태에서는 dialog 열림
 *
 * @param defaultTitle dialog 타이틀
 * @param defaultContent dialog 메세지
 * @param defaultCancelButtonText dialog 취소버튼텍스트
 * @constructor
 * @category Hook
 */
function UsePreventMove(defaultTitle: string, defaultContent: string, defaultCancelButtonText?: string) {
    const router = useRouter();
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);

    const allowMove = useRef<boolean>(true);
    const prevUrl = useRef<Undefinable>();
    const title = useRef<string>(defaultTitle);
    const content = useRef<string>(defaultContent);
    const cancelButtonText = useRef<Undefinable>(defaultCancelButtonText);

    /**
     * dialog 내용 변경. 동적으로 내용을 변경하고 싶을때 사용.
     * @param currentTitle dialog 타이틀
     * @param currentContent dialog 메세지
     * @param currentCancelButtonText dialog 취소버튼텍스트
     */
    const setPreventMoveDialogData = (currentTitle: string, currentContent: string, currentCancelButtonText?: string) => {
        title.current = currentTitle;
        content.current = currentContent;
        cancelButtonText.current = currentCancelButtonText;
    };

    /**
     * 페이지 이동 가능/불가능 설정하기
     * @param currentAllowMove 페이지 이동가능 여부
     */
    const setAllowMove = (currentAllowMove: boolean): void => {
        allowMove.current = currentAllowMove;
    };

    /**
     * back 버튼을 눌렀을 때 해당 모달이 꺼지면 기본 url 로 복귀
     */
    const restoreUrl = async () => {
        if (router.asPath !== window.location.pathname) {
            allowMove.current = true;
            await router.replace(router.asPath, undefined, { shallow: true, scroll: false });
            allowMove.current = false;
        }
    };

    useBeforeunload(event => {
        if (allowMove.current) return;
        event.preventDefault();
    });

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            /**
             * 현재 url 이랑 다르면 prevUrl 저장해둔다. dialog 에서 확인버튼을 누르면 저장된 url 로 페이지 이동
             */
            if (router.asPath !== url) {
                prevUrl.current = url;
            }

            /**
             * 페이지 이동이 가능하면 종료
             */
            if (allowMove.current) return;

            setDialogRecoil({
                open: true,
                title: title.current,
                content: content.current,
                hasCancelButton: true,
                cancelButtonText: cancelButtonText.current || "취소",
                confirmButtonText: "그만두기",
                confirmButtonStyle: "outlined",
                onCancel: restoreUrl,
                onClose: restoreUrl,
                onConfirm: () => {
                    setDialogRecoil({
                        open: false,
                    });
                    setAllowMove(true);
                    router.push(prevUrl.current || url);
                },
            });

            /**
             * 페이지 이동 불가능하면 강제로 Error throw
             */
            if (!allowMove.current) {
                router.events.emit("routeChangeError");
                throw new Error("Cancel rendering route");
            }
        };

        /**
         * route 변경 이벤트 등록 / 해제
         */
        router.events.on("routeChangeStart", handleRouteChange);
        setTimeout(() => {
            router.events.on("routeChangeStart", handleRouteChange);
        }, 1000);
        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, []);
    return { setAllowMove, setPreventMoveDialogData };
}

export default UsePreventMove;
