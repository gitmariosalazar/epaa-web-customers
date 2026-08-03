import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import {
  AuthProvider,
  useAuth
} from '@/shared/presentation/context/AuthContext';
import { ThemeProvider } from '@/shared/presentation/context/ThemeContext';
import { LoginPage } from '@/modules/auth/presentation/pages/auth/LoginPage';
import { RegisterPage } from '@/modules/auth/presentation/pages/auth/RegisterPage';
import { DashboardLayout } from '@/shared/presentation/components/Layout/DashboardLayout';
import { DashboardHome } from '@/modules/dashboard/presentation/pages/dashboard/DashboardHome';
import { SolicitudNuevaPage } from '@/modules/solicitudes/presentation/pages/SolicitudNuevaPage';
import { SolicitudesListPage } from '@/modules/solicitudes/presentation/pages/SolicitudesListPage';
import { SolicitudesTrackingPage } from '@/modules/solicitudes/presentation/pages/SolicitudesTrackingPage';
import { TramitesCatalogPage } from '@/modules/tramites/presentation/pages/TramitesCatalogPage';
import { TramiteDetailPage } from '@/modules/tramites/presentation/pages/TramiteDetailPage';
import { TramitesProvider } from '@/modules/tramites/presentation/context/TramitesContext';
// ── Independent tramite module pages ──
import { AcometidasPage } from '@/modules/acometidas-catalog/presentation/pages/AcometidasPage';
import { CambioTitularPage } from '@/modules/cambio-titular/presentation/pages/CambioTitularPage';
import { SuspensionPage } from '@/modules/suspension/presentation/pages/SuspensionPage';
import { BeneficioTerceraEdadPage } from '@/modules/beneficio-tercera-edad/presentation/pages/BeneficioTerceraEdadPage';
import { BeneficioDiscapacidadPage } from '@/modules/beneficio-discapacidad/presentation/pages/BeneficioDiscapacidadPage';
import { SolicitudesProvider } from '@/modules/solicitudes/presentation/context/SolicitudesContext';
import { SolicitudDetailPage } from '@/modules/solicitudes/presentation/pages/SolicitudDetailPage';
import { ProfilePage } from '@/modules/settings/presentation/pages/profile/ProfilePage';
import { NotificationsPage } from '@/modules/notifications/presentation/pages/NotificationsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import UnAuthorizedPage from '@/shared/presentation/components/unauthorized/UnAuthorizedPage';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import SettingsPage from './shared/presentation/pages/settings/SettingsPage';
import { useEffect, useMemo } from 'react';
import { ConnectionProvider } from './modules/connections/presentation/context/ConnectionContext';
import { ConnectionsPage } from './modules/connections/presentation/pages/ConnectionsPage';
import { ConnectionsDashboardPage } from './modules/connections/presentation/pages/ConnectionsDashboardPage/ConnectionsDashboardPage';
import { IncidentProvider } from './modules/incidents/presentation/context/IncidentContext';
import { IncidentsPage } from './modules/incidents/presentation/pages/IncidentsPage';
import { ReadingsProvider } from './modules/readings/presentation/context/ReadingsContext';
import { CreateIncidentPage } from './modules/incidents/presentation/pages/CreateIncidentPage';
import { PaymentsProvider } from './modules/accounting/presentation/context/payments/PaymentsContext';

/**
 * ProtectedRoute — SRP: only checks authentication status.
 */
