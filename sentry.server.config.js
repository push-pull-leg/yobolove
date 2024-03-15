// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN || "https://3c33427306cd416a9ad37bc524c52361@o4503979226890240.ingest.sentry.io/4503979229511682",
    tracesSampleRate: 1.0,
    denyUrls: [/localhost:3000/],
});
