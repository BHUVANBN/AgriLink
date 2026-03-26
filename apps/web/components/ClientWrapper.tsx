'use client';

import React from 'react';
import useSWR from 'swr';
import NotificationProvider from '@/components/NotificationProvider';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(r => r.json());

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
  
  // Try to get user data if logged in
  const { data } = useSWR(`${API}/auth/me`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const userId = data?.data?.id;

  return (
    <NotificationProvider userId={userId}>
      {children}
    </NotificationProvider>
  );
}
