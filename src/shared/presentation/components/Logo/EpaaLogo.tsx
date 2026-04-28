import React from 'react';
import './EpaaLogo.css';

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface EpaaLogoProps {
  isCollapsed?: boolean;
  size?: LogoSize;
  className?: string;
}

export const EpaaLogo: React.FC<EpaaLogoProps> = ({ 
  isCollapsed = false,
  size = 'md',
  className = ''
}) => {
  if (isCollapsed) {
    return (
      <div className={`epaa-logo-wrapper collapsed ${className}`}>
        <svg
          viewBox="0 15 80 50"
          className="epaa-logo-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text x="10" y="60" className="epaa-text-dark">
            E
          </text>
          <text x="45" y="60" className="epaa-text-light">
            A
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`epaa-logo-wrapper size-${size} ${className}`}>
      <svg
        viewBox="0 15 175 68"
        className="epaa-logo-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="top-clip">
            <path d="M 0 0 L 175 0 L 175 30 L 160 30 Q 125 55 100 47 Q 80 41 60 50 L 0 50 Z" />
          </clipPath>
          <clipPath id="bottom-clip">
            <path d="M 60 50 Q 80 41 100 47 Q 125 55 160 30 L 175 30 L 175 85 L 0 85 Z" />
          </clipPath>
        </defs>

        {/* EP */}
        <text x="7" y="58" className="epaa-text-dark">
          EP
        </text>

        {/* AA Top (Dark) */}
        <text
          x="72"
          y="58"
          className="epaa-text-dark"
          clipPath="url(#top-clip)"
        >
          AA
        </text>

        {/* AA Bottom (Light) */}
        <text
          x="72"
          y="58"
          className="epaa-text-light"
          clipPath="url(#bottom-clip)"
        >
          AA
        </text>

        {/* The Swoosh Wave */}
        <path
          d="M 60 50 Q 80 38 100 45 Q 125 52 160 30 Q 125 60 100 50 Q 80 44 60 50 Z"
          className="epaa-wave"
        />

        {/* ANTONIO ANTE */}
        <text x="87.5" y="78" textAnchor="middle" className="epaa-sub">
          ANTONIO ANTE
        </text>
      </svg>
    </div>
  );
};
