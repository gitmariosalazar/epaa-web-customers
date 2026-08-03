import React from 'react';
import type { ConnectionDashboardResponse } from '../../../domain/models/view-dashboard.response';
import { Button } from '@/shared/presentation/components/Button/Button';
import { X, MapPin, User, Activity, Droplets, AlertTriangle, Hash, Gauge } from 'lucide-react';
import { GradientAreaChart } from '@/shared/presentation/components/Charts/GradientAreaChart';
import { StatCard, type StatCardItem } from '@/shared/presentation/components/Stats/StatsGrid';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import './ConnectionDetailDashboard.css';

interface Props {
  connection: ConnectionDashboardResponse;
  onClose: () => void;
}

export const ConnectionDetailDashboard: React.FC<Props> = ({ connection, onClose }) => {
  const meterData = connection.meter || { serial: 'N/A', brand: 'N/A' };
  const consumptionData = connection.consumption || { lastConsumptionM3: 0, historicalAverageM3: 0, history: [] };
  const incidentsData = connection.incidents || { latest: [] };

  const statsCards: StatCardItem[] = [
    {
      title: 'Medidor',
      value: meterData.serial,
      desc: `Marca: ${meterData.brand}`,
      icon: Gauge,
      color: 'blue'
    },
    {
      title: 'Consumo Actual',
      value: `${consumptionData.lastConsumptionM3} m³`,
      desc: `Promedio: ${consumptionData.historicalAverageM3} m³`,
      icon: Droplets,
      color: 'cyan'
    },
    {
      title: 'Incidentes Activos',
      value: incidentsData.pendingCount || 0,
      desc: `De ${incidentsData.totalCount || 0} históricos`,
      icon: AlertTriangle,
      color: incidentsData.pendingCount && incidentsData.pendingCount > 0 ? 'amber' : 'green'
    }
  ];

  return (
    <div className="connection-detail-dashboard">
      <div className="cdd-header">
        <div className="cdd-header-info">
          <div className="cdd-title">
            <User size={20} />
            {connection.client?.name || 'Cliente Desconocido'}
            <ColorChip 
              label={connection.status.replace('🟢 ', '').replace('🔴 ', '').replace('🔵 ', '')} 
              color={connection.status.includes('ACTIVE') ? 'green' : 'red'} 
            />
          </div>
          <div className="cdd-subtitle">
            <Hash size={14} /> {connection.connectionId}
            <span style={{ margin: '0 8px' }}>•</span>
            <MapPin size={14} /> {connection.address}
          </div>
        </div>
        <Button variant="dashed" onClick={onClose} size="sm" color="gray">
          <X size={16} style={{ marginRight: '4px' }} /> Cerrar
        </Button>
      </div>

      <div className="cdd-grid">
        {statsCards.map((card, idx) => (
          <StatCard key={idx} card={card} />
        ))}
      </div>

      <div className="cdd-chart-section">
        <h4 className="cdd-section-title"><Activity size={18} /> Historial de Consumo (Últimos Meses)</h4>
        <div style={{ height: '300px', width: '100%' }}>
          <GradientAreaChart
            data={consumptionData.history.slice().reverse()} // Assuming data is newest first, reverse it for chronological chart
            dataKeyX="date"
            dataKeyY="consumptionM3"
            nameX="Mes"
            nameY="Consumo (m³)"
            startColor="#0ea5e9" // Sky blue
            endColor="#3b82f6" // Blue
          />
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Últimas 5 Lecturas</h5>
          <div className="cdd-table-container">
            <table className="cdd-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Lectura Ant.</th>
                  <th>Lectura Act.</th>
                  <th>Consumo</th>
                  <th>Novedad</th>
                </tr>
              </thead>
              <tbody>
                {consumptionData.history.slice(0, 5).map((reading: any, idx: number) => (
                  <tr key={idx}>
                    <td>{reading.date}</td>
                    <td>{reading.previousReading}</td>
                    <td>{reading.currentReading}</td>
                    <td><strong>{reading.consumptionM3} m³</strong></td>
                    <td>
                      <span className={`cdd-badge ${reading.anomalyNovelty === 'NORMAL' ? 'cdd-badge-normal' : 'cdd-badge-alert'}`}>
                        {reading.anomalyNovelty}
                      </span>
                    </td>
                  </tr>
                ))}
                {consumptionData.history.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No hay lecturas registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="cdd-chart-section">
        <h4 className="cdd-section-title"><AlertTriangle size={18} /> Últimos Incidentes Reportados</h4>
        {incidentsData.latest && incidentsData.latest.length > 0 ? (
          <div className="cdd-incidents-list">
            {incidentsData.latest.map((incident: any, idx: number) => (
              <div key={idx} className="cdd-incident-item">
                <div className="cdd-incident-desc">
                  {incident.description}
                </div>
                <div className="cdd-incident-meta">
                  <ColorChip 
                    label={incident.status} 
                    color={incident.status === 'EN_INSPECCION' ? 'amber' : incident.status === 'RESUELTO' ? 'green' : 'blue'} 
                    size="sm"
                  />
                  <span>{incident.reportDate}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No hay incidentes reportados recientemente.</p>
        )}
      </div>
    </div>
  );
};
