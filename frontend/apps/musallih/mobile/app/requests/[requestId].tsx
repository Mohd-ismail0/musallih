import { useLocalSearchParams } from "expo-router";
import { ListItemCard, SectionCard, StateBlock } from "../../src/components/AppUI";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { createConsumerApi } from "@musallih/api-client";
import { API_BASE_URL } from "../../src/config/api";
import { useMobileAuth } from "../../src/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export default function RequestDetailScreen() {
  const { accessToken, status } = useMobileAuth();
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const api = createConsumerApi({
    baseUrl: API_BASE_URL,
    getToken: async () => accessToken,
  });
  const requestQuery = useQuery({
    queryKey: ["mobile-request", requestId],
    queryFn: () => api.getRequestById(requestId ?? ""),
    enabled: status === "authenticated" && Boolean(requestId),
  });

  return (
    <ScreenScaffold
      title="Request Detail"
      description="Track request status and appointment timeline."
    >
      <SectionCard title="Request overview">
        {requestQuery.isLoading ? (
          <StateBlock
            state="loading"
            title="Loading request details"
            description="Fetching latest request status."
          />
        ) : requestQuery.isError ? (
          <StateBlock
            state="error"
            title="Unable to load request"
            description="Please retry in a moment."
            actionLabel="Retry"
            onAction={() => void requestQuery.refetch()}
          />
        ) : requestQuery.data ? (
          <>
            <ListItemCard title="Request ID" subtitle={requestQuery.data.id} />
            <ListItemCard title="Service" subtitle={requestQuery.data.serviceType} />
            <ListItemCard title="Status" subtitle={requestQuery.data.status} />
          </>
        ) : (
          <StateBlock
            state="empty"
            title="Request not found"
            description="This request may have been removed or is unavailable."
          />
        )}
      </SectionCard>
    </ScreenScaffold>
  );
}
