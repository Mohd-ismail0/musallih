import { ScrollView, StyleSheet } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { ListItemCard, SectionCard, StateBlock } from "../../src/components/AppUI";
import { createConsumerApi } from "@musallih/api-client";
import { API_BASE_URL } from "../../src/config/api";
import { useQuery } from "@tanstack/react-query";
import { theme } from "../../src/theme/theme";
import { useMobileAuth } from "../../src/auth/AuthProvider";

export default function DiscoverTabScreen() {
  const { accessToken } = useMobileAuth();
  const api = createConsumerApi({
    baseUrl: API_BASE_URL,
    getToken: async () => accessToken,
  });
  const servicesQuery = useQuery({
    queryKey: ["mobile-services"],
    queryFn: () => api.getServices(),
  });
  const activitiesQuery = useQuery({
    queryKey: ["mobile-activities"],
    queryFn: () => api.getActivities(),
  });

  return (
    <ScreenScaffold
      title="Discover"
      description="Services, activities, and organization discovery."
    >
      <ScrollView contentContainerStyle={styles.content}>
        <SectionCard title="Available services" subtitle="Browse offerings across organizations.">
      {servicesQuery.isLoading ? (
            <StateBlock
              state="loading"
              title="Loading services"
              description="Pulling the latest service catalog."
            />
      ) : servicesQuery.isError ? (
            <StateBlock
              state="error"
              title="Services unavailable"
              description="Unable to reach the services API."
              actionLabel="Retry"
              onAction={() => void servicesQuery.refetch()}
            />
      ) : (
            <>
              {(servicesQuery.data ?? []).map((service) => (
                <ListItemCard key={service.id} title={service.name} subtitle="Service" />
              ))}
              {(servicesQuery.data?.length ?? 0) === 0 ? (
                <StateBlock
                  state="empty"
                  title="No services published"
                  description="Check back soon for new services."
                />
              ) : null}
            </>
      )}
        </SectionCard>

        <SectionCard title="Activities" subtitle="Community classes, events, and initiatives.">
          {activitiesQuery.isLoading ? (
            <StateBlock
              state="loading"
              title="Loading activities"
              description="Pulling upcoming activities."
            />
          ) : activitiesQuery.isError ? (
            <StateBlock
              state="error"
              title="Activities unavailable"
              description="Unable to reach the activities API."
              actionLabel="Retry"
              onAction={() => void activitiesQuery.refetch()}
            />
          ) : (
            <>
              {(activitiesQuery.data ?? []).map((activity) => (
                <ListItemCard key={activity.id} title={activity.title} subtitle="Activity" />
              ))}
              {(activitiesQuery.data?.length ?? 0) === 0 ? (
                <StateBlock
                  state="empty"
                  title="No activities published"
                  description="Check back soon for new activities."
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
