import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import sectionStyle from "../../styles/sectionStyle";
import Form from "../../components/form/Form";
import Radio from "../../components/form/Radio";
import PostCaregiverNotificationRequestInterface from "../../interface/request/PostCaregiverNotificationRequestInterface";
import NotificationValueEnum, { NotificationValueLabel } from "../../enum/NotificationEnum";
import NotificationDateEnum, { NotificationDateLabel } from "../../enum/NotificationDateEnum";
import NotificationOffReasonEnum, { NotificationOffReasonLabel } from "../../enum/NotificationOffReasonEnum";
import Date from "../../components/form/Date";
import Text from "../../components/form/Text";
import DateUtil from "../../util/DateUtil";
import WithCaregiverAuth from "../../hoc/WithCaregiverAuth";
import usePreventMove from "../../hook/UsePreventMove";
import UseCaregiverService from "../../hook/UseCaregiverService";
import Skeleton from "../../components/skeleton/ListSkeleton";
import UseTitle from "../../hook/UseTitle";
import WithHeadMetaData from "../../hoc/WithHeadMetaData";
import { Undefinable } from "../../type/Undefinable";

/**
 * 구직자서비스 - 맞춤일자리알림
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A89103)
 * @category Page
 * @Caregiver
 */
const Notification: NextPage = function Notification() {
    UseTitle("맞춤 일자리 알림", "맞춤 일자리 알림");
    const { setAllowMove } = usePreventMove("알림 여부 변경을 그만두시겠어요?", "나가면 입력했던 내용이 사라집니다.");
    const { isLoading, getNotification, setNotification, getNotificationValueByDate } = UseCaregiverService();

    /**
     * 알림 받을 일시
     */
    const notificationDate = useRef<string | null>(null);
    /**
     * 알림 중단 이유
     */
    const notificationOffReason = useRef<Undefinable>();
    const [value, setValue] = useState<NotificationValueEnum | undefined>(undefined);
    /**
     * 알림 예약 선택지
     */
    const [notificationDateValue, setNotificationDateValue] = useState<NotificationDateEnum | undefined>(undefined);
    /**
     * 알림 중단 선택지
     */
    const [notificationOffReasonValue, setNotificationOffReasonValue] = useState<NotificationOffReasonEnum | undefined>(undefined);

    /**
     * 알림 수신/예약/중단 값 변경
     * #### case 1. 수신인 경우, 알림 받을 날짜를 현재로 변경. 알림 중단 선택지 및 예약 날짜 선택지 reset
     * #### case 2. 예약인 경우, 알림 중단 선택지를 reset
     * @param _name
     * @param currentValue
     */
    const handleValueChange = (_name: string, currentValue: NotificationValueEnum) => {
        setValue(currentValue);

        if (currentValue === NotificationValueEnum.SUBSCRIBED) {
            setNotificationDateValue(undefined);
            setNotificationOffReasonValue(undefined);
            notificationDate.current = DateUtil.now();
        } else if (currentValue === NotificationValueEnum.RESERVED) {
            setNotificationOffReasonValue(undefined);
        } else {
            setNotificationDateValue(undefined);
            notificationDate.current = null;
        }
    };

    /**
     * 알림 받을 예약일시 설정. 값이 한달 후 인경우, 직접 계산해서 {@link notificationDate}에 값을 넣어준다.
     * @param _name
     * @param currentValue
     */
    const handleDateValueChange = (_name: string, currentValue: NotificationDateEnum) => {
        setNotificationDateValue(currentValue);
        if (currentValue === NotificationDateEnum.ONE_MONTH) {
            notificationDate.current = dayjs().add(1, "month").format("YYYY-MM-DD").toString();
        }
    };

    /**
     * Date 변경 될 때, {@link notificationDate}에 값 저장
     * @param _name
     * @param currentValue
     */
    const handleDateChange = (_name: string, currentValue: string) => {
        notificationDate.current = currentValue;
    };

    /**
     * 중단 사유 변경 될 때, {@link notificationOffReason}에 값을 저장하고, 직접입력이 아닌경우 {@link notificationOffReason}에도 값을 저장함.
     * @param _name
     * @param currentValue
     */
    const handleReasonValueChange = (_name: string, currentValue: NotificationOffReasonEnum) => {
        notificationDate.current = null;
        setNotificationOffReasonValue(currentValue);
        if (currentValue !== NotificationOffReasonEnum.DIRECTLY_WRITING) {
            notificationOffReason.current = currentValue;
        }
    };

    /**
     * 중단 사유 직접입력시, {@link notificationOffReason}에 값 저장
     * @param _name
     * @param currentValue
     */
    const handleReasonChange = (_name: string, currentValue: string) => {
        notificationOffReason.current = currentValue.trim();
    };

    /**
     * 일자리 알림 수신 여부 가져오기. {@link getNotification} 을 통해 데이터를 불러온뒤 내부 state 변수로 저장. notificationDate도 로컬 변수로 저장.
     * mount 시에 실행
     */
    const getCaregiverNotification = async (): Promise<void> => {
        const notification = await getNotification();
        if (!notification) return;

        notificationDate.current = notification.notificationDate;
        setValue(getNotificationValueByDate(notification.notificationDate));
    };

    /**
     * 일자리 알림 내역 저장하기
     * @param request
     */
    const setCaregiverNotification = async (request: PostCaregiverNotificationRequestInterface): Promise<void> => {
        setAllowMove(true);
        await setNotification(Object.assign(request, { notificationDate: notificationDate.current, offReason: notificationOffReason.current }));
    };

    useEffect(() => {
        getCaregiverNotification();
    }, []);

    /**
     * 각 선택지 별 추가 항목 랜더링
     */
    const additionalSelectionDom = () => {
        if (!value) return <div />;

        if (value === NotificationValueEnum.RESERVED) {
            return (
                <>
                    <Radio<NotificationDateEnum>
                        title="언제부터 받으실래요?"
                        name="notificationDateValue"
                        defaultValue={notificationDateValue}
                        data={NotificationDateLabel}
                        required
                        onChange={handleDateValueChange}
                        iconStyle="radio"
                        labelVariant="h3"
                    />
                    {notificationDateValue === NotificationDateEnum.DIRECTLY_WRITING && (
                        <Date
                            title=""
                            name="notificationDate"
                            placeholder="날짜를 입력해주세요"
                            defaultValue={notificationDate.current || DateUtil.now()}
                            required
                            onChange={handleDateChange}
                            autoFocus
                        />
                    )}
                </>
            );
        }
        if (value === NotificationValueEnum.ABORTED) {
            return (
                <>
                    <Radio<NotificationOffReasonEnum>
                        title="중단 이유를 알려주세요."
                        name="notificationOffReason"
                        defaultValue={notificationOffReasonValue}
                        data={NotificationOffReasonLabel}
                        required
                        onChange={handleReasonValueChange}
                        iconStyle="radio"
                        labelVariant="h3"
                    />
                    {notificationOffReasonValue === NotificationOffReasonEnum.DIRECTLY_WRITING && (
                        <Text title="" name="offReason" placeholder="직접 입력해주세요" required onChange={handleReasonChange} autoFocus />
                    )}
                </>
            );
        }

        return <div />;
    };

    if (isLoading || !value) {
        return <Skeleton />;
    }
    return (
        <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm", true)}>
            <Form<PostCaregiverNotificationRequestInterface> buttonText="변경내용 저장" onSubmit={setCaregiverNotification} onChange={() => setAllowMove(false)}>
                <Typography variant="h3">일자리 알림을 받으시겠어요?</Typography>
                <Radio<NotificationValueEnum> title="" name="notificationValue" defaultValue={value} data={NotificationValueLabel} required onChange={handleValueChange} />

                {additionalSelectionDom()}
            </Form>
        </Box>
    );
};

export default WithHeadMetaData(Notification);

export const getServerSideProps: GetServerSideProps = WithCaregiverAuth(undefined, true);
