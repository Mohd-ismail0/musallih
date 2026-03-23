import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { lazy, Suspense, type ComponentType } from "react";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import { NotFound } from "@/pages/NotFound";

const lazyConsumerPage = <T extends keyof typeof import("@/pages/consumer")>(
  exportName: T
) =>
  lazy(async () => {
    const module = await import("@/pages/consumer");
    return { default: module[exportName] as ComponentType };
  });

const AccessHistoryPage = lazyConsumerPage("AccessHistoryPage");
const AccountSecurityPage = lazyConsumerPage("AccountSecurityPage");
const ActivitiesListPage = lazyConsumerPage("ActivitiesListPage");
const ActivityDetailPage = lazyConsumerPage("ActivityDetailPage");
const AnnouncementDetailPage = lazyConsumerPage("AnnouncementDetailPage");
const AnnouncementsFeedPage = lazyConsumerPage("AnnouncementsFeedPage");
const AppointmentSchedulerPage = lazyConsumerPage("AppointmentSchedulerPage");
const CampaignDetailPage = lazyConsumerPage("CampaignDetailPage");
const CampaignsListPage = lazyConsumerPage("CampaignsListPage");
const CompleteProfilePage = lazyConsumerPage("CompleteProfilePage");
const DataExportDeletePage = lazyConsumerPage("DataExportDeletePage");
const DonateFlowPage = lazyConsumerPage("DonateFlowPage");
const DonationHistoryPage = lazyConsumerPage("DonationHistoryPage");
const EditProfilePage = lazyConsumerPage("EditProfilePage");
const EntityDetailPage = lazyConsumerPage("EntityDetailPage");
const FamilyDetailPage = lazyConsumerPage("FamilyDetailPage");
const FamilyListPage = lazyConsumerPage("FamilyListPage");
const HijriCalendarPage = lazyConsumerPage("HijriCalendarPage");
const LocationSettingsPage = lazyConsumerPage("LocationSettingsPage");
const MapPage = lazyConsumerPage("MapPage");
const MemberConsentSettingsPage = lazyConsumerPage("MemberConsentSettingsPage");
const NotificationSettingsPage = lazyConsumerPage("NotificationSettingsPage");
const PrayerDashboardPage = lazyConsumerPage("PrayerDashboardPage");
const PrayerSettingsPage = lazyConsumerPage("PrayerSettingsPage");
const ProfilePage = lazyConsumerPage("ProfilePage");
const RequestAttachmentsPage = lazyConsumerPage("RequestAttachmentsPage");
const RequestCreatePage = lazyConsumerPage("RequestCreatePage");
const RequestDetailPage = lazyConsumerPage("RequestDetailPage");
const RequestReviewSubmitPage = lazyConsumerPage("RequestReviewSubmitPage");
const RequestsListPage = lazyConsumerPage("RequestsListPage");
const SchoolOfThoughtPage = lazyConsumerPage("SchoolOfThoughtPage");
const ServiceDetailPage = lazyConsumerPage("ServiceDetailPage");
const ServicesListPage = lazyConsumerPage("ServicesListPage");
const SessionLoadingPage = lazyConsumerPage("SessionLoadingPage");
const SignInPage = lazyConsumerPage("SignInPage");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { status } = useAuth();
  if (status === "loading") {
    return <SessionLoadingPage />;
  }
  if (status === "signed_out") {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <BrowserRouter>
          <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/map" replace />} />
              <Route path="/auth" element={<SignInPage />} />
              <Route path="/auth/sign-in" element={<Navigate to="/auth" replace />} />
              <Route path="/auth/sign-up" element={<Navigate to="/auth" replace />} />
              <Route path="/auth/signup" element={<Navigate to="/auth" replace />} />
              <Route path="/auth/complete-profile" element={<CompleteProfilePage />} />
              <Route path="/auth/session" element={<SessionLoadingPage />} />
              <Route
                element={
                  <ProtectedRoute>
                    <ConsumerLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/map" element={<MapPage />} />
                <Route path="/entities/:entityId" element={<EntityDetailPage />} />
                <Route path="/discover/services" element={<ServicesListPage />} />
                <Route path="/discover/services/:serviceId" element={<ServiceDetailPage />} />
                <Route path="/discover/activities" element={<ActivitiesListPage />} />
                <Route path="/discover/activities/:activityId" element={<ActivityDetailPage />} />
                <Route path="/prayer" element={<PrayerDashboardPage />} />
                <Route path="/prayer/settings" element={<PrayerSettingsPage />} />
                <Route path="/calendar/hijri" element={<HijriCalendarPage />} />
                <Route path="/requests" element={<RequestsListPage />} />
                <Route path="/requests/new" element={<RequestCreatePage />} />
                <Route path="/requests/attachments" element={<RequestAttachmentsPage />} />
                <Route path="/requests/review" element={<RequestReviewSubmitPage />} />
                <Route path="/requests/:requestId" element={<RequestDetailPage />} />
                <Route path="/appointments/scheduler" element={<AppointmentSchedulerPage />} />
                <Route path="/announcements" element={<AnnouncementsFeedPage />} />
                <Route path="/announcements/:announcementId" element={<AnnouncementDetailPage />} />
                <Route path="/family" element={<FamilyListPage />} />
                <Route path="/family/:familyId" element={<FamilyDetailPage />} />
                <Route path="/consent/member/:memberId" element={<MemberConsentSettingsPage />} />
                <Route path="/consent/access-history" element={<AccessHistoryPage />} />
                <Route path="/consent/data-rights" element={<DataExportDeletePage />} />
                <Route path="/donations/campaigns" element={<CampaignsListPage />} />
                <Route path="/donations/campaigns/:campaignId" element={<CampaignDetailPage />} />
                <Route path="/donations/checkout" element={<DonateFlowPage />} />
                <Route path="/donations/history" element={<DonationHistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
                <Route path="/profile/school-of-thought" element={<SchoolOfThoughtPage />} />
                <Route path="/profile/notifications" element={<NotificationSettingsPage />} />
                <Route path="/profile/location" element={<LocationSettingsPage />} />
                <Route path="/profile/security" element={<AccountSecurityPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
