// ============================================================
// Navigation Hook — Acometidas Portal
// Defines the sidebar navigation sections for the WP system.
// Clean Architecture: Delegated configuration to modular files.
// ============================================================
import { useTranslation } from 'react-i18next';
import type { NavSection } from '@/shared/domain/models/Navigation';
import { getGeneralSection } from './navigation/sections/generalSection';
import { getTramitesSection } from './navigation/sections/tramitesSection';
import { getDocumentosSection } from './navigation/sections/documentosSection';
import { getAdministracionSection } from './navigation/sections/administracionSection';
import { getCatastrosSection } from './navigation/sections/catastrosSection';

export const useNavigation = (): NavSection[] => {
  const { t } = useTranslation();
  return [
    getGeneralSection(),
    getCatastrosSection(t),
    getTramitesSection(),
    getDocumentosSection(),
    getAdministracionSection()
  ];
};
