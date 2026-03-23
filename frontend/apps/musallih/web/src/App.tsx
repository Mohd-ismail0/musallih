import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import {
  AccessHistoryPage,
  AccountSecurityPage,
  ActivitiesListPage,
  ActivityDetailPage,
  AnnouncementDetailPage,
  AnnouncementsFeedPage,
  AppointmentSchedulerPage,
  AuthLandingPage,
  CampaignDetailPage,
  CampaignsListPage,
  CompleteProfilePage,
  DataExportDeletePage,
  DonateFlowPage,
  DonationHistoryPage,
  EditProfilePage,
  EntityDetailPage,
  FamilyDetailPage,
  FamilyListPage,
  HijriCalendarPage,
  MapPage,
  MemberConsentSettingsPage,
  NotificationSettingsPage,
  PrayerDashboardPage,
  PrayerSettingsPage,
  RequestAttachmentsPage,
  RequestCreatePage,
  RequestDetailPage,
  RequestReviewSubmitPage,
  RequestsListPage,
  SchoolOfThoughtPage,
  ServiceDetailPage,
  ServicesListPage,
  SessionLoadingPage,
  SignInPage,
  SignUpPage,
  LocationSettingsPage,
  ProfilePage,
} from "@/pages/consumer";
import { NotFound } from "@/pages/NotFound";

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
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
