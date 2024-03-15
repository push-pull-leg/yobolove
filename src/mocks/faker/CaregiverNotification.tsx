import { faker } from "@faker-js/faker";
import CaregiverNotificationInterface from "../../interface/CaregiverNotificationInterface";
import DateUtil from "../../util/DateUtil";

const caregiverNotification = (): CaregiverNotificationInterface => ({
    notificationDate: faker.helpers.arrayElement<string | null>([DateUtil.toString(faker.date.between("2022-01-01", "2023-12-31")), null]),
});

export default caregiverNotification;
