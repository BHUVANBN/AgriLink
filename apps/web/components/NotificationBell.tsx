'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/components/NotificationProvider';

/** Header bell with the real unread count; opens the notifications page. */
export default function NotificationBell({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { unread } = useNotifications();
  const cls = tone === 'dark'
    ? 'bg-white/5 border-white/10 text-white/60 hover:text-white'
    : 'bg-white border-[#eae6de] shadow-sm hover:shadow-md text-text-muted hover:text-brand-green';

  return (
    <Link
      href="/dashboard/notifications"
      aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
      className={`relative w-12 h-12 rounded-2xl border flex items-center justify-center transition-all active:scale-90 ${cls}`}
    >
      <Bell className="w-5 h-5" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  );
}
