import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';

export const WorkOrderCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>Volver</Button>
          <h2>Crear Orden de Trabajo</h2>
        </div>
      }
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        background: 'var(--surface-50, #f9fafb)',
        borderRadius: '12px',
        margin: '24px'
      }}>
        <AlertCircle size={48} style={{ color: 'var(--warning, #f59e0b)', marginBottom: '16px' }} />
        <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', fontWeight: 600 }}>Acción No Disponible</h3>
        <p style={{ color: 'var(--text-secondary, #6b7280)', maxWidth: '500px', lineHeight: 1.5 }}>
          Esta página está reservada para futuras implementaciones. Por el momento, los clientes no pueden crear órdenes de trabajo directamente desde este portal.
        </p>
      </div>
    </PageLayout>
  );
};
