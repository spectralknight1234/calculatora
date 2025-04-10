
import React from 'react';
import { Loader2 } from "lucide-react";

const MapLoader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Carregando mapa...</span>
    </div>
  );
};

export default MapLoader;
