/**
 * Analytics integration
 * PostHog setup (optional)
 */

declare global {
  interface Window {
    posthog?: any;
  }
}

export function initAnalytics() {
  if (typeof window === "undefined") return;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!posthogKey) {
    console.log("PostHog not configured");
    return;
  }

  // Lazy load PostHog
  import("posthog-js").then(({ default: posthog }) => {
    if (typeof window !== "undefined") {
      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        loaded: (posthog: any) => {
          if (process.env.NODE_ENV === "development") {
            console.log("PostHog loaded");
          }
        },
      });
      window.posthog = posthog;
    }
  });
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.capture(eventName, properties);
  }
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.identify(userId, properties);
  }
}

