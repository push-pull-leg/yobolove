import { faker } from "@faker-js/faker";
import CenterMeCertFileInterface from "../../interface/CenterMeCertFileInterface";

const CenterMeCertFile = (): CenterMeCertFileInterface => ({
    certFileAsBase64: faker.image.dataUri(),
});

export default CenterMeCertFile;
