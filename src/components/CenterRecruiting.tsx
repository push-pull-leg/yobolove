import { Box, Button, Card, CardContent, CardHeader, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { forwardRef, memo, ReactElement, useMemo, useRef } from "react";
import { useSetRecoilState } from "recoil";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import DateUtil from "../util/DateUtil";
import RecruitingSimpleInterface from "../interface/RecruitingSimpleInterface";
import { GenderLabel } from "../enum/GenderEnum";
import RecruitingStatusEnum, { RecruitingStatusLabel } from "../enum/RecruitingStatusEnum";
import UseCenterService from "../hook/UseCenterService";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import Radio from "./form/Radio";
import RecruitingStatusUpdateEnum, { RecruitingStatusUpdateLabel } from "../enum/RecruitingStatusUpdateEnum";
import PatchCenterRecruitingRequestInterface from "../interface/request/PatchCenterRecruitingRequestInterface";
import UseAlert from "../hook/UseAlert";
import RecruitingService from "../service/RecruitingService";
import { JobSubTitle } from "../enum/JobEnum";
import UseRecruitingModal from "../hook/UseRecuritingModal";
import RecruitingSessionStorageKeys from "../enum/RecruitingSessionStorageKeys";
import StorageUtil from "../util/StorageUtil";
import EventUtil from "../util/EventUtil";

dayjs.extend(relativeTime);

/**
 * {@link CenterRecruiting} props
 * @category PropsType
 */
type CenterRecruitingPropsType = {
    /**
     * 구인공고
     */
    recruiting: RecruitingSimpleInterface;
    /**
     * 상태 변경시 호출되는 이벤트 리스너
     */
    onChange?: (recruiting: RecruitingSimpleInterface) => void;
};

/**
 * 기관용 - 내정보 - 나의공고에 있는 구인공고 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A91241)
 * @category Component
 */
const CenterRecruiting = forwardRef((props: CenterRecruitingPropsType, ref: React.Ref<HTMLDivElement> | undefined) => {
    const { recruiting, onChange } = props;
    const { openAlert } = UseAlert();
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);
    const { updateRecruitingStatus, getRecruitingDetail } = UseCenterService();
    const recruitingStatusUpdateEnum = useRef<RecruitingStatusUpdateEnum | undefined>();
    const { openRecruitingDetailModal } = UseRecruitingModal();

    const handleStatusChange = (_name: string, value: RecruitingStatusUpdateEnum): void => {
        recruitingStatusUpdateEnum.current = value;

        EventUtil.gtmEvent("select", "reason", "cenRecruitings", `${value === RecruitingStatusUpdateEnum.SUCCESS ? "success" : "fail"}`);
    };

    const updateStatus = (currentRecruiting: RecruitingSimpleInterface) => {
        setDialogRecoil({
            open: true,
            title: "구인공고 마감",
            content: (
                <>
                    <br />
                    <Radio<RecruitingStatusUpdateEnum>
                        title=""
                        name="status"
                        onChange={handleStatusChange}
                        defaultValue={undefined}
                        data={RecruitingStatusUpdateLabel}
                        required
                        iconStyle="radio"
                    />
                </>
            ),
            confirmButtonText: "확인",
            hasCancelButton: true,
            onConfirm: async () => {
                EventUtil.gtmEvent("click", "reasonCheck", "cenRecruitings", recruiting.uuid);

                if (!recruitingStatusUpdateEnum.current) {
                    openAlert("마감 이유를 선택해주세요");
                    return;
                }

                const request: PatchCenterRecruitingRequestInterface = {
                    uuid: currentRecruiting.uuid,
                    status: recruitingStatusUpdateEnum.current,
                };

                const isSuccessToUpdateRecruitingStatus = await updateRecruitingStatus(request);

                if (isSuccessToUpdateRecruitingStatus) {
                    openAlert("구인공고 마감 완료");
                    onChange?.(recruiting);
                }
            },
            onCancel: () => {
                EventUtil.gtmEvent("click", "reasonCancel", "cenRecruitings", recruiting.uuid);
            },
        });
    };

    const simpleAddress = `${recruiting.address.regionSecondDepth} ${recruiting.address.regionThirdDepth}`.trim();
    const contents = useMemo<string>(() => {
        const content =
            JobSubTitle.get(recruiting.job) ||
            `${RecruitingService.getGradeTitle(recruiting)}/${GenderLabel.get(recruiting.recipient.gender)}/
                ${recruiting.recipient.age}세`;
        return `[${simpleAddress || recruiting.address.roadAddressName}] ${content}`;
    }, [recruiting?.address, recruiting?.recipient?.grade, recruiting?.recipient?.age, recruiting?.recipient?.gender, recruiting?.job]);

    const statusText = useMemo<ReactElement>(
        () => (
            <Typography variant="caption" color={recruiting.status === RecruitingStatusEnum.IN_PROGRESS ? "primary" : "text.secondary"} sx={{ fontWeight: 700 }}>
                {RecruitingStatusLabel.get(recruiting.status)}
            </Typography>
        ),
        [recruiting.status],
    );

    const handleClickEditButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        EventUtil.gtmEvent("click", "edit", "cenRecruitings", recruiting.uuid);
        StorageUtil.removeItem([RecruitingSessionStorageKeys.WRITTEN_RECRUITING_CONTENT, RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL]);
    };

    const handleClickClosingButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        EventUtil.gtmEvent("click", "end", "cenRecruitings", recruiting.uuid);
        updateStatus(recruiting);
    };

    const handleClickRePostButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        EventUtil.gtmEvent("click", "repost", "cenRecruitings", recruiting.uuid);
        StorageUtil.removeItem([RecruitingSessionStorageKeys.WRITTEN_RECRUITING_CONTENT, RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL]);
    };

    const actionButton = useMemo<ReactElement>(() => {
        if (recruiting.status === RecruitingStatusEnum.IN_PROGRESS) {
            return (
                <Box display="flex" gap={2} component="span">
                    <Link href={`/기관/나의공고/${recruiting.uuid}/공고수정`}>
                        <Button variant="outlined" color="secondary" onClick={handleClickEditButton}>
                            수정
                        </Button>
                    </Link>
                    <Button variant="outlined" color="secondary" onClick={handleClickClosingButton}>
                        마감
                    </Button>
                </Box>
            );
        }

        return (
            <Link href={`/기관/나의공고/${recruiting.uuid}/공고재등록`}>
                <Button variant="outlined" color="secondary" onClick={handleClickRePostButton}>
                    재등록
                </Button>
            </Link>
        );
    }, [recruiting.status]);
    return (
        <div ref={ref}>
            <Card
                sx={{
                    p: 4,
                    borderRadius: 0,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    width: "100%",
                    boxSizing: "border-box",
                }}
                elevation={0}
                raised={false}
                onClick={async () => {
                    EventUtil.gtmEvent("click", "list", "cenRecruitings", recruiting.uuid);

                    const response = await getRecruitingDetail({ uuid: recruiting.uuid });
                    openRecruitingDetailModal(response, `${recruiting.address.roadAddressName}`);
                }}
            >
                <CardHeader
                    title={
                        <Typography data-cy="date" color="text.primary" variant="subtitle2" sx={{ mb: 1 }}>
                            {DateUtil.toString(recruiting.openedDate, "YYYY.M.D")}
                        </Typography>
                    }
                    titleTypographyProps={{ variant: "body1", role: "heading", "data-cy": "title" }}
                    sx={{ p: 0, textAlign: "left", alignItems: "flex-start" }}
                    subheader={
                        <Typography data-cy="date" color="text.secondary" variant="caption" sx={{ mt: 1 }}>
                            {`${DateUtil.toString(recruiting.expiredDate, "YYYY.M.D")} 마감`}
                        </Typography>
                    }
                    action={statusText}
                />
                <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 2.5 } }}>
                    <ListItem disablePadding sx={{ mt: 1, clear: "both", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        <ListItemText primary={contents} primaryTypographyProps={{ variant: "body1" }} secondary={actionButton} secondaryTypographyProps={{ sx: { mt: 5 } }} />
                    </ListItem>
                </CardContent>
            </Card>
        </div>
    );
});

CenterRecruiting.defaultProps = {
    onChange: undefined,
};

export default memo(CenterRecruiting);
