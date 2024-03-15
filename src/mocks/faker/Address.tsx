import { faker } from "@faker-js/faker";
import AddressType from "../../type/AddressType";

faker.locale = "ko";
const address = (): AddressType => ({
    lotAddressName: faker.address.secondaryAddress(),
    roadAddressName: faker.address.streetAddress(true),
    lat: parseFloat(faker.address.latitude()),
    lng: parseFloat(faker.address.longitude()),
    zipCode: faker.random.numeric(5),
});
export default address;
