import { toResponse } from "../functions";
import mock from "../mock";

mock.onPut(/\/v1\/centers\/(.*)\/recruitings\/(.*)/).reply(() => [200, toResponse(null)]);
