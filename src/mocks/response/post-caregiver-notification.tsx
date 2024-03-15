import { toResponse } from "../functions";
import mock from "../mock";

mock.onPost("/v1/caregivers/notification").reply(() => [200, toResponse(null)]);
