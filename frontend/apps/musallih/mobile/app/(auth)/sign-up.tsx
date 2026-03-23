import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { Button } from "../../src/components/Button";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { useMobileAuth } from "../../src/auth/AuthProvider";
import { theme } from "../../src/theme/theme";

export default function SignUpScreen() {
  const { signUpWithEmail, status } = useMobileAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setError(null);
      setBusy(true);
      await signUpWithEmail(email, password);
    } catch {
      setError("Sign up failed. Verify Firebase email/password setup.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/(tabs)/map");
    }
  }, [status]);

  return (
    <ScreenScaffold
      title="Create Account"
      description="Create with email/password. Link Google, Apple, and phone from web security."
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
            textContentType="newPassword"
            autoComplete="password-new"
            accessibilityLabel="Password"
          />
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor={theme.colors.mutedForeground}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
            textContentType="newPassword"
            autoComplete="password-new"
            accessibilityLabel="Confirm password"
          />
          <Button title={busy ? "Creating..." : "Create Account"} onPress={handleSignUp} disabled={busy} />
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
    backgroundColor: theme.colors.background,
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
