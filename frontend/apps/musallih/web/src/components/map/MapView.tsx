import { useCallback, useRef, useState } from "react";
import Map, {
  type MapRef,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@musallih/shared";

const DEFAULT_CENTER = { lng: 101.686, lat: 3.139 };
const DEFAULT_ZOOM = 12;

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

interface MapViewProps {
  entities: MapEntity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onBoundsChange?: (bbox: Bbox) => void;
  className?: string;
}

export function MapView({
  entities,
  selectedId,
  onSelect,
  onBoundsChange,
  className,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: DEFAULT_CENTER.lng,
    latitude: DEFAULT_CENTER.lat,
    zoom: DEFAULT_ZOOM,
  });

  const selected = entities.find((e) => e.id === selectedId);

  const onMove = useCallback((ev: { viewState: typeof viewState }) => {
    setViewState(ev.viewState);
  }, []);

  const handleMoveEnd = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (map && onBoundsChange) {
      const b = map.getBounds();
      onBoundsChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
    }
  }, [onBoundsChange]);

  return (
    <div className={cn("relative h-full w-full rounded-xl overflow-hidden", className)}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={onMove}
        onMoveEnd={(ev) => {
          onMove(ev);
          handleMoveEnd();
        }}
        onLoad={handleMoveEnd}
        mapStyle="https://demotiles.maplibre.org/styles/osm-bright/style.json"
        style={{ width: "100%", height: "100%" }}
        attributionControl
      >
        <NavigationControl position="top-right" showCompass showZoom />
        <FullscreenControl position="top-right" />

        {entities.map((entity) => (
          <Marker
            key={entity.id}
            longitude={entity.lng}
            latitude={entity.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onSelect(selectedId === entity.id ? null : entity.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 border-background shadow-md flex items-center justify-center text-xs font-bold",
                selectedId === entity.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {entity.type === "MASJID" ? "M" : entity.name.charAt(0)}
            </div>
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            anchor="top"
            onClose={() => onSelect(null)}
            closeButton
            closeOnClick={false}
          >
            <div className="p-2 min-w-[200px]">
              <p className="font-semibold">{selected.name}</p>
              {selected.sect && (
                <p className="text-xs text-muted-foreground">Sect: {selected.sect}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {selected.openNow ? "Open" : "Closed"}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="text-xs font-medium text-accent hover:underline"
                  onClick={() => window.open(`/entities/${selected.id}`, "_self")}
                >
                  View
                </button>
                <button
                  type="button"
                  className="text-xs font-medium text-accent hover:underline"
                  onClick={() => window.open(`/requests/new?org=${selected.id}`, "_self")}
                >
                  Request
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Directions
                </a>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
