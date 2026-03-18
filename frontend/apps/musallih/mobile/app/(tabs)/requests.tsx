import { Text, View } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { createConsumerApi } from "@musallih/api-client";
import { API_BASE_URL } from "../../src/config/api";
import { useQuery } from "@tanstack/react-query";

export default function RequestsTabScreen() {
  const api = createConsumerApi({ baseUrl: API_BASE_URL });
  const requestsQuery = useQuery({
    queryKey: ["mobile-requests"],
    queryFn: () => api.getRequests(),
  });

  return (
    <ScreenScaffold
      title="Requests"
      description="Create and track service requests with status timeline."
    >
      {requestsQuery.isLoading ? (
        <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
          Loading requests...
        </Text>
      ) : requestsQuery.isError ? (
        <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
          Requests API unavailable.
        </Text>
      ) : (
        <View style={{ gap: theme.spacing.sm }}>
          {(requestsQuery.data ?? []).map((request) => (
            <Text key={request.id} style={{ color: theme.colors.foreground, fontFamily: theme.fonts.sans }}>
              {request.serviceType} ({request.status})
            </Text>
          ))}
        </View>
      )}
    </ScreenScaffold>
  );
}
