'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Navigation,
  CloudFog,
  AlertCircle,
  ChevronRight,
  History,
  Calendar,
  LocateFixed
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WEATHER_MAP: Record<number, { label: string; icon: any; color: string; bg: string }> = {
  0: { label: 'Clear Sky', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
  1: { label: 'Mainly Clear', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-50/50' },
  2: { label: 'Partly Cloudy', icon: Cloud, color: 'text-text-muted', bg: 'bg-slate-50' },
  3: { label: 'Overcast', icon: Cloud, color: 'text-text-muted', bg: 'bg-slate-100' },
  45: { label: 'Fog', icon: CloudFog, color: 'text-text-muted', bg: 'bg-slate-50' },
  48: { label: 'Foggy', icon: CloudFog, color: 'text-text-muted', bg: 'bg-slate-50' },
  51: { label: 'Light Drizzle', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-50' },
  53: { label: 'Moderate Drizzle', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
  55: { label: 'Dense Drizzle', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-100' },
  61: { label: 'Slight Rain', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-50' },
  63: { label: 'Moderate Rain', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
  65: { label: 'Heavy Rain', icon: CloudRain, color: 'text-blue-700', bg: 'bg-blue-100' },
  80: { label: 'Slight Showers', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-50' },
  81: { label: 'Moderate Showers', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
  82: { label: 'Violent Showers', icon: CloudRain, color: 'text-blue-700', bg: 'bg-blue-100' },
  95: { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-500', bg: 'bg-purple-50' },
  96: { label: 'Storm + Hail', icon: CloudLightning, color: 'text-purple-600', bg: 'bg-purple-100' },
  99: { label: 'Heavy Storm', icon: CloudLightning, color: 'text-purple-700', bg: 'bg-purple-100' },
};

export default function WeatherWidget({ weather, isLoading }: { weather: any; isLoading: boolean }) {
  const [view, setView] = useState<'forecast' | 'history'>('forecast');

  if (isLoading) {
    return <div className="bg-white rounded-[3rem] h-full p-8 border border-[#eae6de] animate-pulse shadow-sm min-h-[500px]" />;
  }

  // Handle Unmapped Land State
  if (weather && !weather.isMapped) {
    return (
      <div className="bg-white rounded-[3rem] p-12 flex flex-col items-center justify-center text-center gap-8 border border-brand-green/10 bg-brand-green/[0.02] min-h-[500px] relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
         <div className="w-20 h-20 rounded-[2rem] bg-brand-green/10 flex items-center justify-center text-brand-green shadow-sm relative z-10 animate-bounce">
            <LocateFixed className="w-10 h-10" />
         </div>
         <div className="relative z-10 space-y-3">
            <h4 className="text-sm font-black text-brand-green uppercase tracking-[0.25em] font-heading">Geospatial Sync Required</h4>
            <p className="text-text-muted text-sm font-medium leading-relaxed max-w-xs mx-auto">Precision weather requires exact farm coordinates. Map your land to unlock localized irrigation & sowing advisories.</p>
         </div>
         <Link 
            href="/dashboard/farmer/land"
            className="relative z-10 text-[10px] font-black uppercase tracking-[0.25em] text-white bg-brand-green px-10 py-4 rounded-2xl hover:bg-brand-green-hover transition-all shadow-xl shadow-brand-green/20 active:scale-95 flex items-center gap-3"
         >
            Map Your Land <ChevronRight className="w-4 h-4" />
         </Link>
      </div>
    );
  }

  if (!weather || !weather.current) {
    return (
      <div className="bg-white rounded-[3rem] p-12 flex flex-col items-center justify-center text-center gap-6 border border-orange-100 bg-orange-50/20 min-h-[500px] relative overflow-hidden group">
         <div className="w-16 h-16 rounded-[1.5rem] bg-orange-100 flex items-center justify-center text-brand-orange shadow-sm relative z-10">
            <AlertCircle className="w-8 h-8" />
         </div>
         <h4 className="text-sm font-black text-orange-950 uppercase tracking-[0.2em] font-heading">STATION OFFLINE</h4>
         <p className="text-orange-900/60 text-xs font-medium max-w-xs">Connecting to satellite grid...</p>
      </div>
    );
  }

  const current = weather.current;
  const config = WEATHER_MAP[current.weather_code] || { label: 'Cloudy', icon: Cloud, color: 'text-text-muted', bg: 'bg-slate-50' };
  const daily = weather.forecast || { time: [], temperature_2m_max: [], temperature_2m_min: [], weather_code: [] };
  const history = weather.history || { time: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_sum: [] };

  return (
    <div className="bg-white rounded-[2.5rem] border border-[#eae6de] shadow-sm overflow-hidden flex flex-col h-full group hover:shadow-2xl hover:shadow-slate-200/50 transition-all font-body relative">
      <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-green" />
      
      {/* Current State Area */}
      <div className={`p-10 pb-8 ${config.bg} relative overflow-hidden transition-colors duration-500`}>
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -translate-y-24 translate-x-24" />
         
         <div className="flex items-start justify-between relative z-10">
            <div>
               <div className="flex items-center gap-2.5 mb-2.5 px-3 py-1.5 rounded-full bg-white/80 border border-white/50 backdrop-blur-md w-fit shadow-sm">
                  <Navigation className="w-3.5 h-3.5 text-brand-green" />
                  <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">{weather.location || 'Local Hub'}</span>
               </div>
               <h3 className="text-text-dark font-serif font-bold text-5xl flex items-baseline font-heading tracking-tighter mt-4">
                  {Math.round(current.temperature_2m)}
                  <span className="text-2xl font-bold text-text-muted ml-1">°C</span>
               </h3>
               <div className={`text-xs font-black mt-3 ${config.color} uppercase tracking-[0.25em] flex items-center gap-2`}>
                  <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
                  {config.label}
               </div>
            </div>
            <div className={`w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center ${config.color} transform group-hover:rotate-12 transition-transform duration-500`}>
               <config.icon className="w-10 h-10" />
            </div>
         </div>

         {/* Soil & Air Metrics */}
         <div className="grid grid-cols-3 gap-4 mt-12 relative z-10">
            <div className="bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm backdrop-blur-sm hover:translate-y-[-4px] transition-transform">
               <Droplets className="w-4 h-4 text-blue-500 mb-2.5" />
               <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-1">Humidity</p>
               <p className="text-base font-black text-slate-900">{current.relative_humidity_2m}%</p>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm backdrop-blur-sm hover:translate-y-[-4px] transition-transform">
               <Wind className="w-4 h-4 text-brand-green mb-2.5" />
               <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-1">Wind</p>
               <p className="text-base font-black text-slate-900">{Math.round(current.wind_speed_10m)}<span className="text-[10px] ml-0.5">km/h</span></p>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm backdrop-blur-sm hover:translate-y-[-4px] transition-transform">
               <CloudRain className={`w-4 h-4 ${current.precipitation > 0 ? 'text-blue-500' : 'text-slate-300'} mb-2.5`} />
               <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-1">Precip</p>
               <p className="text-base font-black text-slate-900">{current.precipitation}<span className="text-[10px] ml-0.5">mm</span></p>
            </div>
         </div>
      </div>

      {/* View Toggle */}
      <div className="px-10 pt-8 flex gap-2">
         <button 
            onClick={() => setView('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${view === 'history' ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'bg-[#f8f7f4] text-text-muted hover:bg-slate-100'}`}
         >
            <History className="w-3.5 h-3.5" /> Past Week
         </button>
         <button 
            onClick={() => setView('forecast')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${view === 'forecast' ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'bg-[#f8f7f4] text-text-muted hover:bg-slate-100'}`}
         >
            <Calendar className="w-3.5 h-3.5" /> Forecast
         </button>
      </div>

      {/* List Area */}
      <div className="flex-1 p-10 pt-6 space-y-6 font-body bg-white relative">
         <AnimatePresence mode="wait">
            <motion.div 
               key={view}
               initial={{ opacity: 0, x: view === 'forecast' ? 20 : -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: view === 'forecast' ? -20 : 20 }}
               className="space-y-4"
            >
               {(view === 'forecast' ? daily : history).time.slice(0, 7).map((time: string, i: number) => {
                  const weatherCode = view === 'forecast' ? (daily.weather_code?.[i] || 0) : 0;
                  const dayConfig = WEATHER_MAP[weatherCode || 0] || { icon: Cloud, color: view === 'history' ? 'text-slate-400' : 'text-text-muted' };
                  const date = new Date(time);
                  const isToday = new Date().toDateString() === date.toDateString();
                  const dayLabel = isToday ? 'TODAY' : date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                  
                  const targetDaily = view === 'forecast' ? daily : history;

                  return (
                    <div key={time} className={`flex items-center justify-between text-xs py-1.5 ${isToday ? 'bg-brand-green/[0.03] -mx-4 px-4 rounded-lg' : ''}`}>
                       <span className={`w-20 font-black tracking-widest text-[10px] ${isToday ? 'text-brand-green' : 'text-text-muted'}`}>{dayLabel}</span>
                       <dayConfig.icon className={`w-4 h-4 ${dayConfig.color}`} />
                       <div className="flex items-center gap-4 w-28 justify-end text-right">
                          <span className="text-text-dark font-serif font-bold text-sm min-w-[32px]">{Math.round(targetDaily.temperature_2m_max[i] || 0)}°</span>
                          <span className="text-text-muted font-bold min-w-[32px]">{Math.round(targetDaily.temperature_2m_min[i] || 0)}°</span>
                          <div className="w-12 text-[9px] font-black text-blue-500 uppercase tracking-tighter">
                             {targetDaily.precipitation_sum?.[i] > 0 ? `${targetDaily.precipitation_sum[i]}mm` : 'Dry'}
                          </div>
                       </div>
                    </div>
                  );
               })}
            </motion.div>
         </AnimatePresence>
         
         <div className="mt-8 pt-6 border-t border-[#f8f7f4]">
            <Link href="/dashboard/farmer/weather" className="w-full py-4 bg-[#f8f7f4] text-brand-green text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.25rem] hover:bg-brand-green hover:text-white transition-all flex items-center justify-center gap-3">
               Full Climate Analysis <ChevronRight className="w-4 h-4" />
            </Link>
         </div>
      </div>
    </div>
  );
}
