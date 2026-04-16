'use client';

import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function OceanMap() {
  return (
    <Map
      initialViewState={{
        longitude: 127.5,
        latitude: 36.5,
        zoom: 5,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    />
  );
}
