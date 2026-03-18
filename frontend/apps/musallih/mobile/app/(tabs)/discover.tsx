import { Text, View } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { createConsumerApi } from "@musallih/api-client";
import { API_BASE_URL } from "../../src/config/api";
import { useQuery } from "@tanstack/react-query";

export default function DiscoverTabScreen() {
  const api = createConsumerApi({ baseUrl: API_BASE_URL });
  const servicesQuery = useQuery({
    queryKey: ["mobile-services"],
    queryFn: () => api.getServices(),
  });

  return (
    <ScreenScaffold
      title="Discover"
      description="Services, activities, and organization discovery."
    >
      {servicesQuery.isLoading ? (
        <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
          Loading services...
        </Text>
      ) : servicesQuery.isError ? (
        <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
          Services API unavailable.
        </Text>
      ) : (
        <View style={{ gap: theme.spacing.sm }}>
          {(servicesQuery.data ?? []).map((service) => (
            <Text key={service.id} style={{ color: theme.colors.foreground, fontFamily: theme.fonts.sans }}>
              {service.name}
            </Text>
          ))}
        </View>
      )}
    </ScreenScaffold>
  );
}
