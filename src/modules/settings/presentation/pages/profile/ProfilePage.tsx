import { UsersProvider } from '../../context/UsersContext';
import './Profile.css';
import { ChangePasswordModal } from '@/shared/presentation/components/Modal/ChangePasswordModal';
import { EditCustomerProfileModal } from '../../components/EditCustomerProfileModal';
import { EditCompanyProfileModal } from '../../components/EditCompanyProfileModal';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Activity,
  AlertTriangle,
  Lock,
  Building2,
  Phone,
  Edit2
} from 'lucide-react';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useProfileViewModel } from '../../hooks/useProfileViewModel';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';

/**
 * ProfileContent — presentation only.
 *
 * SRP: renders profile data and delegates all actions to useProfileViewModel.
 * OCP: adding a new action only requires extending the view model, not this component.
 */
const ProfileContent = () => {
  const {
    profile,
    loading,
    error,
    isSaving,
    isEditOpen,
    setIsEditOpen,
    isPasswordOpen,
    setIsPasswordOpen,
    handleUpdateCustomer,
    handleUpdateCompany,
    handleChangePassword
  } = useProfileViewModel();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="profile-page__container"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
      >
        <div className="profile-page__loader">
          <CircularProgress />
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !profile) {
    return (
      <div className="profile-page__container">
        <div className="profile-page__error-message">
          <AlertTriangle size={24} />
          <span>{error || 'Perfil no encontrado'}</span>
        </div>
      </div>
    );
  }

  // ── Derived display values ─────────────────────────────────────────────────
  const isCompany = !!profile.company;

  const displayName = isCompany
    ? (profile.company?.commercialName || profile.company?.businessName || profile.username)
    : `${profile.person?.firstName ?? ''} ${profile.person?.lastName ?? ''}`.trim() || profile.username;

  const avatarLetter = displayName.charAt(0).toUpperCase();

  const primaryPhone = isCompany
    ? profile.company?.phones?.[0]?.numero
    : profile.person?.phones?.[0]?.numero;

  return (
    <div className="profile-page__container">

      {/* ── Header ── */}
      <div className="profile-page__header">
        <div className="profile-page__avatar-wrapper">
          <div className="profile-page__avatar">{avatarLetter}</div>
        </div>

        <div className="profile-page__info">
          <h1>{displayName}</h1>
          <div className="profile-page__role-badge">
            <div className="user-detail__tags">
              {profile.username === 'root' ? (
                <span className="profile-page__permission-tag profile-page__permission-tag--super-user">
                  All Permissions — Super User
                </span>
              ) : (
                profile.roles.map((role: any) => {
                  const name = typeof role === 'string' ? role : role.name;
                  const key  = typeof role === 'string' ? role : (role.id?.toString() ?? name);
                  return (
                    <span key={key} className="user-detail__tag user-detail__tag--role">
                      {name}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Edit button — visible for both natural and company */}
        <button
          className="btn-secondary profile-page__header-btn"
          onClick={() => setIsEditOpen(true)}
          title="Editar datos personales"
        >
          <Edit2 size={16} /> Editar datos
        </button>
      </div>

      {/* ── Cards grid ── */}
      <div className="profile-page__grid">

        {/* Personal / Company info */}
        <div className="profile-page__card">
          <h2>
            {isCompany
              ? <><Building2 size={24} strokeWidth={1.5} /> Empresa</>
              : <><UserIcon size={24} strokeWidth={1.5} /> Información Personal</>}
          </h2>

          <div className="profile-page__info-group">
            <label>Usuario</label>
            <div className="profile-page__info-value">
              <UserIcon size={16} /> {profile.username}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Correo</label>
            <div className="profile-page__info-value">
              <Mail size={16} /> {profile.email}
            </div>
          </div>

          {primaryPhone && (
            <div className="profile-page__info-group">
              <label>Teléfono</label>
              <div className="profile-page__info-value">
                <Phone size={16} /> {primaryPhone}
              </div>
            </div>
          )}

          {isCompany && profile.company?.address && (
            <div className="profile-page__info-group">
              <label>Dirección</label>
              <div className="profile-page__info-value">
                {profile.company.address}
              </div>
            </div>
          )}

          {!isCompany && profile.person?.address && (
            <div className="profile-page__info-group">
              <label>Dirección</label>
              <div className="profile-page__info-value">
                {profile.person.address}
              </div>
            </div>
          )}

          <div className="profile-page__info-group">
            <label>Registrado el</label>
            <div className="profile-page__info-value">
              <Calendar size={16} />{' '}
              {dateService.formatToLocaleString(profile.registeredAt)}
            </div>
          </div>
        </div>

        {/* Account status */}
        <div className="profile-page__card">
          <h2>
            <Activity size={24} strokeWidth={1.5} /> Estado de la Cuenta
          </h2>

          <div className="profile-page__info-group">
            <label>Estado</label>
            <div
              className={`profile-page__info-value ${
                profile.isActive ? 'profile-page__status-active' : 'profile-page__status-inactive'
              }`}
            >
              {profile.isActive ? 'Activo' : 'Inactivo'}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Último acceso</label>
            <div className="profile-page__info-value">
              <Calendar size={16} />
              {profile.lastLogin
                ? dateService.formatToLocaleString(profile.lastLogin)
                : 'No disponible'}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Autenticación de dos factores</label>
            <div className="profile-page__info-value">
              <div
                className={`profile-page__info-value ${
                  profile.twoFactorEnabled ? 'profile-page__status-active' : 'profile-page__status-inactive'
                }`}
              >
                {profile.twoFactorEnabled ? 'Habilitada' : 'Deshabilitada'}
              </div>
            </div>
          </div>

          <button
            className="btn-secondary profile-page__full-width-btn"
            onClick={() => setIsPasswordOpen(true)}
          >
            <Lock size={18} /> Cambiar Contraseña
          </button>
        </div>

        {/* Permissions */}
        <div className="profile-page__card full-width">
          <h2>
            <Shield size={24} strokeWidth={1.5} /> Permisos y Seguridad
          </h2>
          <div className="profile-page__info-group">
            <label>Permisos asignados</label>
            <div className="profile-page__permissions-list">
              {profile.username === 'root' ? (
                <span className="profile-page__permission-tag profile-page__permission-tag--super-user">
                  All Permissions — Super User
                </span>
              ) : profile.permissions.length === 0 ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Sin permisos adicionales asignados.
                </span>
              ) : (
                profile.permissions.map((perm: any) => {
                  const name = typeof perm === 'string' ? perm : perm.name;
                  const key  = typeof perm === 'string' ? perm : (perm.id?.toString() ?? name);
                  return (
                    <span key={key} className="profile-page__permission-tag">
                      {name}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Edit — natural person */}
      {!isCompany && profile.person && (
        <EditCustomerProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          person={profile.person}
          customerId={profile.person.personId}
          isSaving={isSaving}
          onSave={handleUpdateCustomer}
        />
      )}

      {/* Edit — company */}
      {isCompany && profile.company && (
        <EditCompanyProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          company={profile.company}
          isSaving={isSaving}
          onSave={handleUpdateCompany}
        />
      )}

      {/* Change password */}
      <ChangePasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onSave={handleChangePassword}
      />
    </div>
  );
};

export const ProfilePage = () => (
  <UsersProvider>
    <ProfileContent />
  </UsersProvider>
);
