import { AxiosRequestConfig } from "axios";
import { toResponse } from "../functions";
import mock from "../mock";
import recruiting from "../faker/Recruiting";

mock.onGet(/\/v1\/centers\/(.*)\/recruitings/).reply((config: AxiosRequestConfig) => {
    let size = 10;
    if (config.data) {
        const query = JSON.parse(config.data);
        size = query.size || 10;
    }
    return [200, toResponse([...Array(size)].map(() => recruiting()))];
});
