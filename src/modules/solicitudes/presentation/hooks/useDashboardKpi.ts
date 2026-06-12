import React from 'react';
import { useSolicitudesContext } from '../context/SolicitudesContext';
import { useAuth } from '@/shared/presentation/context/AuthContext';

export const useDashboardKpi = () => {
  const { kpis, isLoading, error, loadKpis } = useSolicitudesContext();
  const { user: authUser } = useAuth();
  const clienteId = authUser?.userId ?? '';

  React.useEffect(() => {
    if (clienteId) {
      loadKpis(clienteId);
    }
  }, [clienteId, loadKpis]);

  return { kpis, isLoading, error };
};
