import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageScaffold } from "@/components/layout/PageScaffold";
import { MapView } from "@/components/map/MapView";
import type { MapEntity, Bbox } from "@/components/map/MapView";
import { useAuth } from "@/auth/AuthProvider";
import { useEffect, useState, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { trackWebEvent } from "@/analytics/analytics";
import { createConsumerApi } from "@musallih/api-client";
import type { OrganizationSummary } from "@musallih/api-client";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import AuthTabsCard from "@/components/ui/auth-tabs-card";

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
    <p className="text-sm text-muted-foreground">
      {label} page scaffold is ready for feature implementation.
    </p>
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
            <a href="/auth">Sign In</a>
          </Button>
          <Button asChild>
            <a href="/auth">Sign Up</a>
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <p className="font-medium">Phone + OTP</p>
            <p className="text-xs text-muted-foreground">
              Passwordless login with SMS verification.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <p className="font-medium">Email + Password</p>
            <p className="text-xs text-muted-foreground">
              Traditional account login and recovery path.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <p className="font-medium">Google</p>
            <p className="text-xs text-muted-foreground">
              One-click OAuth sign in from your Google account.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <p className="font-medium">Apple</p>
            <p className="text-xs text-muted-foreground">
              Privacy-first Apple login for supported browsers.
            </p>
          </div>
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
      <PlaceholderBody label="Session loading" />
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

  const rawEntities = nearbyQuery.isError || nearbyQuery.data?.length === 0 ? fallbackEntities : apiEntities;

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
        <div className="flex flex-wrap gap-2">
          {mapCategories.map((category) => (
            <Badge
              key={category}
              variant={category === activeCategory ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        <div className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in current map scope..."
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
          />
          {activeCategory === "Masjid" && (
            <>
              <p className="text-sm font-medium">Masjid sub-filters</p>
              <div className="flex flex-wrap gap-2">
                {masjidSubFilters.sect.map((value) => (
                  <Badge
                    key={value}
                    variant={sect.includes(value) ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleSect(value)}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {masjidSubFilters.timing.map((value) => (
                  <Badge
                    key={value}
                    variant={timing.includes(value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTiming(value)}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {masjidSubFilters.distance.map((value) => (
                  <Badge
                    key={value}
                    variant={distanceBand === value ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setDistanceBand(distanceBand === value ? null : value)}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="h-[420px] min-h-[320px] w-full">
          <MapView
            entities={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onBoundsChange={setBbox}
          />
        </div>
        {nearbyQuery.isError && (
          <p className="text-sm text-muted-foreground">
            Using sample data. Backend /organizations/nearby will be used when available.
          </p>
        )}
        <div className="space-y-2">
          <p className="text-sm font-medium">Entity list</p>
          {filtered.slice(0, 8).map((entity) => (
            <div
              key={entity.id}
              className="rounded-lg border border-border/60 bg-background/70 p-3"
            >
              <p className="font-medium">{entity.name}</p>
              <p className="text-sm text-muted-foreground">
                {entity.type ?? "—"} · {entity.sect ?? "N/A"} · {entity.openNow ? "Open" : "Closed"}
              </p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/entities/${entity.id}`}>View</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/requests/new?org=${entity.id}`}>Request</Link>
                </Button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${entity.lat},${entity.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline">Directions</Button>
                </a>
              </div>
            </div>
          ))}
        </div>
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

  return (
    <PageScaffold title="Services" description="Service discovery list filtered by map/category context.">
      {servicesQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading services...</p>
      ) : servicesQuery.isError ? (
        <p className="text-sm text-muted-foreground">
          Services endpoint unavailable. UI scaffold remains ready.
        </p>
      ) : (
        <div className="space-y-2">
          {servicesQuery.data.map((service) => (
            <div key={service.id} className="rounded-md border border-border/60 p-2">
              <p className="font-medium">{service.name}</p>
              <p className="text-xs text-muted-foreground">Org: {service.organizationId}</p>
            </div>
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

  return (
    <PageScaffold title="Activities" description="Upcoming events, classes, webinars, and drives.">
      {activitiesQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading activities...</p>
      ) : activitiesQuery.isError ? (
        <p className="text-sm text-muted-foreground">Activities API unavailable.</p>
      ) : (
        <div className="space-y-2">
          {activitiesQuery.data.map((activity) => (
            <div key={activity.id} className="rounded-md border border-border/60 p-2">
              <p className="font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">Org: {activity.organizationId}</p>
            </div>
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

  return (
    <PageScaffold title="Prayer Dashboard" description="Prayer times, next prayer, and jamaat updates.">
      {prayerTimesQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading prayer times...</p>
      ) : prayerTimesQuery.isError ? (
        <p className="text-sm text-muted-foreground">Prayer endpoint unavailable.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(prayerTimesQuery.data)
            .filter(([key]) => key !== "date")
            .map(([key, value]) => (
              <div key={key} className="rounded-md border border-border/60 p-2">
                <p className="text-xs uppercase text-muted-foreground">{key}</p>
                <p className="font-medium">{String(value)}</p>
              </div>
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

  return (
    <PageScaffold title="Hijri Calendar" description="Islamic dates, events, and authority overrides.">
      {hijriQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading Hijri calendar...</p>
      ) : hijriQuery.isError ? (
        <p className="text-sm text-muted-foreground">Hijri endpoint unavailable.</p>
      ) : (
        <div className="space-y-1">
          <p className="text-sm">
            Gregorian: <span className="font-medium">{hijriQuery.data.gregorianDate}</span>
          </p>
          <p className="text-sm">
            Hijri: <span className="font-medium">{hijriQuery.data.hijriDate}</span>
          </p>
        </div>
      )}
    </PageScaffold>
  );
}

export function RequestsListPage() {
  const requestsQuery = useQuery({
    queryKey: ["requests"],
    queryFn: () => consumerApi.getRequests(),
  });

  return (
    <PageScaffold title="Requests" description="Track all service requests and current status.">
      {requestsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading requests...</p>
      ) : requestsQuery.isError ? (
        <p className="text-sm text-muted-foreground">Requests API unavailable.</p>
      ) : (
        <div className="space-y-2">
          {requestsQuery.data.map((request) => (
            <div key={request.id} className="rounded-md border border-border/60 p-2">
              <p className="font-medium">{request.serviceType}</p>
              <p className="text-xs text-muted-foreground">
                {request.status} · Org {request.organizationId}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageScaffold>
  );
}

export function RequestCreatePage() {
  const [draft, setDraft] = useState(() => localStorage.getItem("request_draft") || "");

  useEffect(() => {
    localStorage.setItem("request_draft", draft);
  }, [draft]);

  return (
    <PageScaffold title="Create Request" description="Submit a structured service request.">
      <div className="space-y-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-h-32 w-full rounded-md border border-border/60 bg-background p-3 text-sm"
          placeholder="Draft your request details..."
        />
        <p className="text-xs text-muted-foreground">
          Draft is persisted locally for offline recovery.
        </p>
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
        <p className="text-sm text-muted-foreground">Loading request details...</p>
      ) : requestQuery.isError ? (
        <p className="text-sm text-muted-foreground">Request detail API unavailable.</p>
      ) : requestQuery.data ? (
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-muted-foreground">Service:</span>{" "}
            <span className="font-medium">{requestQuery.data.serviceType}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Status:</span>{" "}
            <span className="font-medium">{requestQuery.data.status}</span>
          </p>
        </div>
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
      <PlaceholderBody label="Profile" />
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
        <div className="rounded-lg border border-border/60 bg-background/60 p-4">
          <p className="text-sm font-medium">Linked providers</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(providers.length ? providers : ["none"]).map((provider) => (
              <Badge key={provider} variant={provider === "none" ? "outline" : "default"}>
                {provider}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-4">
            <p className="text-sm font-medium">Link social providers</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => void runLink(linkGoogle, "Google linked.")}>
                Link Google
              </Button>
              <Button type="button" variant="outline" onClick={() => void runLink(linkApple, "Apple linked.")}>
                Link Apple
              </Button>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-4">
            <p className="text-sm font-medium">Link email + password</p>
            <input
              type="email"
              value={linkEmail}
              onChange={(event) => setLinkEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
            />
            <input
              type="password"
              value={linkPassword}
              onChange={(event) => setLinkPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => void runLink(() => linkEmailPassword(linkEmail, linkPassword), "Email/password linked.")}
            >
              Link Email
            </Button>
          </div>

          <div className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-4 lg:col-span-2">
            <p className="text-sm font-medium">Link phone number</p>
            <input
              type="tel"
              value={linkPhone}
              onChange={(event) => setLinkPhone(event.target.value)}
              placeholder="+60123456789"
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
            />
            {phoneLinkStarted ? (
              <>
                <input
                  type="text"
                  value={linkOtp}
                  onChange={(event) => setLinkOtp(event.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
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
          </div>
        </div>

        {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </PageScaffold>
  );
}
