// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";
import ResponseHeaderInterface from "../../interface/response/ResponseHeaderInterface";
import CaregiverJwtRefreshTokenData from "./CaregiverJwtRefreshTokenData";

const CaregiverHeader = (): ResponseHeaderInterface => ({
    refresh: jwt.sign(CaregiverJwtRefreshTokenData(), "YOBOLOVE_MOCK"),
});

export default CaregiverHeader;
