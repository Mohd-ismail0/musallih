import { SectionCard, StateBlock } from "../../src/components/AppUI";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";

export default function DonationsScreen() {
  return (
    <ScreenScaffold title="Donations" description="Campaign discovery and donation history.">
      <SectionCard title="Campaigns">
        <StateBlock
          state="empty"
          title="No campaigns available"
          description="New donation campaigns will be listed here."
        />
      </SectionCard>
    </ScreenScaffold>
  );
}
