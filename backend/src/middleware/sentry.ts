/**
 * Sentry Error Tracking
 * Initialize Sentry for error monitoring
 */

let sentryInitialized = false;

export function initSentry() {
  if (sentryInitialized) return;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.log("Sentry DSN not configured, skipping initialization");
    return;
  }

  try {
    // Lazy load Sentry
    import("@sentry/node").then((Sentry) => {
      Sentry.init({
        dsn,
        environment: process.env.NODE_ENV || "development",
        tracesSampleRate: 1.0,
      });
      sentryInitialized = true;
      console.log("✅ Sentry initialized");
    });
  } catch (error) {
    console.error("Failed to initialize Sentry:", error);
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (!sentryInitialized) {
    console.error("Sentry not initialized:", error, context);
    return;
  }

  import("@sentry/node").then((Sentry) => {
    Sentry.captureException(error, {
      extra: context,
    });
  });
}

