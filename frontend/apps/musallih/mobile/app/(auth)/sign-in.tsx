import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Button } from "../../src/components/Button";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { useMobileAuth } from "../../src/auth/AuthProvider";
import { theme } from "../../src/theme/theme";

export default function SignInScreen() {
  const { signInWithEmail } = useMobileAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    try {
      setError(null);
      setBusy(true);
      await signInWithEmail(email, password);
      router.replace("/(tabs)/map");
    } catch {
      setError("Sign in failed. Check credentials and Firebase config.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenScaffold
      title="Sign In"
      description="Use email/password now. Google, Apple, and phone OTP can be linked from web security settings."
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Email + Password</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCorrect={false}
            accessibilityLabel="Email"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            accessibilityLabel="Password"
          />
          <Button title={busy ? "Signing In..." : "Sign In"} onPress={handleSignIn} disabled={busy} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Other providers</Text>
          <Button title="Continue with Google (link on web)" onPress={() => {}} disabled variant="outline" />
          <Button title="Continue with Apple (link on web)" onPress={() => {}} disabled variant="outline" />
          <Button title="Phone OTP (link on web)" onPress={() => {}} disabled variant="outline" />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
  },
  cardTitle: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.sans,
    fontWeight: "600",
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.foreground,
    fontFamily: theme.fonts.sans,
  },
  error: {
    color: theme.colors.destructive,
    fontFamily: theme.fonts.sans,
    fontSize: 13,
  },
});
