import { toResponse } from "../functions";
import mock from "../mock";

mock.onPost("/v1/center/auth/signin").reply(() => [200, toResponse(null)]);
