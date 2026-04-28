import React, { useState } from 'react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { SolicitudTrackingCard } from '../components/tracking/SolicitudTrackingCard';
import { MOCK_TRACKING_ACOMETIDAS } from '../../infrastructure/data/TrackingMockData';
import { 
  SolicitudesGlobalFilters, 
  defaultSolicitudesFilters
} from '../components/SolicitudesGlobalFilters';
import type { SolicitudesFilterState } from '../components/SolicitudesGlobalFilters';
import './SolicitudesTrackingPage.css';

export const SolicitudesTrackingPage: React.FC = () => {
  const [filters, setFilters] = useState<SolicitudesFilterState>(defaultSolicitudesFilters);

  const filtered = MOCK_TRACKING_ACOMETIDAS.filter((t) => {
    // 1. Search (global text matching)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!t.codigo.toLowerCase().includes(q) && !t.direccion.toLowerCase().includes(q)) {
        return false;
      }
    }

    // 2. Event/Estado
    if (filters.event && t.currentStep !== filters.event) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (updates: Partial<SolicitudesFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageLayout
      header={
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-main)'
            }}
          >
            Mis Solicitudes
          </h1>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gestione sus trámites de acometida
          </span>
        </div>
      }
      filters={
        <SolicitudesGlobalFilters 
          filters={filters} 
          onChange={handleFilterChange} 
          onConsultar={() => console.log('Consultar con:', filters)}
        />
      }
    >
      <div className="tracking-page-container">
        <div className="tracking-list">
          {filtered.map((tracking) => (
            <SolicitudTrackingCard key={tracking.id} tracking={tracking} />
          ))}
          {filtered.length === 0 && (
            <div className="tracking-list__empty">
              No se encontraron solicitudes con esa búsqueda.
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
