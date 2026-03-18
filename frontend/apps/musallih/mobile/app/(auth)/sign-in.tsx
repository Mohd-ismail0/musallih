import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
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

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithEmail(email, password);
      router.replace("/(tabs)/map");
    } catch {
      setError("Sign in failed. Check credentials and Firebase config.");
    }
  };

  return (
    <ScreenScaffold title="Sign In" description="Authenticate with Firebase.">
      <View style={styles.container}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.colors.mutedForeground}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.colors.mutedForeground}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <Button title="Sign In" onPress={handleSignIn} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
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
