'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { Bell, BellOff, CheckCheck, ShieldAlert, ShoppingBag, Leaf, CheckCircle, Star } from 'lucide-react';
import FarmerSidebar from '@/components/FarmerSidebar';
import SupplierSidebar from '@/components/SupplierSidebar';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/components/NotificationProvider';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json()).then((d) => d.data);

function iconFor(topic: string) {
  if (topic.includes('kyc')) return { Icon: ShieldAlert, cls: 'text-amber-600 bg-amber-50' };
  if (topic.includes('approved')) return { Icon: CheckCircle, cls: 'text-brand-green bg-brand-green/10' };
  if (topic.includes('order')) return { Icon: ShoppingBag, cls: 'text-brand-green bg-brand-green/10' };
  if (topic.includes('land')) return { Icon: Leaf, cls: 'text-purple-600 bg-purple-50' };
  if (topic.includes('review')) return { Icon: Star, cls: 'text-amber-600 bg-amber-50' };
  return { Icon: Bell, cls: 'text-blue-600 bg-blue-50' };
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function List({ dark = false }: { dark?: boolean }) {
  const { data, isLoading, mutate } = useSWR(`${API}/notification/me?limit=100`, fetcher);
  const { notifications: live, refreshUnread } = useNotifications();
  const items: any[] = data?.items ?? [];

  // New live notifications → refetch the persisted list
  useEffect(() => { if (live.length) mutate(); }, [live.length, mutate]);

  async function markAll() {
    await fetch(`${API}/notification/me/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: '{}',
    });
    mutate();
    refreshUnread();
  }

  async function markOne(id: string) {
    await fetch(`${API}/notification/me/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ids: [id] }),
    });
    mutate();
    refreshUnread();
  }

  const card = dark ? 'bg-white/5 border-white/10' : 'bg-white border-[#eae6de]';
  const title = dark ? 'text-white' : 'text-text-dark';
  const muted = dark ? 'text-white/50' : 'text-text-muted';

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-serif font-bold ${title}`}>Notifications</h2>
          <p className={`text-sm ${muted}`}>KYC decisions, orders, agreements and announcements.</p>
        </div>
        {(data?.unread ?? 0) > 0 && (
          <button onClick={markAll} className="px-4 py-2 rounded-xl border border-brand-green/30 text-brand-green text-xs font-bold flex items-center gap-2 hover:bg-brand-green/5">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className={`h-40 rounded-3xl border animate-pulse ${card}`} />
      ) : items.length === 0 ? (
        <div className={`rounded-3xl border border-dashed p-16 text-center ${card}`}>
          <BellOff className={`w-10 h-10 mx-auto mb-4 ${muted}`} />
          <p className={`font-bold ${title}`}>You&apos;re all caught up</p>
          <p className={`text-sm mt-1 ${muted}`}>We&apos;ll let you know when something needs your attention.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => {
            const { Icon, cls } = iconFor(n.topic);
            const unread = !n.readAt;
            return (
              <li key={n.id}>
                <button
                  onClick={() => unread && markOne(n.id)}
                  className={`w-full text-left rounded-2xl border p-5 flex gap-4 transition-all ${card} ${unread ? 'ring-1 ring-brand-green/30' : 'opacity-80'}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cls}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className={`font-bold ${title}`}>{n.subject}</p>
                      <span className={`text-[11px] shrink-0 ${muted}`}>{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className={`text-sm mt-1 ${muted}`}>{n.body}</p>
                  </div>
                  {unread && <span className="w-2.5 h-2.5 rounded-full bg-brand-orange mt-2 shrink-0" aria-label="Unread" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const { user, loading } = useAuth();

  if (loading || !user) return <div className="min-h-screen bg-brand-bg" />;

  if (user.role === 'admin') {
    return <AdminLayout pageTitle="Notifications"><List /></AdminLayout>;
  }

  const Sidebar = user.role === 'supplier' ? SupplierSidebar : FarmerSidebar;
  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Sidebar pageTitle="Notifications" />
      <main className="lg:ml-72 p-6 lg:p-8">
        <List />
      </main>
    </div>
  );
}
