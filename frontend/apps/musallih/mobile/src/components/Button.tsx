import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { theme } from "../theme/theme";

type ButtonVariant = "default" | "outline" | "ghost";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = "default",
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const variantStyles = getVariantStyles(variant);
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, variantStyles.container, style]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, variantStyles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

function getVariantStyles(variant: ButtonVariant) {
  switch (variant) {
    case "outline":
      return {
        container: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.colors.border,
        } as ViewStyle,
        text: { color: theme.colors.foreground } as TextStyle,
      };
    case "ghost":
      return {
        container: { backgroundColor: "transparent" } as ViewStyle,
        text: { color: theme.colors.foreground } as TextStyle,
      };
    default:
      return {
        container: {
          backgroundColor: theme.colors.accent,
        } as ViewStyle,
        text: { color: theme.colors.accentForeground } as TextStyle,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: theme.fonts.sans,
  },
});
