import { Text, View } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { createConsumerApi } from "@musallih/api-client";
import { API_BASE_URL } from "../../src/config/api";
import { useQuery } from "@tanstack/react-query";

export default function PrayerTabScreen() {
  const api = createConsumerApi({ baseUrl: API_BASE_URL });
  const prayerTimesQuery = useQuery({
    queryKey: ["mobile-prayer-times"],
    queryFn: () => api.getPrayerTimes(),
  });

  return (
    <ScreenScaffold
      title="Prayer Dashboard"
      description="Prayer timings, next prayer, and method settings."
    >
      {prayerTimesQuery.isLoading ? (
        <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
          Loading prayer times...
        </Text>
      ) : prayerTimesQuery.isError ? (
        <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
          Prayer API unavailable.
        </Text>
      ) : (
        <View style={{ gap: theme.spacing.sm }}>
          {Object.entries(prayerTimesQuery.data ?? {})
            .filter(([key]) => key !== "date")
            .map(([key, value]) => (
              <Text key={key} style={{ color: theme.colors.foreground, fontFamily: theme.fonts.sans }}>
                {key}: {String(value)}
              </Text>
            ))}
        </View>
      )}
    </ScreenScaffold>
  );
}
