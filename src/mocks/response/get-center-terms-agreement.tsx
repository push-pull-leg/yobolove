import { faker } from "@faker-js/faker";
import { toResponse } from "../functions";
import mock from "../mock";
import TermsAgreement from "../faker/TermsAgreement";

const count = faker.datatype.number({
    min: 4,
    max: 8,
});

const termsList = [...Array(count)].map(() => TermsAgreement());

mock.onGet(/^\/v1\/centers\/terms\/agreement\?(.*)$/).reply(() => [200, toResponse(termsList)]);
