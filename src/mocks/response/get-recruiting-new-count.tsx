import { faker } from "@faker-js/faker";
import { toResponse } from "../functions";
import mock from "../mock";

mock.onGet("/v1/recruitings/new-count").reply(() => [
    200,
    toResponse({
        newCount: faker.datatype.number({
            min: 10,
            max: 10000,
        }),
    }),
]);
