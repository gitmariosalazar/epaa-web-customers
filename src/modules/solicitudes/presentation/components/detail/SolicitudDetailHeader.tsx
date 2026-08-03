import React from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import '../../styles/SolicitudDetailHeader.css';

import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { GiMatterStates } from 'react-icons/gi';
import { maskString } from '@/shared/utils/text/maskString';

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
      <div className="sol-detail-header-nav__info">
        <div className='sol-detail-header-nav__analist'>
          <p className="sol-detail-header-nav__analist__label">
            Analista Asignado:
          </p>
          {
            solicitud.analistaUsername ? (
              <ColorChip
                label={maskString(solicitud.analistaUsername)}
                variant="ghost"
                size="sm"
                color='green'
                icon={<User size={16} />}
                borderRadius={4}
              />
            ) : (
              <ColorChip
                label="Sin asignar"
                variant="ghost"
                size="sm"
                color='red'
                icon={<User size={16} />}
                borderRadius={4}
              />
            )
          }
        </div>
        <div className='sol-detail-header-nav__analist'>
          <p className="sol-detail-header-nav__analist__label">Estado:</p>
          <ColorChip
            label={(solicitud.estado)}
            variant="ghost"
            size="sm"
            color='gray'
            icon={<GiMatterStates size={16} />}
            borderRadius={4}
          />
        </div>
      </div>
    </div>
  );
};
