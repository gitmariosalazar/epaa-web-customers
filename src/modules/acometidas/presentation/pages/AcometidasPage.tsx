/**
 * AcometidasPage — Módulo: acometidas
 * SCROLL: solo la lista de requisitos es scrollable.
 * STICKY: título, hero, tabs (izquierda) y resumen+soporte (derecha).
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { TramiteRequisitosList } from '@/shared/presentation/components/TramiteRequisitosList';
import { GetAcometidaCatalogUseCase } from '../../application/usecases/GetAcometidaCatalogUseCase';
import { AcometidaRepositoryImpl } from '../../infrastructure/repositories/AcometidaRepositoryImpl';
import type { AcometidaVariante } from '../../domain/models/Acometida';
import { SupportContactCard } from '@/modules/tramites/presentation/components/SupportContactCard';
import { Droplets, Building2, Clock, DollarSign, ArrowRight, FileText, AlertCircle } from 'lucide-react';
import '@/shared/presentation/components/TramiteRequisitosList/TramiteProcedurePage.css';

const repo    = new AcometidaRepositoryImpl();
const useCase = new GetAcometidaCatalogUseCase(repo);
const tipoLabel = (v: AcometidaVariante) =>
  `${v.tipoAcometida === 'agua_potable' ? 'Agua Potable' : 'Alcantarillado'} — ${v.tipoPersona === 'natural' ? 'Natural' : 'Jurídica'}`;

export const AcometidasPage: React.FC = () => {
  const navigate = useNavigate();
  const [variants, setVariants]   = useState<AcometidaVariante[]>([]);
  const [activeId, setActiveId]   = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    useCase.execute().then((data) => {
      setVariants(data);
      if (data.length > 0) setActiveId(data[0].id);
      setIsLoading(false);
    });
  }, []);

  const active = variants.find((v) => v.id === activeId);

  return (
    <PageLayout>
      {isLoading && <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>}

      {!isLoading && active && (
        <div style={{ height: '100%', '--tp-color': active.color, '--tp-accent-bg': `${active.color}14` } as React.CSSProperties}>
          <div className="tp-scroll-layout">

            {/* ══ LEFT: sticky title + hero + tabs | scrollable requisitos ══ */}
            <div className="tp-scroll-layout__left">

              {/* Sticky section */}
              <div className="tp-scroll-layout__sticky">
                {/* Title */}
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25 }}>
                    Acometidas
                  </h1>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    Conexión de agua potable y alcantarillado
                  </span>
                </div>

                {/* Hero — compact */}
                <div className="tp-hero" style={{ borderColor: `${active.color}30`, padding: '0.875rem 1.1rem' }}>
                  <div className="tp-hero__icon" style={{ background: `${active.color}20`, color: active.color, width: 40, height: 40 }}>
                    <Droplets size={19} />
                  </div>
                  <div className="tp-hero__text">
                    <h2 className="tp-hero__title" style={{ fontSize: '0.9rem' }}>{active.nombre}</h2>
                    <p className="tp-hero__desc" style={{ fontSize: '0.75rem' }}>{active.descripcion}</p>
                  </div>
                  <div className="tp-hero__badges">
                    <span className="tp-badge tp-badge--accent" style={{ fontSize: '0.68rem' }}>
                      <Clock size={10} /> {active.tiempoEstimadoDias}d
                    </span>
                    <span className="tp-badge tp-badge--accent" style={{ fontSize: '0.68rem' }}>
                      <DollarSign size={10} /> ${active.costoTotal}
                    </span>
                  </div>
                </div>

                {/* Tabs — compact */}
                <div className="tp-tabs" style={{ gap: '0.35rem', paddingBottom: '0.25rem', marginTop: '-20px' }}>
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      className={`tp-tab${v.id === activeId ? ' tp-tab--active' : ''}`}
                      style={{ ...(v.id === activeId ? { background: v.color } : {}), fontSize: '0.72rem', padding: '0.35rem 0.7rem' }}
                      onClick={() => setActiveId(v.id)}
                    >
                      {v.tipoPersona === 'natural' ? <Droplets size={12} /> : <Building2 size={12} />}
                      {tipoLabel(v)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable requisitos */}
              <div className="tp-scroll-layout__body">
                <div className="tp-card">
                  <div className="tp-card__header">
                    <div className="tp-card__header-icon" style={{ background: `${active.color}20`, color: active.color }}>
                      <FileText size={13} />
                    </div>
                    <h3 className="tp-card__title" style={{ fontSize: '0.78rem' }}>Requisitos ({active.requisitos.length})</h3>
                  </div>
                  <div className="tp-card__body">
                    <TramiteRequisitosList requisitos={active.requisitos} />
                  </div>
                </div>
              </div>
            </div>

            {/* ══ RIGHT: sticky resumen + soporte ══ */}
            <div className="tp-scroll-layout__right">
              <div className="tp-card">
                <div className="tp-card__header">
                  <div className="tp-card__header-icon" style={{ background: `${active.color}20`, color: active.color }}>
                    <AlertCircle size={13} />
                  </div>
                  <h3 className="tp-card__title" style={{ fontSize: '0.78rem' }}>Resumen</h3>
                </div>
                <div className="tp-card__body" style={{ padding: '0.875rem 1rem' }}>
                  <div className="tp-info-list">
                    {[
                      { icon: <Clock size={13} />, label: 'Tiempo estimado', value: `${active.tiempoEstimadoDias} días hábiles` },
                      { icon: <DollarSign size={13} />, label: 'Costo estimado', value: `$${active.costoTotal} USD`, colored: true },
                      { icon: <FileText size={13} />, label: 'Total requisitos', value: `${active.requisitos.length} ítems` },
                    ].map(({ icon, label, value, colored }) => (
                      <div key={label} className="tp-info-item">
                        <div className="tp-info-item__icon" style={{ width: 26, height: 26 }}>{icon}</div>
                        <div className="tp-info-item__body">
                          <span className="tp-info-item__label" style={{ fontSize: '0.65rem' }}>{label}</span>
                          <span className="tp-info-item__value" style={{ fontSize: '0.82rem', ...(colored ? { color: active.color } : {}) }}>{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="tp-cta"
                    style={{ background: active.color, color: '#fff', padding: '0.65rem 1rem', fontSize: '0.8rem' }}
                    onClick={() => navigate('/requests/nueva_acometida/new')}
                  >
                    Iniciar trámite <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div className="tp-support-compact"><SupportContactCard /></div>
            </div>

          </div>
        </div>
      )}
    </PageLayout>
  );
};
