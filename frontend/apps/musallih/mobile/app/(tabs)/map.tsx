import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { MobileMapView } from "../../src/components/MobileMapView";
import type { MapEntity, Bbox } from "../../src/components/MobileMapView";
import { theme } from "../../src/theme/theme";
import { trackMobileEvent } from "../../src/analytics/mobileAnalytics";
import { createConsumerApi } from "@musallih/api-client";
import type { OrganizationSummary } from "@musallih/api-client";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../../src/config/api";

const categories = [
  "Masjid",
  "Restaurants",
  "Business",
  "Madrasa",
  "Islamic Orgs",
  "Welfare",
  "Burial",
  "All",
] as const;

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

const sampleEntities: Array<{
  id: string;
  name: string;
  category: (typeof categories)[number];
  lat: number;
  lng: number;
  sect?: string;
  openNow?: boolean;
}> = [
  { id: "m1", name: "Masjid Noor", category: "Masjid", lat: 3.139, lng: 101.686, sect: "Shafi", openNow: true },
  { id: "m2", name: "Masjid Rahmah", category: "Masjid", lat: 3.144, lng: 101.694, sect: "Hanafi", openNow: true },
  { id: "m3", name: "Masjid Tawheed", category: "Masjid", lat: 3.147, lng: 101.691, sect: "General", openNow: false },
  { id: "r1", name: "Sunnah Eats", category: "Restaurants", lat: 3.143, lng: 101.688, openNow: true },
  { id: "b1", name: "Ummah Books", category: "Business", lat: 3.142, lng: 101.687, openNow: true },
  { id: "w1", name: "Mercy Welfare", category: "Welfare", lat: 3.141, lng: 101.692, openNow: true },
];

const consumerApi = createConsumerApi({
  baseUrl: API_BASE_URL,
  getToken: async () => null,
});

function orgToMapEntity(o: OrganizationSummary): MapEntity | null {
  if (o.lat == null || o.lng == null) return null;
  return {
    id: o.id,
    name: o.name,
    type: o.type,
    lat: o.lat,
    lng: o.lng,
    sect: o.sect,
    openNow: o.openNow,
  };
}

function sampleToMapEntity(e: (typeof sampleEntities)[number]): MapEntity {
  return {
    id: e.id,
    name: e.name,
    type: e.category === "Masjid" ? "MASJID" : e.category,
    lat: e.lat,
    lng: e.lng,
    sect: e.sect,
    openNow: e.openNow,
  };
}

export default function MapTabScreen() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("Masjid");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bbox, setBbox] = useState<Bbox | null>(() => [101.636, 3.089, 101.736, 3.189] as Bbox);
  const [sect, setSect] = useState<string[]>([]);

  const nearbyQuery = useQuery({
    queryKey: ["organizations", "nearby", bbox?.join(",") ?? "", activeCategory, sect.join(",")],
    queryFn: async () => {
      const params: Parameters<typeof consumerApi.getNearbyOrganizations>[0] = {
        category: activeCategory === "All" ? undefined : activeCategory,
        sect: sect.length ? sect : undefined,
      };
      if (bbox) params.bbox = bbox.join(",");
      return consumerApi.getNearbyOrganizations(params);
    },
    enabled: bbox != null,
    staleTime: 60_000,
    retry: 1,
    gcTime: 10 * 60 * 1000,
  });

  const apiEntities = useMemo(() => {
    if (nearbyQuery.data == null) return [];
    return nearbyQuery.data.map(orgToMapEntity).filter((e): e is MapEntity => e != null);
  }, [nearbyQuery.data]);

  const fallbackEntities = useMemo(() => sampleEntities.map(sampleToMapEntity), []);

  const entities =
    nearbyQuery.isSuccess && (nearbyQuery.data?.length ?? 0) > 0
      ? apiEntities
      : fallbackEntities;

  const filtered = useMemo(() => {
    if (activeCategory === "All") return entities;
    return entities.filter(
      (e) =>
        e.type?.toUpperCase() === activeCategory.toUpperCase().replace(/\s+/g, "_") ||
        e.type === activeCategory
    );
  }, [entities, activeCategory]);

  useEffect(() => {
    void trackMobileEvent("map_home_viewed", { category: activeCategory });
  }, [activeCategory]);

  const toggleSect = (value: string) => {
    setSect((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]));
  };

  return (
    <ScreenScaffold
      title="Map"
      description="Default Masjid category with contextual sub-filters."
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.chipsRow}>
          {categories.map((label) => (
            <Pressable
              key={label}
              onPress={() => setActiveCategory(label)}
              style={[styles.chip, label === activeCategory && styles.activeChip]}
            >
              <Text style={[styles.chipText, label === activeCategory && styles.activeChipText]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeCategory === "Masjid" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Masjid sub-filters</Text>
            <View style={styles.chipsRow}>
              {sectFilters.map((label) => (
                <Pressable
                  key={label}
                  onPress={() => toggleSect(label)}
                  style={[styles.chip, sect.includes(label) && styles.activeChip]}
                >
                  <Text
                    style={[styles.chipText, sect.includes(label) && styles.activeChipText]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.mapContainer}>
          <MobileMapView
            entities={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onBoundsChange={setBbox}
            style={styles.map}
          />
        </View>

        {nearbyQuery.isError && (
          <Text style={styles.fallbackNote}>
            Using sample data. Backend /organizations/nearby will be used when available.
          </Text>
        )}
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
  mapContainer: {
    minHeight: 360,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  map: {
    minHeight: 360,
  },
  fallbackNote: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    fontFamily: theme.fonts.sans,
  },
});
