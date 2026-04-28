// ============================================================
// Navigation Hook — Acometidas Portal
// Defines the sidebar navigation sections for the WP system.
// ============================================================

import {
  LayoutDashboard,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  List,
  User,
  Lock,
  Users,
  Shield,
  Settings,
  ClipboardList,
  Activity,
  Droplets,
  Building2,
  Heart
} from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';
import React from 'react';
import { MdAssignmentAdd, MdOutlineWaterDrop } from 'react-icons/md';
import { FaRegFileAlt, FaWheelchair } from 'react-icons/fa';
import { TiThList } from 'react-icons/ti';

const generateTramiteMenu = (
  icon: React.JSX.Element,
  label: string,
  categoriaSlug: string,
  requisitosRoutes?: { natural?: string; juridica?: string; general?: string }
) => {
  const reqSubItems = [];
  if (requisitosRoutes?.natural) {
    reqSubItems.push({ icon: <Droplets size={18} />, label: 'Persona Natural', to: requisitosRoutes.natural });
  }
  if (requisitosRoutes?.juridica) {
    reqSubItems.push({ icon: <Building2 size={18} />, label: 'Persona Jurídica', to: requisitosRoutes.juridica });
  }
  if (requisitosRoutes?.general) {
    // We don't need a sub-sub menu if there's only one "general" requirement link
    // but the user wanted the same structure. We'll nest it anyway for consistency,
    // or just link the Requisitos node directly. Wait, user said "la misma estructura".
    // I'll add "Ver Requisitos" as a subItem to match structure.
    reqSubItems.push({ icon: <FileText size={18} />, label: 'Ver Requisitos', to: requisitosRoutes.general });
  }

  const requisitosNode = reqSubItems.length > 0 ? [{
    icon: <FileText size={18} />,
    label: 'Requisitos',
    subItems: reqSubItems
  }] : [];

  return {
    icon,
    label,
    subItems: [
      ...requisitosNode,
      { icon: <MdAssignmentAdd size={18} />, label: 'Nueva Solicitud', to: `/requests/${categoriaSlug}/new` },
      { icon: <Activity size={18} />, label: 'Seguimiento', to: `/requests/${categoriaSlug}/tracking` },
      { icon: <TiThList size={18} />, label: 'Mis Solicitudes', to: `/requests/${categoriaSlug}/list` },
      { icon: <Clock size={18} />, label: 'En Proceso', to: `/requests/${categoriaSlug}/pending` },
      { icon: <CheckCircle size={18} />, label: 'Aprobadas', to: `/requests/${categoriaSlug}/approved` },
      { icon: <XCircle size={18} />, label: 'Rechazadas', to: `/requests/${categoriaSlug}/rejected` }
    ]
  };
};

export const useNavigation = (): NavSection[] => {
  const navSections: NavSection[] = [
    {
      title: 'General',
      hideTitle: true,
      items: [
        {
          icon: <LayoutDashboard size={20} />,
          label: 'Panel Principal',
          to: '/'
        }
      ]
    },
    // ── Trámites ──
    {
      title: 'Trámites',
      hideTitle: true,
      items: [
        {
          icon: <ClipboardList size={20} />,
          label: 'Trámites',
          subItems: [
            generateTramiteMenu(<MdOutlineWaterDrop size={18} />, 'Acometidas', 'nueva_acometida', { natural: '/procedures/nueva-acometida-natural', juridica: '/procedures/nueva-acometida-juridica' }),
            generateTramiteMenu(<Users size={18} />, 'Cambio de Titular', 'cambio_titular', { general: '/procedures/cambio-titular' }),
            generateTramiteMenu(<XCircle size={18} />, 'Suspensión', 'suspension_servicio', { general: '/procedures/suspension-servicio' }),
            generateTramiteMenu(<Heart size={18} />, 'Tercera Edad', 'beneficio_tercera_edad', { general: '/procedures/beneficio-tercera-edad' }),
            generateTramiteMenu(<FaWheelchair size={16} />, 'Discapacidad', 'beneficio_discapacidad', { general: '/procedures/beneficio-discapacidad' })
          ]
        }
      ]
    },
    {
      title: 'Documentos',
      hideTitle: true,
      items: [
        {
          icon: <FileText size={20} />,
          label: 'Documentos',
          subItems: [
            {
              icon: <FaRegFileAlt size={18} />,
              label: 'Subir Documentos',
              to: '/documents/upload'
            },
            {
              icon: <List size={18} />,
              label: 'Mis Documentos',
              to: '/documents/list'
            }
          ]
        }
      ]
    },
    {
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
    }
  ];

  return navSections;
};
