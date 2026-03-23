import { SectionCard, StateBlock } from "../../src/components/AppUI";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";

export default function AnnouncementsScreen() {
  return (
    <ScreenScaffold title="Announcements" description="Organization and authority broadcasts.">
      <SectionCard title="Announcement feed">
        <StateBlock
          state="empty"
          title="No announcements yet"
          description="New community updates will appear here."
        />
      </SectionCard>
    </ScreenScaffold>
  );
}
