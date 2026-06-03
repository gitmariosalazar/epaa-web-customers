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
import { AcometidasPage } from '@/modules/acometidas/presentation/pages/AcometidasPage';
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

/**
 * ProtectedRoute — SRP: only checks authentication status.
 */
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <CircularProgress />;
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

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
