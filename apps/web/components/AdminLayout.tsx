'use client';

import AdminShell, { useInAdminShell } from './AdminShell';

/**
 * Wraps content in the admin shell — unless the route layout already did
 * (pages under /dashboard/admin are wrapped once by app/dashboard/admin/layout.tsx).
 */
export default function AdminLayout({ children, pageTitle }: { children: React.ReactNode; pageTitle?: string }) {
  const inShell = useInAdminShell();
  if (inShell) return <>{children}</>;
  return <AdminShell title={pageTitle}>{children}</AdminShell>;
}
