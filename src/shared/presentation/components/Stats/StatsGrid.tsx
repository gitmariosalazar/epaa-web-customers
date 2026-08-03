import React from 'react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { useTranslation } from 'react-i18next';
import { ChartColorService, type SemanticColor } from '@/shared/presentation/utils/colors/ChartColorManager';
import './StatsGrid.css';

export interface StatCardItem {
  title: string;
  value: string | number;
  desc?: string;
  icon: React.ElementType;
  color?: SemanticColor;
  onClick?: () => void;
  isSelected?: boolean;
}

export interface StatsGridProps {
  items: StatCardItem[];
  loading?: boolean;
  className?: string;
}

export const StatCard: React.FC<{ card: StatCardItem }> = ({ card }) => {
  const colorService = ChartColorService.getInstance();
  return (
    <div
      className={`stat-card ${card.isSelected ? 'stat-card-selected' : ''}`.trim()}
      onClick={card.onClick}
      style={{
        backgroundColor: card.color
          ? `color-mix(in srgb, ${colorService.getColorByName(card.color)} ${card.isSelected ? '16%' : '8%'}, var(--surface))`
          : card.isSelected ? 'var(--surface-hover)' : undefined,
        borderColor: card.isSelected
          ? colorService.getColorByName(card.color || 'primary')
          : card.color
            ? `color-mix(in srgb, ${colorService.getColorByName(card.color)} 30%, var(--border-color))`
            : undefined,
        boxShadow: card.isSelected ? `0 0 12px ${colorService.getColorByName(card.color || 'primary')}40` : undefined,
        width: '100%',
        minWidth: 0,
        maxWidth: '400px',
        cursor: card.onClick ? 'pointer' : 'default',
        transform: card.isSelected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <div className={`stat-icon-wrapper ${card.color ? `icon-${card.color}` : ''}`.trim()}>
        <card.icon size={20} />
      </div>
      <div className="stat-content">
        <p className="stat-title">{card.title}</p>
        <h5 className="stat-value" style={{
          color: card.color ? colorService.getColorByName(card.color) : undefined
        }}>{card.value}</h5>
        {card.desc && <p className="stat-desc">{card.desc}</p>}
      </div>
    </div>
  );
};

export const StatsGrid: React.FC<StatsGridProps> = ({ items, loading, className = '' }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="p-4">
        <CircularProgress strokeWidth={9} label={t('common.loading')} />
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className={`stats-grid mb-4 ${className}`.trim()}>
      {items.map((card, idx) => (
        <StatCard key={idx} card={card} />
      ))}
    </div>
  );
};
