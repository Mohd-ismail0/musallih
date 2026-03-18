import { Link, router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "../../src/components/Button";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { useMobileAuth } from "../../src/auth/AuthProvider";

export default function AuthLandingScreen() {
  const { status } = useMobileAuth();

  return (
    <ScreenScaffold title="Welcome to Musallih" description="Choose how to continue.">
      <View style={{ gap: theme.spacing.md }}>
        <Button title="Sign In" onPress={() => router.push("/(auth)/sign-in")} />
        <Button
          title="Sign Up"
          onPress={() => router.push("/(auth)/sign-up")}
          variant="outline"
        />
        <Link href="/(tabs)/map" asChild>
          <Text style={{ color: theme.colors.mutedForeground, textAlign: "center" }}>
            Continue to App (development)
          </Text>
        </Link>
        <Text style={{ color: theme.colors.mutedForeground, textAlign: "center" }}>
          Session status: {status}
        </Text>
      </View>
    </ScreenScaffold>
  );
}
