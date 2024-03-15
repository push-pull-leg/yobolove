import { toResponse } from "../functions";
import mock from "../mock";

mock.onPost(/^\/v1\/caregivers\/terms\/[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}\/agreement$/).reply(() => [200, toResponse(null)]);
