export type EstadoSolicitud = 'aprobada' | 'rechazada' | 'en_proceso' | 'completada';

export interface SolicitudBase {
  id: string;
  tramiteId: string;
  categoria: string;
  fechaCreacion: string;
  estado: EstadoSolicitud;
  titular: string;
  cedula: string;
}

export interface SolicitudAcometida extends SolicitudBase {
  categoria: 'nueva_acometida' | 'alcantarillado';
  detalles: {
    parroquia: string;
    barrio: string;
    direccion: string;
    tipoUso: string;
    diametro: string;
  };
}

export interface SolicitudGenerica extends SolicitudBase {
  categoria: 'cambio_titular' | 'suspension' | 'rehabilitacion' | 'medidor' | 'certificado' | 'beneficio';
  detalles: Record<string, string>;
}

export type Solicitud = SolicitudAcometida | SolicitudGenerica;
