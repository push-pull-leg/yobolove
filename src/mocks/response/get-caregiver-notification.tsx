import { toResponse } from "../functions";
import mock from "../mock";
import caregiverNotification from "../faker/CaregiverNotification";

mock.onGet("/v1/caregivers/notification").reply(() => [200, toResponse(caregiverNotification())]);
