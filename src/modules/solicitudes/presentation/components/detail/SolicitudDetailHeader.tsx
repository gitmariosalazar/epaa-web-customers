import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import '../../styles/SolicitudDetailHeader.css';

import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';

interface SolicitudDetailHeaderProps {
  solicitud: RequestDetailByClientResponse;
  onBack: () => void;
}

export const SolicitudDetailHeader: React.FC<SolicitudDetailHeaderProps> = ({
  solicitud,
  onBack
}) => {
  const fechaStr = solicitud.fechaSolicitud
    ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—';

  return (
    <div className="sol-detail-header-nav">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={16} />}
        onClick={onBack}
      >
        Volver
      </Button>
      <div className="sol-detail-header-nav__info">
        <h2 className="sol-detail-header-nav__title">
          Expediente: {solicitud.solicitudNumero}
        </h2>
        <span className="sol-detail-header-nav__subtitle">
          Creado el {fechaStr}
        </span>
      </div>
    </div>
  );
};
