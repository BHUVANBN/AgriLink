'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + Next.js
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

interface FarmerLand {
  userId: string;
  nameDisplay: string;
  village: string;
  surveyNumber: string;
  landBoundary: any; // Expected to be [lat, lng][]
  centerLat: number;
  centerLng: number;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
}

export default function GlobalDiscoveryMap({ currentUserId, allLands }: { currentUserId?: string, allLands: FarmerLand[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-3xl">
      <span className="text-slate-400 font-medium">Initializing GIS Engine...</span>
    </div>
  );

  // Find current user's land to center map
  const myLand = allLands.find(l => l.userId === currentUserId);
  const initialCenter: [number, number] = myLand?.centerLat ? [myLand.centerLat, myLand.centerLng] : [15.4589, 75.0078];

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner border border-[#eae6de]">
      <MapContainer 
        center={initialCenter} 
        zoom={16} 
        style={{ height: '100%', width: '100%', background: '#f8f7f4' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='© Esri World Imagery'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <MapUpdater center={initialCenter} />

        {allLands.map((land, idx) => {
          const isMe = land.userId === currentUserId;
          const points = Array.isArray(land.landBoundary) ? land.landBoundary : [];
          
          if (points.length < 3) return null;

          return (
            <Polygon
              key={land.userId || idx}
              positions={points}
              pathOptions={{
                color: isMe ? '#10b981' : '#ffffff', // Green for ME, White for OTHERS
                fillColor: isMe ? '#10b981' : 'transparent',
                fillOpacity: isMe ? 0.35 : 0,
                weight: isMe ? 3 : 1.5,
                dashArray: ''
              }}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-slate-900">{isMe ? 'Your Land' : (land.nameDisplay || 'Neighbor')}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Survey: {land.surveyNumber}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Village: {land.village}</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
}
