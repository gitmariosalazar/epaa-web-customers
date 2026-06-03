// ============================================================
// Navigation Hook — Acometidas Portal
// Defines the sidebar navigation sections for the WP system.
// Clean Architecture: Delegated configuration to modular files.
// ============================================================

import type { NavSection } from '@/shared/domain/models/Navigation';
import { getGeneralSection } from './navigation/sections/generalSection';
import { getTramitesSection } from './navigation/sections/tramitesSection';
import { getDocumentosSection } from './navigation/sections/documentosSection';
import { getAdministracionSection } from './navigation/sections/administracionSection';

export const useNavigation = (): NavSection[] => {
  return [
    getGeneralSection(),
    getTramitesSection(),
    getDocumentosSection(),
    getAdministracionSection()
  ];
};
