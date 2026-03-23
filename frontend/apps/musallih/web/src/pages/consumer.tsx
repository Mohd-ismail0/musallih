import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageScaffold } from "@/components/layout/PageScaffold";
import { MapView } from "@/components/map/MapView";
import type { MapEntity, Bbox } from "@/components/map/MapView";
import { useAuth } from "@/auth/AuthProvider";
import { useEffect, useState, useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { trackWebEvent } from "@/analytics/analytics";
import { createConsumerApi } from "@musallih/api-client";
import type { OrganizationSummary } from "@musallih/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import AuthTabsCard from "@/components/ui/auth-tabs-card";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState, LoadingState } from "@/components/consumer/states";
import { MetaPair, SectionHeader, StatusBadge, SurfaceCard } from "@/components/consumer/patterns";
import { toast } from "sonner";

const mapCategories = [
  "Masjid",
  "Restaurants",
  "Business",
  "Madrasa",
  "Islamic Orgs",
  "Welfare",
  "Burial",
  "All",
] as const;

const masjidSubFilters = {
  sect: [
    "General",
    "Hanafi",
    "Shafi",
    "Maliki",
    "Hanbali",
    "Ahl-e-Hadith",
    "Jafari",
    "Zaydi",
    "Ismaili",
  ],
  timing: ["OpenNow", "NextPrayerUnder30m", "IqamahUnder30m", "JumuahToday"],
  distance: ["1km", "3km", "5km", "10km", "Any"],
};

type MapCategory = (typeof mapCategories)[number];

const sampleEntities: Array<{
  id: string;
  name: string;
  category: MapCategory;
  lat: number;
  lng: number;
  sect?: string;
  openNow?: boolean;
}> = [
  { id: "m1", name: "Masjid Noor", category: "Masjid", lat: 3.139, lng: 101.686, sect: "Shafi", openNow: true },
  { id: "m2", name: "Masjid Rahmah", category: "Masjid", lat: 3.144, lng: 101.694, sect: "Hanafi", openNow: true },
  { id: "m3", name: "Masjid Tawheed", category: "Masjid", lat: 3.147, lng: 101.691, sect: "General", openNow: false },
  { id: "r1", name: "Sunnah Eats", category: "Restaurants", lat: 3.143, lng: 101.688, openNow: true },
  { id: "b1", name: "Ummah Books", category: "Business", lat: 3.142, lng: 101.687, openNow: true },
  { id: "w1", name: "Mercy Welfare", category: "Welfare", lat: 3.141, lng: 101.692, openNow: true },
];

function orgToMapEntity(o: OrganizationSummary): MapEntity | null {
  if (o.lat == null || o.lng == null) return null;
  return {
    id: o.id,
    name: o.name,
    type: o.type,
    lat: o.lat,
    lng: o.lng,
    sect: o.sect,
    openNow: o.openNow,
  };
}

function sampleToMapEntity(
  e: (typeof sampleEntities)[number]
): MapEntity {
  return {
    id: e.id,
    name: e.name,
    type: e.category === "Masjid" ? "MASJID" : e.category,
    lat: e.lat,
    lng: e.lng,
    sect: e.sect,
    openNow: e.openNow,
  };
}

const consumerApi = createConsumerApi({
  baseUrl: API_BASE_URL,
  getToken: async () => localStorage.getItem("musallih_access_token"),
});

function PlaceholderBody({ label }: { label: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {label} is ready with production layout, responsive spacing, and state patterns.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <SurfaceCard>
          <p className="text-sm font-medium">Consistent card system</p>
          <p className="text-xs text-muted-foreground">Shared surfaces and hierarchy across consumer screens.</p>
        </SurfaceCard>
        <SurfaceCard>
          <p className="text-sm font-medium">Robust states</p>
          <p className="text-xs text-muted-foreground">Loading, empty, and error UX can be dropped in quickly.</p>
        </SurfaceCard>
      </div>
    </div>
  );
}

export function AuthLandingPage() {
  const { status } = useAuth();
  return (
    <PageScaffold
      title="Welcome to Musallih"
      description="Secure sign-in with phone OTP, email/password, Google, or Apple."
      actions={
        <>
          <Button asChild variant="outline">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Sign Up</Link>
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <SurfaceCard className="p-3">
            <p className="font-medium">Phone + OTP</p>
            <p className="text-xs text-muted-foreground">
              Passwordless login with SMS verification.
            </p>
          </SurfaceCard>
          <SurfaceCard className="p-3">
            <p className="font-medium">Email + Password</p>
            <p className="text-xs text-muted-foreground">
              Traditional account login and recovery path.
            </p>
          </SurfaceCard>
          <SurfaceCard className="p-3">
            <p className="font-medium">Google</p>
            <p className="text-xs text-muted-foreground">
              One-click OAuth sign in from your Google account.
            </p>
          </SurfaceCard>
          <SurfaceCard className="p-3">
            <p className="font-medium">Apple</p>
            <p className="text-xs text-muted-foreground">
              Privacy-first Apple login for supported browsers.
            </p>
          </SurfaceCard>
        </div>
        <p className="text-sm text-muted-foreground">Session status: {status}</p>
      </div>
    </PageScaffold>
  );
}

export function SignInPage() {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    startPhoneSignIn,
    verifyPhoneOtp,
  } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    try {
      setError(null);
      setBusy(true);
      await fn();
    } catch {
      setError("Authentication failed. Verify provider setup and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageScaffold title="Sign In" description="Polished auth experience with all supported providers.">
      <AuthTabsCard
        loading={busy}
        error={error}
        onSignInWithEmail={(email, password) => run(() => signInWithEmail(email, password))}
        onSignUpWithEmail={(_name, email, password) =>
          run(() => signUpWithEmail(email, password))
        }
        onSignInWithGoogle={() => run(() => signInWithGoogle())}
        onSignInWithApple={() => run(() => signInWithApple())}
        onStartPhoneAuth={(phoneNumber) =>
          run(() => startPhoneSignIn(phoneNumber, "phone-signin-recaptcha"))
        }
        onVerifyPhoneOtp={(otpCode) => run(() => verifyPhoneOtp(otpCode))}
      />
      <div id="phone-signin-recaptcha" />
    </PageScaffold>
  );
}

export function SignUpPage() {
  return <Navigate to="/auth" replace />;
}

export function CompleteProfilePage() {
  return (
    <PageScaffold
      title="Complete Profile"
      description="Collect mandatory profile details after first sign in."
    >
      <PlaceholderBody label="Complete profile" />
    </PageScaffold>
  );
}

export function SessionLoadingPage() {
  return (
    <PageScaffold title="Restoring Session" description="Refreshing auth and rehydrating app state.">
      <LoadingState
        title="Restoring your session"
        description="Checking authentication providers and secure tokens..."
      />
    </PageScaffold>
  );
}

export function MapPage() {
  const [activeCategory, setActiveCategory] = useState<MapCategory>("Masjid");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 200);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bbox, setBbox] = useState<Bbox | null>(() => [
    101.636, 3.089, 101.736, 3.189,
  ] as Bbox);
  const [sect, setSect] = useState<string[]>([]);
  const [timing, setTiming] = useState<string[]>([]);
  const [distanceBand, setDistanceBand] = useState<string | null>(null);

  const nearbyQuery = useQuery({
    queryKey: [
      "organizations",
      "nearby",
      bbox?.join(",") ?? "",
      activeCategory,
      sect.join(","),
      timing.join(","),
      distanceBand ?? "",
    ],
    queryFn: async () => {
      const params: Parameters<typeof consumerApi.getNearbyOrganizations>[0] = {
        category: activeCategory === "All" ? undefined : activeCategory,
        sect: sect.length ? sect : undefined,
        timing: timing.length ? timing : undefined,
        distanceBand: distanceBand ?? undefined,
      };
      if (bbox) params.bbox = bbox.join(",");
      return consumerApi.getNearbyOrganizations(params);
    },
    enabled: bbox != null,
    staleTime: 60_000,
    retry: 1,
    gcTime: 10 * 60 * 1000,
  });

  const apiEntities = useMemo(() => {
    if (nearbyQuery.data == null) return [];
    return nearbyQuery.data.map(orgToMapEntity).filter((e): e is MapEntity => e != null);
  }, [nearbyQuery.data]);

  const fallbackEntities = useMemo(
    () => sampleEntities.map(sampleToMapEntity),
    []
  );

  const rawEntities = nearbyQuery.isError ? fallbackEntities : apiEntities;

  const filtered = useMemo(() => {
    let list = rawEntities;
    if (activeCategory !== "All") {
      list = list.filter((e) => e.type?.toUpperCase() === activeCategory.toUpperCase().replace(/\s+/g, "_") || e.type === activeCategory);
    }
    if (debouncedSearch) {
      list = list.filter((e) =>
        e.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    return list;
  }, [rawEntities, activeCategory, debouncedSearch]);

  useEffect(() => {
    trackWebEvent("map_home_viewed", { category: activeCategory });
  }, [activeCategory]);

  const toggleSect = (value: string) => {
    setSect((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]));
  };
  const toggleTiming = (value: string) => {
    setTiming((prev) => (prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]));
  };

  return (
    <PageScaffold
      title="Map"
      description="Map-first home. Default category: Masjid with contextual sub-filters."
    >
      <div className="space-y-4">
        <SectionHeader
          title="Nearby organizations"
          subtitle="Browse by category, then refine using contextual filters."
          trailing={<Badge variant="secondary">{filtered.length} visible</Badge>}
        />
        <div className="flex flex-wrap gap-2">
          {mapCategories.map((category) => (
            <Button
              key={category}
              type="button"
              variant={category === activeCategory ? "default" : "outline"}
              size="sm"
              aria-pressed={category === activeCategory}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <SurfaceCard className="space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in current map scope..."
            type="search"
          />
          {activeCategory === "Masjid" && (
            <>
              <p className="text-sm font-medium">Masjid sub-filters</p>
              <div className="flex flex-wrap gap-2">
                {masjidSubFilters.sect.map((value) => (
                  <Button
                    key={value}
                    variant={sect.includes(value) ? "default" : "secondary"}
                    size="sm"
                    type="button"
                    aria-pressed={sect.includes(value)}
                    onClick={() => toggleSect(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {masjidSubFilters.timing.map((value) => (
                  <Button
                    key={value}
                    variant={timing.includes(value) ? "default" : "outline"}
                    size="sm"
                    type="button"
                    aria-pressed={timing.includes(value)}
                    onClick={() => toggleTiming(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {masjidSubFilters.distance.map((value) => (
                  <Button
                    key={value}
                    variant={distanceBand === value ? "default" : "outline"}
                    size="sm"
                    type="button"
                    aria-pressed={distanceBand === value}
                    onClick={() => setDistanceBand(distanceBand === value ? null : value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </>
          )}
        </SurfaceCard>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="h-[420px] min-h-[320px] w-full">
            <MapView
              entities={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onBoundsChange={setBbox}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Entity list</p>
            {filtered.length === 0 ? (
              <EmptyState
                title="No organizations in view"
                description="Try zooming out, moving the map, or clearing filters."
              />
            ) : (
              filtered.slice(0, 8).map((entity) => (
                <SurfaceCard key={entity.id}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{entity.name}</p>
                    <StatusBadge openNow={entity.openNow} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entity.type ?? "—"} · {entity.sect ?? "N/A"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/entities/${entity.id}`}>View</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/requests/new?org=${entity.id}`}>Request</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${entity.lat},${entity.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Directions
                      </a>
                    </Button>
                  </div>
                </SurfaceCard>
              ))
            )}
          </div>
        </div>
        {nearbyQuery.isError && (
          <ErrorState
            title="Live nearby data unavailable"
            description="Showing built-in sample data while the organizations endpoint is unavailable."
          />
        )}
      </div>
    </PageScaffold>
  );
}

export function EntityDetailPage() {
  return (
    <PageScaffold title="Entity Detail" description="Masjid/organization profile and quick actions.">
      <PlaceholderBody label="Entity detail" />
    </PageScaffold>
  );
}

export function ServicesListPage() {
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: () => consumerApi.getServices(),
  });
  const services = servicesQuery.data ?? [];

  return (
    <PageScaffold title="Services" description="Service discovery list filtered by map/category context.">
      {servicesQuery.isLoading ? (
        <LoadingState title="Loading services" />
      ) : servicesQuery.isError ? (
        <ErrorState title="Services unavailable" description="The services endpoint is currently unreachable." />
      ) : services.length === 0 ? (
        <EmptyState title="No services found" description="Try exploring another category or map area." />
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <SurfaceCard key={service.id}>
              <p className="font-medium">{service.name}</p>
              <MetaPair label="Organization" value={service.organizationId} />
            </SurfaceCard>
          ))}
        </div>
      )}
    </PageScaffold>
  );
}

export function ServiceDetailPage() {
  return (
    <PageScaffold title="Service Detail" description="Service details and request CTA.">
      <PlaceholderBody label="Service detail" />
    </PageScaffold>
  );
}

export function ActivitiesListPage() {
  const activitiesQuery = useQuery({
    queryKey: ["activities"],
    queryFn: () => consumerApi.getActivities(),
  });
  const activities = activitiesQuery.data ?? [];

  return (
    <PageScaffold title="Activities" description="Upcoming events, classes, webinars, and drives.">
      {activitiesQuery.isLoading ? (
        <LoadingState title="Loading activities" />
      ) : activitiesQuery.isError ? (
        <ErrorState title="Activities unavailable" description="Unable to fetch activities right now." />
      ) : activities.length === 0 ? (
        <EmptyState title="No upcoming activities" description="Check back soon for new classes and events." />
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <SurfaceCard key={activity.id}>
              <p className="font-medium">{activity.title}</p>
              <MetaPair label="Organization" value={activity.organizationId} />
            </SurfaceCard>
          ))}
        </div>
      )}
    </PageScaffold>
  );
}

export function ActivityDetailPage() {
  return (
    <PageScaffold title="Activity Detail" description="Event details, registration, and replay access.">
      <PlaceholderBody label="Activity detail" />
    </PageScaffold>
  );
}

export function PrayerDashboardPage() {
  const prayerTimesQuery = useQuery({
    queryKey: ["prayer-times"],
    queryFn: () => consumerApi.getPrayerTimes(),
  });
  const prayerTimes = prayerTimesQuery.data;

  return (
    <PageScaffold title="Prayer Dashboard" description="Prayer times, next prayer, and jamaat updates.">
      {prayerTimesQuery.isLoading ? (
        <LoadingState title="Loading prayer times" />
      ) : prayerTimesQuery.isError ? (
        <ErrorState title="Prayer data unavailable" description="Could not retrieve prayer timings." />
      ) : !prayerTimes ? (
        <EmptyState title="Prayer data unavailable" description="No prayer times were returned." />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(prayerTimes)
            .filter(([key]) => key !== "date")
            .map(([key, value]) => (
              <SurfaceCard key={key} className="p-3">
                <p className="text-xs uppercase text-muted-foreground">{key}</p>
                <p className="font-medium">{String(value)}</p>
              </SurfaceCard>
            ))}
        </div>
      )}
    </PageScaffold>
  );
}

export function PrayerSettingsPage() {
  return (
    <PageScaffold
      title="Prayer Settings"
      description="Calculation methods, school of thought, and location preferences."
    >
      <PlaceholderBody label="Prayer settings" />
    </PageScaffold>
  );
}

export function HijriCalendarPage() {
  const hijriQuery = useQuery({
    queryKey: ["hijri-date"],
    queryFn: () => consumerApi.getHijriDate(),
  });
  const hijri = hijriQuery.data;

  return (
    <PageScaffold title="Hijri Calendar" description="Islamic dates, events, and authority overrides.">
      {hijriQuery.isLoading ? (
        <LoadingState title="Loading Hijri date" />
      ) : hijriQuery.isError ? (
        <ErrorState title="Hijri date unavailable" description="Could not fetch calendar data." />
      ) : !hijri ? (
        <EmptyState title="No calendar data" description="No Hijri date payload was returned." />
      ) : (
        <SurfaceCard className="space-y-2">
          <MetaPair label="Gregorian" value={hijri.gregorianDate} />
          <MetaPair label="Hijri" value={hijri.hijriDate} />
        </SurfaceCard>
      )}
    </PageScaffold>
  );
}

export function RequestsListPage() {
  const requestsQuery = useQuery({
    queryKey: ["requests"],
    queryFn: () => consumerApi.getRequests(),
  });
  const requests = requestsQuery.data ?? [];

  return (
    <PageScaffold title="Requests" description="Track all service requests and current status.">
      {requestsQuery.isLoading ? (
        <LoadingState title="Loading requests" />
      ) : requestsQuery.isError ? (
        <ErrorState title="Requests unavailable" description="Unable to load your requests right now." />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description="Your submitted service requests will appear here."
          action={
            <Button asChild size="sm">
              <Link to="/requests/new">Create a request</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <Link key={request.id} to={`/requests/${request.id}`} className="block">
              <SurfaceCard className="transition-colors hover:border-accent/50">
                <p className="font-medium">{request.serviceType}</p>
                <p className="text-xs text-muted-foreground">{request.status} · Org {request.organizationId}</p>
              </SurfaceCard>
            </Link>
          ))}
        </div>
      )}
    </PageScaffold>
  );
}

export function RequestCreatePage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(() => localStorage.getItem("request_draft") || "");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createRequestMutation = useMutation({
    mutationFn: () =>
      consumerApi.createRequest({
        description: draft,
        serviceType: "General",
      }),
    onSuccess: (request) => {
      localStorage.removeItem("request_draft");
      setDraft("");
      toast.success("Request submitted successfully.");
      navigate(`/requests/${request.id}`);
    },
    onError: () => {
      setSubmitError("Unable to submit request. Please verify account/session and try again.");
    },
  });

  useEffect(() => {
    localStorage.setItem("request_draft", draft);
  }, [draft]);

  return (
    <PageScaffold title="Create Request" description="Submit a structured service request.">
      <div className="space-y-3">
        <label htmlFor="request-draft" className="text-sm font-medium">
          Request details
        </label>
        <textarea
          id="request-draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-h-32 w-full rounded-md border border-border/60 bg-background p-3 text-sm"
          placeholder="Draft your request details..."
        />
        <p className="text-xs text-muted-foreground">
          Draft is persisted locally for offline recovery.
        </p>
        {submitError ? <p className="text-xs text-destructive">{submitError}</p> : null}
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={!draft.trim() || createRequestMutation.isPending}
            onClick={() => {
              setSubmitError(null);
              createRequestMutation.mutate();
            }}
          >
            {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </div>
    </PageScaffold>
  );
}

export function RequestAttachmentsPage() {
  return (
    <PageScaffold title="Request Attachments" description="Upload request documents and evidence files.">
      <PlaceholderBody label="Request attachments" />
    </PageScaffold>
  );
}

export function RequestReviewSubmitPage() {
  return (
    <PageScaffold title="Review & Submit" description="Final review before request submission.">
      <PlaceholderBody label="Request review submit" />
    </PageScaffold>
  );
}

export function RequestDetailPage() {
  const { requestId = "" } = useParams<{ requestId: string }>();
  const requestQuery = useQuery({
    queryKey: ["request", requestId],
    queryFn: () => consumerApi.getRequestById(requestId),
    enabled: Boolean(requestId),
  });

  return (
    <PageScaffold title="Request Detail" description="Status timeline and secure communications.">
      {requestQuery.isLoading ? (
        <LoadingState title="Loading request details" />
      ) : requestQuery.isError ? (
        <ErrorState title="Request detail unavailable" description="Unable to fetch this request." />
      ) : requestQuery.data ? (
        <SurfaceCard className="space-y-2">
          <MetaPair label="Service" value={requestQuery.data.serviceType} />
          <MetaPair label="Status" value={requestQuery.data.status} />
        </SurfaceCard>
      ) : (
        <PlaceholderBody label="Request detail" />
      )}
    </PageScaffold>
  );
}

export function AppointmentSchedulerPage() {
  return (
    <PageScaffold title="Appointment Scheduler" description="Select available slots and confirm timing.">
      <PlaceholderBody label="Appointment scheduler" />
    </PageScaffold>
  );
}

export function AnnouncementsFeedPage() {
  return (
    <PageScaffold title="Announcements" description="Organization and authority broadcasts.">
      <PlaceholderBody label="Announcements feed" />
    </PageScaffold>
  );
}

export function AnnouncementDetailPage() {
  return (
    <PageScaffold title="Announcement Detail" description="Detailed announcement content and actions.">
      <PlaceholderBody label="Announcement detail" />
    </PageScaffold>
  );
}

export function FamilyListPage() {
  return (
    <PageScaffold title="Family" description="Manage family groups and member profiles.">
      <PlaceholderBody label="Family list" />
    </PageScaffold>
  );
}

export function FamilyDetailPage() {
  return (
    <PageScaffold title="Family Detail" description="Member details, roles, and relationships.">
      <PlaceholderBody label="Family detail" />
    </PageScaffold>
  );
}

export function MemberConsentSettingsPage() {
  return (
    <PageScaffold title="Member Consent" description="Field-level consent controls per family member.">
      <PlaceholderBody label="Member consent settings" />
    </PageScaffold>
  );
}

export function AccessHistoryPage() {
  return (
    <PageScaffold title="Access History" description="Audit trail of sensitive data access events.">
      <PlaceholderBody label="Access history" />
    </PageScaffold>
  );
}

export function DataExportDeletePage() {
  return (
    <PageScaffold title="Data Rights" description="Export data and request account deletion.">
      <PlaceholderBody label="Data export delete" />
    </PageScaffold>
  );
}

export function CampaignsListPage() {
  return (
    <PageScaffold title="Campaigns" description="Explore donation drives and community campaigns.">
      <PlaceholderBody label="Campaigns list" />
    </PageScaffold>
  );
}

export function CampaignDetailPage() {
  return (
    <PageScaffold title="Campaign Detail" description="Campaign transparency and donation options.">
      <PlaceholderBody label="Campaign detail" />
    </PageScaffold>
  );
}

export function DonateFlowPage() {
  return (
    <PageScaffold title="Donate" description="Complete donation and view confirmation.">
      <PlaceholderBody label="Donate flow" />
    </PageScaffold>
  );
}

export function DonationHistoryPage() {
  return (
    <PageScaffold title="Donation History" description="Track your past contributions and receipts.">
      <PlaceholderBody label="Donation history" />
    </PageScaffold>
  );
}

export function ProfilePage() {
  return (
    <PageScaffold title="Profile" description="Account profile and personal settings overview.">
      <div className="space-y-4">
        <SurfaceCard className="space-y-1">
          <p className="text-sm font-medium">Manage your account</p>
          <p className="text-sm text-muted-foreground">
            Update profile details, school preferences, notifications, location, and security providers.
          </p>
        </SurfaceCard>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild variant="outline" className="justify-start">
            <Link to="/profile/edit">Edit profile</Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link to="/profile/school-of-thought">School of thought</Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link to="/profile/notifications">Notification settings</Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link to="/profile/location">Location settings</Link>
          </Button>
          <Button asChild variant="outline" className="justify-start sm:col-span-2">
            <Link to="/profile/security">Account security</Link>
          </Button>
        </div>
      </div>
    </PageScaffold>
  );
}

export function EditProfilePage() {
  return (
    <PageScaffold title="Edit Profile" description="Update personal details and attributes.">
      <PlaceholderBody label="Edit profile" />
    </PageScaffold>
  );
}

export function SchoolOfThoughtPage() {
  return (
    <PageScaffold
      title="School of Thought"
      description="Manage school of thought preferences used in app logic."
    >
      <PlaceholderBody label="School of thought" />
    </PageScaffold>
  );
}

export function NotificationSettingsPage() {
  return (
    <PageScaffold title="Notification Settings" description="Control alerts and broadcast preferences.">
      <PlaceholderBody label="Notification settings" />
    </PageScaffold>
  );
}

export function LocationSettingsPage() {
  return (
    <PageScaffold title="Location Settings" description="Manage location permissions and defaults.">
      <PlaceholderBody label="Location settings" />
    </PageScaffold>
  );
}

export function AccountSecurityPage() {
  const {
    getLinkedProviders,
    linkGoogle,
    linkApple,
    linkEmailPassword,
    linkPhoneNumber,
  } = useAuth();
  const [linkEmail, setLinkEmail] = useState("");
  const [linkPassword, setLinkPassword] = useState("");
  const [linkPhone, setLinkPhone] = useState("");
  const [linkOtp, setLinkOtp] = useState("");
  const [phoneLinkStarted, setPhoneLinkStarted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const providers = getLinkedProviders();

  const runLink = async (fn: () => Promise<void>, success: string) => {
    try {
      setError(null);
      setMessage(null);
      await fn();
      setMessage(success);
    } catch {
      setError("Provider linking failed. Ensure provider is enabled in Firebase console.");
    }
  };

  return (
    <PageScaffold title="Account Security" description="Manage login providers and security controls.">
      <div className="space-y-4">
        <SurfaceCard>
          <p className="text-sm font-medium">Linked providers</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(providers.length ? providers : ["none"]).map((provider) => (
              <Badge key={provider} variant={provider === "none" ? "outline" : "default"}>
                {provider}
              </Badge>
            ))}
          </div>
        </SurfaceCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SurfaceCard className="space-y-2">
            <p className="text-sm font-medium">Link social providers</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => void runLink(linkGoogle, "Google linked.")}>
                Link Google
              </Button>
              <Button type="button" variant="outline" onClick={() => void runLink(linkApple, "Apple linked.")}>
                Link Apple
              </Button>
            </div>
          </SurfaceCard>

          <SurfaceCard className="space-y-2">
            <p className="text-sm font-medium">Link email + password</p>
            <Input
              type="email"
              value={linkEmail}
              onChange={(event) => setLinkEmail(event.target.value)}
              placeholder="Email"
            />
            <Input
              type="password"
              value={linkPassword}
              onChange={(event) => setLinkPassword(event.target.value)}
              placeholder="Password"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => void runLink(() => linkEmailPassword(linkEmail, linkPassword), "Email/password linked.")}
            >
              Link Email
            </Button>
          </SurfaceCard>

          <SurfaceCard className="space-y-2 lg:col-span-2">
            <p className="text-sm font-medium">Link phone number</p>
            <Input
              type="tel"
              value={linkPhone}
              onChange={(event) => setLinkPhone(event.target.value)}
              placeholder="+60123456789"
            />
            {phoneLinkStarted ? (
              <>
                <Input
                  type="text"
                  value={linkOtp}
                  onChange={(event) => setLinkOtp(event.target.value)}
                  placeholder="6-digit OTP"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    void runLink(
                      () => linkPhoneNumber(linkPhone, "phone-link-recaptcha", linkOtp),
                      "Phone linked."
                    )
                  }
                >
                  Verify & Link Phone
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void runLink(async () => {
                    await linkPhoneNumber(linkPhone, "phone-link-recaptcha");
                    setPhoneLinkStarted(true);
                  }, "OTP sent.")
                }
              >
                Send Link OTP
              </Button>
            )}
            <div id="phone-link-recaptcha" />
          </SurfaceCard>
        </div>

        {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </PageScaffold>
  );
}
