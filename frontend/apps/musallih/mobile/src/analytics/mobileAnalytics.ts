import { API_BASE_URL } from "../config/api";

export async function trackMobileEvent(
  name: string,
  properties: Record<string, unknown> = {}
) {
  try {
    await fetch(`${API_BASE_URL}/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: name,
        properties,
        source: "mobile",
      }),
    });
  } catch (error) {
    console.warn("Failed to submit mobile analytics event", error);
  }
}
