import * as Sentry from "@sentry/solid";

export function initializeMonitoring(dsn: string){
    Sentry.init({
        dsn: dsn,
        // Setting this option to true will send default PII data to Sentry.
        // For example, automatic IP address collection on events
        sendDefaultPii: true
    });

}