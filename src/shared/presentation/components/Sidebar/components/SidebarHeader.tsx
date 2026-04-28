import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EpaaLogo } from '../../Logo/EpaaLogo';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  toggleSidebar
}) => {
  return (
    <div className="sidebar__header">
      <div className="sidebar__logo">
        <EpaaLogo isCollapsed={isCollapsed} size="sm" />
      </div>
      <button className="sidebar__toggle" onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
};
