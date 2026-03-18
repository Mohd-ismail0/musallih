import { Text } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";

export default function FamilyScreen() {
  return (
    <ScreenScaffold title="Family" description="Family members, roles, and request context.">
      <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
        Family flow scaffold is ready.
      </Text>
    </ScreenScaffold>
  );
}
