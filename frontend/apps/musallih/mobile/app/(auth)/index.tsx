import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../src/components/Button";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { useMobileAuth } from "../../src/auth/AuthProvider";
import { SectionCard } from "../../src/components/AppUI";

export default function AuthLandingScreen() {
  const { status } = useMobileAuth();

  return (
    <ScreenScaffold title="Welcome to Musallih" description="Choose how to continue.">
      <SectionCard title="Get started" subtitle="Sign in to personalize your experience.">
        <View style={styles.actions}>
          <Button title="Sign In" onPress={() => router.push("/(auth)/sign-in")} />
          <Button
            title="Sign Up"
            onPress={() => router.push("/(auth)/sign-up")}
            variant="outline"
          />
        </View>
        {__DEV__ ? (
          <Link href="/(tabs)/map" asChild>
            <Text style={styles.devLink}>Continue to App (development)</Text>
          </Link>
        ) : null}
        <Text style={styles.sessionStatus}>Session status: {status}</Text>
      </SectionCard>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.sm,
  },
  devLink: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    fontFamily: theme.fonts.sans,
    fontSize: 13,
  },
  sessionStatus: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    fontFamily: theme.fonts.sans,
    fontSize: 12,
  },
});
