import { ListItemCard, SectionCard } from "../../src/components/AppUI";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";

export default function ConsentScreen() {
  return (
    <ScreenScaffold
      title="Consent & Data Rights"
      description="Field-level consent, access history, and export/delete."
    >
      <SectionCard title="Data rights">
        <ListItemCard title="Consent status" subtitle="No active overrides" />
        <ListItemCard title="Access history" subtitle="No recent access events" />
      </SectionCard>
    </ScreenScaffold>
  );
}
