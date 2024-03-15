import { toResponse } from "../functions";
import mock from "../mock";
import caregiverDesiredWork from "../faker/CaregiverDesiredWork";

mock.onPost("/v1/caregivers/desired-work").reply(() => [200, toResponse(caregiverDesiredWork())]);