const ProtectedRoute = () => {
  const { token, user, isLoading, isVerifying, logout } = useAuth();

  console.log('user', user);

  // Validación robusta: verificar si el usuario tiene rol de externo/cliente
  const isExternal = useMemo(() => {
    if (!user) return false;

    // Imprimimos el usuario para depuración, como pediste
    console.log('[ProtectedRoute] Usuario actual con token:', user);

    const rawRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
    return rawRoles.filter(Boolean).some((r: any) => {
      const roleName = typeof r === 'object' && r.name ? r.name : String(r);
      const upper = roleName.toUpperCase();
      return (
        upper !== 'ABONADO PORTAL WEB'
      );
    });
  }, [user]);

  // Ejecutamos logout inmediatamente si es externo (Clean Architecture: Controller level side effect)
  useEffect(() => {
    if (isExternal) {
      console.warn("Acceso denegado: Usuario externo intentando acceder a la intranet.");
      logout();
    }
  }, [isExternal, logout]);

  // Si estamos validando, o si descubrimos que es externo (y el logout está en curso), mostramos loader
  if (isLoading || isVerifying || isExternal) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * RoleGuard - SOLID (Single Responsibility & Open/Closed)
 * Protege rutas basadas en el rol del usuario sin acoplar la lógica al componente de la página.
*/
/*
const RoleGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );

  // Aseguramos que sea un array de strings o de objetos y extraemos el nombre del rol normalizado
  const rawRoles = Array.isArray(user?.roles) ? user?.roles : [user?.roles];
  const userRoles = rawRoles.filter(Boolean).flatMap((r: any) => {
    const name = typeof r === 'object' && r.name ? r.name : String(r);
    const upper = name.toUpperCase();
    console.log(userRoles)
    // Mapeamos 'ADMINISTRADOR' a 'ADMIN' para compatibilidad con allowedRoles={['ADMIN']}
    if (upper === 'SUPER ADMINISTRADOR') {
      return ['SUPER ADMINISTRADOR', 'ADMINISTRADOR'];
    }
    return [upper];
  });

  const hasAccess = allowedRoles.some((role) =>
    userRoles.includes(role.toUpperCase())
  );

  console.log('hasAccess', hasAccess);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

console.log(RoleGuard)
*/


function App() {

  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={4500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        <BrowserRouter>
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnAuthorizedPage />} />

            {/* ── Protected Routes ── */}
            <Route element={<ProtectedRoute />}>
              {/* TramitesProvider wraps all protected routes — DIP at router boundary */}
              <Route
                element={
                  <TramitesProvider>
                    <SolicitudesProvider>
                      <DashboardLayout />
                    </SolicitudesProvider>
                  </TramitesProvider>
                }
              >
                {/* Dashboard */}
                <Route path="/" element={<DashboardHome />} />

                {/* ── Trámites — Catálogo general ── */}
                <Route path="/procedures" element={<Outlet />}>
                  <Route index element={<TramitesCatalogPage />} />
                  <Route path=":id" element={<TramiteDetailPage />} />
                </Route>

                {/* ── Módulos independientes por trámite ── */}
                <Route path="/procedures/acometidas" element={<AcometidasPage />} />
                <Route path="/procedures/cambio-titular" element={<CambioTitularPage />} />
                <Route path="/procedures/suspension" element={<SuspensionPage />} />
                <Route path="/procedures/tercera-edad" element={<BeneficioTerceraEdadPage />} />
                <Route path="/procedures/discapacidad" element={<BeneficioDiscapacidadPage />} />

                {/* ── Solicitudes ── */}
                <Route path="/requests/new" element={<SolicitudNuevaPage />} />
                <Route path="/requests/new/:procedureId" element={<SolicitudNuevaPage />} />

                {/* Fallbacks/Aliases for /solicitudes/ paths */}
                <Route path="/solicitudes/nueva" element={<Navigate to="/requests/new" replace />} />
                <Route path="/solicitudes/nueva/:procedureId" element={<Navigate to="/requests/new/:procedureId" replace />} />
                <Route path="/solicitudes/lista" element={<Navigate to="/requests/list" replace />} />
                <Route path="/solicitudes/en-proceso" element={<Navigate to="/requests/pending" replace />} />
                <Route path="/solicitudes/aprobadas" element={<Navigate to="/requests/approved" replace />} />
                <Route path="/solicitudes/rechazadas" element={<Navigate to="/requests/rejected" replace />} />

                {/* Solicitud Detail */}
                <Route path="/solicitudes/:id" element={<SolicitudDetailPage />} />
                <Route path="/requests/:id" element={<SolicitudDetailPage />} />
                <Route path="/requests/:categoria/:id" element={<SolicitudDetailPage />} />

                {/* Fallbacks for backwards compatibility */}
                <Route path="/requests/tracking" element={<SolicitudesTrackingPage />} />
                <Route path="/requests/list" element={<SolicitudesListPage />} />
                <Route path="/requests/pending" element={<SolicitudesListPage filter="en_proceso" />} />
                <Route path="/requests/approved" element={<SolicitudesListPage filter="aprobada" />} />
                <Route path="/requests/rejected" element={<SolicitudesListPage filter="rechazada" />} />

                {/* ── Dynamic Category Routes ── */}
                <Route path="/requests/:categoria/new" element={<SolicitudNuevaPage />} />
                <Route path="/requests/:categoria/tracking" element={<SolicitudesTrackingPage />} />
                <Route path="/requests/:categoria/list" element={<SolicitudesListPage />} />
                <Route path="/requests/:categoria/pending" element={<SolicitudesListPage filter="en_proceso" />} />
                <Route path="/requests/:categoria/approved" element={<SolicitudesListPage filter="aprobada" />} />
                <Route path="/requests/:categoria/rejected" element={<SolicitudesListPage filter="rechazada" />} />

                {/* ── Perfil & Configuración ── */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* ── Notificaciones ── */}
                <Route path="/notifications" element={<NotificationsPage />} />

                {/* ── Connections ── */}
                <Route
                  path="/connections/*"
                  element={
                    <ConnectionProvider>
                      <PaymentsProvider>
                        <Routes>
                          <Route index element={<Navigate to="list" replace />} />
                          <Route path="list" element={<ConnectionsPage />} />
                          <Route path="map" element={<ConnectionsPage />} />
                          <Route
                            path="dashboard"
                            element={<ConnectionsDashboardPage />}
                          />
                        </Routes>
                      </PaymentsProvider>
                    </ConnectionProvider>
                  }
                />
                <Route
                  path="/incidents/*"
                  element={
                    <IncidentProvider>
                      <Routes>
                        {/* Ruta raíz → lista */}
                        <Route index element={<IncidentsPage />} />
                        {/* Tab: Lista e Incidentes (comparten IncidentsPage, el tab se sincroniza por pathname) */}
                        <Route path="list" element={<IncidentsPage />} />
                        <Route path="map" element={<IncidentsPage />} />
                        {/* Crear incidente (flujo separado) */}
                        <Route
                          path="create"
                          element={
                            <ReadingsProvider>
                              <CreateIncidentPage />
                            </ReadingsProvider>
                          }
                        />
                      </Routes>
                    </IncidentProvider>
                  }
                />
                <Route />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
