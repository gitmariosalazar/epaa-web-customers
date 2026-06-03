import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import './VerificationCodeStep.css';

interface VerificationCodeStepProps {
  email: string;
  isLoading: boolean;
  apiError: string | null;
  onVerify: (code: string) => void;
  onResend: () => void;
  isResending: boolean;
}

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

/**
 * VerificationCodeStep
 * SRP: solo renderiza y gestiona la UI del paso de verificación.
 * No conoce detalles de HTTP ni de Kafka.
 */
export const VerificationCodeStep: React.FC<VerificationCodeStepProps> = ({
  email,
  isLoading,
  apiError,
  onVerify,
  onResend,
  isResending,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown para reenvío
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    const updated = [...digits];
    updated[index] = sanitized;
    setDigits(updated);

    // Auto-focus siguiente
    if (sanitized && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit si todos completos
    if (sanitized && index === CODE_LENGTH - 1) {
      const full = [...updated].join('');
      if (full.length === CODE_LENGTH) {
        onVerify(full);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const updated = [...digits];
        updated[index - 1] = '';
        setDigits(updated);
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'Enter') {
      const full = digits.join('');
      if (full.length === CODE_LENGTH) onVerify(full);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    const updated = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { updated[i] = ch; });
    setDigits(updated);
    const lastFilled = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[lastFilled]?.focus();
    if (pasted.length === CODE_LENGTH) {
      onVerify(pasted);
    }
  };

  const handleResend = () => {
    setDigits(Array(CODE_LENGTH).fill(''));
    setCountdown(RESEND_COOLDOWN);
    inputRefs.current[0]?.focus();
    onResend();
  };

  const code = digits.join('');
  const isComplete = code.length === CODE_LENGTH;

  return (
    <div className="verification-step">
      {/* Icon */}
      <div className="verification-step__icon">
        <ShieldCheck size={36} strokeWidth={1.5} />
      </div>

      <h3 className="verification-step__title">Verifica tu correo</h3>
      <p className="verification-step__subtitle">
        Ingresa el código de 6 dígitos que enviamos a{' '}
        <strong className="verification-step__email">{email}</strong>.<br />
        Expira en <strong>15 minutos</strong>.
      </p>

      {/* Inputs OTP */}
      <div className="verification-step__inputs" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            id={`otp-digit-${i}`}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            autoFocus={i === 0}
            className={`otp-input ${digit ? 'otp-input--filled' : ''} ${apiError ? 'otp-input--error' : ''}`}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={isLoading}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Error */}
      {apiError && (
        <div className="verification-step__error" role="alert">
          {apiError}
        </div>
      )}

      {/* Botón verificar */}
      <Button
        id="btn-verify-code"
        type="button"
        variant="primary"
        size="sm"
        isLoading={isLoading}
        disabled={!isComplete || isLoading}
        onClick={() => onVerify(code)}
        leftIcon={!isLoading ? <ShieldCheck size={18} /> : undefined}
        style={{ width: '100%', marginTop: '8px' }}
      >
        {isLoading ? 'Verificando...' : 'Verificar Código'}
      </Button>

      {/* Reenviar */}
      <div className="verification-step__resend">
        {countdown > 0 ? (
          <span className="verification-step__countdown">
            Puedes reenviar el código en <strong>{countdown}s</strong>
          </span>
        ) : (
          <button
            type="button"
            className="verification-step__resend-btn"
            onClick={handleResend}
            disabled={isResending}
          >
            <RotateCcw size={14} />
            {isResending ? 'Enviando...' : 'Reenviar código'}
          </button>
        )}
      </div>
    </div>
  );
};
