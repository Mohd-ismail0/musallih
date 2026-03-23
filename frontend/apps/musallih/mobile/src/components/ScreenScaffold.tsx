import type { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

interface ScreenScaffoldProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function ScreenScaffold({
  title,
  description,
  children,
}: ScreenScaffoldProps) {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  inner: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  header: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: theme.fonts.sans,
  },
  description: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    fontFamily: theme.fonts.sans,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.sm,
  },
});
