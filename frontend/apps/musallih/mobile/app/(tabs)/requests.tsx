import { ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { Button } from "../../src/components/Button";
import { ListItemCard, SectionCard, StateBlock } from "../../src/components/AppUI";
import { createConsumerApi } from "@musallih/api-client";
import { API_BASE_URL } from "../../src/config/api";
import { useQuery } from "@tanstack/react-query";
import { theme } from "../../src/theme/theme";
import { useMobileAuth } from "../../src/auth/AuthProvider";

export default function RequestsTabScreen() {
  const { accessToken, status } = useMobileAuth();
  const api = createConsumerApi({
    baseUrl: API_BASE_URL,
    getToken: async () => accessToken,
  });
  const requestsQuery = useQuery({
    queryKey: ["mobile-requests"],
    queryFn: () => api.getRequests(),
    enabled: status === "authenticated",
  });

  return (
    <ScreenScaffold
      title="Requests"
      description="Create and track service requests with status timeline."
    >
      <ScrollView contentContainerStyle={styles.content}>
        <SectionCard
          title="Your requests"
          subtitle="Track updates and appointments."
          rightSlot={<Button title="New" onPress={() => router.push("/requests/new")} variant="outline" />}
        >
      {requestsQuery.isLoading ? (
            <StateBlock
              state="loading"
              title="Loading requests"
              description="Syncing your request history."
            />
      ) : requestsQuery.isError ? (
            <StateBlock
              state="error"
              title="Requests unavailable"
              description="Unable to fetch your requests right now."
              actionLabel="Retry"
              onAction={() => void requestsQuery.refetch()}
            />
      ) : (
            <>
              {(requestsQuery.data ?? []).map((request) => (
                <ListItemCard
                  key={request.id}
                  title={request.serviceType}
                  subtitle={`Request #${request.id.slice(0, 8)}`}
                  rightMeta={request.status}
                  onPress={() => router.push(`/requests/${request.id}`)}
                />
              ))}
              {(requestsQuery.data?.length ?? 0) === 0 ? (
                <StateBlock
                  state="empty"
                  title="No requests yet"
                  description="Create your first request to get started."
                  actionLabel="Create request"
                  onAction={() => router.push("/requests/new")}
                />
              ) : null}
            </>
      )}
        </SectionCard>
      </ScrollView>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
});
