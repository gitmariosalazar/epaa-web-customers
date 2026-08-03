import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import {
  Map,
  InfoWindow,
  useMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint
} from '@vis.gl/react-google-maps';
import type { ConnectionAndPropertyResponse } from '../../../domain/models/Connection';
import { useTheme } from '@/shared/presentation/context/ThemeContext';

import { MapMarker } from './MapMarker';
import { MapInfoWindow } from './MapInfoWindow';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import { decodeEWKBPoint } from '@/shared/utils/geoUtils';

interface ConnectionMapProps {
  connections: ConnectionAndPropertyResponse[];
  selectedConnection: ConnectionAndPropertyResponse | null;
  onSelect: (conn: ConnectionAndPropertyResponse) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  onEdit?: (conn: ConnectionAndPropertyResponse) => void;
  onCameraChange?: (center: { lat: number; lng: number }, zoom: number) => void;
  mapId?: string;
}

export const ConnectionMap: React.FC<ConnectionMapProps> = ({
  connections,
  selectedConnection,
  onSelect,
  center,
  zoom = 13,
  onEdit,
  onCameraChange,
  mapId
}) => {
  const BOUNDS_PADDING_DEG = 0.01;

  const map = useMap();
  const navigate = useNavigate();
  const isInternalActionRef = useRef(false); // ← Previene re-render agresivo
  const lastBoundsUpdateRef = useRef(0);

  const handleViewIncidentsOnTable = useCallback(
    (connectionId: string) => {
      navigate(`/incidents?connectionId=${encodeURIComponent(connectionId)}`);
    },
    [navigate]
  );

  const handleViewIncidentsOnMap = useCallback(
    (connectionId: string) => {
      navigate(
        `/incidents/map?connectionId=${encodeURIComponent(connectionId)}`
      );
    },
    [navigate]
  );

  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState<ConnectionAndPropertyResponse | null>(
    null
  );
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);
  const [visibleBounds, setVisibleBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  const { theme } = useTheme();

  // Solo mover el mapa cuando se selecciona desde fuera del popup
  useEffect(() => {
    if (!map || !selectedConnection || isInternalActionRef.current) return;

    if (selectedConnection.connectionCoordinates && selectedConnection.connectionCoordinates) {
      map.setCenter({
        lat: Number(decodeEWKBPoint(selectedConnection.connectionCoordinates)?.lat),
        lng: Number(decodeEWKBPoint(selectedConnection.connectionCoordinates)?.lng)
      });
      setInfoWindowShown(true);
      if (map.getZoom() < 17) map.setZoom(17);
    }
  }, [map, selectedConnection]);

  const _handleEdit = useCallback(
    (conn: ConnectionAndPropertyResponse) => {
      isInternalActionRef.current = true;
      onEdit?.(conn);

      // Reset después de la acción
      setTimeout(() => {
        isInternalActionRef.current = false;
      }, 1000);
    },
    [onEdit]
  );

  console.log('_handleEdit', _handleEdit);

  const handleClose = useCallback(() => {
    setInfoWindowShown(false);
  }, []);

  const firstWithCoords = connections.find((c) => c.connectionCoordinates);
  const fallbackCenter = FALLBACK_CENTER_ANTONIO_ANTE;

  const finalCenter =
    center?.lat && center?.lng
      ? center
      : firstWithCoords
        ? {
          lat: Number(decodeEWKBPoint(firstWithCoords.connectionCoordinates)?.lat),
          lng: Number(decodeEWKBPoint(firstWithCoords.connectionCoordinates)?.lng)
        }
        : fallbackCenter;

  const connectionsWithCoords = useMemo(
    () => connections.filter((conn) => conn.connectionCoordinates),
    [connections]
  );

  const visibleConnections = useMemo(() => {
    if (!visibleBounds) {
      // Keep initial mount light; full set appears once bounds are available.
      return connectionsWithCoords.slice(0, 350);
    }

    return connectionsWithCoords.filter((conn) => {
      const lat = Number(decodeEWKBPoint(conn.connectionCoordinates)?.lat);
      const lng = Number(decodeEWKBPoint(conn.connectionCoordinates)?.lng);
      return (
        lat <= visibleBounds.north + BOUNDS_PADDING_DEG &&
        lat >= visibleBounds.south - BOUNDS_PADDING_DEG &&
        lng <= visibleBounds.east + BOUNDS_PADDING_DEG &&
        lng >= visibleBounds.west - BOUNDS_PADDING_DEG
      );
    });
  }, [connectionsWithCoords, visibleBounds]);

  return (
    <div className="map-view-container">
      <Map
        colorScheme={theme === 'dark' ? 'DARK' : 'LIGHT'}
        defaultCenter={finalCenter}
        defaultZoom={zoom}
        mapId={mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={true}
        streetViewControl={true}
        fullscreenControl={true}
        onCameraChanged={(ev) => {
          if (ev.detail.zoom !== currentZoom) {
            setCurrentZoom(ev.detail.zoom);
          }

          if (map) {
            const now = Date.now();
            if (now - lastBoundsUpdateRef.current > 120) {
              const bounds = map.getBounds();
              if (bounds) {
                const northEast = bounds.getNorthEast();
                const southWest = bounds.getSouthWest();
                setVisibleBounds({
                  north: northEast.lat(),
                  south: southWest.lat(),
                  east: northEast.lng(),
                  west: southWest.lng()
                });
              }
              lastBoundsUpdateRef.current = now;
            }
          }

          onCameraChange?.(ev.detail.center, ev.detail.zoom);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {visibleConnections.map((conn) => (
          <AdvancedMarker
            key={conn.connectionId}
            position={{
              lat: Number(decodeEWKBPoint(conn.connectionCoordinates)?.lat),
              lng: Number(decodeEWKBPoint(conn.connectionCoordinates)?.lng)
            }}
            anchor={AdvancedMarkerAnchorPoint.CENTER}
            zIndex={
              selectedConnection?.connectionId === conn.connectionId ? 10000 : 1
            }
            onMouseEnter={() => {
              if (infoWindowShown || currentZoom < 17) return;
              setHoveredConnection(conn);
            }}
            onMouseLeave={() => setHoveredConnection(null)}
          >
            <MapMarker
              connection={conn}
              isHovered={hoveredConnection?.connectionId === conn.connectionId}
              isSelected={
                selectedConnection?.connectionId === conn.connectionId
              }
              onClick={() => {
                setHoveredConnection(null);
                onSelect(conn);
                setInfoWindowShown(true);
              }}
            />
          </AdvancedMarker>
        ))}

        {selectedConnection &&
          infoWindowShown &&
          selectedConnection.connectionCoordinates &&
          selectedConnection.connectionCoordinates && (
            <InfoWindow
              key={`infowindow-${selectedConnection.connectionId}`} // ← Clave estable
              position={{
                lat: Number(decodeEWKBPoint(selectedConnection.connectionCoordinates)?.lat),
                lng: Number(decodeEWKBPoint(selectedConnection.connectionCoordinates)?.lng)
              }}
              pixelOffset={[0, -25]}
              onCloseClick={handleClose}
            >
              <MapInfoWindow
                connection={selectedConnection}
                theme={theme}
                onClose={handleClose}
                onViewIncidentsOnTable={handleViewIncidentsOnTable}
                onViewIncidentsOnMap={handleViewIncidentsOnMap}
              />
            </InfoWindow>
          )}
      </Map>
    </div>
  );
};
