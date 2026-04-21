'use client';

import React from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import NotificationProvider from '@/components/NotificationProvider';

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
