/**
 * Sentry Error Tracking (Frontend)
 */

let sentryInitialized = false;

export function initSentry() {
  if (sentryInitialized || typeof window === "undefined") return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.log("Sentry DSN not configured");
    return;
  }

  try {
    import("@sentry/nextjs").then((Sentry) => {
      Sentry.init({
        dsn,
        environment: process.env.NODE_ENV || "development",
        tracesSampleRate: 1.0,
      });
      sentryInitialized = true;
    });
  } catch (error) {
    console.error("Failed to initialize Sentry:", error);
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (!sentryInitialized) return;

  import("@sentry/nextjs").then((Sentry) => {
    Sentry.captureException(error, {
      extra: context,
    });
  });
}

