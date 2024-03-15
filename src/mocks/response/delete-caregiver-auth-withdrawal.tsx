import { toResponse } from "../functions";
import mock from "../mock";

mock.onDelete("/v1/caregivers/auth/withdrawal").reply(() => [200, toResponse(null)]);
