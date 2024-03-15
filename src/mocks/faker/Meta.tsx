import { faker } from "@faker-js/faker";
import MetaInterface from "../../interface/response/MetaInterface";

faker.locale = "ko";
const meta = (): MetaInterface => ({
    nextToken: faker.datatype.string(20),
    prevToken: faker.datatype.string(20),
});
export default meta;
