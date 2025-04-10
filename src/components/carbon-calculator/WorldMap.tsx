
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dados de exemplo de emissões de carbono por país
const carbonData = [
  { id: 'BRA', name: 'Brasil', emissions: 2.15 },
  { id: 'USA', name: 'Estados Unidos', emissions: 14.67 },
  { id: 'CHN', name: 'China', emissions: 7.62 },
  { id: 'IND', name: 'Índia', emissions: 1.92 },
  { id: 'RUS', name: 'Rússia', emissions: 11.12 },
  { id: 'DEU', name: 'Alemanha', emissions: 8.40 },
  { id: 'GBR', name: 'Reino Unido', emissions: 5.55 },
  { id: 'JPN', name: 'Japão', emissions: 9.13 },
  { id: 'CAN', name: 'Canadá', emissions: 15.32 },
  { id: 'AUS', name: 'Austrália', emissions: 16.75 },
  { id: 'MEX', name: 'México', emissions: 3.11 },
  { id: 'FRA', name: 'França', emissions: 4.51 },
  { id: 'ZAF', name: 'África do Sul', emissions: 7.51 },
  { id: 'ARG', name: 'Argentina', emissions: 3.83 },
  { id: 'ITA', name: 'Itália', emissions: 5.38 },
  { id: 'ESP', name: 'Espanha', emissions: 5.03 },
  { id: 'IDN', name: 'Indonésia', emissions: 2.05 },
  { id: 'TUR', name: 'Turquia', emissions: 4.66 },
  { id: 'SAU', name: 'Arábia Saudita', emissions: 16.85 },
  { id: 'NGA', name: 'Nigéria', emissions: 0.64 },
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
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 1.2,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      map.current.on('load', () => {
        setLoading(false);

        if (!map.current) return;

        // Adicionar fonte de dados dos países
        map.current.addSource('countries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        });

        // Adicionar camada dos países
        map.current.addLayer({
          id: 'countries-fill',
          type: 'fill',
          source: 'countries',
          'source-layer': 'country_boundaries',
          paint: {
            'fill-color': [
              'match',
              ['get', 'iso_3166_1'],
              ...carbonData.flatMap(country => [country.id, getColorForEmission(country.emissions)]),
              '#CCCCCC', // cor padrão para países sem dados
            ],
            'fill-opacity': 0.8,
          },
        });

        // Adicionar contornos dos países
        map.current.addLayer({
          id: 'countries-border',
          type: 'line',
          source: 'countries',
          'source-layer': 'country_boundaries',
          paint: {
            'line-color': '#FFFFFF',
            'line-width': 0.5,
          },
        });

        // Adicionar popups ao passar o mouse sobre os países
        map.current.on('mousemove', 'countries-fill', (e) => {
          if (!e.features || e.features.length === 0) return;
          
          const countryCode = e.features[0].properties?.iso_3166_1 || '';
          const countryData = carbonData.find(country => country.id === countryCode);
          
          if (countryData) {
            const popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'carbon-map-popup',
            })
              .setLngLat(e.lngLat)
              .setHTML(`
                <strong>${countryData.name}</strong><br/>
                Emissão: ${countryData.emissions.toFixed(2)} toneladas CO₂ per capita/ano
              `)
              .addTo(map.current);
              
            map.current.on('mouseleave', 'countries-fill', () => {
              popup.remove();
            });
          }
        });

        // Mudar o cursor ao passar sobre países
        map.current.on('mouseenter', 'countries-fill', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        
        map.current.on('mouseleave', 'countries-fill', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      });
    } catch (error) {
      console.error('Erro ao inicializar o mapa:', error);
      setLoading(false);
    }
  };

  // Função para definir a cor com base na emissão
  const getColorForEmission = (emission: number): string => {
    if (emission < 2) return '#8ABA6F'; // verde (baixa emissão)
    if (emission < 5) return '#94C973'; // verde claro
    if (emission < 8) return '#FFD166'; // amarelo
    if (emission < 12) return '#F8961E'; // laranja
    return '#F94144'; // vermelho (alta emissão)
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
          Mapa Global de Emissões de Carbono
        </CardTitle>
        <CardDescription>
          Visualize as emissões de carbono per capita por país
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
            <div className="text-xs font-medium mb-1">Emissões de CO₂ (ton per capita/ano)</div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#8ABA6F]"></div>
              <span className="text-xs">{'<'}2</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#94C973]"></div>
              <span className="text-xs">2-5</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#FFD166]"></div>
              <span className="text-xs">5-8</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#F8961E]"></div>
              <span className="text-xs">8-12</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#F94144]"></div>
              <span className="text-xs">{'>'}12</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldMap;
