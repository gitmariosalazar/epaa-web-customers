import React from 'react';
import { Droplets, Mail, Phone, User } from 'lucide-react';
import { FaUserCheck } from 'react-icons/fa';
import { LocationSelector } from '@/shared/presentation/components/Input/LocationSelector';
import { DynamicFormResolver } from '../../components/forms/DynamicFormResolver';
import type { Tramite } from '@/modules/tramites/domain/models/Tramite';
import type { SolicitudForm } from './types';
import { isLocationTramite } from './helpers';

interface PersonalDataStepProps {
  form: SolicitudForm;
  tramite?: Tramite | null;
  onDetallesChange: (detalles: Record<string, any>) => void;
  errors?: Record<string, string>;
}

export const PersonalDataStep: React.FC<PersonalDataStepProps> = ({
  form,
  tramite,
  onDetallesChange,
  errors
}) => {
  return (
    <div className="solicitud-form-section">
      <div className="solicitud-form-section__header">
        <User size={20} />
        <h3>Datos del Titular</h3>
      </div>

      <div className="solicitud-titular-card">
        <div className="solicitud-titular-card__badge">
          <span className="solicitud-titular-card__badge-dot"></span>
          Titular Autenticado
        </div>

        <div className="solicitud-titular-card__avatar">
          <div className="solicitur-titular-card__avatar-inner">
            {form.nombres.charAt(0) || '👤'}
            {form.apellidos.charAt(0) || ''}
          </div>
          <div>
            <h4 className="solicitud-titular-card__name">
              {form.nombres} {form.apellidos}
            </h4>
            <p className="solicitud-titular-card__role">
              Cliente Registrado EPAA-AA
            </p>
          </div>
        </div>

        <div className="solicitud-titular-card__grid">
          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper">
              <User size={16} />
            </div>
            <div>
              <span className="solicitud-titular-card__label">
                Cédula de Identidad
              </span>
              <strong className="solicitud-titular-card__value">
                {form.cedula}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--phone">
              <Phone size={16} />
            </div>
            <div>
              <span className="solicitud-titular-card__label">
                Teléfono de Contacto
              </span>
              <strong className="solicitud-titular-card__value">
                {form.telefono}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--email">
              <Mail size={16} />
            </div>
            <div>
              <span className="solicitud-titular-card__label">
                Correo Electrónico
              </span>
              <strong className="solicitud-titular-card__value">
                {form.email}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--email">
              <FaUserCheck size={16} />
            </div>
            <div>
              <span className="solicitud-titular-card__label">
                Tipo de Persona
              </span>
              <strong className="solicitud-titular-card__value">
                {form.tipo_persona === 'JURIDICA'
                  ? 'Persona Jurídica'
                  : 'Persona Natural'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div
        className="solicitud-form-section__header"
        style={{ marginTop: 'var(--spacing-lg)' }}
      >
        <Droplets size={20} />
        <h3>Detalles Generales</h3>
      </div>

      {isLocationTramite(tramite?.categoria) && (
        <>
          <div
            className="solicitud-form-section__header"
            style={{ marginTop: 'var(--spacing-lg)' }}
          >
            <h3>Ubicación del Predio</h3>
          </div>
          <div className="solicitud-location-wrapper">
            <LocationSelector
              countryId={form.detalles?.countryId || 'ECU'}
              provinceId={form.detalles?.provinceId || ''}
              cantonId={form.detalles?.cantonId || ''}
              parishId={form.detalles?.parishId || ''}
              onLocationChange={(location) =>
                onDetallesChange({
                  ...form.detalles,
                  countryId: location.countryId,
                  provinceId: location.provinceId,
                  cantonId: location.cantonId,
                  parishId: location.parishId
                })
              }
            />
            {(errors?.provinceId || errors?.cantonId || errors?.parishId) && (
              <span className="input__error" style={{ display: 'block', marginTop: '4px' }}>
                {errors.provinceId || errors.cantonId || errors.parishId}
              </span>
            )}
          </div>
        </>
      )}

      {tramite && (
        <DynamicFormResolver
          categoria={tramite.categoria}
          data={form.detalles}
          onChange={(newDetalles) => onDetallesChange(newDetalles)}
          errors={errors}
        />
      )}
    </div>
  );
};
