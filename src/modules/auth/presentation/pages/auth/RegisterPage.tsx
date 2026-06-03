import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { Input } from '@/shared/presentation/components/Input/Input';
import { PasswordInput } from '@/shared/presentation/components/Input/PasswordInput';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Card } from '@/shared/presentation/components/Card/Card';
import {
  Moon,
  Sun,
  Globe,
  User,
  Mail,
  Check,
  Building2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { FaUserPlus } from 'react-icons/fa';
import './RegisterPage.css';
import { EpaaLogo } from '@/shared/presentation/components/Logo/EpaaLogo';
import { RegisterNaturalUseCase } from '@/modules/auth/application/usecases/RegisterNaturalUseCase';
import { RegisterCompanyUseCase } from '@/modules/auth/application/usecases/RegisterCompanyUseCase';
import { VerifyCodeUseCase } from '@/modules/auth/application/usecases/VerifyCodeUseCase';
import { ResendVerificationCodeUseCase } from '@/modules/auth/application/usecases/ResendVerificationCodeUseCase';
import { AuthRepositoryImpl } from '@/modules/auth/infrastructure/repositories/AuthRepositoryImpl';
import { VerificationRepositoryImpl } from '@/modules/auth/infrastructure/repositories/VerificationRepositoryImpl';
import { CustomerForm } from '@/modules/customers/presentation/components/CustomerForm';
import { CompanyForm } from '@/modules/customers/presentation/components/CompanyForm';
import { CustomerRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CustomerRepositoryImpl';
import { CompanyRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CompanyRepositoryImpl';
import { VerificationCodeStep } from '@/modules/auth/presentation/components/VerificationCodeStep';

// Initial states for forms
const initialCustomerState = {
  customerId: '',   // string para preservar ceros iniciales (ej: 0400000000)
  firstName: '',
  lastName: '',
  emails: [''],
  phoneNumbers: [''],
  dateOfBirth: new Date(),
  sexId: 1,
  civilStatus: 1,
  address: '',
  professionId: 1,
  originCountry: 'ECUADOR',
  identificationType: 'CED',
  parishId: '',
  deceased: false,
  countryId: 'ECU',
  provinceId: '10',
  cantonId: '1001'
};

const initialCompanyState = {
  companyName: '',
  socialReason: '',
  companyRuc: '',
  identificationType: 'RUC',
  companyEmails: [''],
  companyPhones: [''],
  companyAddress: '',
  companyCountryId: 'ECU',
  companyProvinceId: '10',
  companyCantonId: '1001',
  companyParishId: ''
};

const initialAccountState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

type AccountErrors = Partial<Record<keyof typeof initialAccountState, string>>;

export const RegisterPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Wizard state
  const [step, setStep] = useState(1);
  const [isNatural, setIsNatural] = useState(true);

  // Form states
  const [customerData, setCustomerData] = useState<any>(initialCustomerState);
  const [companyData, setCompanyData] = useState<any>(initialCompanyState);
  const [accountData, setAccountData] = useState(initialAccountState);

  // Error and UI states
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});
  const [accountErrors, setAccountErrors] = useState<AccountErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verification step state
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const toggleLang = () =>
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');

  // Prefill Natural Person Profile if they already exist
  React.useEffect(() => {
    if (!isNatural) return;
    const cid = String(customerData.customerId).trim();
    if (cid.length === 10 && /^\d+$/.test(cid)) {
      const checkCustomerProfile = async () => {
        try {
          const customerRepository = new CustomerRepositoryImpl();
          const customer = await customerRepository.getById(cid);
          if (customer) {
            setCustomerData((prev: any) => ({
              ...prev,
              firstName: customer.firstName || '',
              lastName: customer.lastName || '',
              emails: customer.emails && customer.emails.length > 0 ? customer.emails : [''],
              phoneNumbers: customer.phoneNumbers && customer.phoneNumbers.length > 0 ? customer.phoneNumbers : [''],
              dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth) : prev.dateOfBirth,
              sexId: customer.sexId || 1,
              civilStatus: customer.civilStatus || 1,
              address: customer.address || '',
              professionId: customer.professionId || 1,
              originCountry: customer.originCountry || 'ECUADOR',
              identificationType: customer.identificationType || 'CED',
              parishId: customer.parishId || '',
              deceased: customer.deceased ?? false,
            }));
          }
        } catch (e) {
          // Gracefully ignore if customer doesn't exist
        }
      };
      checkCustomerProfile();
    }
  }, [customerData.customerId, isNatural]);

  // Prefill Company Profile if it already exists (triggered when companyRuc changes programmatically)
  React.useEffect(() => {
    if (isNatural) return;
    const ruc = String(companyData.companyRuc).trim();
    if (!ruc || !/^\d+$/.test(ruc)) return;
    const checkCompanyProfile = async () => {
      try {
        const companyRepository = new CompanyRepositoryImpl();
        const company = await companyRepository.getByRuc(ruc);
        if (company) {
          // CompanyEmail[] → string[], CompanyPhone[] → string[]
          const emails =
            company.companyEmails && company.companyEmails.length > 0
              ? company.companyEmails.map((e: any) =>
                  typeof e === 'string' ? e : e.correo ?? ''
                ).filter(Boolean)
              : [''];
          const phones =
            company.companyPhones && company.companyPhones.length > 0
              ? company.companyPhones.map((p: any) =>
                  typeof p === 'string' ? p : p.numero ?? ''
                ).filter(Boolean)
              : [''];
          setCompanyData((prev: any) => ({
            ...prev,
            companyName: company.companyName || '',
            socialReason: company.socialReason || '',
            companyAddress: company.companyAddress || '',
            companyParishId: company.companyParishId || '',
            companyCountryId:
              company.companyCountry === 'ECUADOR' ? 'ECU' : (company.companyCountry || 'ECU'),
            companyEmails: emails,
            companyPhones: phones,
            identificationType: company.identificationType || 'RUC',
          }));
        }
      } catch (e) {
        // Gracefully ignore — user will fill manually
      }
    };
    checkCompanyProfile();
  }, [companyData.companyRuc, isNatural]);

  const handleIdentityKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      // Read from the actual DOM value to avoid stale React state (last keystroke may not be committed yet)
      const inputValue = e.currentTarget.value.trim();

      if (isNatural) {
        const cid = inputValue;
        if (!cid || !/^\d+$/.test(cid)) return;
        setIsLoading(true);
        setApiError(null);
        try {
          const customerRepository = new CustomerRepositoryImpl();
          const customer = await customerRepository.getById(cid);
          if (customer) {
            setCustomerData((prev: any) => ({
              ...prev,
              customerId: cid,
              firstName: customer.firstName || '',
              lastName: customer.lastName || '',
              emails: customer.emails && customer.emails.length > 0 ? customer.emails : [''],
              phoneNumbers: customer.phoneNumbers && customer.phoneNumbers.length > 0 ? customer.phoneNumbers : [''],
              dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth) : prev.dateOfBirth,
              sexId: customer.sexId || 1,
              civilStatus: customer.civilStatus || 1,
              address: customer.address || '',
              professionId: customer.professionId || 1,
              originCountry: customer.originCountry || 'ECUADOR',
              identificationType: customer.identificationType || 'CED',
              parishId: customer.parishId || '',
              deceased: customer.deceased ?? false,
            }));
            setApiError(null);
          }
        } catch (err: any) {
          // Not found — clear all fields but keep the typed cédula
          setCustomerData({
            ...initialCustomerState,
            customerId: cid,
          });
          setApiError('No se encontró información para esta cédula. Completa tus datos manualmente.');
        } finally {
          setIsLoading(false);
        }
      } else {
        const ruc = inputValue;
        if (!ruc || !/^\d+$/.test(ruc)) return;
        setIsLoading(true);
        setApiError(null);
        try {
          const companyRepository = new CompanyRepositoryImpl();
          const company = await companyRepository.getByRuc(ruc);
          if (company) {
            // CompanyEmail[] → string[], CompanyPhone[] → string[]
            const emails =
              company.companyEmails && company.companyEmails.length > 0
                ? company.companyEmails.map((e: any) =>
                    typeof e === 'string' ? e : e.correo ?? ''
                  ).filter(Boolean)
                : [''];
            const phones =
              company.companyPhones && company.companyPhones.length > 0
                ? company.companyPhones.map((p: any) =>
                    typeof p === 'string' ? p : p.numero ?? ''
                  ).filter(Boolean)
                : [''];
            setCompanyData((prev: any) => ({
              ...prev,
              companyRuc: ruc,
              companyName: company.companyName || '',
              socialReason: company.socialReason || '',
              companyAddress: company.companyAddress || '',
              companyParishId: company.companyParishId || '',
              companyCountryId:
                company.companyCountry === 'ECUADOR' ? 'ECU' : (company.companyCountry || 'ECU'),
              companyEmails: emails,
              companyPhones: phones,
              identificationType: company.identificationType || 'RUC',
            }));
            setApiError(null);
          }
        } catch (err: any) {
          // Not found — clear all fields but keep the typed RUC
          setCompanyData({
            ...initialCompanyState,
            companyRuc: ruc,
          });
          setApiError('No se encontró información para este RUC. Completa tus datos manualmente.');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // Input change handlers
  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { name: string; value: any }
  ) => {
    let name: string;
    let value: any;
    let type: string | undefined;

    if ('target' in e) {
      name = e.target.name;
      value = e.target.value;
      type = e.target.type;

      // customerId SIEMPRE se guarda como string para no perder ceros iniciales (ej: 0400000000)
      if (type === 'number' && name !== 'customerId') value = Number(value);
      if (name === 'deceased') {
        const checkbox = e.target as HTMLInputElement;
        value = checkbox.checked;
      }
      if (name === 'dateOfBirth') value = new Date(value);
      setCustomerData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      name = (e as any).name;
      value = (e as any).value;
      setCustomerData((prev: any) => ({ ...prev, [name]: value }));
    }

    if (step1Errors[name]) {
      setStep1Errors((prev) => ({ ...prev, [name]: '' }));
    }
    if (step2Errors[name]) {
      setStep2Errors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { name: string; value: any }
  ) => {
    let name: string;
    let value: any;
    let type: string | undefined;

    if ('target' in e) {
      name = e.target.name;
      value = e.target.value;
      type = e.target.type;

      if (type === 'number') value = Number(value);
      setCompanyData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      name = (e as any).name;
      value = (e as any).value;
      setCompanyData((prev: any) => ({ ...prev, [name]: value }));
    }

    if (step1Errors[name]) {
      setStep1Errors((prev) => ({ ...prev, [name]: '' }));
    }
    if (step2Errors[name]) {
      setStep2Errors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
    if (accountErrors[name as keyof AccountErrors]) {
      setAccountErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validation helpers
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (isNatural) {
      if (!customerData.firstName.trim()) errs.firstName = 'El nombre es requerido';
      if (!customerData.lastName.trim()) errs.lastName = 'El apellido es requerido';
      
      const cid = String(customerData.customerId).trim();
      if (!cid) {
        errs.customerId = 'La cédula es requerida';
      } else if (!/^\d{10}$/.test(cid)) {
        errs.customerId = 'Debe tener exactamente 10 dígitos';
      }
    } else {
      if (!companyData.companyName.trim()) errs.companyName = 'El nombre comercial es requerido';
      
      const ruc = companyData.companyRuc.trim();
      if (!ruc) {
        errs.companyRuc = 'El RUC es requerido';
      } else if (!/^\d{13}$/.test(ruc)) {
        errs.companyRuc = 'Debe tener exactamente 13 dígitos';
      }
    }
    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (isNatural) {
      if (!customerData.address.trim()) {
        errs.address = 'La dirección es requerida';
      }
      if (!customerData.parishId) {
        errs.parishId = 'La parroquia es requerida';
      }
    } else {
      if (!companyData.companyAddress.trim()) {
        errs.companyAddress = 'La dirección es requerida';
      }
      if (!companyData.companyParishId) {
        errs.companyParishId = 'La parroquia es requerida';
      }
    }
    setStep2Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: AccountErrors = {};
    if (!accountData.username.trim()) errs.username = 'El usuario es requerido';
    else if (accountData.username.length < 4) errs.username = 'Mínimo 4 caracteres';

    if (!accountData.email.trim()) errs.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) {
      errs.email = 'Correo electrónico inválido';
    }

    if (!accountData.password) errs.password = 'La contraseña es requerida';
    else if (accountData.password.length < 8) errs.password = 'Mínimo 8 caracteres';

    if (accountData.password !== accountData.confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden';
    }

    setAccountErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleNextStep2 = () => {
    if (validateStep2()) {
      // Pre-fill email from Step 1 if user hasn't typed anything yet
      const profileEmail = isNatural ? customerData.emails[0] : companyData.companyEmails[0];
      if (profileEmail && !accountData.email) {
        setAccountData((prev) => ({ ...prev, email: profileEmail }));
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const authRepository = new AuthRepositoryImpl();
      let responseData: any;

      if (isNatural) {
        const cleanPhones = customerData.phoneNumbers.filter(Boolean);
        const cleanEmails = [accountData.email, ...customerData.emails.slice(1)].filter(Boolean);

        const unifiedNaturalPayload = {
          password: accountData.password,
          clientId: String(customerData.customerId).trim(),
          email: accountData.email,
          emails: cleanEmails,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phoneNumbers: cleanPhones,
          dateOfBirth: customerData.dateOfBirth,
          sexId: customerData.sexId,
          civilStatus: customerData.civilStatus,
          address: customerData.address,
          professionId: customerData.professionId,
          originCountry: customerData.originCountry,
          identificationType: customerData.identificationType,
          parishId: customerData.parishId,
          deceased: customerData.deceased ?? false,
        };

        const registerNaturalUseCase = new RegisterNaturalUseCase(authRepository);
        responseData = await registerNaturalUseCase.execute(unifiedNaturalPayload);
      } else {
        const cleanPhones = companyData.companyPhones.filter(Boolean);
        const cleanEmails = [accountData.email, ...companyData.companyEmails.slice(1)].filter(Boolean);

        const unifiedCompanyPayload = {
          password: accountData.password,
          companyRuc: String(companyData.companyRuc).trim(),
          email: accountData.email,
          companyEmails: cleanEmails,
          companyName: companyData.companyName,
          socialReason: companyData.socialReason,
          companyAddress: companyData.companyAddress,
          companyParishId: companyData.companyParishId,
          companyCountry: companyData.companyCountryId === 'ECU' ? 'ECUADOR' : companyData.companyCountryId,
          companyPhones: cleanPhones,
          identificationType: companyData.identificationType,
        };

        const registerCompanyUseCase = new RegisterCompanyUseCase(authRepository);
        responseData = await registerCompanyUseCase.execute(unifiedCompanyPayload);
      }

      // El backend retorna la cuenta creada con customerUserId
      const userId = responseData?.account?.customerUserId ?? responseData?.customerUserId ?? null;
      setRegisteredUserId(userId);

      // Avanzar al paso de verificación
      setStep(4);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Fallo el proceso de registro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    if (!registeredUserId) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const verificationRepo = new VerificationRepositoryImpl();
      const verifyUseCase = new VerifyCodeUseCase(verificationRepo);
      await verifyUseCase.execute(registeredUserId, code, 'EMAIL_CODE');
      setSuccess(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Código incorrecto. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!registeredUserId) return;
    setIsResending(true);
    setApiError(null);
    try {
      const verificationRepo = new VerificationRepositoryImpl();
      const resendUseCase = new ResendVerificationCodeUseCase(verificationRepo);
      await resendUseCase.execute(registeredUserId, 'EMAIL_CODE');
    } catch (err: unknown) {
      setApiError('No se pudo reenviar el código. Intenta de nuevo.');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-page__background" />
        <Card className="register-card register-success">
          <div className="register-success__icon">
            <Check size={40} />
          </div>
          <h2>¡Cuenta Creada!</h2>
          <p>
            Tu cuenta y perfil han sido creados exitosamente. Ahora puedes iniciar sesión
            para comenzar a gestionar tus trámites en línea.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-page__background" />

      {/* Theme and Language Controls */}
      <div className="register-page__controls">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button
          className="icon-btn"
          onClick={toggleLang}
          title="Change Language"
        >
          <Globe size={20} />
          <span className="lang-text">{i18n.language.toUpperCase()}</span>
        </button>
      </div>

      <Card className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="register-header__logo">
            <EpaaLogo size="lg" />
          </div>
          <div className="register-header__content">
            <h2 className="register-header__title">Registrarse en el Portal</h2>
            <p className="register-header__subtitle">
              Crea tu perfil y cuenta de usuario para trámites en línea
            </p>
          </div>
        </div>

        <div className="divider">

        </div>

        {/* Dynamic Step Progress Indicator */}
        <div className="register-stepper">
          <div className={`step-item ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">{step > 1 ? <Check size={16} /> : '1'}</div>
            <div className="step-label">Ficha del Cliente</div>
          </div>
          <div className={`step-connector ${step > 1 ? 'active' : ''}`} />
          <div className={`step-item ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">{step > 2 ? <Check size={16} /> : '2'}</div>
            <div className="step-label">Ubicación</div>
          </div>
          <div className={`step-connector ${step > 2 ? 'active' : ''}`} />
          <div className={`step-item ${step === 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-number">{step > 3 ? <Check size={16} /> : '3'}</div>
            <div className="step-label">Datos de Acceso</div>
          </div>
          <div className={`step-connector ${step > 3 ? 'active' : ''}`} />
          <div className={`step-item ${step === 4 ? 'active' : ''}`}>
            <div className="step-number">
              {step === 4 ? <ShieldCheck size={16} /> : '4'}
            </div>
            <div className="step-label">Verificación</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {step === 1 && (
            <>
              <div className="register-form__scroll-container">
                {/* Profile Type Selector Cards */}
                <div className="profile-selector">
                  <Button
                    type="button"
                    size='sm'
                    className={`profile-card ${isNatural ? 'selected' : ''}`}
                    onClick={() => setIsNatural(true)}
                    leftIcon={<User size={28} />}
                  >
                    Persona Natural
                  </Button>
                  <Button
                    type="button"
                    size='sm'
                    className={`profile-card ${!isNatural ? 'selected' : ''}`}
                    onClick={() => setIsNatural(false)}
                    leftIcon={<Building2 size={28} />}
                  >
                    Empresa/Sociedad
                  </Button>
                </div>

                {/* Render dynamic form */}
                {isNatural ? (
                  <>
                    <div className="register-section-label">Ficha de Persona Natural</div>
                    <CustomerForm
                      formData={customerData}
                      onChange={handleCustomerChange}
                      setFormData={setCustomerData}
                      isEditMode={false}
                      hideLocation={true}
                      hideDeceased={true}
                      onIdentityKeyDown={handleIdentityKeyDown}
                    />
                    {Object.keys(step1Errors).length > 0 && (
                      <div className="register-error" style={{ marginTop: '15px' }}>
                        Por favor, completa los campos requeridos marcados (Nombre, Apellido, Cédula de 10 dígitos).
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="register-section-label">Ficha de Empresa</div>
                    <CompanyForm
                      formData={companyData}
                      onChange={handleCompanyChange}
                      setFormData={setCompanyData}
                      isEditMode={false}
                      hideLocation={true}
                      onIdentityKeyDown={handleIdentityKeyDown}
                    />
                    {Object.keys(step1Errors).length > 0 && (
                      <div className="register-error" style={{ marginTop: '15px' }}>
                        Por favor, completa los campos requeridos marcados (Nombre de la empresa, RUC de 13 dígitos).
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="wizard-actions">
                <div />
                <Button
                  type="button"
                  variant="primary"
                  size='xs'
                  onClick={handleNextStep1}
                  rightIcon={<ChevronRight size={18} />}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="register-form__scroll-container">
                {isNatural ? (
                  <>
                    <div className="register-section-label">Ubicación Domiciliaria</div>
                    <CustomerForm
                      formData={customerData}
                      onChange={handleCustomerChange}
                      setFormData={setCustomerData}
                      isEditMode={false}
                      showLocationOnly={true}
                    />
                    {Object.keys(step2Errors).length > 0 && (
                      <div className="register-error" style={{ marginTop: '15px' }}>
                        Por favor, completa la dirección y selecciona la ubicación (Parroquia).
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="register-section-label">Ubicación de la Empresa</div>
                    <CompanyForm
                      formData={companyData}
                      onChange={handleCompanyChange}
                      setFormData={setCompanyData}
                      isEditMode={false}
                      showLocationOnly={true}
                    />
                    {Object.keys(step2Errors).length > 0 && (
                      <div className="register-error" style={{ marginTop: '15px' }}>
                        Por favor, completa la dirección de la empresa y selecciona la ubicación (Parroquia).
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="wizard-actions">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  leftIcon={<ChevronLeft size={18} />}
                >
                  Atrás
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size='xs'
                  onClick={handleNextStep2}
                  rightIcon={<ChevronRight size={18} />}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="register-form__scroll-container">
                <div className="register-section-label">Datos de Acceso a la Cuenta</div>
                <div className="register-grid">
                  <Input
                    id="reg-username"
                    name="username"
                    label="Nombre de Usuario"
                    placeholder="Ej: juanperez"
                    value={accountData.username}
                    onChange={handleAccountChange}
                    required
                    leftIcon={<User size={18} />}
                    error={accountErrors.username}
                    autoComplete="username"
                  />
                  <Input
                    id="reg-email"
                    name="email"
                    label="Correo Electrónico"
                    type="email"
                    placeholder="Ej: juan@correo.com"
                    value={accountData.email}
                    onChange={handleAccountChange}
                    required
                    leftIcon={<Mail size={18} />}
                    error={accountErrors.email}
                    autoComplete="email"
                  />
                </div>
                <div className="register-grid">
                  <PasswordInput
                    id="reg-password"
                    name="password"
                    label="Contraseña"
                    placeholder="Mínimo 8 caracteres"
                    value={accountData.password}
                    onChange={handleAccountChange}
                    required
                    showStrength
                    error={accountErrors.password}
                    autoComplete="new-password"
                  />
                  <PasswordInput
                    id="reg-confirm-password"
                    name="confirmPassword"
                    label="Confirmar Contraseña"
                    placeholder="Repita la contraseña"
                    value={accountData.confirmPassword}
                    onChange={handleAccountChange}
                    required
                    valueToMatch={accountData.password}
                    error={accountErrors.confirmPassword}
                    autoComplete="new-password"
                  />
                </div>

                {apiError && (
                  <div className="register-error" role="alert" style={{ marginTop: '15px' }}>
                    {apiError}
                  </div>
                )}
              </div>

              <div className="wizard-actions">
                <Button
                  type="button"
                  variant="ghost"
                  size='xs'
                  onClick={() => setStep(2)}
                  leftIcon={<ChevronLeft size={18} />}
                  disabled={isLoading}
                >
                  Atrás
                </Button>
                <Button
                  id="btn-register-submit"
                  type="submit"
                  variant="primary"
                  size='xs'
                  isLoading={isLoading}
                  leftIcon={!isLoading ? <FaUserPlus size={18} /> : undefined}
                >
                  {isLoading ? 'Registrando...' : 'Crear mi Cuenta'}
                </Button>
              </div>
            </>
          )}
          {step === 4 && (
            <VerificationCodeStep
              email={accountData.email}
              isLoading={isLoading}
              apiError={apiError}
              onVerify={handleVerifyCode}
              onResend={handleResendCode}
              isResending={isResending}
            />
          )}
        </form>

        <div className="register-footer">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" id="link-to-login">
            Iniciar Sesión
          </Link>
        </div>
      </Card>
    </div>
  );
};
