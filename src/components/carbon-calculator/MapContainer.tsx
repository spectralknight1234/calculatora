
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Region } from './worldMapTypes';
import { getRouteFeatures } from './worldMapData';

interface MapContainerProps {
  token: string;
  regions: Region[];
  onRegionHover: (regionId: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const MapContainer = ({ token, regions, onRegionHover, setLoading }: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !token) return;
    
    setLoading(true);
    
    try {
      mapboxgl.accessToken = token;
      
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
        regions.forEach(region => {
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
            onRegionHover(region.id);
          });
          
          el.addEventListener('mouseleave', () => {
            setTimeout(() => {
              if (popup.isOpen()) popup.remove();
              onRegionHover(null);
            }, 300);
          });
        });

        // Adicionar linhas conectando regiões
        map.current.addSource('routes', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: getRouteFeatures()
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

        setupGlobeRotation();
      });
    } catch (error) {
      console.error('Erro ao inicializar o mapa:', error);
      setLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [token, regions, onRegionHover, setLoading]);

  // Configurar rotação automática do globo
  const setupGlobeRotation = () => {
    if (!map.current) return;
    
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
  };

  return <div ref={mapContainer} className="absolute inset-0" />;
};

export default MapContainer;
