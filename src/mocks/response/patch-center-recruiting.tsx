import { toResponse } from "../functions";
import mock from "../mock";

mock.onPatch(/\/v1\/centers\/(.*)\/recruitings\/(.*)/).reply(() => [200, toResponse(null)]);
