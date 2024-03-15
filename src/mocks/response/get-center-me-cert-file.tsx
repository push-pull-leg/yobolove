import { toResponse } from "../functions";
import mock from "../mock";
import CenterMeCertFile from "../faker/CenterMeCertFile";

mock.onGet("/v1/centers/me/cert-file").reply(() => [200, toResponse(CenterMeCertFile())]);
