'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Contoh batas wilayah simulasi (Polygon)
// TODO: Ganti dengan data koordinat asli (GeoJSON) batas wilayah Desa/Kodim
const KODIM_BOUNDARY: [number, number][] = [
  [-3.550, 119.750],
  [-3.590, 119.750],
  [-3.590, 119.800],
  [-3.550, 119.800],
];

type MapProps = {
  reports: any[];
  selectedReport?: any;
};

function MapController({ selectedReport, defaultCenter }: { selectedReport: any, defaultCenter: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (selectedReport?.lat && selectedReport?.lng) {
      map.flyTo([selectedReport.lat, selectedReport.lng], 16, { animate: true, duration: 1.2 });
    } else {
      map.flyTo(defaultCenter, 11, { animate: true, duration: 1.2 });
    }
  }, [selectedReport, map, defaultCenter]);
  return null;
}

export default function Map({ reports, selectedReport }: MapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />;

  const defaultCenter: [number, number] = reports.length > 0 && reports[0].lat && reports[0].lng
    ? [reports[0].lat, reports[0].lng]
    : [-3.5750, 119.7750]; // Default Enrekang

  const center: [number, number] = selectedReport?.lat && selectedReport?.lng
    ? [selectedReport.lat, selectedReport.lng]
    : defaultCenter;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-gray-200 z-0 relative">
      <MapContainer center={center} zoom={11} scrollWheelZoom={true} className="h-full w-full" zoomControl={true}>
        <MapController selectedReport={selectedReport} defaultCenter={defaultCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={20}
        />
        {/* Batas Wilayah Poligon */}
        <Polygon pathOptions={{ color: '#15803d', weight: 2, fillOpacity: 0.1 }} positions={KODIM_BOUNDARY} />
        
        {reports.map((report) => {
          if (!report.lat || !report.lng) return null;
          return (
            <Marker key={report.id} position={[report.lat, report.lng]} icon={customIcon}>
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-semibold text-sm text-gray-800 mb-0.5">{report.category}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{report.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
