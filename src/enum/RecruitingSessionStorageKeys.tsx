/**
 * 공고 관련 session storage key 모음
 *
 * @category Enum
 * @enum
 */
const enum RecruitingSessionStorageKeys {
    /**
     * 해당 공고에 대해 선택 했었던 채널들
     */
    SELECTED_CENTER_ONETOUCH_CHANNEL = "selectedCenterOneTouchChannel",
    /**
     * 공고등록 완료 전, 공고등록 페이지 (이전 페이지)에서 submit해두었던 내용
     */
    WRITTEN_RECRUITING_CONTENT = "writtenRecruitingContent",
}

export default RecruitingSessionStorageKeys;
