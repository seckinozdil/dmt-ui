// src/components/map/MapView.jsx
import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { ScatterplotLayer } from '@deck.gl/layers';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapView = ({ kpiData = [], machineData = [] }) => {
  const INITIAL_VIEW_STATE = {
    longitude: 32.8,
    latitude: 39.9,
    zoom: 6,
    pitch: 0,
    bearing: 0,
  };

  const kpiLayer = useMemo(() => (
    new ScatterplotLayer({
      id: 'kpi-layer',
      data: kpiData,
      pickable: true,
      getPosition: d => [d.longitude, d.latitude],
      getFillColor: [0, 102, 255, 180],
      getRadius: 300,
      radiusMinPixels: 2,
      radiusMaxPixels: 10,
      onHover: ({ object, x, y }) => {
        const tooltip = document.getElementById('tooltip');
        if (object) {
          tooltip.style.display = 'block';
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
          tooltip.innerHTML = `Route: ${object.routeName}`;
        } else {
          tooltip.style.display = 'none';
        }
      }
    })
  ), [kpiData]);

  const machineLayer = useMemo(() => (
    new ScatterplotLayer({
      id: 'machine-layer',
      data: machineData,
      pickable: true,
      getPosition: d => [d.longitude, d.latitude],
      getFillColor: [255, 0, 0, 180],
      getRadius: 500,
      radiusMinPixels: 2,
      radiusMaxPixels: 12,
      onHover: ({ object, x, y }) => {
        const tooltip = document.getElementById('tooltip');
        if (object) {
          tooltip.style.display = 'block';
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
          tooltip.innerHTML = `Azimuth: ${object.azimuth}`;
        } else {
          tooltip.style.display = 'none';
        }
      }
    })
  ), [machineData]);

  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[kpiLayer, machineLayer]}
        // style={{ height: '100%', zIndex: '-10' }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <Map 
          // mapStyle="https://api.maptiler.com/maps/openstreetmap/style.json?key=U0Eaz69aCUSCWa10OFX1#7.2/40.23310/30.93177"
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          // mapStyle="https://demotiles.maplibre.org/style.json"
          // mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        />
      </DeckGL>

      <div
        id="tooltip"
        style={{
          position: 'absolute',
          background: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          pointerEvents: 'none',
          fontSize: '12px',
          display: 'none',
          zIndex: 10,
        }}
      />
    </>
  );
};

export default MapView;
