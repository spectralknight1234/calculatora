
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

import MapTokenInput from './MapTokenInput';
import MapLoader from './MapLoader';
import MapLegend from './MapLegend';
import MapContainer from './MapContainer';
import { worldRegions } from './worldMapData';
import { WorldMapProps } from './worldMapTypes';

const WorldMap = ({ mapboxToken }: WorldMapProps) => {
  const [loading, setLoading] = useState(true);
  const [mapboxTokenInput, setMapboxTokenInput] = useState("");
  const [token, setToken] = useState(mapboxToken || "");
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  // Componente de input para token do Mapbox quando não fornecido como prop
  const renderTokenInput = () => {
    if (token) return null;
    
    return (
      <MapTokenInput 
        mapboxTokenInput={mapboxTokenInput}
        setMapboxTokenInput={setMapboxTokenInput}
        setToken={setToken}
      />
    );
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Mapa Mundial de Carbonum
        </CardTitle>
        <CardDescription>
          Explore o planeta Carbonum e suas regiões com diferentes níveis de emissão
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {renderTokenInput()}
        
        <div className="relative rounded-md overflow-hidden h-[400px]">
          {token && (
            <MapContainer 
              token={token}
              regions={worldRegions}
              onRegionHover={setActiveRegion}
              setLoading={setLoading}
            />
          )}
          
          {loading && <MapLoader />}
          
          <MapLegend regions={worldRegions} activeRegion={activeRegion} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldMap;
