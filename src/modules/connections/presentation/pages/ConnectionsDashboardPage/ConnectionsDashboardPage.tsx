import React, { useEffect, useMemo, useState } from 'react';
import { useConnectionDashboard } from '../../hooks/useConnectionDashboard';
import {
  DonutChart,
  type DonutSlice
} from '@/shared/presentation/components/Charts/DonutChart';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import {
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  Clock,
  Search,
  DollarSign,
  AlertTriangle,
  Droplet,
  User,
  Home
} from 'lucide-react';
import styles from './ConnectionsDashboardPage.module.css';
import {
  APIProvider,
  Map,
  InfoWindow,
  useMap,
  AdvancedMarker
} from '@vis.gl/react-google-maps';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import {
  DARK_MAP_STYLE,
  SILVER_MAP_STYLE
} from '../../components/Map/MapStyles';
import type { ConnectionDashboardResponse } from '../../../domain/models/view-dashboard.response';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaRegIdCard } from 'react-icons/fa';
import { StatsGrid, StatCard, type StatCardItem } from '@/shared/presentation/components/Stats/StatsGrid';
import { Divider } from '@/shared/presentation/components/divider/Divider';
import { DashBoardProgressProcess, type DataProgressProcess } from '@/shared/presentation/components/ProgressBar/DashBoardProgressProcess';
import { MdCable, MdMicExternalOff } from 'react-icons/md';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { Carousel } from '@/shared/presentation/components/Carousel';
import { ConnectionDetailDashboard } from '../../components/Dashboard/ConnectionDetailDashboard';

const MapController: React.FC<{
  theme: string;
  selectedPin: ConnectionDashboardResponse | null;
}> = ({ theme, selectedPin }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.setOptions({
      styles: theme === 'dark' ? DARK_MAP_STYLE : SILVER_MAP_STYLE
    });
  }, [map, theme]);

  useEffect(() => {
    if (!map || !selectedPin || !selectedPin.latitude || !selectedPin.longitude) return;
    map.panTo({
      lat: Number(selectedPin.latitude),
      lng: Number(selectedPin.longitude)
    });
    if (map.getZoom() < 16) {
      map.setZoom(16);
    }
  }, [map, selectedPin]);

  return null;
};

