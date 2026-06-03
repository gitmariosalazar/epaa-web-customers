import { LayoutDashboard, Bell } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getGeneralSection = (): NavSection => ({
  title: 'General',
  hideTitle: true,
  items: [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Panel Principal',
      to: '/'
    },
    {
      icon: <Bell size={20} />,
      label: 'Notificaciones',
      to: '/notifications'
    }
  ]
});
