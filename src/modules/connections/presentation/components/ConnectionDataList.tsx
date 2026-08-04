import React, { useState, useMemo } from 'react';
import './ConnectionDataList.css';
import {
  DataList,
  type Column
} from '@/shared/presentation/components/Table/DataList';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Check, CheckCircle, EyeIcon, Settings, X, Activity } from 'lucide-react';
import { FaMapMarkerAlt, FaFileInvoiceDollar } from 'react-icons/fa';
import type { Connection, ConnectionAndPropertyResponse } from '../../domain/models/Connection';
import type { SortConfig } from '../hooks/useConnectionsViewModel';
import { IoInformationCircleOutline, IoWaterSharp, IoSpeedometerOutline } from 'react-icons/io5';
import { getConnectionStateChip } from '../utils/connectionStateChip';
import { BsTable } from 'react-icons/bs';
import { GiHexagonalNut } from 'react-icons/gi';

// ── DetailModal (lightweight inline modal for viewing a connection) ────────────
interface ConnectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection: ConnectionAndPropertyResponse | null;
}

const ConnectionDetailModal: React.FC<ConnectionDetailModalProps> = ({
  isOpen,
  onClose,
  connection
}) => {
  const { t } = useTranslation();
  if (!isOpen || !connection) return null;

  const detailRows = [
    { label: t('connections.table.connectionId'), value: connection.connectionId },
    { label: t('connections.table.clientId'), value: connection.clientId },
    { label: t('connections.table.meterNumber'), value: connection.connectionMeterNumber },
    { label: t('connections.table.cadastralKey'), value: connection.connectionCadastralKey },
    { label: t('connections.table.contractNumber'), value: connection.connectionContractNumber },
    { label: t('connections.wizard.clientSelection.address'), value: connection.connectionAddress },
    { label: t('connections.table.rate'), value: connection.connectionRateName },
    { label: t('connections.table.sector'), value: connection.connectionSector },
    { label: t('connections.table.zone'), value: connection.connectionZone },
    { label: t('connections.table.people'), value: connection.connectionPeopleNumbers },
    { label: t('connections.table.altitude'), value: connection.connectionAltitude },
    {
      label: t('connections.table.installationDate'),
      value: connection.connectionInstallationDate
        ? new Date(connection.connectionInstallationDate).toLocaleDateString()
        : '-'
    }
  ];

  return (
    <div className="conn-detail-overlay" onClick={onClose}>
      <div className="conn-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="conn-detail-header">
          <h3>{t('connections.table.detailsTitle')}</h3>
          <Button variant="ghost" size="sm" circle onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        <div className="conn-detail-body">
          {detailRows.map(({ label, value }) => (
            <div key={label} className="conn-detail-row">
              <span className="conn-detail-label">{label}</span>
              <span className="conn-detail-value">{value || '-'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Props ──────────────────────────────────────────────────────────────────────
interface ConnectionDataListProps {
  data: ConnectionAndPropertyResponse[];
  isLoading: boolean;
  onEdit: (connection: Connection) => void;
  onDelete: (connection: Connection) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: SortConfig | null;
  onEndReached?: () => void;
  hasMore?: boolean;
  onViewOnMap: (connection: ConnectionAndPropertyResponse) => void;
  onViewIncidentsOnTable?: (connectionId: string) => void;
  onViewIncidentsOnMap?: (connectionId: string) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────
export const ConnectionDataList: React.FC<ConnectionDataListProps> = ({
  data,
  isLoading,
  onEdit,
  onSort,
  sortConfig,
  onEndReached,
  hasMore,
  onViewOnMap,
  onViewIncidentsOnTable,
  onViewIncidentsOnMap
}) => {
  const { t } = useTranslation();
  const [selectedConnection, setSelectedConnection] = useState<ConnectionAndPropertyResponse | null>(null);

  // ── Columns ──────────────────────────────────────────────────────────────
  const columns: Column<ConnectionAndPropertyResponse>[] = useMemo(
    () => [
      {
        header: t('connections.table.sector'),
        accessor: (item) => item.connectionId.split('-')[0],
        filterValueGetter: (item) => item.connectionId.split('-')[0],
        sortable: true,
        id: 'connectionSector'
      },
      {
        header: t('connections.table.meterNumber'),
        accessor: 'connectionMeterNumberCurrent',
        sortable: true,
        id: 'connectionMeterNumberCurrent'
      },
      {
        header: t('connections.table.cadastralKey'),
        accessor: 'connectionId',
        sortable: true,
        id: 'connectionId'
      },
      {
        header: t('connections.table.connectionType', 'Tipo de acometida'),
        accessor: (item) => item.connectionTypeName || 'No definido',
        filterValueGetter: (item) => item.connectionTypeName || 'No definido',
        sortable: true,
        id: 'connectionTypeName'
      },
      {
        header: t('connections.table.incidents', 'Incidentes'),
        accessor: (item) => Number(item.incidents ?? 0),
        filterValueGetter: (item) => Number(item.incidents ?? 0),
        sortable: true,
        sortKey: 'incidents',
        id: 'incidents'
      },
      {
        header: t('connections.table.contractNumber'),
        accessor: 'connectionContractNumber',
        sortable: true,
        id: 'connectionContractNumber'
      },
      {
        header: t('connections.table.rate'),
        accessor: 'connectionRateName',
        sortable: true,
        id: 'connectionRateName'
      },
      {
        header: t('connections.table.sewerage'),
        accessor: (item) => item.connectionSewerage ? t('connections.table.yes') : t('connections.table.no'),
        filterValueGetter: (item) => item.connectionSewerage ? t('connections.table.yes') : t('connections.table.no'),
        id: 'connectionSewerage'
      },
      {
        header: t('connections.table.status'),
        accessor: (item) => getConnectionStateChip(item.connectionStatus).label,
        filterValueGetter: (item) => getConnectionStateChip(item.connectionStatus).label,
        id: 'connectionStatus'
      },
      {
        header: t('connections.table.connectionIsReadable', 'Lecturable'),
        accessor: (item) => item.connectionIsReadable ? t('connections.table.yes') : t('connections.table.no'),
        filterValueGetter: (item) => item.connectionIsReadable ? t('connections.table.yes') : t('connections.table.no'),
        id: 'connectionIsReadable'
      }
    ],
    [t]
  );

  // ── PDF Export ────────────────────────────────────────────────────────────
  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport<ConnectionAndPropertyResponse>({
    data,
    availableColumns: columns.map((c) => ({
      id: c.id as string,
      label: c.header as string,
      isDefault: true
    })),
    reportTitle: t('connections.table.reportTitle'),
    reportDescription: t('connections.table.reportDescription'),
    labelsHorizontal: {
      [t('readings.historyTable.readingDate')]: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    mapRowData: (item, selectedCols) => {
      const rowData: Record<string, string> = {
        connectionSector: String(item.connectionSector ?? '-'),
        clientId: item.clientId,
        connectionMeterNumber: item.connectionMeterNumber ?? '-',
        connectionCadastralKey: item.connectionCadastralKey ?? '-',
        connectionContractNumber: item.connectionContractNumber ?? '-',
        connectionRateName: item.connectionRateName ?? '-',
        connectionSewerage: item.connectionSewerage ? t('connections.table.yes') : t('connections.table.no'),
        connectionStatus: getConnectionStateChip(item.connectionStatus).label,
        connectionIsReadable: item.connectionIsReadable ? t('connections.table.yes') : t('connections.table.no')
      };
      return selectedCols.map((col) => rowData[col.id] || '-');
    }
  });

  const renderItem = (item: ConnectionAndPropertyResponse, index: number) => {
    const isWater = item.connectionType === 'AGUA_POTABLE';
    const incidentsCount = Number(item.incidents ?? 0);
    const stateChip = getConnectionStateChip(item.connectionStatus);

    return (
      <div key={item.connectionId || index} className={`connection-card-data-list ${isWater ? 'card-agua' : 'card-alcantarillado'}`}>
        {/* Left Icon Area */}
        <div className={`connection-card-icon-data-list ${isWater ? 'agua' : 'alcantarillado'}`}>
          {isWater ? <IoWaterSharp color={isWater ? "#3b82f6" : "#b98110"} /> : <GiHexagonalNut color={isWater ? "#3b82f6" : "#b98110"} />}
        </div>

        {/* Center Content */}
        <div className="connection-card-content-data-list">
          <div className="connection-card-header-data-list">
            <h3>{item.connectionId}</h3>
            <ColorChip
              label={stateChip.label}
              color={stateChip.color}
              icon={stateChip.icon}
              size="xs"
              variant="solid" // Like the Up badge in the screenshot
            />
            {item.connectionInstallationDate && (
              <span className="connection-card-meta-data-list">
                <Activity size={14} /> {new Date(item.connectionInstallationDate).toLocaleString()}
              </span>
            )}
            <span className="connection-card-meta-data-list">
              <FaMapMarkerAlt size={12} /> {item.connectionAddress || 'Sin Dirección'}
            </span>
          </div>

          <div className="connection-card-tags-data-list">
            <span>
              <strong>Sector:</strong> {item.connectionSector || 'N/A'}
            </span>
            <span>
              <FaFileInvoiceDollar size={14} />
              <strong>Contrato:</strong> {item.connectionContractNumber || 'N/A'}
            </span>
            <span>
              <IoSpeedometerOutline size={16} />
              <strong>Medidor:</strong> {item.connectionMeterNumberCurrent || 'N/A'}
            </span>
            <span>
              <strong>Tarifa:</strong> {item.connectionRateName || 'N/A'}
            </span>
          </div>

          <div className="connection-card-stats-data-list">
            <ColorChip
              icon={isWater ? <IoWaterSharp size={14} /> : <GiHexagonalNut size={14} />}
              color={isWater ? '#2563eb' : '#B98110'}
              variant="soft"
              size="xs"
              label={item.connectionTypeName || 'Desconocido'}
            >
            </ColorChip>

            {item.connectionSewerage ? (
              <span><Check size={14} color="#10b981" /> Alcantarillado</span>
            ) : (
              <span><X size={14} color="#ef4444" /> Sin Alcantarillado</span>
            )}

            {incidentsCount > 0 ? (
              <span className="stat-alert">
                <AlertTriangle size={14} /> {incidentsCount} Incidente(s)
              </span>
            ) : (
              <span className="stat-ok">
                <CheckCircle size={14} /> 0 Incidentes
              </span>
            )}
          </div>
        </div>

        {/* Right Actions Area */}
        <div className="connection-card-actions-wrapper-data-list">
          <div className="connection-card-buttons-data-list">
            <Button
              className="conn-action-btn-data-list"
              variant="outline"
              color="neutral"
              size="sm"
              leftIcon={<EyeIcon size={14} />}
              onClick={() => setSelectedConnection(item)}
            >
              {t('connections.table.viewDetails', 'Detalles')}
            </Button>
            <Button
              className="conn-action-btn-data-list"
              variant="outline"
              color={incidentsCount > 0 ? 'red' : 'green'}
              size="sm"
              leftIcon={<BsTable size={14} />}
              onClick={() => onViewIncidentsOnTable?.(item.connectionId)}
            >
              {incidentsCount > 0 ? 'Ver Incidentes' : 'Normal'}
            </Button>
          </div>
          <div className="connection-card-side-actions-data-list">
            <Tooltip content="Ver en Mapa" position="top">
              <Button size="sm" variant="ghost" color="amber" iconOnly circle leftIcon={<FaMapMarkerAlt size={16} />} onClick={() => onViewOnMap(item)} />
            </Tooltip>
            {incidentsCount > 0 && (
              <Tooltip content="Incidentes en Mapa" position="top">
                <Button size="sm" variant="ghost" color="red" iconOnly circle leftIcon={<AlertTriangle size={16} />} onClick={() => onViewIncidentsOnMap?.(item.connectionId)} />
              </Tooltip>
            )}
            <Tooltip content="Editar Acometida" position="top">
              <Button size="sm" variant="ghost" color="primary" iconOnly circle leftIcon={<Settings size={16} />} onClick={() => onEdit(item as unknown as Connection)} />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      <DataList
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={10}
        onSort={onSort}
        sortConfig={sortConfig}
        onExportPdf={() => setShowPdfPreview(true)}
        onEndReached={onEndReached}
        hasMore={hasMore}
        gridClassName="connection-datalist-grid"
        renderItem={renderItem}
        showColumnModal={false}
        emptyState={
          <EmptyState
            message={t('connections.table.noData')}
            description={t('connections.table.noDataDescription')}
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />

      <ConnectionDetailModal
        isOpen={selectedConnection !== null}
        onClose={() => setSelectedConnection(null)}
        connection={selectedConnection}
      />
      {PdfPreviewModal}
    </div>
  );
};
