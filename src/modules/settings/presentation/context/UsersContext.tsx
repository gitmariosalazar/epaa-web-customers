/**
 * UsersContext — Settings module (Profile only)
 *
 * Provides profile, password, and profile-update use cases.
 * SRP: this context only manages the current authenticated user's own data.
 *
 * SOLID (DIP): consumers depend on use case interfaces, not concrete repos.
 */
import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { UserRepositoryImpl } from '@/modules/settings/infrastructure/repositories/UserRepositoryImpl';
import { CustomerRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CustomerRepositoryImpl';
import { CompanyRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CompanyRepositoryImpl';
import { GetProfileUseCase } from '@/modules/settings/application/usecases/GetProfileUseCase';
import { ChangePasswordUseCase } from '@/modules/settings/application/usecases/ChangePasswordUseCase';
import { UpdateCustomerProfileUseCase } from '@/modules/settings/application/usecases/UpdateCustomerProfileUseCase';
import { UpdateCompanyProfileUseCase } from '@/modules/settings/application/usecases/UpdateCompanyProfileUseCase';

interface UsersContextType {
  getProfileUseCase: GetProfileUseCase;
  changePasswordUseCase: ChangePasswordUseCase;
  updateCustomerProfileUseCase: UpdateCustomerProfileUseCase;
  updateCompanyProfileUseCase: UpdateCompanyProfileUseCase;
}

const UsersContext = createContext<UsersContextType | null>(null);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const userRepository = useMemo(() => new UserRepositoryImpl(), []);
  const customerRepository = useMemo(() => new CustomerRepositoryImpl(), []);
  const companyRepository = useMemo(() => new CompanyRepositoryImpl(), []);

  const getProfileUseCase = useMemo(
    () => new GetProfileUseCase(userRepository),
    [userRepository]
  );
  const changePasswordUseCase = useMemo(
    () => new ChangePasswordUseCase(userRepository),
    [userRepository]
  );
  const updateCustomerProfileUseCase = useMemo(
    () => new UpdateCustomerProfileUseCase(customerRepository),
    [customerRepository]
  );
  const updateCompanyProfileUseCase = useMemo(
    () => new UpdateCompanyProfileUseCase(companyRepository),
    [companyRepository]
  );

  const value: UsersContextType = {
    getProfileUseCase,
    changePasswordUseCase,
    updateCustomerProfileUseCase,
    updateCompanyProfileUseCase
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsersContext must be used within a UsersProvider');
  }
  return context;
};
