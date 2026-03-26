'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Bell, ShieldAlert, ShoppingBag, Leaf, CheckCircle } from 'lucide-react';

interface Notification {
  topic: string;
  id: string;
  timestamp: string;
  subject: string;
  body: string;
  data: any;
}

const NotificationContext = createContext({
  notifications: [] as Notification[],
  clearNotifications: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export default function NotificationProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const NOTIFICATION_URL = process.env.NEXT_PUBLIC_NOTIFICATION_URL || 'http://localhost:4005';
    
    const newSocket = io(NOTIFICATION_URL, {
      query: { userId },
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('[WS] Connected to Notification Service');
    });

    newSocket.on('notification', (notif: Notification) => {
      console.log('[WS] New Notification Received:', notif);
      setNotifications(prev => [notif, ...prev].slice(0, 50));
      
      // Dynamic icons based on topic
      let Icon = Bell;
      let color = 'text-blue-500';
      
      if (notif.topic.includes('kyc')) { Icon = ShieldAlert; color = 'text-amber-500'; }
      if (notif.topic.includes('order')) { Icon = ShoppingBag; color = 'text-green-500'; }
      if (notif.topic.includes('land')) { Icon = Leaf; color = 'text-purple-500'; }
      if (notif.topic.includes('approved')) { Icon = CheckCircle; color = 'text-green-500'; }

      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full glass-card border border-white/10 bg-[#0d1526]/90 backdrop-blur p-4 pointer-events-auto flex gap-4 shadow-2xl ring-1 ring-black ring-opacity-5`}>
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0`}>
               <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-white text-sm font-black italic">{notif.subject}</p>
               <p className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2">{notif.body}</p>
            </div>
            <button 
              onClick={() => toast.dismiss(t.id)}
              className="text-slate-600 hover:text-white transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
        </div>
      ), { duration: 6000 });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const clearNotifications = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}
