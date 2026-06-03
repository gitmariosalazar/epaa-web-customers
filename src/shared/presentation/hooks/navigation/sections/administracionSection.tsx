import { Droplets, Lock, Users, Shield, User, Settings } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getAdministracionSection = (): NavSection => ({
  title: 'Administración',
  hideTitle: true,
  items: [
    {
      icon: <Droplets size={20} />,
      label: 'Órdenes de Trabajo',
      to: '/ordenes-trabajo'
    },
    {
      icon: <Lock size={20} />,
      label: 'Seguridad',
      subItems: [
        {
          icon: <Users size={18} />,
          label: 'Usuarios',
          to: '/users'
        },
        {
          icon: <Shield size={18} />,
          label: 'Roles',
          to: '/roles'
        },
        {
          icon: <User size={18} />,
          label: 'Perfil',
          to: '/profile'
        },
        {
          icon: <Settings size={18} />,
          label: 'Configuración',
          to: '/settings'
        }
      ]
    }
  ]
});
