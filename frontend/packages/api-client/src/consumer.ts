import { createApiClient } from "./client";
import { DEFAULT_API_BASE_URL } from "./config";

export interface OrganizationSummary {
  id: string;
  name: string;
  type: string;
  lat?: number;
  lng?: number;
}

export interface ServiceSummary {
  id: string;
  name: string;
  organizationId: string;
}

export interface ActivitySummary {
  id: string;
  title: string;
  organizationId: string;
}

export interface PrayerTimesPayload {
  date: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface HijriDatePayload {
  gregorianDate: string;
  hijriDate: string;
}

export interface RequestSummary {
  id: string;
  status: string;
  serviceType: string;
  organizationId: string;
}

interface ConsumerApiOptions {
  baseUrl?: string;
  getToken?: () => Promise<string | null>;
}

export function createConsumerApi(options: ConsumerApiOptions = {}) {
  const api = createApiClient({
    baseUrl: options.baseUrl || DEFAULT_API_BASE_URL,
    getToken: options.getToken,
  });

  return {
    getNearbyOrganizations: (params: Record<string, string | number | boolean>) => {
      const query = new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
      ).toString();
      return api.get<OrganizationSummary[]>(`/organizations/nearby?${query}`);
    },
    getServices: () => api.get<ServiceSummary[]>("/services"),
    getActivities: () => api.get<ActivitySummary[]>("/activities"),
    getPrayerTimes: (city?: string) =>
      api.get<PrayerTimesPayload>(`/prayer/times${city ? `?city=${encodeURIComponent(city)}` : ""}`),
    getHijriDate: (date?: string) =>
      api.get<HijriDatePayload>(
        `/calendar/hijri${date ? `?date=${encodeURIComponent(date)}` : ""}`
      ),
    getRequests: () => api.get<RequestSummary[]>("/requests"),
    getRequestById: (requestId: string) => api.get<RequestSummary>(`/requests/${requestId}`),
    createRequest: (payload: Record<string, unknown>) =>
      api.post<RequestSummary>("/requests", payload),
  };
}
