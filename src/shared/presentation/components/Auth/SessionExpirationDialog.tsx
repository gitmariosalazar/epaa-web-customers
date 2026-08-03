import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../Button/Button';
import './SessionExpirationDialog.css';

interface SessionExpirationDialogProps {
  isOpen: boolean;
  onExtend: () => void;
  onCancel: () => void;
  isExtending?: boolean;
}

export const SessionExpirationDialog: React.FC<
  SessionExpirationDialogProps
> = ({ isOpen, onExtend, onCancel, isExtending = false }) => {
  if (!isOpen) return null;

  return (
    <div className="session-dialog-overlay">
      <div className="session-dialog" role="dialog" aria-modal="true">
        <div className="session-dialog__icon">
          <AlertTriangle size={32} />
        </div>

        <h2 className="session-dialog__title">Tu sesión ha expirado</h2>

        <p className="session-dialog__message">
          Tu sesión ha expirado debido a inactividad. ¿Te gustaría extender tu sesión o cerrar sesión?
        </p>

        <div className="session-dialog__actions">
          <Button variant="dashed" onClick={onCancel} disabled={isExtending}
            color='error'
          >
            Log Out
          </Button>
          <Button variant="dashed" onClick={onExtend} isLoading={isExtending}
            color='success'
          >
            Extend Session
          </Button>
        </div>
      </div>
    </div>
  );
};
