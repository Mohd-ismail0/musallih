import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapLibre, { MapView, Camera, PointAnnotation } from "@maplibre/maplibre-react-native";
import { theme } from "../theme/theme";

MapLibre.setAccessToken(null);

export interface MapEntity {
  id: string;
  name: string;
  type?: string;
  lat: number;
  lng: number;
  sect?: string;
  openNow?: boolean;
}

export type Bbox = [minLng: number, minLat: number, maxLng: number, maxLat: number];

const DEFAULT_CENTER = [101.686, 3.139] as [number, number];
const DEFAULT_ZOOM = 12;

interface MobileMapViewProps {
  entities: MapEntity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onBoundsChange?: (bbox: Bbox) => void;
  style?: object;
}

export function MobileMapView({
  entities,
  selectedId,
  onSelect,
  onBoundsChange,
  style,
}: MobileMapViewProps) {
  const onRegionDidChange = useCallback(
    (feature: { properties?: { visibleBounds?: [GeoJSON.Position, GeoJSON.Position] } }) => {
      const bounds = feature?.properties?.visibleBounds;
      if (bounds && onBoundsChange && bounds.length >= 2) {
        const ne = bounds[0];
        const sw = bounds[1];
        onBoundsChange([sw[0], sw[1], ne[0], ne[1]]);
      }
    },
    [onBoundsChange]
  );

  return (
    <MapView
      style={[styles.map, style]}
      mapStyle="https://demotiles.maplibre.org/styles/osm-bright/style.json"
      onRegionDidChange={onRegionDidChange}
    >
      <Camera
        defaultSettings={{
          centerCoordinate: DEFAULT_CENTER,
          zoomLevel: DEFAULT_ZOOM,
        }}
      />
      {entities.map((entity) => (
        <PointAnnotation
          key={entity.id}
          id={entity.id}
          coordinate={[entity.lng, entity.lat]}
          title={entity.name}
          selected={selectedId === entity.id}
          onSelected={() => onSelect(selectedId === entity.id ? null : entity.id)}
          anchor={{ x: 0.5, y: 1 }}
        >
          <View
            style={[
              styles.marker,
              selectedId === entity.id && styles.markerSelected,
            ]}
          >
            <Text style={styles.markerText}>
              {entity.type === "MASJID" ? "M" : entity.name.charAt(0)}
            </Text>
          </View>
        </PointAnnotation>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    minHeight: 320,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  markerSelected: {
    backgroundColor: theme.colors.accent,
  },
  markerText: {
    color: theme.colors.primaryForeground,
    fontSize: 12,
    fontWeight: "700",
  },
});
