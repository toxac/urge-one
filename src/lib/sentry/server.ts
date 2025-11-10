// lib/sentry/server.ts
import * as Sentry from "@sentry/node";

let sentryInitialized = false;

export function initializeMonitoringOnServer() {
  if (sentryInitialized) return;
  Sentry.init({
    dsn: import.meta.env.SENTRY_SERVER_KEY,
    sendDefaultPii: true,
  });
  sentryInitialized = true;
}
