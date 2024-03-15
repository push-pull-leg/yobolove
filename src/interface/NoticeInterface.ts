import { ReactElement } from "react";

interface NoticeInterface {
    /**
     * UseNoticeEffect를 보여줄 기간 (TEST_PERIOD: 테스트 기간, LIVE_PERIOD: 라이브 기간)
     */
    showingPeriods: { TEST_PERIOD: [string, string]; LIVE_PERIOD: [string, string] };
    /**
     * 고유한 이름
     */
    id: string;
    /**
     * 제목
     */
    title?: string;
    /**
     * 메인 콘텐츠
     */
    content: ReactElement;
    /**
     * 확인 버튼에 들어갈 텍스트
     */
    confirmButtonText?: string;
    /**
     * 취소 버튼에 들어갈 텍스트
     */
    cancelButtonText?: string;
    /**
     * 제일 하단에 위치한 서브 버튼의 텍스트
     */
    bottomSubButtonText?: string;
    /**
     * 하단 서브 버튼 클릭 이벤트
     */
    onClickBottomSubButton?: () => void;
    /**
     * 다시 보지 않기 버튼을 노출할지 여부
     */
    isNeverShowNoticeButtonShowing?: boolean;
}

export default NoticeInterface;
