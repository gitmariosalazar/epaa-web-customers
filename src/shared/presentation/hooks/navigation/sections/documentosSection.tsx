import { FileText, List } from 'lucide-react';
import { FaRegFileAlt } from 'react-icons/fa';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getDocumentosSection = (): NavSection => ({
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
});
