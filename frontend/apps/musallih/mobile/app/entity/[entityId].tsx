import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";

export default function EntityDetailScreen() {
  const { entityId } = useLocalSearchParams<{ entityId: string }>();

  return (
    <ScreenScaffold
      title="Entity Detail"
      description="Organization profile, services, and map-linked actions."
    >
      <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
        Entity ID: {entityId}
      </Text>
    </ScreenScaffold>
  );
}
