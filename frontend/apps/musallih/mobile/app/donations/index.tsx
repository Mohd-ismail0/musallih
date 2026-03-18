import { Text } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";

export default function DonationsScreen() {
  return (
    <ScreenScaffold title="Donations" description="Campaign discovery and donation history.">
      <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
        Donations and campaigns scaffold is ready.
      </Text>
    </ScreenScaffold>
  );
}
