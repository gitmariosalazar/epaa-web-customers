import React, { useState } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { Input } from '@/shared/presentation/components/Input/Input';
import { PasswordInput } from '@/shared/presentation/components/Input/PasswordInput';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Card } from '@/shared/presentation/components/Card/Card';
import '@/shared/presentation/styles/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { Moon, Sun, Globe, User } from 'lucide-react';
import { FaSignInAlt } from 'react-icons/fa';
import { EpaaLogo } from '@/shared/presentation/components/Logo/EpaaLogo';

export const LoginPage: React.FC = () => {
  const { login, token, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthLoading && token) {
      navigate('/', { replace: true });
    }
  }, [token, isAuthLoading, navigate]);

  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login({ username_or_email: username, password });
      navigate('/');
    } catch {
      setError(t('pages.login.error') || 'Usuario o contraseña inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__background"></div>

      {/* Top right controls */}
      <div className="login-page__controls">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button
          className="icon-btn"
          onClick={toggleLanguage}
          title="Change Language"
        >
          <Globe size={20} />
          <span className="lang-text">{i18n.language.toUpperCase()}</span>
        </button>
      </div>

      <Card className="login-page__card">
        <div className="login-page__header">
          <div className="login-page__logo">
            <EpaaLogo size="lg" />
          </div>
          <h2 className="login-page__title">
            {t('pages.login.welcome', 'Bienvenido')}
          </h2>
          <p className="login-page__subtitle">
            Portal para la gestión de trámites de los usuarios la Empresa
            Pública de Agua y Alcantarillado de Antonio Ante
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-page__form">
          <Input
            id="login-username"
            label={t('pages.login.username', 'Usuario o Correo')}
            className="login-page__input"
            placeholder={t(
              'pages.login.usernamePlaceholder',
              'Ingrese su usuario o correo'
            )}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            leftIcon={<User size={20} />}
            autoComplete="username"
          />
          <PasswordInput
            id="login-password"
            label={t('pages.login.password', 'Contraseña')}
            className="login-page__input"
            placeholder={t(
              'pages.login.passwordPlaceholder',
              'Ingrese su contraseña'
            )}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            showStrength={false}
            autoComplete="current-password"
          />

          {error && <div className="login-page__error">{error}</div>}

          <Button
            id="btn-login-submit"
            type="submit"
            className="login-page__button"
            isLoading={isLoading}
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<FaSignInAlt size={20} />}
          >
            {t('pages.login.signIn', 'Iniciar Sesión')}
          </Button>
        </form>

        {/* Register link */}
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--spacing-md) var(--spacing-lg) var(--spacing-lg)',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'var(--spacing-sm)'
          }}
        >
          ¿No tienes una cuenta?{' '}
          <Link
            to="/register"
            id="link-to-register"
            style={{
              color: 'var(--accent)',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Regístrate aquí
          </Link>
        </div>
      </Card>
    </div>
  );
};
