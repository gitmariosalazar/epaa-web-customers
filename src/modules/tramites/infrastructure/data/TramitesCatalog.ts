// ============================================================
// INFRASTRUCTURE — Tramite Catalog (static seed data)
//
// Clean Architecture: This is the ONLY place where tramite
// requirements are defined. The Repository pattern (OCP) means
// we can later swap this for an API call without touching any
// application or presentation layer code.
//
// SOLID:
//   OCP — Adding a new tramite = adding an entry here only.
//   SRP — Each tramite object is a pure data descriptor.
//   DIP — Application layer depends on Tramite[] not this file.
//
// Source: https://epaa.gob.ec/wp/?page_id=3124
// ============================================================

import type { Tramite } from '../../domain/models/Tramite';

export const TRAMITES_CATALOG: Tramite[] = [

  // ══════════════════════════════════════════════════════
  //  CATEGORÍA: NUEVAS ACOMETIDAS
  // ══════════════════════════════════════════════════════

  {
    id: 'nueva-acometida-natural',
    nombre: 'Nueva Acometida Natural',
    descripcion:
      'Solicitud de conexión nueva de agua potable para propiedades de personas naturales.',
    categoria: 'nueva_acometida',
    tipoPersona: 'natural',
    costoTotal: 25,
    tiempoEstimadoDias: 15,
    icono: 'droplets',
    color: '#3b82f6',
    activo: true,
    requisitos: [
      {
        id: 'nan-01',
        descripcion: 'Solicitud del servicio varios',
        tipo: 'pago',
        costo: 3.0,
        nota: 'Pago en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'nan-02',
        descripcion: 'Inspección técnica del predio',
        tipo: 'pago',
        costo: 10.0,
        nota: 'Pago en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'nan-03',
        descripcion:
          'Copia de cédula, certificado de votación o pasaporte del beneficiario y cónyuge',
        tipo: 'documento',
        nota: 'Documento vigente',
        obligatorio: true
      },
      {
        id: 'nan-04',
        descripcion: 'Copia simple de la Escritura inscrita en el Registro de la Propiedad',
        tipo: 'documento',
        nota: 'No requiere notariado',
        obligatorio: true
      },
      {
        id: 'nan-05',
        descripcion: 'Copia del pago del impuesto predial del año vigente',
        tipo: 'documento',
        nota: 'Año en curso',
        obligatorio: true
      },
      {
        id: 'nan-06',
        descripcion: 'Certificado de no adeudar al G.A.D.M.A.A',
        tipo: 'pago',
        costo: 6.0,
        nota: 'Solicitar en el Municipio de Antonio Ante',
        obligatorio: true
      },
      {
        id: 'nan-07',
        descripcion: 'Certificado de no adeudar a la EPAA-AA',
        tipo: 'pago',
        costo: 6.0,
        nota: 'Solicitar en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'nan-08',
        descripcion: 'Correo electrónico activo',
        tipo: 'documento',
        nota: 'Para notificaciones del trámite',
        obligatorio: true
      }
    ]
  },

  {
    id: 'nueva-acometida-juridica',
    nombre: 'Nueva Acometida Jurídica',
    descripcion:
      'Solicitud de conexión nueva de agua potable para empresas y personas jurídicas.',
    categoria: 'nueva_acometida',
    tipoPersona: 'juridica',
    costoTotal: 13,
    tiempoEstimadoDias: 20,
    icono: 'building2',
    color: '#6366f1',
    activo: true,
    requisitos: [
      {
        id: 'naj-01',
        descripcion: 'Solicitud del servicio varios y pago de inspección',
        tipo: 'pago',
        costo: 13.0,
        nota: 'Pago conjunto en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'naj-02',
        descripcion: 'Copias simples de RUC y nombramiento del representante legal',
        tipo: 'documento',
        nota: 'Vigentes y en buen estado',
        obligatorio: true
      },
      {
        id: 'naj-03',
        descripcion: 'Cédula y certificado de votación del representante legal',
        tipo: 'documento',
        nota: 'Documentos personales del representante',
        obligatorio: true
      },
      {
        id: 'naj-04',
        descripcion: 'Escritura inscrita y pago de impuesto predial vigente',
        tipo: 'documento',
        nota: 'Copia simple, año en curso',
        obligatorio: true
      }
    ]
  },

  // ══════════════════════════════════════════════════════
  //  CATEGORÍA: CAMBIO DE USUARIO / TITULAR
  // ══════════════════════════════════════════════════════

  {
    id: 'cambio-titular',
    nombre: 'Cambio de Usuario / Titular',
    descripcion:
      'Trámite para actualizar el nombre del titular registrado en la cuenta de agua potable.',
    categoria: 'cambio_titular',
    tipoPersona: 'ambas',
    costoTotal: 5,
    tiempoEstimadoDias: 5,
    icono: 'users',
    color: '#f59e0b',
    activo: true,
    requisitos: [
      {
        id: 'ct-01',
        descripcion: 'Copia de cédula y papeleta de votación del nuevo titular',
        tipo: 'documento',
        nota: 'Documentos vigentes',
        obligatorio: true
      },
      {
        id: 'ct-02',
        descripcion: 'Última factura de consumo cancelada',
        tipo: 'documento',
        nota: 'La más reciente',
        obligatorio: true
      },
      {
        id: 'ct-03',
        descripcion: 'Escrituras públicas inscritas en el Registro de la Propiedad',
        tipo: 'documento',
        nota: 'Copia notariada o simple según el caso',
        obligatorio: true
      },
      {
        id: 'ct-04',
        descripcion: 'Pago del impuesto predial del año en curso',
        tipo: 'documento',
        nota: 'Año vigente',
        obligatorio: true
      },
      {
        id: 'ct-05',
        descripcion: 'Formulario de solicitud de cambio de titular — Persona Natural',
        tipo: 'formulario',
        costo: 3.0,
        nota: 'Disponible en Ventanillas EPAA-AA ($3.00)',
        obligatorio: true
      },
      {
        id: 'ct-06',
        descripcion: 'Formulario de solicitud de cambio de titular — Persona Jurídica',
        tipo: 'formulario',
        costo: 5.0,
        nota: 'Solo aplica para personas jurídicas ($5.00)',
        obligatorio: false
      }
    ]
  },

  // ══════════════════════════════════════════════════════
  //  CATEGORÍA: SUSPENSIÓN DEL SERVICIO
  // ══════════════════════════════════════════════════════

  {
    id: 'suspension-servicio',
    nombre: 'Suspensión del Servicio',
    descripcion:
      'Solicitud de suspensión temporal o definitiva del servicio de agua potable o alcantarillado.',
    categoria: 'suspension',
    tipoPersona: 'ambas',
    costoTotal: 26,
    tiempoEstimadoDias: 3,
    icono: 'x-circle',
    color: '#ef4444',
    activo: true,
    requisitos: [
      {
        id: 'ss-01',
        descripcion: 'Solicitud dirigida al Gerente General (motivo: temporal o definitiva)',
        tipo: 'formulario',
        costo: 1.0,
        nota: 'Redactar en papel o solicitar formulario en EPAA-AA',
        obligatorio: true
      },
      {
        id: 'ss-02',
        descripcion: 'Copia de cédula y papeleta de votación actualizada del titular',
        tipo: 'documento',
        nota: 'Del titular de la cuenta',
        obligatorio: true
      },
      {
        id: 'ss-03',
        descripcion: 'Pago de la tasa administrativa por suspensión',
        tipo: 'pago',
        costo: 25.0,
        nota: 'Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'ss-04',
        descripcion: 'Copia de la última factura cancelada',
        tipo: 'documento',
        nota: 'Factura más reciente pagada',
        obligatorio: true
      }
    ]
  },

  // ══════════════════════════════════════════════════════
  //  CATEGORÍA: REHABILITACIÓN DEL SERVICIO
  // ══════════════════════════════════════════════════════

  {
    id: 'rehabilitacion-servicio',
    nombre: 'Rehabilitación del Servicio',
    descripcion:
      'Solicitud para reactivar el servicio de agua potable que fue suspendido por falta de pago u otras causas.',
    categoria: 'rehabilitacion',
    tipoPersona: 'ambas',
    costoTotal: 26,
    tiempoEstimadoDias: 2,
    icono: 'rotate-ccw',
    color: '#06b6d4',
    activo: true,
    requisitos: [
      {
        id: 'rs-01',
        descripcion: 'Solicitud de rehabilitación del servicio',
        tipo: 'formulario',
        costo: 1.0,
        nota: 'Disponible en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'rs-02',
        descripcion: 'Copia de cédula y papeleta de votación del titular',
        tipo: 'documento',
        nota: 'Documento vigente',
        obligatorio: true
      },
      {
        id: 'rs-03',
        descripcion: 'Pago total de la deuda pendiente (facturas atrasadas)',
        tipo: 'pago',
        nota: 'Cancelar en Ventanillas EPAA-AA o puntos autorizados',
        obligatorio: true
      },
      {
        id: 'rs-04',
        descripcion: 'Pago de tasa de rehabilitación',
        tipo: 'pago',
        costo: 25.0,
        nota: 'Ventanillas EPAA-AA',
        obligatorio: true
      }
    ]
  },

  // ══════════════════════════════════════════════════════
  //  CATEGORÍA: ACOMETIDA DE ALCANTARILLADO
  // ══════════════════════════════════════════════════════

  {
    id: 'acometida-alcantarillado-natural',
    nombre: 'Acometida de Alcantarillado Natural',
    descripcion:
      'Solicitud de conexión al sistema de alcantarillado sanitario para personas naturales.',
    categoria: 'alcantarillado',
    tipoPersona: 'natural',
    costoTotal: 25,
    tiempoEstimadoDias: 15,
    icono: 'waves',
    color: '#0ea5e9',
    activo: true,
    requisitos: [
      {
        id: 'aca-n-01',
        descripcion: 'Solicitud del servicio varios',
        tipo: 'pago',
        costo: 3.0,
        nota: 'Pago en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'aca-n-02',
        descripcion: 'Inspección técnica del predio',
        tipo: 'pago',
        costo: 10.0,
        nota: 'Pago en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'aca-n-03',
        descripcion:
          'Copia de cédula, certificado de votación o pasaporte del beneficiario y cónyuge',
        tipo: 'documento',
        nota: 'Documento vigente',
        obligatorio: true
      },
      {
        id: 'aca-n-04',
        descripcion: 'Copia simple de la Escritura inscrita en el Registro de la Propiedad',
        tipo: 'documento',
        nota: 'No requiere notariado',
        obligatorio: true
      },
      {
        id: 'aca-n-05',
        descripcion: 'Copia del pago del impuesto predial del año vigente',
        tipo: 'documento',
        nota: 'Año en curso',
        obligatorio: true
      },
      {
        id: 'aca-n-06',
        descripcion: 'Certificado de no adeudar al G.A.D.M.A.A',
        tipo: 'pago',
        costo: 6.0,
        nota: 'Solicitar en el Municipio de Antonio Ante',
        obligatorio: true
      },
      {
        id: 'aca-n-07',
        descripcion: 'Certificado de no adeudar a la EPAA-AA',
        tipo: 'pago',
        costo: 6.0,
        nota: 'Solicitar en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'aca-n-08',
        descripcion: 'Correo electrónico activo',
        tipo: 'documento',
        nota: 'Para notificaciones del trámite',
        obligatorio: true
      }
    ]
  },

  {
    id: 'acometida-alcantarillado-juridica',
    nombre: 'Acometida de Alcantarillado Jurídica',
    descripcion:
      'Solicitud de conexión al sistema de alcantarillado sanitario para personas jurídicas.',
    categoria: 'alcantarillado',
    tipoPersona: 'juridica',
    costoTotal: 13,
    tiempoEstimadoDias: 20,
    icono: 'factory',
    color: '#14b8a6',
    activo: true,
    requisitos: [
      {
        id: 'aca-j-01',
        descripcion: 'Solicitud del servicio varios y pago de inspección',
        tipo: 'pago',
        costo: 13.0,
        nota: 'Pago conjunto en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'aca-j-02',
        descripcion: 'Copias simples de RUC y nombramiento del representante legal',
        tipo: 'documento',
        nota: 'Vigentes y en buen estado',
        obligatorio: true
      },
      {
        id: 'aca-j-03',
        descripcion: 'Cédula y certificado de votación del representante legal',
        tipo: 'documento',
        nota: 'Documentos personales del representante',
        obligatorio: true
      },
      {
        id: 'aca-j-04',
        descripcion: 'Escritura inscrita en el Registro de la Propiedad',
        tipo: 'documento',
        nota: 'Copia simple',
        obligatorio: true
      },
      {
        id: 'aca-j-05',
        descripcion: 'Pago del impuesto predial vigente',
        tipo: 'documento',
        nota: 'Año en curso',
        obligatorio: true
      }
    ]
  },

  // ══════════════════════════════════════════════════════
  //  CATEGORÍA: CAMBIO / REPOSICIÓN DE MEDIDOR
  // ══════════════════════════════════════════════════════

  {
    id: 'cambio-medidor',
    nombre: 'Cambio / Reposición de Medidor',
    descripcion:
      'Solicitud para reemplazar o reponer el medidor de agua potable dañado, obsoleto o extraviado.',
    categoria: 'medidor',
    tipoPersona: 'ambas',
    costoTotal: 4,
    tiempoEstimadoDias: 5,
    icono: 'gauge',
    color: '#f97316',
    activo: true,
    requisitos: [
      {
        id: 'cm-01',
        descripcion: 'Solicitud de cambio de medidor (formulario)',
        tipo: 'formulario',
        costo: 1.0,
        nota: 'Disponible en Ventanillas EPAA-AA',
        obligatorio: true
      },
      {
        id: 'cm-02',
        descripcion: 'Copia de cédula y papeleta de votación del titular',
        tipo: 'documento',
        nota: 'Documento vigente del propietario de la cuenta',
        obligatorio: true
      },
      {
        id: 'cm-03',
        descripcion: 'Denuncia (en caso de robo o pérdida del medidor)',
        tipo: 'documento',
        nota: 'Emitida por la UPC o Policía Nacional',
        obligatorio: false
      },
      {
        id: 'cm-04',
        descripcion: 'Pago de inspección técnica',
        tipo: 'pago',
        costo: 3.0,
        nota: 'Ventanillas EPAA-AA',
        obligatorio: true
      }
    ]
  },

  // ══════════════════════════════════════════════════════
  //  CATEGORÍA: CERTIFICADO DE NO ADEUDAR
  // ══════════════════════════════════════════════════════

  {
    id: 'certificado-no-adeudar',
    nombre: 'Certificado de No Adeudar',
    descripcion:
      'Emisión del certificado oficial que acredita que la cuenta no tiene deudas pendientes con la EPAA-AA.',
    categoria: 'certificado',
    tipoPersona: 'ambas',
    costoTotal: 6,
    tiempoEstimadoDias: 1,
    icono: 'file-check',
    color: '#10b981',
    activo: true,
    requisitos: [
      {
        id: 'cna-01',
        descripcion: 'Copia de cédula del titular de la cuenta',
        tipo: 'documento',
        nota: 'Documento vigente',
        obligatorio: true
      },
      {
        id: 'cna-02',
        descripcion: 'Número de cuenta de agua potable o dirección del predio',
        tipo: 'documento',
        nota: 'Para ubicar la cuenta en el sistema',
        obligatorio: true
      },
      {
        id: 'cna-03',
        descripcion: 'Pago por emisión del certificado',
        tipo: 'pago',
        costo: 6.0,
        nota: 'Ventanillas EPAA-AA',
        obligatorio: true
      }
    ]
  },

  // ══════════════════════════════════════════════════════
  //  CATEGORÍA: BENEFICIOS
  // ══════════════════════════════════════════════════════

  {
    id: 'beneficio-tercera-edad',
    nombre: 'Descuento Tercera Edad',
    descripcion:
      'Solicitud de descuento en la planilla de agua potable para ciudadanos adultos mayores (65 años o más).',
    categoria: 'beneficio',
    tipoPersona: 'natural',
    costoTotal: 1,
    tiempoEstimadoDias: 3,
    icono: 'heart',
    color: '#10b981',
    activo: true,
    requisitos: [
      {
        id: 'bte-01',
        descripcion: 'Copia de cédula que acredite ser adulto mayor (65 años o más)',
        tipo: 'documento',
        nota: 'Cédula de identidad vigente',
        obligatorio: true
      },
      {
        id: 'bte-02',
        descripcion: 'Última factura de consumo de agua cancelada',
        tipo: 'documento',
        nota: 'La más reciente',
        obligatorio: true
      },
      {
        id: 'bte-03',
        descripcion: 'Formulario de solicitud de descuento por tercera edad',
        tipo: 'formulario',
        costo: 1.0,
        nota: 'Disponible en Ventanillas EPAA-AA',
        obligatorio: true
      }
    ]
  },

  {
    id: 'beneficio-discapacidad',
    nombre: 'Descuento por Discapacidad',
    descripcion:
      'Solicitud de descuento en la planilla de agua potable para personas con discapacidad reconocida.',
    categoria: 'beneficio',
    tipoPersona: 'natural',
    costoTotal: 1,
    tiempoEstimadoDias: 3,
    icono: 'accessibility',
    color: '#8b5cf6',
    activo: true,
    requisitos: [
      {
        id: 'bd-01',
        descripcion: 'Copia de cédula del beneficiario',
        tipo: 'documento',
        nota: 'Cédula de identidad vigente',
        obligatorio: true
      },
      {
        id: 'bd-02',
        descripcion: 'Carnet de CONADIS o certificado del Ministerio de Salud',
        tipo: 'documento',
        nota: 'Documento que acredite la condición de discapacidad. Vigente.',
        obligatorio: true
      },
      {
        id: 'bd-03',
        descripcion: 'Última factura de consumo de agua cancelada',
        tipo: 'documento',
        nota: 'La más reciente',
        obligatorio: true
      },
      {
        id: 'bd-04',
        descripcion: 'Formulario de solicitud de descuento por discapacidad',
        tipo: 'formulario',
        costo: 1.0,
        nota: 'Disponible en Ventanillas EPAA-AA',
        obligatorio: true
      }
    ]
  }
];
