'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(async (r) => {
    if (!r.ok) throw new Error('Unauthorized');
    return r.json();
  });

/**
 * useRequireAuth — redirects to /auth/login if not authenticated.
 * Optional `role` check: if the user's role doesn't match, redirects to their dashboard.
 */
export function useRequireAuth(role?: 'farmer' | 'supplier' | 'admin') {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  const { data, error, isLoading } = useSWR(`${API}/auth/me`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (isLoading) return;

    if (error || !data?.data) {
      router.replace('/auth/login');
      return;
    }

    if (role && data.data.role !== role) {
      const dashMap: Record<string, string> = {
        farmer: '/dashboard/farmer',
        supplier: '/dashboard/supplier',
        admin: '/dashboard/admin',
      };
      router.replace(dashMap[data.data.role] ?? '/auth/login');
    }
  }, [data, error, isLoading, role, router]);

  return {
    user: data?.data ?? null,
    isLoading,
    isAuthenticated: !!data?.data && !error,
  };
}
