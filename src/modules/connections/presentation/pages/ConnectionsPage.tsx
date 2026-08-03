import '../styles/ConnectionsPage.css';
import {
  useConnectionsViewModel,
  type ConnectionTab
} from '../hooks/useConnectionsViewModel';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Network, Users, LayoutGrid } from 'lucide-react';
import { CreateConnectionWizard } from '../components/CreateConnectionWizard';
import { ConnectionDataList } from '../components/ConnectionDataList';
import { ConnectionsFilters } from '../components/ConnectionsFilters';
import { ConnectionMapFeature } from '../components/Map/ConnectionMapFeature';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { OverduePaymentsTable } from '@/modules/accounting/presentation/components/overdue/OverduePaymentsTable';
import { PendingReadingsModal } from '@/modules/accounting/presentation/components/pending-readings/PendingReadingsModal';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { useOverduePaymentsViewModel } from '@/modules/accounting/presentation/hooks/overdue/useOverduePaymentsViewModel';
import { useClientPendingBills } from '@/modules/accounting/presentation/hooks/pending-readings/useClientPendingBills';
import { ClientPendingBillsList } from '@/modules/accounting/presentation/components/pending-readings/ClientPendingBillsList';


export const ConnectionsPage = () => {
  const { t } = useTranslation();

  const CONNECTION_TABS: TabItem<ConnectionTab>[] = [
    {
      id: 'all',
      label: t('connections.tabs.allConnections'),
      icon: <LayoutGrid size={16} />
    },
    {
      id: 'sector',
      label: t('connections.tabs.overdueAccounts'),
      icon: <Network size={16} />
    },
    {
      id: 'client',
      label: t('connections.tabs.pendingReadings'),
      icon: <Users size={16} />
    }
  ];

  // ── Unified ViewModel (Handles both List and CRUD/Wizard) ────────────────
  const { state, actions } = useConnectionsViewModel();
  const { setViewMode, handleFetch } = actions;

  // ── Overdue Payments ViewModel (for Sector tab) ──────────────────────────
  const overdueViewModel = useOverduePaymentsViewModel();

  // ── Client Pending Bills ViewModel (for Client tab) ──────────────────────
  const clientBillsViewModel = useClientPendingBills();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const initializedModeRef = useRef({ table: false, map: false });

  useEffect(() => {
    const nextMode: 'table' | 'map' = pathname.endsWith('/map')
      ? 'map'
      : 'table';

    setViewMode(nextMode);

    // Fetch once per mode to avoid repeated empty-result loops.
    if (!initializedModeRef.current[nextMode]) {
      handleFetch();
      initializedModeRef.current[nextMode] = true;
    }
  }, [pathname, setViewMode, handleFetch]);

  const loadingProgress = useSimulatedProgress(state.isLoading);

  // ── Content renderer (mirrors PropertiesPage pattern) ────────────────────
  const renderContent = () => {
    if (state.isLoading && state.filteredConnections.length === 0 && state.activeTab !== 'sector') {
      return (
        <div className="connections-loading">
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Loading...')}
          />
        </div>
      );
    }

    if (state.error && state.activeTab !== 'sector') {
      return (
        <div className="connections-loading">
          <EmptyState
            message={t('common.error', 'Ocurrió un error')}
            description={state.error}
            icon={AlertCircle}
            variant="error"
            minHeight="300px"
          />
        </div>
      );
    }

    if (!state.isLoading && state.filteredConnections.length === 0 && state.activeTab !== 'client') {
      // No data fetched yet
      if (state.connections.length === 0) {
        return (
          <div className="connections-loading">
            <EmptyState
              message={t('common.noResults', 'Sin resultados')}
              description={t(
                'connections.noDataDescription',
                'No se encontraron Acometidas con los filtros actuales. Usa Consultar para cargar datos.'
              )}
              variant="info"
              minHeight="300px"
            />
          </div>
        );
      }
      // Data was loaded but the active filters return 0 results
      return (
        <div className="connections-loading">
          <EmptyState
            message={t(
              'connections.noFilterResults',
              'Sin resultados para este filtro'
            )}
            description={t(
              'connections.noFilterResultsDescription',
              'Ninguna acometida coincide con los filtros aplicados. Prueba cambiando o limpiando los filtros.'
            )}
            variant="info"
            minHeight="300px"
          />
        </div>
      );
    }

    if (state.activeTab === 'sector') {
      if (overdueViewModel.isLoading && overdueViewModel.overduePayments.length === 0) {
        return (
          <div className="connections-loading">
            <CircularProgress
              progress={loadingProgress}
              size={112}
              strokeWidth={9}
              label={t('common.loading', 'Loading...')}
            />
          </div>
        );
      }
      return (
        <OverduePaymentsTable
          data={overdueViewModel.overduePayments}
          isLoading={overdueViewModel.isLoading}
          sortConfig={overdueViewModel.sortConfig}
          onSort={(key) => overdueViewModel.handleSort(key)}
          onEndReached={overdueViewModel.handleLoadMore}
          onViewPendingReadings={(clientId) => {
            overdueViewModel.fetchPendingReadings(clientId);
          }}
          hasMore={overdueViewModel.hasMore}
        />
      );
    }

    if (state.activeTab === 'client') {
      if (!clientBillsViewModel.isLoading && clientBillsViewModel.groupedBills.length === 0) {
        return (
          <div className="connections-loading">
            <EmptyState
              message={t('common.noResults', 'Sin deudas pendientes')}
              description="No se encontraron facturas pendientes para este cliente o aún no has consultado."
              variant="info"
              minHeight="300px"
            />
          </div>
        );
      }
      return (
        <ClientPendingBillsList
          groups={clientBillsViewModel.groupedBills}
          isLoading={clientBillsViewModel.isLoading}
        />
      );
    }

    if (state.viewMode === 'map') {
      return <ConnectionMapFeature viewModel={{ state, actions }} />;
    }

    return (
      <ConnectionDataList
        data={state.filteredConnections}
        isLoading={state.isLoading}
        onEdit={actions.openEdit}
        onDelete={actions.openDelete}
        onSort={actions.handleSort}
        sortConfig={state.sortConfig}
        onEndReached={actions.loadMore}
        hasMore={state.hasMore}
        onViewOnMap={(conn) => {
          actions.setSelectedConnection(conn);
          actions.setViewMode('map');
        }}
        onViewIncidentsOnTable={(connectionId) =>
          navigate(
            `/incidents?connectionId=${encodeURIComponent(connectionId)}`
          )
        }
        onViewIncidentsOnMap={(connectionId) =>
          navigate(
            `/incidents/map?connectionId=${encodeURIComponent(connectionId)}`
          )
        }
      />
    );
  };

  return (
    <PageLayout
      className="connections-page"
      header={
        <div className="connections-tabs-row">
          <Tabs
            tabs={CONNECTION_TABS}
            activeTab={state.activeTab}
            onTabChange={actions.handleTabChange}
          />
        </div>
      }
      filters={
        <ConnectionsFilters
          activeTab={state.activeTab}
          sectorInput={state.sectorInput}
          onSectorInputChange={actions.setSectorInput}
          clientIdInput={state.clientIdInput}
          onClientIdInputChange={actions.setClientIdInput}
          onFetch={() => {
            if (state.activeTab === 'client') {
              // The useClientPendingBills hook will use user.cardId if sectorInput is empty.
              clientBillsViewModel.fetchPendingBills(state.sectorInput);
            } else if (state.activeTab === 'sector') {
              // We need to fetch overdue payments and apply local filter
              if (state.sectorInput.trim() !== '') {
                overdueViewModel.setSearchField('cadastralKey');
                overdueViewModel.setSearchQuery(state.sectorInput);
              } else {
                overdueViewModel.handleClearSearch();
              }
              overdueViewModel.fetchOverduePayments(0, false, true);
            } else {
              actions.handleFetch();
            }
          }}
          isLoading={state.isLoading || clientBillsViewModel.isLoading || overdueViewModel.isLoading}
          canFetch={true}
          searchQuery={state.searchQuery}
          onSearchQueryChange={actions.setSearchQuery}
          searchField={state.searchField}
          onSearchFieldChange={actions.setSearchField}
          selectedStatus={state.selectedStatus}
          onStatusChange={actions.setSelectedStatus}
          selectedSewerage={state.selectedSewerage}
          onSewerageChange={actions.setSelectedSewerage}
          selectedIncidents={state.selectedIncidents}
          onIncidentsChange={actions.setSelectedIncidents}
          selectedCoordinates={state.selectedCoordinates}
          onCoordinatesChange={actions.setSelectedCoordinates}
        />
      }
    >
      {/* ── Content ── */}
      <div className="connections-page-content">{renderContent()}</div>

      {/* ── Create/Edit Wizard ── */}
      {state.isFormOpen && (
        <CreateConnectionWizard
          viewModel={{ state, actions }}
          onClose={() => actions.setIsFormOpen(false)}
        />
      )}

      {/* ── Delete Modal ── */}
      <Modal
        isOpen={state.isDeleteOpen}
        onClose={() => actions.setIsDeleteOpen(false)}
        title={t('connections.deleteTitle', 'Eliminar Conexión')}
        footer={
          <>
            <Button
              variant="subtle"
              onClick={() => actions.setIsDeleteOpen(false)}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button
              onClick={actions.handleDelete}
              disabled={state.isLoading}
              style={{ backgroundColor: 'var(--error)' }}
            >
              {t('common.delete', 'Eliminar')}
            </Button>
          </>
        }
      >
        <p>
          {t(
            'connections.deleteConfirm',
            '¿Está seguro que desea eliminar esta conexión? Esta acción no se puede deshacer.'
          )}
        </p>
      </Modal>

      {/* ── Pending Readings Modal (for Overdue Payments) ── */}
      {state.activeTab === 'sector' && (
        <PendingReadingsModal
          isOpen={overdueViewModel.isPendingModalOpen}
          onClose={() => overdueViewModel.setIsPendingModalOpen(false)}
          data={overdueViewModel.pendingReadings}
          isLoading={overdueViewModel.isPendingLoading}
        />
      )}
    </PageLayout>
  );
};
