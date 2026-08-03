import { useState, useCallback } from 'react';
import type {
  ClientDashboardResponse,
  ConnectionDashboardResponse
} from '../../domain/models/view-dashboard.response';
import { useConnectionsContext } from '../context/ConnectionContext';
import { useAuth } from '@/shared/presentation/context/AuthContext';

export const useConnectionDashboard = () => {
  const {
    getDashboardGlobalClientIdUseCase,
    getDashboardConnectionsByClientIdUseCase
  } = useConnectionsContext();

  const { user } = useAuth();

  const [data, setData] = useState<ClientDashboardResponse | null>(null);
  const [liveData, setLiveData] = useState<ConnectionDashboardResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user?.cardId) return;
    setIsLoading(true);
    setError(null);
    try {
      const stats = await getDashboardGlobalClientIdUseCase.execute(
        user.cardId
      );
      const statsLiveData =
        await getDashboardConnectionsByClientIdUseCase.execute(user.cardId);
      setData(stats);
      setLiveData(statsLiveData);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar las estadísticas';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [getDashboardGlobalClientIdUseCase, user?.cardId]);

  const fetchLiveData = useCallback(async () => {
    if (!user?.cardId) return;
    setIsLoading(true);
    setError(null);
    try {
      const connections =
        await getDashboardConnectionsByClientIdUseCase.execute(user.cardId);
      setLiveData(connections || []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar el mapa';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [getDashboardConnectionsByClientIdUseCase, user?.cardId]);

  return {
    data,
    liveData,
    isLoading,
    error,
    fetchStats,
    fetchLiveData
  };
};
