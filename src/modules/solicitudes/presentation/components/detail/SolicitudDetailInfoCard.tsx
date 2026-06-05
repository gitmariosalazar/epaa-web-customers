import React from 'react';
import { User, MapPin, FileText, Navigation, Home, Building, Mail, Phone } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';
import { TIPO_PERSONA_LABELS, USO_PREDIO_LABELS } from '../SolicitudConfig';
import '../../styles/SolicitudDetailInfoCard.css';

interface SolicitudDetailInfoCardProps {
  solicitud: RequestDetailByClientResponse;
}

export const SolicitudDetailInfoCard: React.FC<SolicitudDetailInfoCardProps> = ({
  solicitud
}) => {
  const personaLabel = TIPO_PERSONA_LABELS[solicitud.tipoPersona] ?? solicitud.tipoPersona;
  const usoLabel = USO_PREDIO_LABELS[solicitud.usoPredio] ?? solicitud.usoPredio;
  const isJuridica = solicitud.tipoPersona === 'JURIDICA';

  const titular = isJuridica
    ? solicitud.company?.businessName ||
      solicitud.datosAdicionales?.nombres ||
      solicitud.clienteId
    : solicitud.person
      ? `${solicitud.person.firstName} ${solicitud.person.lastName}`
      : solicitud.datosAdicionales?.nombres && solicitud.datosAdicionales?.apellidos
        ? `${solicitud.datosAdicionales.nombres} ${solicitud.datosAdicionales.apellidos}`
        : solicitud.clienteId;

  const identificationVal = isJuridica
    ? solicitud.company?.ruc || solicitud.clienteId
    : solicitud.person?.personId || solicitud.clienteId;

  const emailVal = isJuridica
    ? solicitud.company?.emails?.[0]?.correo || solicitud.datosAdicionales?.email || ''
    : solicitud.person?.emails?.[0]?.correo || solicitud.datosAdicionales?.email || '';

  const phoneVal = isJuridica
    ? solicitud.company?.phones?.[0]?.numero || solicitud.datosAdicionales?.telefono || ''
    : solicitud.person?.phones?.[0]?.numero || solicitud.datosAdicionales?.telefono || '';

  return (
    <Card className="sol-detail-card">
      <div className="sol-detail-card__title-row">
        <User size={18} className="sol-detail-card__title-icon" />
        <h3 className="sol-detail-card__title">Información General</h3>
      </div>

      <div className="sol-detail-grid">
        {/* Titular */}
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">Nombre del Titular</span>
          <span className="sol-detail-item__value">{titular}</span>
        </div>
        {/* Identificación */}
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">Identificación (Cédula / RUC)</span>
          <span className="sol-detail-item__value">{identificationVal}</span>
        </div>
        {/* Email */}
        {emailVal && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <Mail size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
              Correo Electrónico
            </span>
            <span className="sol-detail-item__value">{emailVal}</span>
          </div>
        )}
        {/* Teléfono */}
        {phoneVal && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <Phone size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
              Teléfono
            </span>
            <span className="sol-detail-item__value">{phoneVal}</span>
          </div>
        )}
        {/* Persona */}
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">
            <Building size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
            Tipo de Persona
          </span>
          <span className="sol-detail-item__value">{personaLabel}</span>
        </div>
        {/* Uso de predio */}
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">
            <Home size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
            Uso del Predio
          </span>
          <span className="sol-detail-item__value">{usoLabel}</span>
        </div>
        {/* Dirección */}
        <div className="sol-detail-item sol-detail-item--full">
          <span className="sol-detail-item__label">
            <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
            Dirección
          </span>
          <span className="sol-detail-item__value">{solicitud.direccion}</span>
        </div>
        {/* Clave catastral */}
        <div className="sol-detail-item">
          <span className="sol-detail-item__label">
            <FileText size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
            Clave Catastral
          </span>
          <span className="sol-detail-item__value">
            {solicitud.claveCatastral.trim() === '' ? 'Sin Asignar' : solicitud.claveCatastral.trim()}
          </span>
        </div>
        {/* Coordenadas */}
        {solicitud.coordenadas && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <Navigation size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
              Coordenadas
            </span>
            <span className="sol-detail-item__value">{solicitud.coordenadas}</span>
          </div>
        )}
        {/* Analista */}
        {solicitud.analistaUsername && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <User size={12} style={{ display: 'inline', marginRight: 4 }} />{' '}
              Analista Asignado
            </span>
            <span className="sol-detail-item__value">{solicitud.analistaUsername}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
