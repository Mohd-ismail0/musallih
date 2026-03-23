import { useLocalSearchParams } from "expo-router";
import { ListItemCard, SectionCard } from "../../src/components/AppUI";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";

export default function EntityDetailScreen() {
  const { entityId } = useLocalSearchParams<{ entityId: string }>();

  return (
    <ScreenScaffold
      title="Entity Detail"
      description="Organization profile, services, and map-linked actions."
    >
      <SectionCard title="Organization snapshot">
        <ListItemCard title="Entity ID" subtitle={entityId ?? "Unknown"} />
        <ListItemCard title="Availability" subtitle="Use map to inspect live data." />
      </SectionCard>
    </ScreenScaffold>
  );
}
