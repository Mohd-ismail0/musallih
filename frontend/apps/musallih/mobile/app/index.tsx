import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/Button";
import { theme } from "../src/theme/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Musallih</Text>
        <Text style={styles.tagline}>
          Open digital infrastructure for Muslim communities.
        </Text>
        <View style={styles.actions}>
          <Button
            title="Get Started"
            onPress={() => {}}
            style={styles.primaryButton}
          />
          <Button
            title="Learn More"
            onPress={() => {}}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: theme.colors.accent,
    fontFamily: theme.fonts.sans,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: 18,
    color: theme.colors.mutedForeground,
    fontFamily: theme.fonts.sans,
    marginBottom: theme.spacing.xl,
  },
  actions: {
    gap: theme.spacing.md,
  },
  primaryButton: {
    marginBottom: theme.spacing.sm,
  },
  secondaryButton: {},
});
