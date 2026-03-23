import { SectionCard, StateBlock } from "../../src/components/AppUI";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";

export default function FamilyScreen() {
  return (
    <ScreenScaffold title="Family" description="Family members, roles, and request context.">
      <SectionCard title="Family members">
        <StateBlock
          state="empty"
          title="No linked family members"
          description="Invite or add family profiles to manage shared care requests."
        />
      </SectionCard>
    </ScreenScaffold>
  );
}
