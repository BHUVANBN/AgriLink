'use client';

import useSWR from 'swr';
import { Star, BadgeCheck, MessageSquare } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((d) => d.data ?? []);

function Stars({ value, size = 'w-4 h-4' }: { value: number; size?: string }) {
  return (
    <div className="flex" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= Math.round(value) ? 'text-amber-500 fill-amber-500' : 'text-[#eae6de]'}`} />
      ))}
    </div>
  );
}

/**
 * Verified-purchase reviews for a product. Public (no login needed).
 * `tone="dark"` matches the dark storefront theme.
 */
export default function ProductReviews({ productId, tone = 'light' }: { productId: string; tone?: 'light' | 'dark' }) {
  const { data: reviews = [], isLoading } = useSWR<any[]>(productId ? `${API}/marketplace/reviews?productId=${encodeURIComponent(productId)}` : null, fetcher);

  const dark = tone === 'dark';
  const card = dark ? 'bg-white/5 border-white/10' : 'bg-white border-[#eae6de]';
  const heading = dark ? 'text-white' : 'text-text-dark';
  const muted = dark ? 'text-slate-400' : 'text-text-muted';

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const counts = [5, 4, 3, 2, 1].map((n) => reviews.filter((r) => r.rating === n).length);

  return (
    <section className="mt-12 space-y-6" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className={`text-2xl font-serif font-bold ${heading}`}>Farmer reviews</h2>

      {isLoading ? (
        <div className={`h-24 rounded-3xl border animate-pulse ${card}`} />
      ) : reviews.length === 0 ? (
        <div className={`rounded-3xl border p-8 flex items-center gap-4 ${card}`}>
          <MessageSquare className={`w-6 h-6 ${muted}`} />
          <p className={`text-sm ${muted}`}>No reviews yet. Farmers can review this product after their order is delivered.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`rounded-3xl border p-6 space-y-4 ${card}`}>
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-bold ${heading}`}>{avg.toFixed(1)}</span>
              <span className={`text-sm mb-1 ${muted}`}>/ 5 · {reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
            </div>
            <Stars value={avg} size="w-5 h-5" />
            <div className="space-y-1.5">
              {counts.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={`w-3 ${muted}`}>{5 - i}</span>
                  <div className={`flex-1 h-2 rounded-full ${dark ? 'bg-white/10' : 'bg-[#f1eee8]'}`}>
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: `${(c / reviews.length) * 100}%` }} />
                  </div>
                  <span className={`w-6 text-right ${muted}`}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <ul className="md:col-span-2 space-y-4">
            {reviews.slice(0, 10).map((r) => (
              <li key={r.id} className={`rounded-3xl border p-6 space-y-2 ${card}`}>
                <div className="flex items-center justify-between gap-4">
                  <Stars value={r.rating} />
                  <span className={`text-[11px] ${muted}`}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className={`font-bold ${heading}`}>{r.title}</p>
                <p className={`text-sm leading-relaxed ${muted}`}>{r.body}</p>
                {r.isVerified && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-green flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified purchase
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
