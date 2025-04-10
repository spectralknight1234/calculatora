
import React from 'react';
import { Region } from './worldMapTypes';

interface MapLegendProps {
  regions: Region[];
  activeRegion: string | null;
}

const MapLegend = ({ regions, activeRegion }: MapLegendProps) => {
  return (
    <div className="absolute bottom-4 right-4 z-10 bg-background/90 p-3 rounded-md shadow-md">
      <div className="text-xs font-medium mb-1">Regiões de Carbonum</div>
      {regions.map((region) => (
        <div 
          key={region.id}
          className={`flex items-center gap-1 ${activeRegion === region.id ? 'font-bold' : ''}`}
        >
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: region.color }}
          ></div>
          <span className="text-xs">{region.name} ({region.emissions.toFixed(1)})</span>
        </div>
      ))}
    </div>
  );
};

export default MapLegend;
