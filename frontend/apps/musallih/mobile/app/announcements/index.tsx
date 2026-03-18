import { Text } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";

export default function AnnouncementsScreen() {
  return (
    <ScreenScaffold title="Announcements" description="Organization and authority broadcasts.">
      <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
        Announcement feed scaffold is ready.
      </Text>
    </ScreenScaffold>
  );
}
