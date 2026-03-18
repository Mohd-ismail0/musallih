import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { theme } from "../src/theme/theme";
import { MobileAuthProvider } from "../src/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <MobileAuthProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.foreground,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="entity/[entityId]" options={{ title: "Entity Detail" }} />
          <Stack.Screen name="requests/new" options={{ title: "Create Request" }} />
          <Stack.Screen name="requests/[requestId]" options={{ title: "Request Detail" }} />
          <Stack.Screen
            name="announcements/[announcementId]"
            options={{ title: "Announcement Detail" }}
          />
          <Stack.Screen name="announcements/index" options={{ title: "Announcements" }} />
          <Stack.Screen name="family/index" options={{ title: "Family" }} />
          <Stack.Screen name="consent/index" options={{ title: "Consent" }} />
          <Stack.Screen name="donations/index" options={{ title: "Donations" }} />
        </Stack>
      </MobileAuthProvider>
    </QueryClientProvider>
  );
}
