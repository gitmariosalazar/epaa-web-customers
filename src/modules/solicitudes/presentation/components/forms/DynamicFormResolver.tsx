import React from 'react';
import { FormAcometida } from './FormAcometida';
import { FormSuspension } from './FormSuspension';

// In a real app, this interface would use discriminated unions or generics
interface DynamicFormResolverProps {
  categoria: string;
  data: any;
  onChange: (data: any) => void;
}

export const DynamicFormResolver: React.FC<DynamicFormResolverProps> = ({ categoria, data, onChange }) => {
  switch (categoria) {
    case 'nueva_acometida':
    case 'alcantarillado':
      return <FormAcometida data={data} onChange={onChange} />;
    
    case 'suspension':
      return <FormSuspension data={data} onChange={onChange} />;
      
    // Default form for other tramites that don't have a specific form yet
    default:
      return (
        <div style={{ padding: 'var(--spacing-lg)', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No hay campos adicionales requeridos para este trámite.</p>
        </div>
      );
  }
};
