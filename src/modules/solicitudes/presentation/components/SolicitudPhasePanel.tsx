/**
 * SolicitudPhasePanel
 *
 * SRP: Renders the contextual status panel for each BPMN phase.
 * OCP: Add new phases by adding new cases — no structural changes needed.
 * DIP: Receives data as props from the parent page.
 *
 * Each sub-panel is exported independently so they can be tested/reused.
 */
import React from 'react';
import type { RequestDetailByClientResponse } from '../../domain/models/Solicitud';
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Wrench,
  FileSignature,
  MapPin,
  DollarSign,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import '../styles/SolicitudPhasePanel.css';

interface PhasePanelProps {
  solicitud: RequestDetailByClientResponse;
}

// ── Helper ────────────────────────────────────────────────────────────────────
const fmt = (n: number | null | undefined): string =>
  n != null ? `$${n.toFixed(2)}` : '—';

const fmtDate = (d: Date | string | null | undefined): string => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// ── INSPECCION panels ─────────────────────────────────────────────────────────

export const InspeccionScheduledPanel: React.FC<PhasePanelProps> = ({ solicitud }) => (
  <div className="phase-panel phase-panel--info">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--indigo">
      <Search size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Inspección Técnica Agendada</h4>
      <p className="phase-panel__description">
        Su expediente está aprobado para inspección técnica. Un técnico de EPAA
        se pondrá en contacto con usted para coordinar el horario de visita al
        predio en <strong>{solicitud.direccion}</strong>.
      </p>
      <div className="phase-panel__tip">
        <Clock size={12} />
        <span>Mantenga su teléfono disponible para recibir la llamada de coordinación.</span>
      </div>
    </div>
  </div>
);

export const InspeccionInProgressPanel: React.FC<PhasePanelProps> = () => (
  <div className="phase-panel phase-panel--warning">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--purple">
      <Search size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Inspección en Proceso</h4>
      <p className="phase-panel__description">
        El técnico inspector se encuentra realizando la visita técnica al predio.
        Se evaluará la viabilidad de conexión, la distancia a la red de distribución
        y las condiciones del terreno.
      </p>
      <div className="phase-panel__tip phase-panel__tip--warning">
        <AlertTriangle size={12} />
        <span>Por favor asegúrese de que alguien esté presente en el predio para facilitar la inspección.</span>
      </div>
    </div>
  </div>
);

export const InformeRevisionPanel: React.FC<PhasePanelProps> = () => (
  <div className="phase-panel phase-panel--info">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--purple">
      <FileText size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Informe Técnico en Revisión</h4>
      <p className="phase-panel__description">
        El informe técnico de campo fue entregado y está siendo evaluado
        por la jefatura de operaciones. Este proceso puede tomar hasta 48 horas hábiles.
      </p>
      <div className="phase-panel__tip">
        <Clock size={12} />
        <span>Recibirá una notificación cuando el informe sea aprobado o si requiere correcciones.</span>
      </div>
    </div>
  </div>
);

