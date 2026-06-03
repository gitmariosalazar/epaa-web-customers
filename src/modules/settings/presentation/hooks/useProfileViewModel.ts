import { useState, useCallback, useEffect } from 'react';
import type { CustomerWithRolesAndPermissionsResponse } from '@/modules/settings/domain/models/User';
import type { ChangePasswordRequest } from '@/modules/settings/domain/models/ChangePasswordRequest';
import type { UpdateCustomerRequest } from '@/modules/customers/domain/repositories/CustomerRepository';
import type { UpdateCompanyRequest } from '@/modules/customers/domain/repositories/CompanyRepository';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { useUsersContext } from '../context/UsersContext';
import { toast } from 'react-toastify';

/**
 * useProfileViewModel
 *
 * SRP: owns all state and side effects for the Profile page.
 * DIP: reads use cases from context — never instantiates repos directly.
 * OCP: to add a new profile action, extend this hook without modifying the page.
 */
export const useProfileViewModel = () => {
  const { user: authUser } = useAuth();
  const {
    getProfileUseCase,
    changePasswordUseCase,
    updateCustomerProfileUseCase,
    updateCompanyProfileUseCase
  } = useUsersContext();

  const [profile, setProfile] = useState<CustomerWithRolesAndPermissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!authUser?.username) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getProfileUseCase.execute(authUser.username);
      setProfile(data);
    } catch (err) {
      console.error('[useProfileViewModel] fetchProfile failed', err);
      setError('No se pudo cargar el perfil. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [authUser?.username, getProfileUseCase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ── Update customer (persona natural) ─────────────────────────────────────
  const handleUpdateCustomer = useCallback(
    async (data: UpdateCustomerRequest) => {
      if (!profile?.person?.personId) {
        toast.error('No se pudo identificar la cédula del cliente');
        return;
      }
      setIsSaving(true);
      try {
        await updateCustomerProfileUseCase.execute(profile.person.personId, data);
        toast.success('Datos actualizados correctamente');
        setIsEditOpen(false);
        await fetchProfile();
      } catch (err: any) {
        console.error('[useProfileViewModel] handleUpdateCustomer failed', err);
        toast.error(err?.response?.data?.message || 'Error al actualizar los datos');
      } finally {
        setIsSaving(false);
      }
    },
    [profile, updateCustomerProfileUseCase, fetchProfile]
  );

  // ── Update company (persona jurídica) ──────────────────────────────────────
  const handleUpdateCompany = useCallback(
    async (data: UpdateCompanyRequest) => {
      if (!profile?.company?.ruc) {
        toast.error('No se pudo identificar el RUC de la empresa');
        return;
      }
      setIsSaving(true);
      try {
        await updateCompanyProfileUseCase.execute(profile.company.ruc, data);
        toast.success('Datos de empresa actualizados correctamente');
        setIsEditOpen(false);
        await fetchProfile();
      } catch (err: any) {
        console.error('[useProfileViewModel] handleUpdateCompany failed', err);
        toast.error(err?.response?.data?.message || 'Error al actualizar los datos de empresa');
      } finally {
        setIsSaving(false);
      }
    },
    [profile, updateCompanyProfileUseCase, fetchProfile]
  );

  // ── Change password ────────────────────────────────────────────────────────
  const handleChangePassword = useCallback(
    async (data: ChangePasswordRequest) => {
      if (!profile?.userId) return;
      setIsSaving(true);
      try {
        await changePasswordUseCase.execute(profile.userId, data);
        toast.success('Contraseña actualizada correctamente');
        setIsPasswordOpen(false);
      } catch (err: any) {
        console.error('[useProfileViewModel] handleChangePassword failed', err);
        toast.error(err?.response?.data?.message || 'Error al cambiar la contraseña');
      } finally {
        setIsSaving(false);
      }
    },
    [profile, changePasswordUseCase]
  );

  return {
    profile,
    loading,
    error,
    isSaving,
    // Modal toggles
    isEditOpen,
    setIsEditOpen,
    isPasswordOpen,
    setIsPasswordOpen,
    // Actions
    handleUpdateCustomer,
    handleUpdateCompany,
    handleChangePassword
  };
};
