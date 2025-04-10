
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dados fictícios de regiões e suas emissões
const worldRegions = [
  { id: 'NOR', name: 'Norália', emissions: 14.67, color: '#8B5CF6', lat: 65, lng: -30 },
  { id: 'AQU', name: 'Aquatera', emissions: 3.21, color: '#0EA5E9', lat: 10, lng: 0 },
  { id: 'VER', name: 'Verdélia', emissions: 1.92, color: '#8ABA6F', lat: -20, lng: 20 },
  { id: 'PYR', name: 'Pyronia', emissions: 11.12, color: '#F97316', lat: 50, lng: 60 },
  { id: 'CRY', name: 'Crystalia', emissions: 8.40, color: '#D946EF', lat: 30, lng: 100 },
  { id: 'SOL', name: 'Solara', emissions: 5.55, color: '#FEC6A1', lat: -40, lng: 140 },
  { id: 'ARG', name: 'Argentum', emissions: 9.13, color: '#C8C8C9', lat: 65, lng: 170 },
  { id: 'BOT', name: 'Botânica', emissions: 2.15, color: '#94C973', lat: 0, lng: -60 },
  { id: 'FRO', name: 'Frostland', emissions: 7.51, color: '#D3E4FD', lat: -70, lng: -120 },
  { id: 'TER', name: 'Terra Central', emissions: 5.03, color: '#9F9EA1', lat: 0, lng: 85 },
];

// Interface para o token do Mapbox
interface WorldMapProps {
  mapboxToken?: string;
}

const WorldMap = ({ mapboxToken }: WorldMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxTokenInput, setMapboxTokenInput] = useState("");
  const [token, setToken] = useState(mapboxToken || "");
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const initializeMap = (accessToken: string) => {
    if (!mapContainer.current) return;
    setLoading(true);
    
    try {
      mapboxgl.accessToken = accessToken;
      
      if (map.current) {
        map.current.remove();
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [0, 20],
        zoom: 1.5,
        projection: 'globe',
      });

      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      map.current.on('load', () => {
        setLoading(false);

        if (!map.current) return;

        // Configurar efeitos do globo
        map.current.setFog({
          color: 'rgb(23, 22, 25)',
          'high-color': 'rgb(44, 42, 60)',
          'horizon-blend': 0.4,
          'space-color': 'rgb(11, 11, 15)',
          'star-intensity': 0.8
        });

        // Adicionar regiões fictícias como marcadores
        worldRegions.forEach(region => {
          // Criar um elemento DOM para o marcador personalizado
          const el = document.createElement('div');
          el.className = 'region-marker';
          el.style.backgroundColor = region.color;
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid white';
          el.style.cursor = 'pointer';
          el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
          
          // Adicionar o marcador ao mapa
          const marker = new mapboxgl.Marker(el)
            .setLngLat([region.lng, region.lat])
            .addTo(map.current!);
          
          // Adicionar popup com informações da região
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: true,
            className: 'carbon-map-popup',
            offset: 25
          }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-lg">${region.name}</h3>
              <p class="text-sm mt-1">ID: ${region.id}</p>
              <p class="text-sm">Emissão: ${region.emissions.toFixed(2)} toneladas CO₂ per capita/ano</p>
            </div>
          `);
          
          // Adicionar eventos ao marcador
          el.addEventListener('mouseenter', () => {
            marker.setPopup(popup);
            popup.addTo(map.current!);
            setActiveRegion(region.id);
          });
          
          el.addEventListener('mouseleave', () => {
            setTimeout(() => {
              if (popup.isOpen()) popup.remove();
              setActiveRegion(null);
            }, 300);
          });
        });

        // Adicionar linhas conectando regiões
        map.current.addSource('routes', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [worldRegions[0].lng, worldRegions[0].lat],
                    [worldRegions[1].lng, worldRegions[1].lat]
                  ]
                },
                properties: { color: '#9b87f5' }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [worldRegions[1].lng, worldRegions[1].lat],
                    [worldRegions[2].lng, worldRegions[2].lat]
                  ]
                },
                properties: { color: '#8ABA6F' }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [worldRegions[2].lng, worldRegions[2].lat],
                    [worldRegions[4].lng, worldRegions[4].lat]
                  ]
                },
                properties: { color: '#D946EF' }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [worldRegions[3].lng, worldRegions[3].lat],
                    [worldRegions[4].lng, worldRegions[4].lat]
                  ]
                },
                properties: { color: '#F97316' }
              },
            ]
          }
        });
        
        map.current.addLayer({
          id: 'routes',
          type: 'line',
          source: 'routes',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 2,
            'line-opacity': 0.7,
            'line-dasharray': [2, 1]
          }
        });

        // Adicionar efeito de rotação automática
        const secondsPerRevolution = 180;
        let userInteracting = false;
        let spinEnabled = true;

        function spinGlobe() {
          if (!map.current || userInteracting || !spinEnabled) return;
          
          const distancePerSecond = 360 / secondsPerRevolution;
          const center = map.current.getCenter();
          center.lng -= distancePerSecond / 60;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
          
          setTimeout(spinGlobe, 1000);
        }

        map.current.on('mousedown', () => {
          userInteracting = true;
        });
        
        map.current.on('mouseup', () => {
          userInteracting = false;
          setTimeout(spinGlobe, 3000);
        });
        
        map.current.on('touchstart', () => {
          userInteracting = true;
        });
        
        map.current.on('touchend', () => {
          userInteracting = false;
          setTimeout(spinGlobe, 3000);
        });

        spinGlobe();
      });
    } catch (error) {
      console.error('Erro ao inicializar o mapa:', error);
      setLoading(false);
    }
  };

  // Inicializar mapa quando o token estiver disponível
  useEffect(() => {
    if (token) {
      initializeMap(token);
    }
  }, [token]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Componente de input para token do Mapbox quando não fornecido como prop
  const renderTokenInput = () => {
    if (token) return null;
    
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
          <div ref={mapContainer} className="absolute inset-0" />
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando mapa...</span>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 z-10 bg-background/90 p-3 rounded-md shadow-md">
            <div className="text-xs font-medium mb-1">Regiões de Carbonum</div>
            {worldRegions.map((region) => (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldMap;
