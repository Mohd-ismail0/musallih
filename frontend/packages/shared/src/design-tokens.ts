/**
 * Musallih design tokens — shared between web and React Native.
 * Dark-first, fal.ai inspired. Accent: teal/emerald.
 */
export const colors = {
  background: "#0f1216",
  foreground: "#dce0e6",
  card: "#161a20",
  cardForeground: "#dce0e6",
  primary: "#dce0e6",
  primaryForeground: "#0f1216",
  secondary: "#1e2329",
  secondaryForeground: "#dce0e6",
  muted: "#1e2329",
  mutedForeground: "#7a8494",
  accent: "#14b8a6",
  accentForeground: "#0f1216",
  destructive: "#7f1d1d",
  destructiveForeground: "#f8fafc",
  border: "#2a3038",
  input: "#2a3038",
  ring: "#14b8a6",
} as const;

export const fonts = {
  sans: "Inter",
  mono: "JetBrains Mono",
} as const;

export const fontWeights = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 12,
  full: 9999,
} as const;
