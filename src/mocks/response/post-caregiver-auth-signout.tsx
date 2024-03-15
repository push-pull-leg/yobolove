import { toResponse } from "../functions";
import mock from "../mock";

mock.onPost("/v1/caregivers/auth/signout").reply(() => [200, toResponse(null)]);
