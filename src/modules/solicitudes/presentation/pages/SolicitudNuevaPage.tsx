// ============================================================
// PRESENTATION — SolicitudNuevaPage (5-step wizard)
//
// CLEAN ARCHITECTURE:
//   - tramiteId comes from URL (:tramiteId param) — each tramite
//     is an independent process with its own requisitos.
//   - GetTramiteByIdUseCase loads the exact requirements.
//   - DocumentUploadCard handles per-document upload (SRP).
//   - ValidateDocumentoUseCase enforces business rules.
//   - DocumentosMap state owned here as orchestrator (SRP).
//
// SOLID:
//   - SRP: wizard orchestrates steps, doesn't know upload logic.
//   - OCP: add new tramites by adding to TramitesCatalog, not here.
//   - DIP: depends on Tramite domain type, not on implementations.
// ============================================================

import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Card } from '@/shared/presentation/components/Card/Card';
import {
  User,
  Droplets,
  UploadCloud,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { DocumentUploadCard } from './DocumentUploadCard';
import { useTramiteById } from '@/modules/tramites/presentation/context/TramitesContext';
import type { DocumentosMap } from '@/modules/tramites/domain/models/DocumentoAdjunto';
import type { Tramite } from '@/modules/tramites/domain/models/Tramite';
import './SolicitudNuevaPage.css';
import { DynamicFormResolver } from '../components/forms/DynamicFormResolver';
import { INITIAL_FORM_ACOMETIDA } from '../components/forms/FormAcometida';
import { INITIAL_FORM_SUSPENSION } from '../components/forms/FormSuspension';

/* ── Steps config — 3 steps only ── */
const STEPS = [
  { id: 1, label: 'Datos Personales', icon: <User size={18} /> },
  { id: 2, label: 'Documentos', icon: <UploadCloud size={18} /> },
  { id: 3, label: 'Confirmación', icon: <FileText size={18} /> }
];

/* ── Form types ── */
interface SolicitudForm {
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  tipo_persona: 'natural' | 'juridica';
  detalles: any; // Dynamic based on category
}


const INITIAL_FORM: SolicitudForm = {
  cedula: '',
  nombres: '',
  apellidos: '',
  email: '',
  telefono: '',
  tipo_persona: 'natural',
  detalles: {} // We'll initialize this dynamically when we know the category
};

// ── Default tramite ID — can be overridden by URL param ──────
const DEFAULT_TRAMITE_ID = 'nueva-acometida-natural';

// ── Sub-component: Documents step ───────────────────────────
interface DocumentsStepProps {
  tramite: Tramite;
  documentos: DocumentosMap;
  onAttach: (id: string, file: File) => void;
  onRemove: (id: string) => void;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({
  tramite,
  documentos,
  onAttach,
  onRemove
}) => {
  const obligatorios = tramite.requisitos.filter((r) => r.obligatorio);
  const uploaded = Object.keys(documentos).length;
  const total = obligatorios.length;
  const progress = total > 0 ? Math.round((uploaded / total) * 100) : 0;
  const allReady = uploaded >= total;

  return (
    <div className="solicitud-form-section solicitud-docs-step">
      <div className="solicitud-form-section__header">
        <UploadCloud size={20} />
        <h3>Carga de Documentos — {tramite.nombre}</h3>
      </div>

      <p className="solicitud-docs-step__subtitle">
        Adjunta cada documento de forma independiente. Los documentos de
        terceros (Municipio, Registro de la Propiedad) deben obtenerse
        previamente.
      </p>

      {/* Progress bar */}
      <div className="doc-upload-progress">
        <div className="doc-upload-progress__bar-track">
          <div
            className="doc-upload-progress__bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="doc-upload-progress__meta">
          <span>
            <strong
              style={{
                color: allReady ? 'var(--success)' : 'var(--text-main)'
              }}
            >
              {uploaded}
            </strong>
            &nbsp;de <strong>{total}</strong> documentos obligatorios adjuntados
          </span>
          {allReady && (
            <span
              style={{
                color: 'var(--success)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <CheckCircle size={14} /> Listo para continuar
            </span>
          )}
        </div>
      </div>

      {/* Card grid — 2 columns, scrolls with card body */}
      <div className="doc-upload-grid">
        {tramite.requisitos.map((req, i) => (
          <DocumentUploadCard
            key={req.id}
            requisito={req}
            index={i}
            adjunto={documentos[req.id]}
            onAttach={onAttach}
            onRemove={onRemove}
          />
        ))}
      </div>

      {!allReady && (
        <div className="solicitud-docs-step__warning">
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          Faltan {total - uploaded} documento{total - uploaded !== 1 ? 's' : ''}{' '}
          obligatorio{total - uploaded !== 1 ? 's' : ''}. Puedes continuar y
          adjuntarlos después.
        </div>
      )}
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────
export const SolicitudNuevaPage: React.FC = () => {
  // OCP: tramiteId from URL — new tramite types need zero changes here
  const { tramiteId = DEFAULT_TRAMITE_ID } = useParams<{
    tramiteId?: string;
  }>();
  const navigate = useNavigate();

  const { tramite, isLoading: tramiteLoading } = useTramiteById(tramiteId);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<SolicitudForm>(INITIAL_FORM);
  const [documentos, setDocumentos] = useState<DocumentosMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof SolicitudForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  // Initialize dynamic form data once tramite is loaded
  React.useEffect(() => {
    if (tramite && Object.keys(form.detalles).length === 0) {
      if (tramite.categoria === 'nueva_acometida' || tramite.categoria === 'alcantarillado') {
        setForm(prev => ({ ...prev, detalles: { ...INITIAL_FORM_ACOMETIDA } }));
      } else if (tramite.categoria === 'suspension') {
        setForm(prev => ({ ...prev, detalles: { ...INITIAL_FORM_SUSPENSION } }));
      }
    }
  }, [tramite]);

  // DIP: handlers only use DocumentoAdjunto domain type
  const handleAttach = useCallback((requisitoId: string, file: File) => {
    setDocumentos((prev) => ({
      ...prev,
      [requisitoId]: { requisitoId, file, estado: 'pendiente' }
    }));
  }, []);

  const handleRemove = useCallback((requisitoId: string) => {
    setDocumentos((prev) => {
      const n = { ...prev };
      delete n[requisitoId];
      return n;
    });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const docsSubidos = Object.keys(documentos).length;
  const docsTotal =
    tramite?.requisitos.filter((r) => r.obligatorio).length ?? 0;
  const allDocsReady = docsSubidos >= docsTotal;

  // ── Loading state ──
  if (tramiteLoading) {
    return (
      <PageLayout>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            gap: '0.75rem'
          }}
        >
          <Droplets size={24} />
          <span>Cargando proceso...</span>
        </div>
      </PageLayout>
    );
  }

  // ── Success screen ──
  if (submitted) {
    const solNum = `SOL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    return (
      <PageLayout
        header={
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              color: 'var(--text-main)'
            }}
          >
            Nueva Solicitud
          </h2>
        }
      >
        <div className="solicitud-success">
          <div className="solicitud-success__icon">
            <Check size={48} />
          </div>
          <h2>¡Solicitud Enviada!</h2>
          <p>
            Tu solicitud de <strong>{tramite?.nombre}</strong> ha sido
            registrada con&nbsp;
            <strong>
              {docsSubidos} documento{docsSubidos !== 1 ? 's' : ''}
            </strong>{' '}
            adjuntos.
          </p>
          <div className="solicitud-success__info">
            <strong>Número de Solicitud:</strong> {solNum}
          </div>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <Button variant="outline" onClick={() => navigate('/tramites')}>
              Ver Trámites
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setForm(INITIAL_FORM);
                setDocumentos({});
              }}
            >
              Nueva Solicitud
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            id="btn-back-wizard"
          >
            Atrás
          </Button>
          <h2
            style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-main)'
            }}
          >
            Nueva Solicitud — {tramite?.nombre ?? 'Acometida'}
          </h2>
        </div>
      }
    >
      {/* ── Step indicator (outside Card so it doesn't scroll) ── */}
      <div className="solicitud-steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div
              className={`solicitud-step ${step >= s.id ? 'solicitud-step--active' : ''} ${step > s.id ? 'solicitud-step--done' : ''}`}
            >
              <div className="solicitud-step__dot">
                {step > s.id ? <Check size={14} /> : s.icon}
              </div>
              <span className="solicitud-step__label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`solicitud-steps__line ${step > s.id ? 'solicitud-steps__line--done' : ''}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Main Card — scrolls internally ── */}
      <Card className="solicitud-card">
        {/* ═══ Step 1 — Datos Personales + Predio + Servicio ═══ */}
        {step === 1 && (
          <div className="solicitud-form-section">
            {/* Titular */}
            <div className="solicitud-form-section__header">
              <User size={20} />
              <h3>Datos del Titular</h3>
            </div>
            <div className="solicitud-grid-2">
              <Input
                id="sol-cedula"
                label="Cédula de Identidad"
                placeholder="Ej: 1234567890"
                value={form.cedula}
                onChange={update('cedula')}
                required
                maxLength={10}
                inputMode="numeric"
              />
              <Input
                id="sol-telefono"
                label="Teléfono"
                placeholder="Ej: 0999999999"
                value={form.telefono}
                onChange={update('telefono')}
                required
              />
              <Input
                id="sol-nombres"
                label="Nombres"
                placeholder="Ej: Juan Carlos"
                value={form.nombres}
                onChange={update('nombres')}
                required
              />
              <Input
                id="sol-apellidos"
                label="Apellidos"
                placeholder="Ej: Pérez Gómez"
                value={form.apellidos}
                onChange={update('apellidos')}
                required
              />
              <Input
                id="sol-email"
                label="Correo Electrónico"
                type="email"
                placeholder="Ej: juan@correo.com"
                value={form.email}
                onChange={update('email')}
                required
                className="solicitud-grid-2__full"
              />
            </div>

            {/* Tipo Persona */}
            <div
              className="solicitud-form-section__header"
              style={{ marginTop: 'var(--spacing-lg)' }}
            >
              <Droplets size={20} />
              <h3>Detalles Generales</h3>
            </div>
            <div className="solicitud-grid-2">
              <div className="input-component solicitud-grid-2__full">
                <label className="input__label">Tipo de Persona</label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginTop: '0.25rem'
                  }}
                >
                  {(['natural', 'juridica'] as const).map((tp) => (
                    <div
                      key={tp}
                      onClick={() =>
                        setForm((p) => ({ ...p, tipo_persona: tp }))
                      }
                      style={{
                        padding: '0.75rem',
                        border: `2px solid ${form.tipo_persona === tp ? 'var(--accent)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        background:
                          form.tipo_persona === tp
                            ? 'color-mix(in srgb, var(--accent), transparent 92%)'
                            : 'var(--surface)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        color:
                          form.tipo_persona === tp
                            ? 'var(--accent)'
                            : 'var(--text-secondary)',
                        transition: 'all 0.18s'
                      }}
                    >
                      {tp === 'natural'
                        ? '👤 Persona Natural'
                        : '🏢 Persona Jurídica'}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Details based on tramite */}
            {tramite && (
              <DynamicFormResolver 
                categoria={tramite.categoria} 
                data={form.detalles} 
                onChange={(newDetalles) => setForm(p => ({ ...p, detalles: newDetalles }))} 
              />
            )}
          </div>
        )}

        {/* ═══ Step 2 — Documentos ═══ */}
        {step === 2 && tramite && (
          <DocumentsStep
            tramite={tramite}
            documentos={documentos}
            onAttach={handleAttach}
            onRemove={handleRemove}
          />
        )}

        {/* ═══ Step 3 — Confirmación ═══ */}
        {step === 3 && (
          <div className="solicitud-form-section">
            <div className="solicitud-form-section__header">
              <FileText size={20} />
              <h3>Resumen de la Solicitud</h3>
            </div>
            <div className="solicitud-summary">
              <div className="solicitud-summary__group">
                <h4>Datos Personales</h4>
                <div className="solicitud-summary__row">
                  <span>Cédula:</span>
                  <strong>{form.cedula}</strong>
                </div>
                <div className="solicitud-summary__row">
                  <span>Nombres:</span>
                  <strong>
                    {form.nombres} {form.apellidos}
                  </strong>
                </div>
                <div className="solicitud-summary__row">
                  <span>Correo:</span>
                  <strong>{form.email}</strong>
                </div>
                <div className="solicitud-summary__row">
                  <span>Teléfono:</span>
                  <strong>{form.telefono}</strong>
                </div>
              </div>
              <div className="solicitud-summary__group">
                <h4>Servicio General</h4>
                <div className="solicitud-summary__row">
                  <span>Tipo Persona:</span>
                  <strong style={{ textTransform: 'capitalize' }}>
                    {form.tipo_persona}
                  </strong>
                </div>
              </div>
              {Object.keys(form.detalles).length > 0 && (
                <div className="solicitud-summary__group">
                  <h4>Detalles Específicos</h4>
                  {Object.entries(form.detalles).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div className="solicitud-summary__row" key={key}>
                        <span style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}:</span>
                        <strong>{String(value)}</strong>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="solicitud-summary__group">
                <h4>Documentos — {tramite?.nombre}</h4>
                <div className="solicitud-summary__row">
                  <span>Adjuntados:</span>
                  <strong
                    style={{
                      color: allDocsReady ? 'var(--success)' : 'var(--error)'
                    }}
                  >
                    {docsSubidos}/{docsTotal}{' '}
                    {allDocsReady ? '✓ Completo' : '⚠ Incompleto'}
                  </strong>
                </div>
                {Object.values(documentos).map((doc) => {
                  const req = tramite?.requisitos.find(
                    (r) => r.id === doc.requisitoId
                  );
                  return (
                    <div
                      key={doc.requisitoId}
                      className="solicitud-summary__row"
                    >
                      <span style={{ fontSize: '0.75rem' }}>
                        {(req?.descripcion ?? '').length > 38
                          ? (req?.descripcion ?? '').slice(0, 38) + '…'
                          : (req?.descripcion ?? '')}
                      </span>
                      <strong
                        style={{ color: 'var(--success)', fontSize: '0.75rem' }}
                      >
                        ✓ {doc.file.name.slice(0, 18)}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="solicitud-nav">
          {step > 1 && (
            <Button
              id="btn-prev-step"
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              leftIcon={<ChevronLeft size={18} />}
            >
              Anterior
            </Button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <Button
              id="btn-next-step"
              variant="primary"
              onClick={() => setStep((s) => s + 1)}
              rightIcon={<ChevronRight size={18} />}
            >
              Continuar
            </Button>
          ) : (
            <Button
              id="btn-submit-solicitud"
              variant="success"
              isLoading={isSubmitting}
              onClick={handleSubmit}
              leftIcon={!isSubmitting ? <Check size={18} /> : undefined}
            >
              Enviar Solicitud
            </Button>
          )}
        </div>
      </Card>
    </PageLayout>
  );
};
