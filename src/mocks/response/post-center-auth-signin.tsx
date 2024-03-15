import { toResponse } from "../functions";
import mock from "../mock";
import jwtToken from "../faker/JwtToken";

mock.onPost("/v1/center/auth/signin").reply(() => [200, toResponse(jwtToken)]);
