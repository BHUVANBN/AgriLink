'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { Cloud, Droplets, Wind, Thermometer, Sprout, SprayCan, AlertTriangle, MapPin, Info } from 'lucide-react';
import FarmerSidebar from '@/components/FarmerSidebar';
import { WEATHER_MAP } from '@/components/WeatherWidget';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json()).then((d) => d.data);

interface Day {
  date: string;
  code: number;
  max: number;
  min: number;
  rain: number;
  rainChance?: number;
  wind?: number;
  et0?: number;
}

function toDays(daily: any): Day[] {
  if (!daily?.time?.length) return [];
  return daily.time.map((date: string, i: number) => ({
    date,
    code: daily.weather_code?.[i] ?? 0,
    max: daily.temperature_2m_max?.[i],
    min: daily.temperature_2m_min?.[i],
    rain: daily.precipitation_sum?.[i] ?? 0,
    rainChance: daily.precipitation_probability_max?.[i],
    wind: daily.wind_speed_10m_max?.[i],
    et0: daily.et0_fao_evapotranspiration?.[i],
  }));
}

/** Simple, transparent rule-of-thumb advice from the forecast. */
function advisories(days: Day[]) {
  const out: { icon: any; tone: string; title: string; text: string }[] = [];
  const next3 = days.slice(0, 3);
  if (!next3.length) return out;

  const sprayDay = days.find((d) => (d.rainChance ?? 0) < 30 && (d.wind ?? 0) < 15);
  const wetSoon = next3.filter((d) => (d.rainChance ?? 0) >= 60 || d.rain >= 5);
  if (wetSoon.length) {
    out.push({
      icon: SprayCan,
      tone: 'amber',
      title: 'Hold off on spraying',
      text: `Rain is likely ${wetSoon.map((d) => weekday(d.date)).join(', ')}. Pesticide and foliar fertiliser may wash off.${sprayDay ? ` Better window: ${weekday(sprayDay.date)}.` : ''}`,
    });
  } else if (sprayDay) {
    out.push({ icon: SprayCan, tone: 'green', title: 'Good spraying window', text: `${weekday(sprayDay.date)} looks dry with light wind.` });
  }

  const week = days.slice(0, 7);
  const et0 = week.reduce((s, d) => s + (d.et0 ?? 0), 0);
  const rain = week.reduce((s, d) => s + d.rain, 0);
  if (et0 > 0) {
    const deficit = et0 - rain;
    out.push({
      icon: Sprout,
      tone: deficit > 15 ? 'amber' : 'green',
      title: deficit > 15 ? 'Plan irrigation this week' : 'Rain should cover crop water needs',
      text: `Expected crop water loss ≈ ${et0.toFixed(0)} mm vs ≈ ${rain.toFixed(0)} mm rain over the next 7 days.`,
    });
  }

  const hot = week.filter((d) => d.max >= 38);
  if (hot.length) {
    out.push({
      icon: Thermometer,
      tone: 'red',
      title: 'Heat stress risk',
      text: `Up to ${Math.max(...hot.map((d) => d.max)).toFixed(0)}°C on ${hot.map((d) => weekday(d.date)).join(', ')}. Irrigate early morning or evening and protect livestock.`,
    });
  }

  const storm = week.find((d) => d.code >= 95);
  if (storm) {
    out.push({ icon: AlertTriangle, tone: 'red', title: 'Thunderstorm expected', text: `${weekday(storm.date)}: secure harvested produce and avoid open fields.` });
  }
  return out;
}

function weekday(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
}

const TONES: Record<string, string> = {
  green: 'bg-brand-green/5 border-brand-green/20 text-brand-green',
  amber: 'bg-amber-50 border-amber-200 text-amber-700',
  red: 'bg-red-50 border-red-200 text-red-700',
};

