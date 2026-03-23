import { useLocalSearchParams } from "expo-router";
import { ListItemCard, SectionCard } from "../../src/components/AppUI";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";

export default function AnnouncementDetailScreen() {
  const { announcementId } = useLocalSearchParams<{ announcementId: string }>();

  return (
    <ScreenScaffold
      title="Announcement Detail"
      description="Authority and organization announcement details."
    >
      <SectionCard title="Announcement details">
        <ListItemCard title="Announcement ID" subtitle={announcementId ?? "Unknown"} />
      </SectionCard>
    </ScreenScaffold>
  );
}