export const ConnectionsDashboardPage: React.FC = () => {
  const { data, liveData, isLoading, error, fetchStats, fetchLiveData } =
    useConnectionDashboard();
  const { theme } = useTheme();

  // Tabs correspond to the 3 main blocks: Financial/Commercial, Infrastructure, Map
  const [activeTab, setActiveTab] = useState<'financial' | 'infra' | 'map'>('financial');
  const [selectedPin, setSelectedPin] = useState<ConnectionDashboardResponse | null>(null);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedConnection, setSelectedConnection] = useState<ConnectionDashboardResponse | null>(liveData[0]);
  /** Incrementing this closes the Carousel's internal modal */
  const [closeCarouselCount, setCloseCarouselCount] = useState(0);

  useEffect(() => {
    if (liveData.length > 0 && !selectedConnection) {
      setSelectedConnection(liveData[0]);
      console.log('Datos de liveData: ', liveData[0]);
    }
  }, [liveData, selectedConnection]);


  // Responsive Carousel logic
  const [itemsPerView, setItemsPerView] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1400) setItemsPerView(4);
      else if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredLiveData = useMemo(() => {
    if (!searchQuery.trim()) return liveData;
    const q = searchQuery.toLowerCase().trim();
    return liveData.filter((conn) => {
      return (
        (conn.client?.name || '').toLowerCase().includes(q) ||
        (conn.cadastralKey || '').toLowerCase().includes(q) ||
        (conn.address || '').toLowerCase().includes(q)
      );
    });
  }, [liveData, searchQuery]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'map') {
      fetchLiveData();
    }
  }, [activeTab, fetchLiveData]);

  const requestsSlices: DonutSlice[] = useMemo(() => {
    if (!data?.processes) return [];
    const completed = data.processes.totalRequests - data.processes.pendingRequests;
    return [
      { label: 'Aprobadas', value: completed, color: '#10b981' },
      { label: 'Pendientes', value: data.processes.pendingRequests, color: '#f59e0b' }
    ];
  }, [data]);

  const workOrdersSlices: DonutSlice[] = useMemo(() => {
    if (!data?.processes) return [];
    const completed = data.processes.totalWorkOrders - data.processes.activeWorkOrders;
    return [
      { label: 'Completadas', value: completed, color: '#3b82f6' },
      { label: 'Activas', value: data.processes.activeWorkOrders, color: '#8b5cf6' }
    ];
  }, [data]);

  if (isLoading && !data) {
    return (
      <div className={styles.loadingWrapper}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Activity size={32} className="animate-spin" />
          <span>Cargando visión 360 del cliente...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>No se pudo cargar el dashboard: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const itemsStatsGrid: StatCardItem[] = [
    {
      title: 'Saldo Actual',
      value: data.financials.currentDebtAmount.toFixed(2),
      desc: `Total de obligaciones financieras pendientes`,
      icon: DollarSign,
      color: data.financials.currentDebtAmount > 0 ? 'red' : 'green'
    },
    {
      title: 'Total Facturado',
      value: data.financials.totalInvoicedAmount.toFixed(2),
      desc: `Total facturado por el cliente`,
      icon: CheckCircle2,
      color: 'magenta'
    },
    {
      title: 'Perfil de Consumo',
      value: data.consumption.consumptionProfile.replace(/[^A-Za-z_]/g, '').replace('_', ' '),
      desc: 'Perfil de consumo del cliente',
      icon: Droplet,
      color: 'green'
    },
    {
      title: 'Promedio Consumo (m³)',
      value: data.consumption.averageConsumptionM3.toFixed(2) + ' m³',
      desc: `Promedio consumo del cliente (Ultima Lectura: ${data.consumption.lastReadingDate})`,
      icon: Droplet,
      color: 'amber'
    },
    {
      title: 'Total de Servicios',
      value: data.infrastructure.totalConnections,
      desc: `Total de Acometidas Activas e Inactivas`,
      icon: Home,
      color: 'blue'
    }
  ];

  const dataConnectionStats: StatCardItem[] = liveData.map((conn, index) => ({
    title: truncateText(`Acometida ${index + 1}`, 15),
    value: conn.connectionId,
    desc: truncateText(conn.address || '', 28),
    icon: conn.hasSewerService ? MdCable : MdMicExternalOff,
    color: conn.status.includes('ACTIVE') ? 'green' : 'red',
    onClick: () => {
      setSelectedConnection(conn);
      // Close the Carousel modal if it is open
      setCloseCarouselCount((c) => c + 1);
    },
    isSelected: selectedConnection?.connectionId === conn.connectionId
  }));

  const dataRequests: DataProgressProcess[] = [{
    totalExpected: data.processes.totalRequests,
    totalCompleted: data.processes.totalRequests - data.processes.pendingRequests,
    totalPending: data.processes.pendingRequests,
    progressPercentage: (data.processes.totalRequests - data.processes.pendingRequests) / data.processes.totalRequests * 100

  }];

  const dataIncidents: DataProgressProcess[] = [{
    totalExpected: data.processes.totalIncidents,
    totalCompleted: data.processes.totalIncidents - data.processes.pendingIncidents,
    totalPending: data.processes.pendingIncidents,
    progressPercentage: (data.processes.totalIncidents - data.processes.pendingIncidents) / data.processes.totalIncidents * 100
  }];

  const dataWorkOrders: DataProgressProcess[] = [{
    totalExpected: data.processes.totalWorkOrders,
    totalCompleted: data.processes.totalWorkOrders - data.processes.activeWorkOrders,
    totalPending: data.processes.activeWorkOrders,
    progressPercentage: (data.processes.totalWorkOrders - data.processes.activeWorkOrders) / data.processes.totalWorkOrders * 100
  }];

  const headerContent = (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>Mi Dashboard</h1>
        <div className={styles.dashboardInfo}>

          <ColorChip icon={<User size={12} />} label={data.clientName} color="primary" variant="soft" size='xs' />
          <ColorChip icon={<FaRegIdCard size={12} />} label={data.clientId} color="gray" variant="ghost" size='xs' />

        </div>
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'financial' ? styles.active : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          <Activity size={16} /> Estado de Cuenta
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'infra' ? styles.active : ''}`}
          onClick={() => setActiveTab('infra')}
        >
          <Layers size={16} /> Mis Servicios y Consumos
        </button>
      </div>
      <span className={styles.clientSince}>Cliente desde: {new Date(data.clientSinceDate).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    </header>
  );

  return (
    <PageLayout header={headerContent} className={styles.dashboardContainer}>

      {/* TAB 1: FINANCIAL & COMMERCIAL */}
      {activeTab === 'financial' && (
        <div className={styles.tabContent}>
          <section className={styles.kpiGrid}>
            <StatsGrid className={styles.statsGrid} items={itemsStatsGrid} />
          </section>

          <section className={styles.chartsGrid}>
            <DonutChart
              title="Solicitudes de Servicio"
              slices={requestsSlices}
              centerLabel="Total"
              centerValue={data.processes.totalRequests.toString()}
              description="Estado de los trámites"
            />
            <DonutChart
              title="Órdenes de Trabajo"
              slices={workOrdersSlices}
              centerLabel="Total"
              centerValue={data.processes.totalWorkOrders.toString()}
              description="Estado de las órdenes en terreno"
            />
          </section>
          <section className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>
                <Layers size={18} /> Acometidas Activas
              </h3>
              <p className={styles.kpiValue}>
                {data.infrastructure.activeConnections}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                De {data.infrastructure.totalConnections} acometidas registradas
              </span>
            </div>

            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>
                <CheckCircle2 size={18} /> Medidores Físicos
              </h3>
              <p className={`${styles.kpiValue} ${styles.success}`}>
                {data.infrastructure.installedMeters}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Medidores instalados en predios
              </span>
            </div>

            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>
                <Zap size={18} /> Servicios Con Alcantarillado
              </h3>
              <div className={styles.connectionTable}>
                <div className={styles.tableHeader}>
                  <span className={styles.tableName} style={
                    {
                      color: 'var(--warning)'
                    }
                  }>Sin Alcantarillado</span>
                  <span className={styles.tableValue} style={{
                    color: 'var(--warning)'
                  }}>{data.infrastructure.totalConnections - data.infrastructure.withSewerService}</span>
                </div>
                <div className={styles.tableHeader}>
                  <span className={styles.tableName} style={{
                    color: 'var(--success)'
                  }}>Con Alcantarillado</span>
                  <span className={styles.tableValue} style={{
                    color: 'var(--success)'
                  }}>{data.infrastructure.withSewerService}</span>
                </div>
                <Divider variant='dashed' />
                <div className={styles.tableHeader}>
                  <span className={styles.tableName} style={
                    {
                      color: 'var(--magenta)',
                      fontWeight: 'bold'
                    }
                  }>Total Acometidas</span>
                  <span className={styles.tableValue}
                    style={
                      {
                        fontWeight: 'bold',
                        color: 'var(--magenta)'
                      }
                    }
                  >{data.infrastructure.totalConnections}</span>
                </div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>
                <AlertTriangle size={18} /> Incidentes y Daños
              </h3>
              <p className={styles.kpiValue} style={{ color: data.processes.pendingIncidents > 0 ? '#f59e0b' : '#10b981' }}>
                {data.processes.pendingIncidents} pendientes
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                De {data.processes.totalIncidents} incidentes históricos
              </span>
            </div>
          </section>
          <section>
            <div className="dashboard-novelties-row">
              <DashBoardProgressProcess
                title='Progreso de Avance de Solicitud de Servicios'
                data={dataRequests}
                loading={false}
              />
            </div>
            <div className="dashboard-novelties-row">
              <DashBoardProgressProcess
                title='Progreso de Avance de Incidentes'
                data={dataIncidents}
                loading={false}
              />
            </div>
            <div className="dashboard-novelties-row">
              <DashBoardProgressProcess
                title='Progreso de Avance de Ordenes de Trabajo'
                data={dataWorkOrders}
                loading={false}
              />
            </div>
          </section>
        </div >
      )}

      {/* TAB 2: INFRASTRUCTURE & PROCESSES */}
      {
        activeTab === 'infra' && (
          <div className={styles.tabContent}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Carousel
                size="xs"
                autoPlay={true}
                interval={4000}
                modalTitle="Detalles de la Acometida"
                itemsPerView={itemsPerView}
                gap={16}
                fullWidth={true}
                closeRequestCount={closeCarouselCount}
                onModalOpen={() => {}}
                onModalClose={() => {}}
              >
                {dataConnectionStats.map((card, idx) => (
                  <StatCard key={idx} card={card}

                  />
                ))}
              </Carousel>

              {selectedConnection && (
                <div style={{ width: '100%' }}>
                  <ConnectionDetailDashboard
                    connection={selectedConnection}
                    onClose={() => setSelectedConnection(null)}
                  />
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* TAB 3: MAP */}
      {
        activeTab === 'map' && (
          <div className={styles.tabContent}>
            <section className={styles.mapSection}>
              <div className={styles.mapHeader}>
                <h3 className={styles.chartTitle}>Ubicación Geográfica de las Acometidas</h3>
                <div className={styles.mapTools}>
                  <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Buscar clave catastral, cliente, dirección..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.mapStatsRow}>
                <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                  <Clock size={14} /> Total georreferenciadas: {liveData.length.toLocaleString()}
                </span>
              </div>

              <div className={styles.mapSectionBody}>
                <div className={styles.mapContainer}>
                  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
                    <Map
                      defaultCenter={FALLBACK_CENTER_ANTONIO_ANTE}
                      defaultZoom={14}
                      mapId={(import.meta.env.VITE_GOOGLE_MAPS_ID as string) || 'DEMO_MAP_ID'}
                      disableDefaultUI={true}
                      zoomControl={true}
                      style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                    >
                      <MapController theme={theme} selectedPin={selectedPin} />

                      {filteredLiveData.map((conn) => {
                        if (!conn.latitude || !conn.longitude) return null;

                        const isSelected = selectedPin?.connectionId === conn.connectionId;
                        const isHovered = hoveredPinId === conn.connectionId;
                        const markerColor = conn.consumption?.automaticAlert?.includes('LEAK') || conn.consumption?.automaticAlert?.includes('ANOMALY')
                          ? '#ef4444'
                          : (conn.status === 'ACTIVA' || conn.status === 'ACTIVE' || conn.status.includes('ACTIVA') ? '#10b981' : '#f59e0b');

                        return (
                          <AdvancedMarker
                            key={conn.connectionId}
                            position={{ lat: Number(conn.latitude), lng: Number(conn.longitude) }}
                            onClick={() => setSelectedPin(conn)}
                            onMouseEnter={() => setHoveredPinId(conn.connectionId)}
                            onMouseLeave={() => setHoveredPinId(null)}
                          >
                            <div
                              className={styles.mapMarker}
                              style={{
                                backgroundColor: markerColor,
                                transform: isSelected || isHovered ? 'scale(1.2)' : 'scale(1)',
                                zIndex: isSelected || isHovered ? 10 : 1
                              }}
                            />
                          </AdvancedMarker>
                        );
                      })}

                      {selectedPin && selectedPin.latitude && selectedPin.longitude && (
                        <InfoWindow
                          position={{ lat: Number(selectedPin.latitude), lng: Number(selectedPin.longitude) }}
                          onCloseClick={() => setSelectedPin(null)}
                          anchor={null}
                        >
                          <div className={styles.infoWindow}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#111827' }}>
                              Acometida {selectedPin.cadastralKey}
                            </h4>
                            <div style={{ fontSize: '0.875rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <p style={{ margin: 0 }}><strong>Medidor:</strong> {selectedPin.meter?.serial || 'Sin medidor'}</p>
                              <p style={{ margin: 0 }}><strong>Estado:</strong> {selectedPin.status}</p>
                              <p style={{ margin: 0 }}><strong>Consumo Histórico:</strong> {selectedPin.consumption?.historicalAverageM3} m³</p>
                              <p style={{ margin: 0 }}><strong>Último Consumo:</strong> {selectedPin.consumption?.lastConsumptionM3} m³</p>
                              <p style={{ margin: 0, marginTop: '8px' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  backgroundColor: selectedPin.consumption?.automaticAlert?.includes('ANOMALY') || selectedPin.consumption?.automaticAlert?.includes('LEAK') ? '#fee2e2' : '#dcfce7',
                                  color: selectedPin.consumption?.automaticAlert?.includes('ANOMALY') || selectedPin.consumption?.automaticAlert?.includes('LEAK') ? '#b91c1c' : '#15803d'
                                }}>
                                  {selectedPin.consumption?.automaticAlert.replace(/[^A-Za-z_]/g, '').replace(/_/g, ' ')}
                                </span>
                              </p>
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </Map>
                  </APIProvider>
                </div>
              </div>
            </section>
          </div>
        )
      }
    </PageLayout >
  );
};
