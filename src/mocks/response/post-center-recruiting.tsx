import { toResponse } from "../functions";
import mock from "../mock";
import terms from "../faker/Terms";

mock.onPost(/\/v1\/centers\/(.*)\/recruitings/).reply(() => [200, toResponse(terms())]);
