import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { Button } from "../../src/components/Button";
import { SectionCard } from "../../src/components/AppUI";

export default function ProfileTabScreen() {
  return (
    <ScreenScaffold
      title="Profile"
      description="Profile, consent, family, and account settings."
    >
      <ScrollView contentContainerStyle={styles.content}>
        <SectionCard title="Account hub" subtitle="Manage privacy, family, and activity flows.">
          <View style={styles.actions}>
            <Button title="Open Family" variant="outline" onPress={() => router.push("/family")} />
            <Button title="Open Consent" variant="outline" onPress={() => router.push("/consent")} />
            <Button
              title="Open Announcements"
              variant="outline"
              onPress={() => router.push("/announcements")}
            />
            <Button title="Open Donations" variant="outline" onPress={() => router.push("/donations")} />
          </View>
        </SectionCard>
        <Text style={styles.footnote}>
          Authentication and profile data are handled through existing secure flows.
        </Text>
      </ScrollView>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  actions: {
    gap: theme.spacing.sm,
  },
  footnote: {
    color: theme.colors.mutedForeground,
    fontFamily: theme.fonts.sans,
    fontSize: 12,
  },
});
