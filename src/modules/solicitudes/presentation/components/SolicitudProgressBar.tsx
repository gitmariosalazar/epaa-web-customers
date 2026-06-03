/**
 * SolicitudProgressBar
 *
 * SRP: renders only the visual progress bar for a solicitud BPMN phase.
 * DIP: receives estadoCodigo as prop — no context reads.
 * OCP: adding a new step means adding to BPMN_STEPS array only.
 */
import React from 'react';
import {
  FileText,
  Files,
  CreditCard,
  Search,
  FileSignature,
  Wrench,
  ShieldCheck,
  Zap,
  XCircle
} from 'lucide-react';
import './SolicitudProgressBar.css';

interface BpmnStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** estados BD que mapean a este paso */
  states: string[];
}

const BPMN_STEPS: BpmnStep[] = [
  {
    id: 'solicitud',
    label: 'Solicitud',
    icon: <FileText size={14} />,
    states: ['DRAFT']
  },
  {
    id: 'documentos',
    label: 'Documentos',
    icon: <Files size={14} />,
    states: ['DOCS_SUBMITTED', 'DOCS_REJECTED', 'DOCS_APPROVED']
  },
  {
    id: 'pago',
    label: 'Pago',
    icon: <CreditCard size={14} />,
    states: ['FACTURA_INSPECCION_EMITIDA', 'PAGO_PENDIENTE', 'PAGO_CONFIRMADO']
  },
  {
    id: 'inspeccion',
    label: 'Inspección',
    icon: <Search size={14} />,
    states: ['ORDEN_INSPECCION_EMITIDA', 'INSPECCION_EN_PROCESO', 'INFORME_EN_REVISION', 'INFORME_APROBADO']
  },
  {
    id: 'contrato',
    label: 'Contrato',
    icon: <FileSignature size={14} />,
    states: ['CONTRATO_GENERADO', 'CONTRATO_FIRMADO']
  },
  {
    id: 'instalacion',
    label: 'Instalación',
    icon: <Wrench size={14} />,
    states: ['OT_INSTALACION_EMITIDA', 'INSTALACION_EN_PROCESO', 'INSTALACION_FALLIDA', 'INSTALACION_COMPLETADA']
  },
  {
    id: 'catastro',
    label: 'Catastro',
    icon: <ShieldCheck size={14} />,
    states: ['REGISTRO_CATASTRAL_PENDIENTE']
  },
  {
    id: 'activo',
    label: 'Activo',
    icon: <Zap size={14} />,
    states: ['SUMINISTRO_ACTIVO']
  }
];

const TERMINAL_NEGATIVE = new Set(['ANULADA', 'RECHAZADA_TECNICA']);

const resolveStepIndex = (estadoCodigo: string): number => {
  for (let i = 0; i < BPMN_STEPS.length; i++) {
    if (BPMN_STEPS[i].states.includes(estadoCodigo)) return i;
  }
  return 0;
};

interface SolicitudProgressBarProps {
  estadoCodigo: string;
}

export const SolicitudProgressBar: React.FC<SolicitudProgressBarProps> = ({ estadoCodigo }) => {
  const isTerminalNeg = TERMINAL_NEGATIVE.has(estadoCodigo);
  const currentIndex = resolveStepIndex(estadoCodigo);

  if (isTerminalNeg) {
    return (
      <div className="sol-progress-bar sol-progress-bar--terminal">
        <div className="sol-progress-bar__terminal-badge">
          <XCircle size={14} />
          <span>{estadoCodigo === 'ANULADA' ? 'Solicitud Anulada' : 'Rechazada — Evaluación Técnica'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sol-progress-bar" aria-label={`Progreso: etapa ${currentIndex + 1} de ${BPMN_STEPS.length}`}>
      <div className="sol-progress-bar__track">
        {BPMN_STEPS.map((step, idx) => {
          const isDone    = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture  = idx > currentIndex;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div
                  className={`sol-progress-bar__connector${isDone || isCurrent ? ' sol-progress-bar__connector--filled' : ''}`}
                />
              )}
              <div
                className={[
                  'sol-progress-bar__step',
                  isDone    ? 'sol-progress-bar__step--done'    : '',
                  isCurrent ? 'sol-progress-bar__step--current' : '',
                  isFuture  ? 'sol-progress-bar__step--future'  : '',
                ].join(' ').trim()}
                title={step.label}
              >
                <div className="sol-progress-bar__step-dot">
                  {isDone ? (
                    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="sol-progress-bar__step-label">{step.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
