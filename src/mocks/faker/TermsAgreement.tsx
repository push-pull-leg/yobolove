import { faker } from "@faker-js/faker";
import TermsAgreementInterface from "../../interface/TermsAgreementInterface";
import Terms from "./Terms";

faker.locale = "ko";
const TermsAgreement = (): TermsAgreementInterface => ({
    terms: Terms(),
    agreedDate: faker.date.recent().toISOString(),
});

export default TermsAgreement;
