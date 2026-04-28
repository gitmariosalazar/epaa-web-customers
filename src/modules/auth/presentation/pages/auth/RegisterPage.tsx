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
  CreditCard,
  Check,
  Phone
} from 'lucide-react';
import { FaUserPlus } from 'react-icons/fa';
import '@/shared/presentation/styles/LoginPage.css';
import './RegisterPage.css';
import { EpaaLogo } from '@/shared/presentation/components/Logo/EpaaLogo';
interface RegisterForm {
  firstName: string;
  lastName: string;
  cedula: string;
  telefono: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

const INITIAL: RegisterForm = {
  firstName: '',
  lastName: '',
  cedula: '',
  telefono: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const validate = (f: RegisterForm): FormErrors => {
  const e: FormErrors = {};
  if (!f.firstName.trim()) e.firstName = 'El nombre es requerido';
  if (!f.lastName.trim()) e.lastName = 'El apellido es requerido';
  if (!f.cedula.trim()) e.cedula = 'La cédula es requerida';
  else if (!/^\d{10}$/.test(f.cedula)) e.cedula = 'Debe tener 10 dígitos';
  if (!f.username.trim()) e.username = 'El usuario es requerido';
  else if (f.username.length < 4) e.username = 'Mínimo 4 caracteres';
  if (!f.email.trim()) e.email = 'El correo es requerido';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = 'Correo inválido';
  if (!f.telefono.trim()) e.telefono = 'El telefono es requerido';
  else if (!/^\d{10}$/.test(f.telefono)) e.telefono = 'Debe tener 10 dígitos';
  if (!f.password) e.password = 'La contraseña es requerida';
  else if (f.password.length < 8) e.password = 'Mínimo 8 caracteres';
  if (f.password !== f.confirmPassword)
    e.confirmPassword = 'Las contraseñas no coinciden';
  return e;
};

export const RegisterPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update =
    (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const toggleLang = () =>
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    setApiError(null);
    try {
      // TODO: call registerUseCase.execute(form) when backend is ready
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-page__background" />
        <Card className="login-page__card register-success">
          <div className="register-success__icon">
            <Check size={40} />
          </div>
          <h2>¡Cuenta Creada!</h2>
          <p>
            Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión
            para gestionar tu trámite.
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
    <div className="login-page">
      <div className="login-page__background" />

      {/* Controls */}
      <div className="login-page__controls">
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

      <Card className="login-page__card register-card">
        {/* Header */}
        <div className="login-page__header">
          <div className="login-page__logo">
            <EpaaLogo size="lg" />
          </div>
          <h2 className="login-page__title">Crear Cuenta</h2>
          <p className="login-page__subtitle">
            Regístrate para acceder al portal de trámites en línea
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-page__form register-form"
        >
          {/* Personal Data */}
          <div className="register-section-label">Datos Personales</div>
          <div className="register-grid">
            <Input
              id="reg-first-name"
              label="Nombres"
              placeholder="Ej: Juan Carlos"
              value={form.firstName}
              onChange={update('firstName')}
              required
              leftIcon={<User size={18} />}
              error={errors.firstName}
            />
            <Input
              id="reg-last-name"
              label="Apellidos"
              placeholder="Ej: Pérez Gómez"
              value={form.lastName}
              onChange={update('lastName')}
              required
              leftIcon={<User size={18} />}
              error={errors.lastName}
            />
          </div>
          <div className="register-grid">
            <Input
              id="reg-cedula"
              label="Cédula de Identidad"
              placeholder="Ej: 1234567890"
              value={form.cedula}
              onChange={update('cedula')}
              required
              leftIcon={<CreditCard size={18} />}
              error={errors.cedula}
              maxLength={10}
              inputMode="numeric"
            />
            <Input
              id="reg-telefono"
              label="Telefono"
              placeholder="Ej: 0999999999"
              value={form.telefono}
              onChange={update('telefono')}
              required
              leftIcon={<Phone size={18} />}
              error={errors.telefono}
              maxLength={10}
              inputMode="numeric"
            />
          </div>

          {/* Account Data */}
          <div className="register-section-label">Datos de la Cuenta</div>
          <div className="register-grid">
            <Input
              id="reg-username"
              label="Nombre de Usuario"
              placeholder="Ej: juanperez"
              value={form.username}
              onChange={update('username')}
              required
              leftIcon={<User size={18} />}
              error={errors.username}
              autoComplete="username"
            />
            <Input
              id="reg-email"
              label="Correo Electrónico"
              type="email"
              placeholder="Ej: juan@correo.com"
              value={form.email}
              onChange={update('email')}
              required
              leftIcon={<Mail size={18} />}
              error={errors.email}
              autoComplete="email"
            />
          </div>
          <div className="register-grid">
            <PasswordInput
              id="reg-password"
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={update('password')}
              required
              showStrength
              error={errors.password}
              autoComplete="new-password"
            />
            <PasswordInput
              id="reg-confirm-password"
              label="Confirmar Contraseña"
              placeholder="Repita la contraseña"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              required
              valueToMatch={form.password}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </div>

          {apiError && (
            <div className="login-page__error" role="alert">
              {apiError}
            </div>
          )}

          <Button
            id="btn-register"
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            leftIcon={!isLoading ? <FaUserPlus size={18} /> : undefined}
            className="login-page__button"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear mi Cuenta'}
          </Button>
        </form>

        <div className="register-footer">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" id="link-to-login">
            {t('Iniciar Sesión')}
          </Link>
        </div>
      </Card>
    </div>
  );
};
