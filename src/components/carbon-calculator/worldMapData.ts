
import { Region, RouteFeature } from './worldMapTypes';

// Dados fictícios de regiões e suas emissões
export const worldRegions: Region[] = [
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

// Rotas de conexão entre regiões
export const getRouteFeatures = (): RouteFeature[] => {
  return [
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
  ];
};
