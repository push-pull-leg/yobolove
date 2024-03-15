/**
 * z-index를 더하고 빼는 기준 단위를 모아둔 utils
 */
const utils = {
    base: 0,
    above: 100,
    below: -100,
};
const { base, above, below } = utils;

/**
 * MUI 컴포넌트의 z-index 기본 값
 */
const Z_MUI_DEFAULT = {
    MOBILE_STEPPER: 1000,
    FAB: 1050,
    SPEED_DIAL: 1050,
    APP_BAR: 1100,
    DRAWER: 1200,
    MODAL: 1300,
    SNACKBAR: 1400,
    TOOLTIP: 1500,
};

/**
 * STANDARD_COMPONENTS의 베이스가 되는 컴포넌트의 z-index
 */
// SimpleSwiper
export const zSimpleSwiper = Z_MUI_DEFAULT.DRAWER + above;
// LongSwiper
export const zLongSwiper = Z_MUI_DEFAULT.DRAWER;

/**
 * z-index를 주로 사용하는 대표 컴포넌트의 z-index 값
 */
const Z_STANDARD_COMPONENTS = {
    Alert: Z_MUI_DEFAULT.MODAL,
    Dialog: zSimpleSwiper,
    Popup: zLongSwiper,
};

/**
 * ### z-index 상수에 대한 명명 규칙 [z.사용할 파일명.사용할 element명]
 *
 * z: z-index임을 나타내는 접두사
 * 사용될 파일명: z-index를 사용할 파일의 이름
 * 사용될 element명: z-index를 사용할 html 요소의 unique한 이름 (ex. classname, id, 컴포넌트명 등)
 *
 *
 * ### 사용법
 * 모든 z-index는 이 파일에서 관리한다.
 * 사용할 z-index는 모두 변수화하고 import하여 사용한다.
 * 타 컴포넌트의 위/아래에 컴포넌트를 위치시키고 싶다면 '타 컴포넌트의 z-index 변수 + above/below' 형식으로 작성한다.
 */
// RecruitingsFilterDialog
export const zRecruitingsFilterDialogJobSelect = base + above;

// UseNoticeEffect
export const zUseNoticeEffectPopup = Z_STANDARD_COMPONENTS.Dialog + above;
