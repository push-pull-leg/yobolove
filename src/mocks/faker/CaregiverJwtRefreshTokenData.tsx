import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import JwtRefreshTokenDataInterface from "../../interface/JwtRefreshTokenDataInterface";

const CaregiverJwtRefreshTokenData = (): JwtRefreshTokenDataInterface => ({
    sub: faker.phone.number("010-####-####"),
    iat: Math.round(faker.date.recent().getTime() / 1000),
    exp: dayjs().unix() + 86400,
});
export default CaregiverJwtRefreshTokenData;
