import { AxiosRequestConfig } from "axios";
import { toBadResponse, toResponse } from "../functions";
import mock from "../mock";
import ResponseErrorCodeEnum from "../../enum/ResponseErrorCodeEnum";
import meta from "../faker/Meta";
import RecruitingSimple from "../faker/RecruitingSimple";

mock.onGet(/\/v1\/recruitings\/simple(.*)/).reply((config: AxiosRequestConfig) => {
    let size = 10;
    if (config.data) {
        const query = JSON.parse(config.data);
        size = query.size || 10;
    }

    if (size <= 1) {
        return [500, toBadResponse(ResponseErrorCodeEnum.FAILED_PROCESS_PAGE_TOKEN, "페이징을 위한 토큰 조회 또는 생성에 실패했습니다.")];
    }

    return [
        200,
        toResponse(
            [...Array(size)].map(() => RecruitingSimple()),
            meta(),
        ),
    ];
});
