// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";
import JwtTokenInterface from "../../interface/JwtTokenInterface";
import CaregiverJwtAccessTokenData from "./CaregiverJwtAccessTokenData";

const jwtToken = (): JwtTokenInterface => ({
    accessToken: jwt.sign(CaregiverJwtAccessTokenData(), "YOBOLOVE_MOCK"),
});

export default jwtToken;