export const InformeAprobadoPanel: React.FC<PhasePanelProps> = ({ solicitud }) => (
  <div className="phase-panel phase-panel--success">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--green">
      <CheckCircle size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Informe Técnico Aprobado</h4>
      <p className="phase-panel__description">
        La jefatura técnica aprobó el informe de inspección. A continuación se generará el contrato de servicio.
      </p>
      {(solicitud.costoMateriales != null || solicitud.costoManoObra != null || solicitud.costoTotal != null) && (
        <div className="phase-panel__data-grid">
          {solicitud.resultadoInforme && (
            <div className="phase-panel__data-item">
              <span className="phase-panel__data-label">Resultado</span>
              <span className="phase-panel__data-value">{solicitud.resultadoInforme}</span>
            </div>
          )}
          {solicitud.costoMateriales != null && (
            <div className="phase-panel__data-item">
              <DollarSign size={12} className="phase-panel__data-icon" />
              <span className="phase-panel__data-label">Materiales</span>
              <span className="phase-panel__data-value">{fmt(solicitud.costoMateriales)}</span>
            </div>
          )}
          {solicitud.costoManoObra != null && (
            <div className="phase-panel__data-item">
              <DollarSign size={12} className="phase-panel__data-icon" />
              <span className="phase-panel__data-label">Mano de obra</span>
              <span className="phase-panel__data-value">{fmt(solicitud.costoManoObra)}</span>
            </div>
          )}
          {solicitud.costoTotal != null && (
            <div className="phase-panel__data-item phase-panel__data-item--highlight">
              <DollarSign size={12} className="phase-panel__data-icon" />
              <span className="phase-panel__data-label">Costo total estimado</span>
              <span className="phase-panel__data-value phase-panel__data-value--big">{fmt(solicitud.costoTotal)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

export const RechazadaTecnicaPanel: React.FC<PhasePanelProps> = ({ solicitud }) => (
  <div className="phase-panel phase-panel--error">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--red">
      <XCircle size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Solicitud Rechazada — Evaluación Técnica</h4>
      <p className="phase-panel__description">
        Lamentablemente, la inspección técnica determinó que no es viable la conexión
        de acometida para este predio bajo las condiciones actuales.
      </p>
      {solicitud.motivoRechazo && (
        <div className="phase-panel__rejection-reason">
          <span className="phase-panel__rejection-reason__label">Motivo:</span>
          <span className="phase-panel__rejection-reason__text">{solicitud.motivoRechazo}</span>
        </div>
      )}
      <div className="phase-panel__tip phase-panel__tip--error">
        <AlertTriangle size={12} />
        <span>Si considera que hay un error, puede presentar una apelación en las oficinas de EPAA dentro de los 15 días hábiles.</span>
      </div>
    </div>
  </div>
);

// ── CONTRATO panels ───────────────────────────────────────────────────────────

export const ContratoGeneradoPanel: React.FC<PhasePanelProps> = ({ solicitud }) => (
  <div className="phase-panel phase-panel--contract">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--pink">
      <FileSignature size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Contrato de Servicio Generado</h4>
      <p className="phase-panel__description">
        Se ha redactado el contrato de servicio de acometida. El contrato debe ser
        firmado por ambas partes (cliente y EPAA) para continuar con la instalación.
      </p>
      {(solicitud.numeroContrato || solicitud.valorTotal != null) && (
        <div className="phase-panel__data-grid">
          {solicitud.numeroContrato && (
            <div className="phase-panel__data-item">
              <FileSignature size={12} className="phase-panel__data-icon" />
              <span className="phase-panel__data-label">N° Contrato</span>
              <span className="phase-panel__data-value"><strong>{solicitud.numeroContrato}</strong></span>
            </div>
          )}
          {solicitud.valorTotal != null && (
            <div className="phase-panel__data-item phase-panel__data-item--highlight">
              <DollarSign size={12} className="phase-panel__data-icon" />
              <span className="phase-panel__data-label">Valor total del contrato</span>
              <span className="phase-panel__data-value phase-panel__data-value--big">{fmt(solicitud.valorTotal)}</span>
            </div>
          )}
          {solicitud.estadoFirma && (
            <div className="phase-panel__data-item">
              <span className="phase-panel__data-label">Estado de firmas</span>
              <span className="phase-panel__data-value">{solicitud.estadoFirma}</span>
            </div>
          )}
        </div>
      )}
      <div className="phase-panel__tip">
        <MapPin size={12} />
        <span>Acérquese a las oficinas de EPAA con su documento de identidad para la firma del contrato.</span>
      </div>
    </div>
  </div>
);

export const ContratoFirmadoPanel: React.FC<PhasePanelProps> = ({ solicitud }) => (
  <div className="phase-panel phase-panel--success">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--green">
      <CheckCircle size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Contrato Firmado — Proceso Continúa</h4>
      <p className="phase-panel__description">
        El contrato de servicio ha sido suscrito correctamente por ambas partes.
        A continuación, se programará la instalación física de su acometida.
      </p>
      {solicitud.numeroContrato && (
        <div className="phase-panel__data-grid">
          <div className="phase-panel__data-item">
            <FileSignature size={12} className="phase-panel__data-icon" />
            <span className="phase-panel__data-label">Contrato N°</span>
            <span className="phase-panel__data-value"><strong>{solicitud.numeroContrato}</strong></span>
          </div>
          {solicitud.valorTotal != null && (
            <div className="phase-panel__data-item">
              <DollarSign size={12} className="phase-panel__data-icon" />
              <span className="phase-panel__data-label">Valor total</span>
              <span className="phase-panel__data-value">{fmt(solicitud.valorTotal)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

// ── INSTALACION panels ────────────────────────────────────────────────────────

export const InstalacionEmitidaPanel: React.FC<PhasePanelProps> = () => (
  <div className="phase-panel phase-panel--installation">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--orange">
      <Wrench size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Orden de Instalación Emitida</h4>
      <p className="phase-panel__description">
        Se ha asignado una cuadrilla técnica para la instalación de su acometida.
        El equipo se coordinará con usted para la fecha de los trabajos.
      </p>
      <div className="phase-panel__tip">
        <Calendar size={12} />
        <span>Se le contactará para confirmar la fecha y hora de la instalación en su predio.</span>
      </div>
    </div>
  </div>
);

export const InstalacionEnProcesoPanel: React.FC<PhasePanelProps> = () => (
  <div className="phase-panel phase-panel--warning">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--orange">
      <Wrench size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Instalación Física en Proceso</h4>
      <p className="phase-panel__description">
        La cuadrilla técnica de EPAA se encuentra realizando los trabajos de
        instalación de la acometida en su predio.
      </p>
      <div className="phase-panel__tip phase-panel__tip--warning">
        <AlertTriangle size={12} />
        <span>Asegúrese de que haya acceso al área de instalación y que alguien pueda atender al equipo técnico.</span>
      </div>
    </div>
  </div>
);

export const InstalacionCompletadaPanel: React.FC<PhasePanelProps> = () => (
  <div className="phase-panel phase-panel--success">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--green">
      <CheckCircle size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Instalación Completada</h4>
      <p className="phase-panel__description">
        La instalación física de su acometida fue completada exitosamente.
        El expediente pasa ahora al proceso de registro catastral y
        activación del suministro.
      </p>
    </div>
  </div>
);

export const InstalacionFallidaPanel: React.FC<PhasePanelProps> = () => (
  <div className="phase-panel phase-panel--error">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--red">
      <XCircle size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Inconveniente en la Instalación</h4>
      <p className="phase-panel__description">
        Ocurrió un imprevisto durante el proceso de instalación. El personal
        técnico de EPAA se pondrá en contacto con usted para reprogramar los trabajos.
      </p>
      <div className="phase-panel__tip phase-panel__tip--error">
        <AlertTriangle size={12} />
        <span>No se preocupe — se asignará una nueva orden de trabajo para resolver la situación.</span>
      </div>
    </div>
  </div>
);

// ── CATASTRO / SUMINISTRO panels ──────────────────────────────────────────────

export const CatastroPanel: React.FC<PhasePanelProps> = () => (
  <div className="phase-panel phase-panel--info">
    <div className="phase-panel__icon-wrap phase-panel__icon-wrap--cyan">
      <ShieldCheck size={20} />
    </div>
    <div className="phase-panel__body">
      <h4 className="phase-panel__title">Registro Catastral en Proceso</h4>
      <p className="phase-panel__description">
        Su predio está siendo ingresado al sistema catastral de EPAA y
        se está configurando su número de cuenta de facturación.
        Este proceso puede tomar de 24 a 72 horas hábiles.
      </p>
      <div className="phase-panel__tip">
        <Clock size={12} />
        <span>Una vez activado, recibirá su número de medidor y cuenta de facturación.</span>
      </div>
    </div>
  </div>
);

export const SuministroActivoPanel: React.FC<PhasePanelProps> = ({ solicitud }) => (
  <div className="phase-panel phase-panel--active">
    <div className="phase-panel__active-glow" />
    <div className="phase-panel__active-header">
      <div className="phase-panel__active-icon">
        <Zap size={28} />
      </div>
      <div>
        <h4 className="phase-panel__active-title">¡Suministro Activo!</h4>
        <p className="phase-panel__active-subtitle">
          Su servicio de agua potable ha sido activado exitosamente.
        </p>
      </div>
    </div>
    <div className="phase-panel__active-data">
      {solicitud.numeroMedidor && (
        <div className="phase-panel__active-card">
          <span className="phase-panel__active-card__label">N° de Medidor</span>
          <span className="phase-panel__active-card__value">{solicitud.numeroMedidor}</span>
        </div>
      )}
      {solicitud.numeroCuenta && (
        <div className="phase-panel__active-card">
          <span className="phase-panel__active-card__label">N° de Cuenta</span>
          <span className="phase-panel__active-card__value">{solicitud.numeroCuenta}</span>
        </div>
      )}
      {solicitud.fechaActivacion && (
        <div className="phase-panel__active-card">
          <span className="phase-panel__active-card__label">Fecha de Activación</span>
          <span className="phase-panel__active-card__value">{fmtDate(solicitud.fechaActivacion)}</span>
        </div>
      )}
    </div>
    <p className="phase-panel__active-notice">
      Para consultas sobre facturación, acérquese a las ventanillas de recaudación de EPAA
      o comuníquese a través de los canales oficiales.
    </p>
  </div>
);

// ── Dispatcher — SRP: selects the correct panel for the current state ─────────

export const SolicitudPhasePanel: React.FC<PhasePanelProps> = ({ solicitud }) => {
  const { estado } = solicitud;

  switch (estado) {
    // ── Inspección
    case 'ORDEN_INSPECCION_EMITIDA':
      return <InspeccionScheduledPanel solicitud={solicitud} />;
    case 'INSPECCION_EN_PROCESO':
      return <InspeccionInProgressPanel solicitud={solicitud} />;
    case 'INFORME_EN_REVISION':
      return <InformeRevisionPanel solicitud={solicitud} />;
    case 'INFORME_APROBADO':
      return <InformeAprobadoPanel solicitud={solicitud} />;
    case 'RECHAZADA_TECNICA':
      return <RechazadaTecnicaPanel solicitud={solicitud} />;

    // ── Contrato
    case 'CONTRATO_GENERADO':
      return <ContratoGeneradoPanel solicitud={solicitud} />;
    case 'CONTRATO_FIRMADO':
      return <ContratoFirmadoPanel solicitud={solicitud} />;

    // ── Instalación
    case 'OT_INSTALACION_EMITIDA':
      return <InstalacionEmitidaPanel solicitud={solicitud} />;
    case 'INSTALACION_EN_PROCESO':
      return <InstalacionEnProcesoPanel solicitud={solicitud} />;
    case 'INSTALACION_COMPLETADA':
      return <InstalacionCompletadaPanel solicitud={solicitud} />;
    case 'INSTALACION_FALLIDA':
      return <InstalacionFallidaPanel solicitud={solicitud} />;

    // ── Catastro y activación
    case 'REGISTRO_CATASTRAL_PENDIENTE':
      return <CatastroPanel solicitud={solicitud} />;
    case 'SUMINISTRO_ACTIVO':
      return <SuministroActivoPanel solicitud={solicitud} />;

    default:
      return null;
  }
};
