import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";

export default function RequestDetailScreen() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();

  return (
    <ScreenScaffold
      title="Request Detail"
      description="Track request status and appointment timeline."
    >
      <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
        Request ID: {requestId}
      </Text>
    </ScreenScaffold>
  );
}
