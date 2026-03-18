import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { trackMobileEvent } from "../../src/analytics/mobileAnalytics";

const categories = [
  "Masjid",
  "Restaurants",
  "Business",
  "Madrasa",
  "Islamic Orgs",
  "Welfare",
  "Burial",
  "All",
];

const sectFilters = [
  "General",
  "Hanafi",
  "Shafi",
  "Maliki",
  "Hanbali",
  "Ahl-e-Hadith",
  "Jafari",
  "Zaydi",
  "Ismaili",
];

export default function MapTabScreen() {
  useEffect(() => {
    void trackMobileEvent("map_home_viewed", { category: "Masjid" });
  }, []);

  return (
    <ScreenScaffold
      title="Map"
      description="Default Masjid category with contextual sub-filters."
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.chipsRow}>
          {categories.map((label) => (
            <View key={label} style={[styles.chip, label === "Masjid" && styles.activeChip]}>
              <Text style={[styles.chipText, label === "Masjid" && styles.activeChipText]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Masjid sub-filters</Text>
          <View style={styles.chipsRow}>
            {sectFilters.map((label) => (
              <View key={label} style={styles.chip}>
                <Text style={styles.chipText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.mapPlaceholder}>
          <Text style={styles.placeholderText}>
            Map placeholder (MapLibre + marker clusters + info cards).
          </Text>
        </View>
      </ScrollView>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.sans,
    fontWeight: "600",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  activeChip: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  chipText: {
    color: theme.colors.foreground,
    fontSize: 12,
    fontFamily: theme.fonts.sans,
  },
  activeChipText: {
    color: theme.colors.accentForeground,
  },
  mapPlaceholder: {
    minHeight: 360,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  placeholderText: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    fontFamily: theme.fonts.sans,
  },
});
