// Keeping the interfaces for type reference, but they're no longer actively used
export interface Region {
  id: string;
  name: string;
  emissions: number;
  color: string;
  lat: number;
  lng: number;
}

export interface RouteFeature {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  properties: {
    color: string;
  };
}

export interface WorldMapProps {
  mapboxToken?: string;
}
