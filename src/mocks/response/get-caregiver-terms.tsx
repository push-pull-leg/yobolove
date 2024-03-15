import { faker } from "@faker-js/faker";
import { toResponse } from "../functions";
import mock from "../mock";
import terms from "../faker/Terms";

const count = faker.datatype.number({
    min: 4,
    max: 8,
});

mock.onGet(/^\/v1\/caregivers\/terms\?(.*)/).reply(() => [200, toResponse([...Array(count)].map(() => terms()))]);
