import { Text, View } from "react-native";
import { router } from "expo-router";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { Button } from "../../src/components/Button";

export default function ProfileTabScreen() {
  return (
    <ScreenScaffold
      title="Profile"
      description="Profile, consent, family, and account settings."
    >
      <View style={{ gap: theme.spacing.md }}>
        <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
          Profile and consent flows are scaffolded.
        </Text>
        <Button title="Open Family" variant="outline" onPress={() => router.push("/family")} />
        <Button title="Open Consent" variant="outline" onPress={() => router.push("/consent")} />
        <Button
          title="Open Announcements"
          variant="outline"
          onPress={() => router.push("/announcements")}
        />
        <Button
          title="Open Donations"
          variant="outline"
          onPress={() => router.push("/donations")}
        />
      </View>
    </ScreenScaffold>
  );
}
