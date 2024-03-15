import { atom, selector } from "recoil";
import { ReactElement } from "react";
import { v1 } from "uuid";
import { ButtonStyleType } from "../type/ButtonStyleType";

/**
 * Dialog 관련 recoil 데이터
 */
interface DialogRecoilStateInterface {
    /**
     * dialog 열림 여부
     */
    open: boolean;
    /**
     * 타이틀
     */
    title?: string | ReactElement;
    /**
     * 내용
     */
    content?: string | ReactElement;
    /**
     * 내용 하단 캡션
     */
    caption?: string;
    /**
     * 취소버튼이 있는지 여부
     */
    hasCancelButton?: boolean;
    /**
     * 확인버튼 텍스트
     */
    confirmButtonText?: string;
    /**
     * 취소버튼 텍스트
     */
    cancelButtonText?: string;
    /**
     * 확인버튼 Variant
     */
    confirmButtonStyle?: ButtonStyleType;
    /**
     * 취소버튼 Variant
     */
    cancelButtonStyle?: ButtonStyleType;
    /**
     * 우측 상단 닫힘 버튼 노출 여부
     */
    hasCloseButton?: boolean;
    /**
     * 확인 버튼 눌렀을 때 이벤튼
     */
    onConfirm?: () => void;
    /**
     *  취소버튼 눌렀을 때 이벤트
     */
    onCancel?: () => void;
    /**
     * 닫기버튼 / 백그라운드 눌렀을 때 이벤트
     */
    onClose?: () => void;
    /**
     * 버튼 정렬 flex-direction.
     */
    flexDirection?: "row" | "column";
    /**
     * 취소버튼 커스터마이징
     */
    cancelButton?: ReactElement;
    /**
     * 확인버튼 여부
     */
    hasConfirmButton?: boolean;
    /**
     * 다이얼로그 제일 하단에 위치한 서브 버튼의 텍스트
     */
    bottomSubButtonText?: string;
    /**
     * 하단 서브 버튼 클릭 이벤트
     */
    onClickBottomSubButton?: () => void;
    /**
     * 백드롭 클릭 시, 다이얼로그 닫기 불가 여부
     */
    isCloseWhenBackDropClick?: boolean;
}

const defaultDialogRecoilStateInterface: DialogRecoilStateInterface = {
    open: false,
    confirmButtonText: "확인",
    hasCancelButton: true,
    hasCloseButton: false,
    confirmButtonStyle: "contained",
    cancelButtonStyle: "outlined",
    onClose: undefined,
    flexDirection: "row",
    cancelButton: undefined,
    hasConfirmButton: true,
    onCancel: undefined,
    bottomSubButtonText: undefined,
    onClickBottomSubButton: undefined,
    isCloseWhenBackDropClick: true,
};

/**
 * @category Recoil
 */
export const dialogRecoilState = atom({
    key: `dialogState${v1()}`,
    default: defaultDialogRecoilStateInterface,
});

/**
 * @category Recoil
 */
export const dialogRecoilSelector = selector({
    key: `dialogSelector${v1()}`,
    get: ({ get }): DialogRecoilStateInterface => get(dialogRecoilState),
});
