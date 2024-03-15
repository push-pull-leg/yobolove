import { faker } from "@faker-js/faker";
import { toResponse } from "../functions";
import mock from "../mock";

const data = {
    accountId: faker.random.word(),
    createdDate: faker.date.past().toString(),
};

mock.onGet("/v1/centers/terms").reply(() => [200, toResponse(data)]);
