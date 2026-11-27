'use client';

import React from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import NotificationProvider from '@/components/NotificationProvider';
import { installAuthRefresh } from '@/lib/authRefresh';

// Install once, before any component fires its first request
installAuthRefresh(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080');

function NotificationWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <NotificationProvider userId={user?.id}>
      {children}
    </NotificationProvider>
  );
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationWrapper>
        {children}
      </NotificationWrapper>
    </AuthProvider>
  );
}
