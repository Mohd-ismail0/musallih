import { useLocalSearchParams } from "expo-router";
import { ListItemCard, SectionCard } from "../../src/components/AppUI";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";

export default function RequestDetailScreen() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();

  return (
    <ScreenScaffold
      title="Request Detail"
      description="Track request status and appointment timeline."
    >
      <SectionCard title="Request overview">
        <ListItemCard title="Request ID" subtitle={requestId ?? "Unknown"} />
        <ListItemCard title="Status" subtitle="Pending update from provider" />
      </SectionCard>
    </ScreenScaffold>
  );
}
