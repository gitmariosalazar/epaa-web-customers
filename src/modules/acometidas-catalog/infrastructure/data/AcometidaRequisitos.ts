// ============================================================
// ACOMETIDAS — Static catalog (infrastructure/data)
//
// OCP: add a new variant by adding an object here only.
// SRP: pure data — no logic.
// ============================================================
import type { AcometidaVariante } from '../../domain/models/Acometida';

export const ACOMETIDAS_CATALOG: AcometidaVariante[] = [
  {
    id: 'nueva-acometida-natural',
    nombre: 'Nueva Acometida — Persona Natural',
    descripcion: 'Solicitud de conexión nueva de agua potable para propiedades de personas naturales.',
    tipoAcometida: 'agua_potable',
    tipoPersona: 'natural',
    costoTotal: 25,
    tiempoEstimadoDias: 15,
    icono: 'droplets',
    color: '#3b82f6',
    activo: true,
    requisitos: [
      { id: 'nan-01', descripcion: 'Cédula o pasaporte del beneficiario (copia)', tipo: 'documento', nota: 'Copia legible del titular', obligatorio: true, documentTypeId: 1 },
      { id: 'nan-02', descripcion: 'Cédula o pasaporte del cónyuge (copia)', tipo: 'documento', nota: 'Opcional, copia legible del cónyuge', obligatorio: false, documentTypeId: 1 },
      { id: 'nan-03', descripcion: 'Papeleta de votación del beneficiario', tipo: 'documento', nota: 'Copia legible del titular', obligatorio: true, documentTypeId: 3 },
      { id: 'nan-04', descripcion: 'Papeleta de votación del cónyuge', tipo: 'documento', nota: 'Opcional, copia legible del cónyuge', obligatorio: false, documentTypeId: 3 },
      { id: 'nan-05', descripcion: 'Escritura del predio (copia)', tipo: 'documento', nota: 'Copia simple inscrita en el Registro de la Propiedad', obligatorio: true, documentTypeId: 4 },
      { id: 'nan-06', descripcion: 'Pago de impuesto predial (copia)', tipo: 'documento', nota: 'Copia del pago del año vigente', obligatorio: true, documentTypeId: 5 },
      { id: 'nan-07', descripcion: 'Certificado de no adeudar del municipio (GADM-AA)', tipo: 'documento', nota: 'Certificado vigente', obligatorio: true, documentTypeId: 6 },
      { id: 'nan-08', descripcion: 'Certificado de no adeudar a la EPAA-AA beneficiario', tipo: 'documento', nota: 'Certificado vigente del titular', obligatorio: true, documentTypeId: 6 },
      { id: 'nan-09', descripcion: 'Certificado de no adeudar a la EPAA-AA cónyuge', tipo: 'documento', nota: 'Opcional, certificado vigente del cónyuge', obligatorio: false, documentTypeId: 6 }
    ]
  },
  {
    id: 'nueva-acometida-juridica',
    nombre: 'Nueva Acometida — Persona Jurídica',
    descripcion: 'Solicitud de conexión nueva de agua potable para empresas y personas jurídicas.',
    tipoAcometida: 'agua_potable',
    tipoPersona: 'juridica',
    costoTotal: 13,
    tiempoEstimadoDias: 20,
    icono: 'building2',
    color: '#6366f1',
    activo: true,
    requisitos: [
      { id: 'naj-01', descripcion: 'Solicitud del servicio varios y pago de inspección', tipo: 'pago', costo: 13.00, nota: 'Pago conjunto en Ventanillas EPAA-AA', obligatorio: true },
      { id: 'naj-02', descripcion: 'Copias simples de RUC y nombramiento del representante legal', tipo: 'documento', nota: 'Vigentes y en buen estado', obligatorio: true },
      { id: 'naj-03', descripcion: 'Cédula y certificado de votación del representante legal', tipo: 'documento', nota: 'Documentos personales del representante', obligatorio: true },
      { id: 'naj-04', descripcion: 'Escritura inscrita y pago de impuesto predial vigente', tipo: 'documento', nota: 'Copia simple, año en curso', obligatorio: true }
    ]
  },
  {
    id: 'acometida-alcantarillado-natural',
    nombre: 'Acometida Alcantarillado — Persona Natural',
    descripcion: 'Solicitud de conexión al sistema de alcantarillado sanitario para personas naturales.',
    tipoAcometida: 'alcantarillado',
    tipoPersona: 'natural',
    costoTotal: 25,
    tiempoEstimadoDias: 15,
    icono: 'waves',
    color: '#0ea5e9',
    activo: true,
    requisitos: [
      { id: 'aca-n-01', descripcion: 'Cédula o pasaporte del beneficiario (copia)', tipo: 'documento', nota: 'Copia legible del titular', obligatorio: true, documentTypeId: 1 },
      { id: 'aca-n-02', descripcion: 'Cédula o pasaporte del cónyuge (copia)', tipo: 'documento', nota: 'Opcional, copia legible del cónyuge', obligatorio: false, documentTypeId: 1 },
      { id: 'aca-n-03', descripcion: 'Papeleta de votación del beneficiario', tipo: 'documento', nota: 'Copia legible del titular', obligatorio: true, documentTypeId: 3 },
      { id: 'aca-n-04', descripcion: 'Papeleta de votación del cónyuge', tipo: 'documento', nota: 'Opcional, copia legible del cónyuge', obligatorio: false, documentTypeId: 3 },
      { id: 'aca-n-05', descripcion: 'Escritura del predio (copia)', tipo: 'documento', nota: 'Copia simple inscrita en el Registro de la Propiedad', obligatorio: true, documentTypeId: 4 },
      { id: 'aca-n-06', descripcion: 'Pago de impuesto predial (copia)', tipo: 'documento', nota: 'Copia del pago del año vigente', obligatorio: true, documentTypeId: 5 },
      { id: 'aca-n-07', descripcion: 'Certificado de no adeudar del municipio (GADM-AA)', tipo: 'documento', nota: 'Certificado vigente', obligatorio: true, documentTypeId: 6 },
      { id: 'aca-n-08', descripcion: 'Certificado de no adeudar a la EPAA-AA beneficiario', tipo: 'documento', nota: 'Certificado vigente del titular', obligatorio: true, documentTypeId: 6 },
      { id: 'aca-n-09', descripcion: 'Certificado de no adeudar a la EPAA-AA cónyuge', tipo: 'documento', nota: 'Opcional, certificado vigente del cónyuge', obligatorio: false, documentTypeId: 6 }
    ]
  },
  {
    id: 'acometida-alcantarillado-juridica',
    nombre: 'Acometida Alcantarillado — Persona Jurídica',
    descripcion: 'Solicitud de conexión al sistema de alcantarillado sanitario para personas jurídicas.',
    tipoAcometida: 'alcantarillado',
    tipoPersona: 'juridica',
    costoTotal: 13,
    tiempoEstimadoDias: 20,
    icono: 'factory',
    color: '#14b8a6',
    activo: true,
    requisitos: [
      { id: 'aca-j-01', descripcion: 'Solicitud del servicio varios y pago de inspección', tipo: 'pago', costo: 13.00, nota: 'Pago conjunto en Ventanillas EPAA-AA', obligatorio: true },
      { id: 'aca-j-02', descripcion: 'Copias simples de RUC y nombramiento del representante legal', tipo: 'documento', nota: 'Vigentes y en buen estado', obligatorio: true },
      { id: 'aca-j-03', descripcion: 'Cédula y certificado de votación del representante legal', tipo: 'documento', nota: 'Documentos personales del representante', obligatorio: true },
      { id: 'aca-j-04', descripcion: 'Escritura inscrita en el Registro de la Propiedad', tipo: 'documento', nota: 'Copia simple', obligatorio: true },
      { id: 'aca-j-05', descripcion: 'Pago del impuesto predial vigente', tipo: 'documento', nota: 'Año en curso', obligatorio: true }
    ]
  }
];
