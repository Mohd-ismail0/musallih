import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";

export default function AnnouncementDetailScreen() {
  const { announcementId } = useLocalSearchParams<{ announcementId: string }>();

  return (
    <ScreenScaffold
      title="Announcement Detail"
      description="Authority and organization announcement details."
    >
      <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
        Announcement ID: {announcementId}
      </Text>
    </ScreenScaffold>
  );
}
