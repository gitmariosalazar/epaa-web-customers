import { MdOutlineCable } from 'react-icons/md';
import { TiThList } from 'react-icons/ti';
import { BarChart3, LayoutDashboard, Map, ShieldAlert } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getCatastrosSection = (t: any): NavSection => ({
  title: 'Mis Acometidas',
  hideTitle: true,
  items: [
    {
      icon: <MdOutlineCable size={20} />,
      label: 'Mis Servicios', // Opcional: Cambiar "Mis Acometidas" a "Mis Servicios" si es para usuario final
      subItems: [
        {
          icon: <TiThList size={18} />,
          label: t('sidebar.connectionsList', 'Lista de Acometidas'),
          to: '/connections/list'
        },
        {
          icon: <BarChart3 size={18} />,
          label: t('sidebar.connectionsMap', 'Mapa de Acometidas'), // Mayúscula inicial
          to: '/connections/map'
        },
        {
          icon: <LayoutDashboard size={18} />,
          label: t('sidebar.connectionsDashboard', 'Resumen (Dashboard)'), // Más amigable para clientes
          to: '/connections/dashboard'
        },
        {
          icon: <ShieldAlert size={18} />,
          label: t('sidebar.incidentsList', 'Mis Incidentes'),
          to: '/incidents/list'
        },
        {
          icon: <Map size={18} />,
          label: t('sidebar.incidentsMap', 'Mapa de Incidentes'), // Consistencia: Incidentes en lugar de Incidencias
          to: '/incidents/map'
        }
      ]
    }
  ]
});

