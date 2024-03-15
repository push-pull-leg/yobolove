import { toResponse } from "../functions";
import mock from "../mock";
import TermsAgreement from "../faker/TermsAgreement";

mock.onGet(/^\/v1\/centers\/terms\/[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}\/agreement$/).reply(() => [200, toResponse(TermsAgreement())]);
