/**
 * 헤더 좌측 메뉴 리스트 타입
 */
export type MenuType = {
    /**
     * 메뉴 제목
     */
    title: string;
    /**
     * 메뉴 링크
     */
    href: string;
    /**
     * 메뉴 alias
     */
    as: string;
    /**
     * 탭에 사용 되는지 여부
     */
    isTab: boolean;
    /**
     * ListItem 클릭시 실행 될 onClick 함수
     */
    onClick?: () => void;
};
