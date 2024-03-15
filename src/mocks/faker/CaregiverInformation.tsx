import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import CaregiverInformationInterface from "../../interface/CaregiverInformationInterface";

const caregiverInformation: CaregiverInformationInterface = {
    phoneNum: faker.phone.number("010-####-####"),
    uuid: faker.datatype.uuid().replaceAll("-", ""),
    hasDesiredWork: false,
};

export default caregiverInformation;
