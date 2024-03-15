import { toResponse } from "../functions";
import mock from "../mock";
import caregiverInformation from "../faker/CaregiverInformation";

mock.onGet("/v1/caregivers/me").reply(() => [200, toResponse(caregiverInformation)]);
