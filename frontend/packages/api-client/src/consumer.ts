import { createApiClient } from "./client";
import { DEFAULT_API_BASE_URL } from "./config";

export interface OrganizationSummary {
  id: string;
  name: string;
  type: string;
  lat?: number;
  lng?: number;
  sect?: string;
  openNow?: boolean;
}

export interface NearbyParams {
  bbox?: string; // minLng,minLat,maxLng,maxLat
  lat?: number;
  lng?: number;
  radiusKm?: number;
  category?: string;
  sect?: string[];
  timing?: string[];
  distanceBand?: string;
  facilities?: string[];
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
    getNearbyOrganizations: (params: NearbyParams) => {
      const query = new URLSearchParams();
      if (params.bbox != null) query.set("bbox", params.bbox);
      if (params.lat != null) query.set("lat", String(params.lat));
      if (params.lng != null) query.set("lng", String(params.lng));
      if (params.radiusKm != null) query.set("radiusKm", String(params.radiusKm));
      if (params.category != null) query.set("category", params.category);
      if (params.sect?.length) query.set("sect", params.sect.join(","));
      if (params.timing?.length) query.set("timing", params.timing.join(","));
      if (params.distanceBand != null) query.set("distanceBand", params.distanceBand);
      if (params.facilities?.length) query.set("facilities", params.facilities.join(","));
      const qs = query.toString();
      return api.get<OrganizationSummary[]>(`/organizations/nearby${qs ? `?${qs}` : ""}`);
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
