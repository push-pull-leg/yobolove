import { faker } from "@faker-js/faker";
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";
import CaregiverAuthInterface from "../../interface/CaregiverAuthInterface";
import CaregiverJwtAccessTokenData from "./CaregiverJwtAccessTokenData";

const caregiverAuth = (): CaregiverAuthInterface => ({
    phoneNum: faker.phone.number("010-####-####"),
    uuid: faker.datatype.uuid().replaceAll("-", ""),
    accessToken: jwt.sign(CaregiverJwtAccessTokenData(), "YOBOLOVE_MOCK"),
    hasDesiredWork: false,
});

export default caregiverAuth;
