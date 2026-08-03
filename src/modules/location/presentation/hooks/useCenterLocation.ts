import { useEffect, useState, useCallback } from 'react';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import { GetCenterLLocationMapIncidentsUseCase } from '@/shared/location/application/usecases/GetCenterLLocationMapIncidentsUseCase';
import type { CenterLocationResponse } from '@/shared/location/domain/schemas/dto/response/location.response';
import { CenterLocationIncidentImpl } from '@/shared/location/infrastructure/repositories/CenterLocationIncidentImpl';

const centerLocationIncidentUseCase = new GetCenterLLocationMapIncidentsUseCase(
  new CenterLocationIncidentImpl()
);

export interface UseCenterLocationIncidentResult {
  centerLocationIncident: CenterLocationResponse;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCenterLocationIncident =
  (): UseCenterLocationIncidentResult => {
    const [centerLocationIncident, setCenterLocationIncident] =
      useState<CenterLocationResponse>({
        centerLat: FALLBACK_CENTER_ANTONIO_ANTE.lat,
        centerLng: FALLBACK_CENTER_ANTONIO_ANTE.lng,
        countData: 0
      });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCenter = useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await centerLocationIncidentUseCase.execute();
        setCenterLocationIncident(result);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo obtener el centro del mapa.';
        setError(message);
        // Mantener fallback
        setCenterLocationIncident({
          centerLat: FALLBACK_CENTER_ANTONIO_ANTE.lat,
          centerLng: FALLBACK_CENTER_ANTONIO_ANTE.lng,
          countData: 0
        });
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchCenter();
    }, [fetchCenter]);

    // Función para refrescar manualmente
    const refetch = useCallback(() => {
      fetchCenter();
    }, [fetchCenter]);

    return {
      centerLocationIncident,
      loading,
      error,
      refetch // ← Útil para botón de reintentar
    };
  };
