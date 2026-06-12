import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { DashboardKpisResponse, Solicitud } from '../../domain/models/Solicitud';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { GetExpedientesByClienteUseCase } from '../../application/usecases/GetExpedientesByClienteUseCase';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { GetDashboardKpisByClienteIdUseCase } from '../../application/usecases/GetDashboardKpisByClienteIdUseCase';

interface SolicitudesContextType {
  solicitudes: Solicitud[];
  kpis: DashboardKpisResponse | null;
  isLoading: boolean;
  error: string | null;
  loadSolicitudes: (clienteId: string) => Promise<void>;
  loadKpis: (clienteId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const SolicitudesContext = createContext<SolicitudesContextType | undefined>(undefined);

export const SolicitudesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [kpis, setKpis] = useState<DashboardKpisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new SolicitudRepositoryImpl(), []);
  const getExpedientesUseCase = useMemo(
    () => new GetExpedientesByClienteUseCase(repository),
    [repository]
  );

  const getDashboardKpisByClienteIdUseCase = useMemo(
    () => new GetDashboardKpisByClienteIdUseCase(repository),
    [repository]
  );

  const loadSolicitudes = useCallback(
    async (clienteId: string) => {
      if (!clienteId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getExpedientesUseCase.execute(clienteId);
        setSolicitudes(data);
      } catch (err: any) {
        console.error('Error loading expedientes in context:', err);
        setError(err.message || 'Error al cargar las solicitudes del servidor.');
      } finally {
        setIsLoading(false);
      }
    },
    [getExpedientesUseCase]
  );

  const loadKpis = useCallback(
    async (clienteId: string) => {
      if (!clienteId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDashboardKpisByClienteIdUseCase.execute(clienteId);
        setKpis(data);
      } catch (err: any) {
        console.error('Error loading kpis in context:', err);
        setError(err.message || 'Error al cargar los kpis del servidor.');
      } finally {
        setIsLoading(false);
      }
    },
    [getDashboardKpisByClienteIdUseCase]
  );

  const refresh = useCallback(async () => {
    if (authUser?.userId) {
      await loadSolicitudes(authUser.userId);
    }
  }, [authUser?.userId, loadSolicitudes]);
  console.log('authUser', solicitudes);
  // Load automatically when client ID changes
  React.useEffect(() => {
    if (authUser?.userId) {
      loadSolicitudes(authUser.userId);
      loadKpis(authUser.userId);
    } else {
      setSolicitudes([]);
      setKpis(null);
    }
  }, [authUser?.userId, loadSolicitudes, loadKpis]);

  const value = useMemo(
    () => ({
      solicitudes,
      kpis,
      isLoading,
      error,
      loadSolicitudes,
      loadKpis,
      refresh
    }),
    [solicitudes, kpis, isLoading, error, loadSolicitudes, loadKpis, refresh]
  );

  return (
    <SolicitudesContext.Provider value={value}>
      {children}
    </SolicitudesContext.Provider>
  );
};

export const useSolicitudesContext = () => {
  const context = useContext(SolicitudesContext);
  if (!context) {
    throw new Error('useSolicitudesContext must be used within a SolicitudesProvider');
  }
  return context;
};
