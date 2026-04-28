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
import { ProfilePage } from '@/modules/users/presentation/pages/profile/ProfilePage';
import { UsersPage } from '@/modules/users/presentation/pages/users/UsersPage';
import { UserDetailPage } from '@/modules/users/presentation/pages/users/UserDetailPage';
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
                    <DashboardLayout />
                  </TramitesProvider>
                }
              >
                {/* Dashboard */}
                <Route path="/" element={<DashboardHome />} />

                {/* ── Trámites y Requisitos ── */}
                <Route path="/procedures" element={<Outlet />}>
                  <Route index element={<TramitesCatalogPage />} />
                  <Route path=":id" element={<TramiteDetailPage />} />
                </Route>

                {/* ── Solicitudes ── */}
                <Route path="/requests/new" element={<SolicitudNuevaPage />} />
                <Route path="/requests/new/:procedureId" element={<SolicitudNuevaPage />} />
                
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

                {/* ── Usuarios ── */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />

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
