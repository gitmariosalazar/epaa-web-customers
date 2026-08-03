import React from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import type { ConnectionAndPropertyResponse } from '../../../domain/models/Connection';

interface MapInstantTooltipProps {
  connection: ConnectionAndPropertyResponse;
}

export const MapInstantTooltip: React.FC<MapInstantTooltipProps> = ({
  connection,
}) => {
  return (
    <div className="map-instant-tooltip">
      <HiOutlineLocationMarker size={14} />
      <span>{connection.connectionCadastralKey}</span>
    </div>
  );
};
