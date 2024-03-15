import { toResponse } from "../functions";
import mock from "../mock";
import CaregiverHeader from "../faker/CaregiverHeader";
import jwtToken from "../faker/JwtToken";

mock.onPost(/\/v1\/caregivers\/auth\/refresh(.*)/).reply(() => [200, toResponse(jwtToken()), CaregiverHeader()], undefined, CaregiverHeader());
