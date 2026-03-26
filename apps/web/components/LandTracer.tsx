'use client';

import { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Marker, 
  useMapEvents,
  ImageOverlay,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Trash2, 
  Save, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Leaflet Fix for Next.js ────────────────────────────────────
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// ── Approx District Coordinates (Karnataka) ───────────────────
const DISTRICT_COORDS: Record<string, [number, number]> = {
  'Udupi': [13.3409, 74.7421],
  'Bangalore': [12.9716, 77.5946],
  'Mysore': [12.2958, 76.6394],
  'Dharwad': [15.4589, 75.0078],
  'Shimoga': [13.9299, 75.5681],
  'Mangalore': [12.9141, 74.8560],
};

function MapResizer({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
    setTimeout(() => map.invalidateSize(), 500);
  }, [center, map]);
  return null;
}

interface LandTracerProps {
  district: string;
  initialBoundary?: [number, number][];
  sketchUrl?: string;
  onSave: (boundary: [number, number][], center: [number, number]) => void;
  saving?: boolean;
  hideControls?: boolean;
}

export default function LandTracer({ district, initialBoundary, sketchUrl, onSave, saving, hideControls }: LandTracerProps) {
  const [points, setPoints] = useState<[number, number][]>(initialBoundary || []);
  const [opacity, setOpacity] = useState(0.5);
  const [showOverlay, setShowOverlay] = useState(!hideControls && !!sketchUrl);
  const [mode, setMode] = useState<'view' | 'draw'>(hideControls ? 'view' : 'view');

  const center: [number, number] = DISTRICT_COORDS[district] || [13.3409, 74.7421];

  // Overlay Bounds (Mocking 100m x 100m box around center for the sketch)
  const offset = 0.001; // Approx 100m
  const overlayBounds: L.LatLngBoundsExpression = [
    [center[0] - offset, center[1] - offset],
    [center[0] + offset, center[1] + offset],
  ];

  function DrawingLayer() {
    useMapEvents({
      click(e) {
        if (mode === 'draw') {
          setPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
        }
      },
    });
    return null;
  }

  function handleSave() {
    if (points.length < 3) {
      return toast.error('Minimal geometry required: Plot 3+ coordinates');
    }
    const centerLat = points.reduce((acc, p) => acc + p[0], 0) / points.length;
    const centerLng = points.reduce((acc, p) => acc + p[1], 0) / points.length;
    onSave(points, [centerLat, centerLng]);
  }

  return (
    <div className="flex flex-col h-full">
      {!hideControls && (
        <div className="flex items-center justify-between pb-2">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm relative z-20">
            <button 
              onClick={() => setMode('view')}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'view' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Spatial View
            </button>
            <button 
              onClick={() => setMode('draw')}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'draw' ? 'bg-[var(--accent)] text-white shadow-lg shadow-orange-900/10' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Digitize Boundary
            </button>
          </div>

          <div className="flex gap-4 relative z-20">
            {points.length > 0 && (
              <button 
                onClick={() => setPoints([])}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-red-400 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                title="Purge Geometry"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={handleSave}
              disabled={saving || points.length < 3}
              className={`bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 flex items-center gap-3 transition-all ${saving || points.length < 3 ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {saving ? 'Syncing...' : 'Finalize Polygon'}
              <Save className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden h-full border border-slate-100 bg-slate-50 shadow-2xl shadow-slate-200/40 group">
        <MapContainer 
          center={center} 
          zoom={18} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="grayscale contrast-[1.1] brightness-[0.95]"
          />
          
          <MapResizer center={center} />
          {!hideControls && <DrawingLayer />}

          {/* User Points - Only show if manual drawing enabled */}
          {!hideControls && points.map((p, i) => (
            <Marker key={i} position={p} />
          ))}

          {/* The Polygon */}
          {points.length > 2 && (
            <Polygon 
              positions={points} 
              pathOptions={{ 
                color: '#1A4D2E', 
                fillColor: '#1A4D2E33',
                weight: 4
              }} 
            />
          )}

          {/* Sketch Overlay for Tracing - Only show if not high-precision mode */}
          {!hideControls && showOverlay && sketchUrl && (
            <ImageOverlay
              url={sketchUrl}
              bounds={overlayBounds}
              opacity={opacity}
              zIndex={100}
            />
          )}
        </MapContainer>

        {/* Action Button for High-Precision Sync */}
        {hideControls && points.length > 0 && (
           <div className="absolute bottom-10 inset-x-0 z-[1000] flex justify-center">
             <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-brand-green text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-green/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
             >
                {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4" />}
                {saving ? 'Synchronizing State...' : 'Accept AI Extraction'}
             </button>
           </div>
        )}
      </div>
    </div>
  );
}
