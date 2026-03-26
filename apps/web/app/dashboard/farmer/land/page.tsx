'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map as MapIcon,
  Upload,
  ShieldCheck,
  Loader2,
  Info,
  Navigation
} from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import FarmerSidebar from '@/components/FarmerSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function LandMappingPage() {
  const { isLoading: authLoading } = useRequireAuth('farmer');
  const { data: profile, mutate } = useSWR(`${API}/farmer/profile`, fetcher);

  const [uploading, setUploading] = useState(false);
  const [mappingResult, setMappingResult] = useState<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to map on successful extraction
  useEffect(() => {
    if (mappingResult && mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [mappingResult]);

  // Persist hydration from profile ONLY if an actual sketch exists
  useEffect(() => {
    if (profile?.rtcDataJson && !mappingResult && profile?.surveyNumber && profile?.landSketchUrl) {
      setMappingResult({
        success: true,
        surveyNumber: profile.surveyNumber,
        area_sq_mtrs: profile.totalExtentAcres * 4046.86,
        center: profile.landBoundary?.[0] ? { lat: profile.centerLat, lng: profile.centerLng } : null,
        boundary: profile.landBoundary || [],
        map_path: `map_survey_${profile.surveyNumber.replace(/[\/\*]/g, '_')}.html`
      });
    }
  }, [profile, mappingResult]);

  if (authLoading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
    </div>
  );

  async function handleSketchUpload(file: File) {
    setUploading(true);
    setMappingResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API}/farmer/documents/sketch`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Mapping failed');

      const extraction = json.data?.extracted;
      if (extraction?.success) {
        setMappingResult(extraction);
        toast.success('Land boundary synchronized!');
      } else {
        toast.error('AI could not stabilize boundary.');
      }

      mutate();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <FarmerSidebar pageTitle="AgriLink GI" />

      <main className="lg:ml-72 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-green rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-green/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">Verified Intelligence</h1>
                <p className="text-xs text-slate-500 mt-1.5 font-medium italic">Geospatial boundary is synchronized with official records.</p>
              </div>
            </div>
            {!uploading && (
              <label className="bg-brand-green text-white px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-brand-green-dark transition-all flex items-center gap-2 shadow-sm">
                <Upload className="w-3.5 h-3.5" /> Upload Sketch
                <input type="file" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleSketchUpload(file);
                }} />
              </label>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6 h-[720px]">
            {/* Sidebar: Data Summary */}
            <div className="w-full lg:w-80 space-y-6 flex flex-col">
              {uploading ? (
                <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center animate-pulse">
                  <div className="w-16 h-16 bg-brand-green/5 rounded-3xl flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-green">Extracting Nodes...</p>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-y-auto flex flex-col">
                  <div className="flex items-center gap-2 text-brand-green font-black text-[10px] uppercase mb-6">
                    <ShieldCheck className="w-4 h-4" /> Extraction Report
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Survey Number</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{mappingResult?.surveyNumber || 'Pending Upload'}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Navigation className="w-3 h-3 text-brand-green" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Geo-Coordinates</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="bg-white/50 p-2.5 rounded-xl border border-slate-100/50">
                          <p className="text-[8px] text-slate-400 font-bold uppercase">Latitude</p>
                          <p className="text-[11px] font-mono font-bold text-slate-700">{mappingResult?.center?.lat?.toFixed(6) || '0.000000'}</p>
                        </div>
                        <div className="bg-white/50 p-2.5 rounded-xl border border-slate-100/50">
                          <p className="text-[8px] text-slate-400 font-bold uppercase">Longitude</p>
                          <p className="text-[11px] font-mono font-bold text-slate-700">{mappingResult?.center?.lng?.toFixed(6) || '0.000000'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Calculated Area</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {mappingResult ? `${(mappingResult.area_sq_mtrs / 4046.86).toFixed(3)} Acres` : '--- Ac'}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Precision Nodes</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{mappingResult?.boundary?.length || 0} Points</p>
                    </div>
                  </div>

                  {!mappingResult && (
                    <div className="mt-8">
                      <p className="text-[9px] text-slate-400 font-bold text-center mb-4 uppercase tracking-[0.1em]">Awaiting survey ingestion</p>
                      <label className="w-full bg-brand-green text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:bg-brand-green-dark transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-green/20">
                        Upload Survey
                        <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleSketchUpload(e.target.files[0])} />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Main Map Container */}
            <div ref={mapContainerRef} className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <iframe
                className="w-full h-full border-0"
                srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
                      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                      <style>
                        * { margin:0; padding:0; box-sizing:border-box; }
                        body { font-family: sans-serif; display:flex; flex-direction:column; height:100vh; background:#0f172a; overflow:hidden; }
                        #header { padding: 10px 18px; background: #1a1a2e; color: #fff; display: flex; align-items: center; justify-content: space-between; border-bottom:1px solid #10b98133; }
                        #header h1 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #10b981; }
                        #controls { padding: 8px 18px; background: #f8f8f8; border-bottom: 1px solid #ddd; display: flex; gap: 8px; align-items: center; }
                        .btn { padding: 4px 12px; border: 1px solid #ccc; border-radius: 6px; background: #fff; cursor: pointer; font-size: 11px; font-weight: 600; }
                        .btn.active { background:#10b981; color:#fff; border-color:#10b981; }
                        #map { flex:1; }
                        .overlay {
                          position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
                          background:rgba(255,255,255,0.95); padding:15px 25px; border-radius:20px;
                          box-shadow:0 20px 50px rgba(0,0,0,0.3); z-index:1000;
                          font-size:10px; font-weight:900; color:#1e293b; text-transform:uppercase; letter-spacing:0.2em;
                          border: 1px solid #10b981;
                        }
                        .stat-lbl { font-size:9px; color:#64748b; text-transform:uppercase; font-weight:700; }
                        .stat-val { font-size:12px; font-weight:700; color:#fff; }
                      </style>
                    </head>
                    <body>
                      <div id="header">
                        <div>
                          <h1>${mappingResult?.surveyNumber ? 'Survey No. ' + mappingResult.surveyNumber : 'AgriLink Geospatial'}</h1>
                          <div style="font-size:9px; color:#64748b;">${mappingResult?.center ? mappingResult.center.lat.toFixed(5) + '°N, ' + mappingResult.center.lng.toFixed(5) + '°E' : 'v2.0.4-stable'}</div>
                        </div>
                        ${mappingResult ? `
                        <div style="display:flex; gap:15px; text-align:right;">
                          <div><div class="stat-lbl">Area</div><div class="stat-val">${(mappingResult.area_sq_mtrs / 4046.86).toFixed(3)} Ac</div></div>
                          <div><div class="stat-lbl">Nodes</div><div class="stat-val">${mappingResult.boundary?.length || 0}</div></div>
                        </div>
                        ` : ''}
                      </div>

                      <div id="controls">
                        <button class="btn" onclick="location.reload()">Reset View</button>
                        <button class="btn active">Satellite</button>
                      </div>

                      ${!mappingResult ? '<div class="overlay">Awaiting Survey Synchronization</div>' : ''}
                      
                      <div id="map"></div>

                      <script>
                        const CENTER = ${mappingResult?.center ? `[${mappingResult.center.lat}, ${mappingResult.center.lng}]` : '[15.3173, 75.7139]'};
                        const map = L.map('map', { zoomControl:false }).setView(CENTER, ${mappingResult ? 18 : 7});
                        
                        const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                          attribution: '© Esri', maxZoom: 17
                        }).addTo(map);

                        ${mappingResult?.boundary ? `
                          const polygon = L.polygon(${JSON.stringify(mappingResult.boundary.map((v: any) => [v.lat, v.lng]))}, {
                            color: '#10b981', weight: 3, fillColor: '#10b981', fillOpacity: 0.2
                          }).addTo(map);
                          map.fitBounds(polygon.getBounds(), { padding: [20, 20] });
                        ` : ''}
                      </script>
                    </body>
                    </html>
                  `}
                title="AgriLink GI Map"
                key={mappingResult?.surveyNumber || 'skeleton'}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
