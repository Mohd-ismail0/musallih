import type { PropsWithChildren, ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";
import { Button } from "./Button";

interface SectionCardProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export function SectionCard({ title, subtitle, rightSlot, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      {(title || subtitle || rightSlot) && (
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderText}>
            {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
            {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
          </View>
          {rightSlot}
        </View>
      )}
      {children}
    </View>
  );
}

interface StateBlockProps {
  state: "loading" | "error" | "empty";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function StateBlock({ state, title, description, actionLabel, onAction }: StateBlockProps) {
  return (
    <View style={styles.stateBlock}>
      {state === "loading" ? (
        <ActivityIndicator color={theme.colors.accent} size="small" />
      ) : (
        <Text style={styles.stateIcon}>{state === "error" ? "!" : "-"}</Text>
      )}
      <View style={styles.stateTextGroup}>
        <Text style={styles.stateTitle}>{title}</Text>
        <Text style={styles.stateDescription}>{description}</Text>
      </View>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant="outline" />
      ) : null}
    </View>
  );
}

interface ListItemCardProps {
  title: string;
  subtitle?: string;
  rightMeta?: string;
  onPress?: () => void;
}

export function ListItemCard({ title, subtitle, rightMeta, onPress }: ListItemCardProps) {
  const content = (
    <View style={styles.listItem}>
      <View style={styles.listItemText}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle ? <Text style={styles.listItemSubtitle}>{subtitle}</Text> : null}
      </View>
      {rightMeta ? <Text style={styles.listItemMeta}>{rightMeta}</Text> : null}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.listItemPressable, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  cardHeaderText: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  cardTitle: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.sans,
    fontWeight: "600",
    fontSize: 16,
  },
  cardSubtitle: {
    color: theme.colors.mutedForeground,
    fontFamily: theme.fonts.sans,
    fontSize: 13,
  },
  stateBlock: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: "flex-start",
  },
  stateIcon: {
    color: theme.colors.mutedForeground,
    fontFamily: theme.fonts.mono,
    fontSize: 16,
  },
  stateTextGroup: {
    gap: theme.spacing.xs,
  },
  stateTitle: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.sans,
    fontWeight: "600",
    fontSize: 15,
  },
  stateDescription: {
    color: theme.colors.mutedForeground,
    fontFamily: theme.fonts.sans,
    fontSize: 13,
  },
  listItemPressable: {
    borderRadius: theme.radius.md,
  },
  pressed: {
    opacity: 0.85,
  },
  listItem: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  listItemText: {
    flex: 1,
    gap: 2,
  },
  listItemTitle: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.sans,
    fontWeight: "500",
    fontSize: 14,
  },
  listItemSubtitle: {
    color: theme.colors.mutedForeground,
    fontFamily: theme.fonts.sans,
    fontSize: 12,
  },
  listItemMeta: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.sans,
    fontWeight: "600",
    fontSize: 12,
  },
});