export default function WeatherPage() {
  const { isLoading: authLoading } = useRequireAuth('farmer');
  const { data, isLoading } = useSWR(`${API}/farmer/weather`, fetcher);

  const forecast = toDays(data?.forecast);
  const history = toDays(data?.history);
  const current = data?.current;
  const now = WEATHER_MAP[current?.weather_code ?? 0] ?? WEATHER_MAP[0];
  const advice = advisories(forecast);

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <FarmerSidebar pageTitle="Weather" />
      <main className="lg:ml-72 p-6 lg:p-8 space-y-8 max-w-6xl">
        {(authLoading || isLoading) ? (
          <div className="h-64 rounded-[2rem] bg-white border border-[#eae6de] animate-pulse" />
        ) : (
          <>
            {!data?.isMapped && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex gap-3 items-center">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>
                  Showing weather for a default Karnataka location.{' '}
                  <Link href="/dashboard/farmer/land" className="font-bold underline">Map your land</Link> for a forecast at your farm.
                </span>
              </div>
            )}
            {data && data.live === false && (
              <div className="p-4 rounded-2xl bg-slate-100 text-slate-700 text-sm flex gap-3 items-center">
                <Info className="w-4 h-4 shrink-0" /> Live weather is temporarily unavailable. Please try again shortly.
              </div>
            )}

            {/* Now */}
            <section className="bg-white rounded-[2rem] border border-[#eae6de] p-8 grid md:grid-cols-2 gap-8 items-center">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${now.bg}`}>
                  <now.icon className={`w-10 h-10 ${now.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {data?.location}
                  </p>
                  <p className="text-5xl font-bold text-text-dark">{Math.round(current?.temperature_2m ?? 0)}°C</p>
                  <p className="text-text-muted">{now.label}{current?.apparent_temperature != null ? ` · feels like ${Math.round(current.apparent_temperature)}°C` : ''}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Droplets, label: 'Humidity', value: `${current?.relative_humidity_2m ?? '–'}%` },
                  { icon: Wind, label: 'Wind', value: current?.wind_speed_10m != null ? `${Math.round(current.wind_speed_10m)} km/h` : '–' },
                  { icon: Cloud, label: 'Rain now', value: current?.precipitation != null ? `${current.precipitation} mm` : '–' },
                ].map((m) => (
                  <div key={m.label} className="bg-[#f8f7f4] rounded-2xl p-4 text-center">
                    <m.icon className="w-5 h-5 mx-auto text-brand-green mb-2" />
                    <p className="text-lg font-bold text-text-dark">{m.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-text-muted">{m.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Advice */}
            {advice.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xl font-serif font-bold text-text-dark">Farm advice</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {advice.map((a) => (
                    <div key={a.title} className={`rounded-2xl border p-5 flex gap-4 ${TONES[a.tone]}`}>
                      <a.icon className="w-6 h-6 shrink-0" />
                      <div>
                        <p className="font-bold">{a.title}</p>
                        <p className="text-sm opacity-90">{a.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-muted">Guidance only, based on the Open-Meteo forecast for your location.</p>
              </section>
            )}

            {/* 7-day forecast */}
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-text-dark">Next 7 days</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {forecast.slice(0, 7).map((d) => {
                  const w = WEATHER_MAP[d.code] ?? WEATHER_MAP[0];
                  return (
                    <div key={d.date} className="bg-white border border-[#eae6de] rounded-2xl p-4 text-center space-y-2">
                      <p className="text-xs font-bold text-text-muted">{weekday(d.date)}</p>
                      <w.icon className={`w-7 h-7 mx-auto ${w.color}`} aria-label={w.label} />
                      <p className="font-bold text-text-dark">{Math.round(d.max)}° <span className="text-text-muted font-normal">{Math.round(d.min)}°</span></p>
                      <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3" /> {d.rainChance != null ? `${d.rainChance}%` : `${d.rain} mm`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Past week */}
            {history.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xl font-serif font-bold text-text-dark">Past 7 days</h2>
                <div className="bg-white border border-[#eae6de] rounded-2xl overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-[10px] uppercase tracking-widest text-text-muted">
                      <tr><th className="p-4">Date</th><th className="p-4">High</th><th className="p-4">Low</th><th className="p-4">Rain</th></tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1eee8]">
                      {history.map((d) => (
                        <tr key={d.date}>
                          <td className="p-4 font-medium">{weekday(d.date)}</td>
                          <td className="p-4">{d.max != null ? `${Math.round(d.max)}°C` : '–'}</td>
                          <td className="p-4">{d.min != null ? `${Math.round(d.min)}°C` : '–'}</td>
                          <td className="p-4">{d.rain != null ? `${d.rain} mm` : '–'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
