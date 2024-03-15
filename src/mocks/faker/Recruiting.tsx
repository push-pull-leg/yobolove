import { faker } from "@faker-js/faker";
import RecruitingInterface from "../../interface/RecrutingInterface";
import JobEnum, { JobLabel } from "../../enum/JobEnum";
import { WorkTimeType } from "../../type/WorkTimeType";
import Address from "./Address";

function makeRandomDays(days: number[]): WorkTimeType {
    const start = faker.datatype.datetime({ min: 1577718000000, max: 1577800800000 });
    const unixStart = new Date(start).getTime();
    const end = faker.datatype.datetime({ min: unixStart, max: 1577804400000 });
    const realDays: number[] = [];
    const length = faker.datatype.number({ min: 1, max: 7 });

    function findNum(n: number) {
        return realDays.indexOf(n) >= 0;
    }

    let i = 0;
    while (i < length) {
        const day = days[Math.floor(Math.random() * faker.datatype.number({ min: 1, max: 7 }))];
        if (!findNum(day)) {
            realDays.push(day);
            i += 1;
        }
    }

    let result = 0;
    realDays.forEach(num => {
        result += num;
    });
    const startTime: string = `${start}`.substring(16, 24);
    const endTime: string = `${end}`.substring(16, 24);

    return {
        startAt: startTime,
        endAt: endTime,
        days: result,
        memo: null,
        weeklyWorkHours: null,
    };
}

const DAYS: number[] = [1, 2, 4, 8, 16, 32, 64];

faker.locale = "ko";

// @ts-ignore
// TODO Interface 변경 됨에 따라 함수 수정 필요
const Recruiting = (): RecruitingInterface => ({
    uuid: faker.datatype.uuid().replaceAll("-", ""),
    job: faker.helpers.arrayElement(Array.from(JobLabel.keys())) as JobEnum,
    address: Address(),
    workTime: makeRandomDays(DAYS),
    // temporaryDays: [
    //     {
    //         workingDay: DateUtil.toString(faker.date.recent()),
    //     },
    //     {
    //         workingDay: DateUtil.toString(faker.date.soon()),
    //     },
    // ],
    // moveJobOffUnit: faker.helpers.arrayElement(Array.from(MoveJobOffUnitLabel.keys())) as MoveJobOffUnitEnum,
    // moveJobOffDays: Number(faker.random.numeric()),
    // preferCaregiverGender: faker.helpers.arrayElement(Array.from(GenderLabel.keys())) as GenderEnum,
    // payType: faker.helpers.arrayElement(Object.keys(PayTypeLabel)) as PayTypeEnum,
    // pay: Number(faker.random.numeric(6)),
    // recipientGender: faker.helpers.arrayElement(Array.from(GenderLabel.keys())) as GenderEnum,
    // recipientGrade: Number(faker.random.numeric(1)),
    // recipientAge: Number(faker.random.numeric(2)),
    // recipientMotionState: faker.helpers.arrayElement(Array.from(RecipientMotionStateLabel.keys())) as RecipientMotionStateEnum,
    // recipientCognitiveState: faker.helpers.arrayElement(Array.from(RecipientCognitiveStateLabel.keys())) as RecipientCognitiveStateEnum,
    //
    // recipientServiceLifeSet: faker.helpers.arrayElements(Array.from(RecipientServiceLifeLabel.keys())) as unknown as RecipientServiceLifeEnum[],
    // recipientServiceHomeSet: faker.helpers.arrayElements(Array.from(RecipientServiceHomeLabel.keys())) as unknown as RecipientServiceHomeEnum[],
    // recipientServiceCognitiveSet: faker.helpers.arrayElements(Array.from(RecipientServiceCognitiveLabel.keys())) as unknown as RecipientServiceCognitiveEnum[],
    // recipientServiceBodySet: faker.helpers.arrayElements(Array.from(RecipientServiceBodyLabel.keys())) as unknown as RecipientServiceBodyEnum[],
    // recipientMemo: faker.lorem.text(),
    //
    // infoUrl: faker.internet.avatar(),
    // mobileInfoUrl: faker.internet.avatar(),
    // status: faker.helpers.arrayElement(Array.from(RecruitingStatusLabel.keys())) as RecruitingStatusEnum,
    // openedDate: DateUtil.toString(faker.date.past()),
    // expiredDate: DateUtil.toString(faker.date.future()),
    // statusChangedDate: DateUtil.toString(faker.date.past()),
    // distance: faker.datatype.number({ min: 10, max: 10000 }),
    // contactNumber: faker.phone.number("010 #### ####"),
    // certType: faker.helpers.arrayElement(["YOBOLOVE", "WORKNET", "ETC"]) as RecruitingCertTypeEnum,
    // isTemporary: faker.helpers.arrayElement([true, false]),
    // centerName: `${faker.word.adjective()}재가방문요양센터 `,
});

export default Recruiting;
