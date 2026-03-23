import { ScrollView, StyleSheet, Text } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { ListItemCard, SectionCard, StateBlock } from "../../src/components/AppUI";
import { createConsumerApi } from "@musallih/api-client";
import { API_BASE_URL } from "../../src/config/api";
import { useQuery } from "@tanstack/react-query";
import { theme } from "../../src/theme/theme";

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
      <ScrollView contentContainerStyle={styles.content}>
        <SectionCard title="Today's prayer times" subtitle="Synced from your selected location.">
      {prayerTimesQuery.isLoading ? (
            <StateBlock
              state="loading"
              title="Loading prayer times"
              description="Fetching the latest schedule for your location."
            />
      ) : prayerTimesQuery.isError ? (
            <StateBlock
              state="error"
              title="Prayer times unavailable"
              description="Please try again in a moment."
              actionLabel="Retry"
              onAction={() => void prayerTimesQuery.refetch()}
            />
      ) : (
            <>
          {Object.entries(prayerTimesQuery.data ?? {})
            .filter(([key]) => key !== "date")
            .map(([key, value]) => (
                  <ListItemCard
                    key={key}
                    title={key}
                    subtitle="Local time"
                    rightMeta={String(value)}
                  />
            ))}
              {Object.entries(prayerTimesQuery.data ?? {}).filter(([key]) => key !== "date").length === 0 ? (
                <StateBlock
                  state="empty"
                  title="No prayer times found"
                  description="No timings were returned for this date."
                />
              ) : null}
            </>
      )}
        </SectionCard>
        <Text style={styles.footnote}>
          Times may vary based on calculation method and local mosque adjustments.
        </Text>
      </ScrollView>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  footnote: {
    color: theme.colors.mutedForeground,
    fontFamily: theme.fonts.sans,
    fontSize: 12,
  },
});
