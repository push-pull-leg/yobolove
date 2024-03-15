import { faker } from "@faker-js/faker";
import AuthCodeInterface from "../../interface/AuthCodeInterface";

const maxGenerationCnt = 5;
const AuthCode = (): AuthCodeInterface => ({
    phoneNum: faker.phone.number("010-####-####"),
    generatedCnt: faker.datatype.number({ min: 1, max: maxGenerationCnt }),
    maxGenerationCnt,
    attemptCnt: faker.datatype.number({ min: 1, max: maxGenerationCnt }),
    maxAttemptCnt: maxGenerationCnt,
    createAt: faker.date.recent().toISOString(),
    expireAt: faker.date.soon().toISOString(),
    notificationMessage: faker.lorem.lines(1),
});
export default AuthCode;
