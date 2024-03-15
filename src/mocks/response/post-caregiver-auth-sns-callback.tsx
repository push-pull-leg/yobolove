import { toResponse } from "../functions";
import mock from "../mock";
import caregiverAuth from "../faker/CaregiverAuth";
import CaregiverHeader from "../faker/CaregiverHeader";

mock.onPost(/\/v1\/caregivers\/auth\/(.*)\/callback/).reply(() => [200, toResponse(caregiverAuth()), CaregiverHeader()], undefined, CaregiverHeader());
