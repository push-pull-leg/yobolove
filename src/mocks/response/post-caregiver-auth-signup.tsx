import { AxiosRequestConfig } from "axios";
import { toBadResponse, toResponse } from "../functions";
import mock from "../mock";
import caregiverAuth from "../faker/CaregiverAuth";
import ResponseErrorCodeEnum from "../../enum/ResponseErrorCodeEnum";
import CaregiverHeader from "../faker/CaregiverHeader";

mock.onPost("/v1/caregivers/auth/signup").reply(
    (config: AxiosRequestConfig) => {
        if (config.data) {
            return [200, toResponse(caregiverAuth()), CaregiverHeader()];
        }
        return [401, toBadResponse(ResponseErrorCodeEnum.FAILED_CODE_AUTHENTICATION, "잘못된 인증코드입니다.")];
    },
    undefined,
    CaregiverHeader(),
);
