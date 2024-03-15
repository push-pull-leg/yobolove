import { toResponse } from "../functions";
import mock from "../mock";

mock.onGet(/\/v1\/center\/auth\/(.*)\/exists/).reply(() => [200, toResponse(true)]);
