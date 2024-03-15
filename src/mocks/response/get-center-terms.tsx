import { faker } from "@faker-js/faker";
import { toResponse } from "../functions";
import mock from "../mock";
import Terms from "../faker/Terms";

const count = faker.datatype.number({
    min: 5,
    max: 10,
});

mock.onGet(/^\/v1\/centers\/terms\?(.*)/).reply(() => [200, toResponse([...Array(count)].map(() => Terms()))]);
