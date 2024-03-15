import { toResponse } from "../functions";
import mock from "../mock";
import AuthCode from "../faker/AuthCode";

mock.onPost("/v1/auth/code").reply(() => [200, toResponse(AuthCode())]);
