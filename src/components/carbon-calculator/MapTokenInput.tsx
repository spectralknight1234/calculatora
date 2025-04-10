
import React from 'react';
import { Button } from "@/components/ui/button";

interface MapTokenInputProps {
  mapboxTokenInput: string;
  setMapboxTokenInput: (token: string) => void;
  setToken: (token: string) => void;
}

const MapTokenInput = ({ mapboxTokenInput, setMapboxTokenInput, setToken }: MapTokenInputProps) => {
  return (
    <div className="space-y-4 p-4 mb-4 border rounded-md bg-muted/20">
      <p className="text-sm font-medium">
        Para visualizar o mapa, você precisa fornecer um token público do Mapbox.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={mapboxTokenInput}
          onChange={(e) => setMapboxTokenInput(e.target.value)}
          placeholder="Cole seu token público do Mapbox aqui"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button 
          onClick={() => setToken(mapboxTokenInput)}
          disabled={!mapboxTokenInput}
        >
          Aplicar
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Visite <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a> para obter seu token gratuito.
      </p>
    </div>
  );
};

export default MapTokenInput;
