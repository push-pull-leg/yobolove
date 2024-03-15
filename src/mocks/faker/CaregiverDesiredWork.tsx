import { faker } from "@faker-js/faker";
import CaregiverDesiredWorkInterface from "../../interface/CaregiverDesiredWorkInterface";
import GenderEnum, { GenderLabel } from "../../enum/GenderEnum";
import JobEnum, { JobLabel } from "../../enum/JobEnum";
import address from "./Address";

// @ts-ignore
// TODO: [잘 동작하는지 확인] 이유: CaregiverDesiredWorkInterface 수정
const caregiverDesiredWork = (): CaregiverDesiredWorkInterface => ({
    address: address(),
    gender: faker.helpers.arrayElement(Object.keys(GenderLabel)) as GenderEnum,
    preferCareGender: faker.helpers.arrayElement(Object.keys(GenderLabel)) as GenderEnum,
    possibleDistanceMinute: faker.helpers.arrayElement([10, 30, 60]),
    desiredWorkTime: {
        startAt: "09:00:00",
        endAt: "18:00:00",
        days: null,
        memo: null,
        weeklyWorkHours: null,
    },
    caregiverDesiredJobSet: faker.helpers.arrayElements(Object.keys(JobLabel)) as JobEnum[],
    isCompleteDementia: faker.helpers.arrayElement([true, false]),
    isPassCareTest: faker.helpers.arrayElement([true, false]),
    isPossibleCareBedridden: faker.helpers.arrayElement([true, false]),
});

export default caregiverDesiredWork;
