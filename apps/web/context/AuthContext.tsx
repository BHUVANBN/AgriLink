'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'farmer' | 'supplier' | 'admin';
  kycStatus: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => {
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  const { data, error, isLoading, mutate } = useSWR(`${API_URL}/auth/me`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  useEffect(() => {
    if (data?.success && data?.data) {
      setUser(data.data);
    } else if (error) {
      setUser(null);
      // Only redirect if we are in a protected route
      if (pathname.startsWith('/dashboard')) {
        router.push('/auth/login');
      }
    }
  }, [data, error, pathname, router]);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
      mutate(null, false);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, logout, refreshUser: mutate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
