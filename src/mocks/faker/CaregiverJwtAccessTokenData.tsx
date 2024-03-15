import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import JwtAccessTokenDataInterface from "../../interface/JwtAccessTokenDataInterface";
import RoleEnum from "../../enum/RoleEnum";

const CaregiverJwtAccessTokenData = (): JwtAccessTokenDataInterface => ({
    sub: faker.phone.number("010-####-####"),
    uuid: faker.datatype.uuid().replaceAll("-", ""),
    role: RoleEnum.ROLE_CAREGIVER,
    iat: Math.round(faker.date.recent().getTime() / 1000),
    exp: dayjs().unix() + 86400,
});
export default CaregiverJwtAccessTokenData;
