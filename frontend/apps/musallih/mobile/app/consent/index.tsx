import { Text } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";

export default function ConsentScreen() {
  return (
    <ScreenScaffold
      title="Consent & Data Rights"
      description="Field-level consent, access history, and export/delete."
    >
      <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
        Consent and data-rights scaffold is ready.
      </Text>
    </ScreenScaffold>
  );
}
