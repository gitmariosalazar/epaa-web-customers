// ============================================================
// PRESENTATION — DashboardHome
// Shows welcome banner, stats, and ALL tramites from the
// catalog — each with its process steps + required documents.
// OCP: adding a new tramite to the catalog auto-appears here.
// SRP: only orchestrates display — no business logic.
// ============================================================

import React from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { useTramites } from '@/modules/tramites/presentation/context/TramitesContext';
import { useNavigate } from 'react-router-dom';
import '@/shared/presentation/styles/dashboard.css';
import './DashboardHome.css';
import { 
  Droplets, XCircle, ArrowRight, Activity, Building2, Users, Heart 
} from 'lucide-react';



// ── Stat card ─────────────────────────────────────────────────
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string; bgColor: string; to?: string }> = (
  { icon, label, value, color, bgColor, to }
) => {
  const navigate = useNavigate();
  return (
    <div className="acometida-stat-card" style={{ cursor: to ? 'pointer' : 'default', '--stat-color': color, '--stat-bg': bgColor } as React.CSSProperties} onClick={() => to && navigate(to)}>
      <div className="acometida-stat-card__icon">{icon}</div>
      <div className="acometida-stat-card__content">
        <div className="acometida-stat-card__value">{value}</div>
        <div className="acometida-stat-card__label">{label}</div>
      </div>
      {to && <ArrowRight size={16} className="acometida-stat-card__arrow" />}
    </div>
  );
};


// ── Main dashboard ────────────────────────────────────────────
export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const { tramites } = useTramites();
  const navigate = useNavigate();

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : user?.username ?? 'Usuario';

  const stats = [
    { icon: <Droplets size={24} />, label: 'Total Solicitudes', value: 0, color: '#3b82f6', bgColor: 'rgba(59,130,246,0.12)', to: '/solicitudes/lista' },
    { icon: <Clock size={24} />,    label: 'En Proceso',        value: 0, color: '#f59e0b', bgColor: 'rgba(245,158,11,0.12)',  to: '/solicitudes/en-proceso' },
    { icon: <CheckCircle size={24} />, label: 'Aprobadas',      value: 0, color: '#10b981', bgColor: 'rgba(16,185,129,0.12)', to: '/solicitudes/aprobadas' },
    { icon: <XCircle size={24} />,  label: 'Rechazadas',        value: 0, color: '#ef4444', bgColor: 'rgba(239,68,68,0.12)',   to: '/solicitudes/rechazadas' },
  ];

  const activeTramites = tramites.filter(t => t.activo);

  return (
    <div className="acometida-dashboard">

      {/* Welcome Banner */}
      <div className="acometida-welcome">
        <div className="acometida-welcome__content">
          <div className="acometida-welcome__icon"><Droplets size={36} /></div>
          <div>
            <h1 className="acometida-welcome__title">Bienvenido, {displayName}</h1>
            <p className="acometida-welcome__subtitle">
              Portal de Trámites EPAA-AA · Sistema de Gestión de Solicitudes
            </p>
          </div>
        </div>
        <button className="acometida-welcome__cta" onClick={() => navigate('/tramites')}>
          <FileText size={18} /> Ver Trámites
        </button>
      </div>

      {/* Stats */}
      <div className="acometida-stats-grid">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Section title */}
      <div className="acometida-section-title-wrapper">
        <Activity size={18} style={{ color: 'var(--accent)' }} />
        <h2 className="acometida-section-title">
          Trámites Disponibles
        </h2>
        <span className="acometida-section-badge">
          {activeTramites.length} trámites
        </span>
      </div>

      {/* Grid of tramite cards */}
      <div className="tramites-grid">
        {activeTramites.map((tramite) => (
          <div key={tramite.id} className="tramite-dashboard-card-wrapper" onClick={() => navigate(`/procedures/${tramite.id}`)}>
             <div 
               className="card tramite-dashboard-card" 
               style={{ '--tramite-color': tramite.color } as React.CSSProperties}
             >
                <div className="tramite-dashboard-card__icon-wrapper">
                   {tramite.icono === 'droplets' ? <Droplets size={28} /> : 
                    tramite.icono === 'building2' ? <Building2 size={28} /> :
                    tramite.icono === 'users' ? <Users size={28} /> :
                    tramite.icono === 'x-circle' ? <XCircle size={28} /> :
                    tramite.icono === 'heart' ? <Heart size={28} /> :
                    <FileText size={28} />}
                </div>
                <div className="tramite-dashboard-card__content">
                  <h3 className="tramite-dashboard-card__title">
                    {tramite.nombre}
                  </h3>
                  <p className="tramite-dashboard-card__desc">
                    {tramite.descripcion.length > 70 ? tramite.descripcion.substring(0, 70) + '...' : tramite.descripcion}
                  </p>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
