import React from 'react';
import { Button } from '@/shared/presentation/components/Button/Button';
import {
  Eye,
  FileText,
  Files,
  ShieldCheck,
  CreditCard,
  Search,
  FileSignature,
  Wrench,
  Zap
} from 'lucide-react';
import { ProcessTimeline } from '@/shared/presentation/components/Timeline/ProcessTimeline';
import type { TrackingAcometida } from '../../../domain/models/ProcesoAcometida';
import { ACOMETIDA_STEPS } from '../../../domain/models/ProcesoAcometida';

interface SolicitudTrackingCardProps {
  tracking: TrackingAcometida;
}

const ACOMETIDA_ICONS: Record<string, React.ReactNode> = {
  solicitud: <FileText size={20} />,
  documentos: <Files size={20} />,
  validacion: <ShieldCheck size={20} />,
  pago: <CreditCard size={20} />,
  inspeccion: <Search size={20} />,
  contrato: <FileSignature size={20} />,
  instalacion: <Wrench size={20} />,
  activo: <Zap size={20} />
};

export const SolicitudTrackingCard: React.FC<SolicitudTrackingCardProps> = ({
  tracking
}) => {
  const stepsWithIcons = ACOMETIDA_STEPS.map((step) => ({
    ...step,
    icon: ACOMETIDA_ICONS[step.id]
  }));

  return (
    <div className="tracking-card">
      <div className="tracking-card__header">
        <div className="tracking-card__info">
          <div className="tracking-card__title-row">
            <h3 className="tracking-card__codigo">{tracking.codigo}</h3>
            <span className="tracking-card__pill">
              {tracking.estadoActualLabel}
            </span>
          </div>
          <p className="tracking-card__direccion">{tracking.direccion}</p>
          <p className="tracking-card__fecha">
            Creada el {tracking.fechaCreacion}
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Eye size={16} />}>
          Ver Detalle
        </Button>
      </div>

      <div className="tracking-card__timeline-wrapper">
        <ProcessTimeline
          steps={stepsWithIcons}
          currentStep={tracking.currentStep}
        />
      </div>

      <div className="tracking-card__footer">
        Estado actual: <strong>{tracking.estadoActualLabel}</strong>
      </div>
    </div>
  );
};
