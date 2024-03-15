import { toResponse } from "../functions";
import mock from "../mock";
import Recruiting from "../faker/Recruiting";

mock.onGet(/\/v1\/recruitings\/(.*)/).reply(() => [200, toResponse(Recruiting())]);
