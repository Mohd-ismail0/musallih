import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { webFirebaseApp } from "@/auth/firebase";

let analyticsReady = false;

export async function initWebAnalytics() {
  if (analyticsReady) return;
  const supported = await isSupported();
  if (!supported) return;
  getAnalytics(webFirebaseApp);
  analyticsReady = true;
}

export function trackWebEvent(name: string, params?: Record<string, unknown>) {
  if (!analyticsReady) return;
  const analytics = getAnalytics(webFirebaseApp);
  logEvent(analytics, name, params);
}
