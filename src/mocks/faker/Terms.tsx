import { faker } from "@faker-js/faker";
import TermsInterface from "../../interface/TermsInterface";

faker.locale = "ko";
const Terms = (): TermsInterface => ({
    title: faker.lorem.lines(1),
    description: faker.lorem.sentences(2),
    subTitle: faker.lorem.sentences(2),
    url: faker.internet.url(),
    version: faker.system.semver(),
    uuid: faker.datatype.uuid().replaceAll("-", ""),
    active: true,
    required: faker.helpers.arrayElement<boolean>([true, false]),
});

export default Terms;
