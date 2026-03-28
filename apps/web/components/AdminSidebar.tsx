'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  Zap,
  Activity,
  CreditCard,
  FileText,
  Search,
  User,
  Bell
} from 'lucide-react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { ADMIN_STRINGS, ADMIN_CONFIG } from '@/config/admin.constants';

const API = ADMIN_CONFIG.API_URL;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());


const NAV = [
  { icon: LayoutDashboard, label: ADMIN_STRINGS.SIDEBAR.NAV.CONTROL_CENTER, href: '/dashboard/admin' },
  { icon: ShieldCheck,     label: 'KYC Operations',     href: '/dashboard/admin/kyc' },
  { icon: Users,           label: ADMIN_STRINGS.SIDEBAR.NAV.KYC_HUB, href: '/dashboard/admin/users' },
  { icon: MessageSquare,   label: ADMIN_STRINGS.SIDEBAR.NAV.MODERATION,   href: '/dashboard/admin/moderation' },
  { icon: CreditCard,      label: ADMIN_STRINGS.SIDEBAR.NAV.FINANCIAL, href: '/dashboard/admin/transactions' },
  { icon: Zap,             label: ADMIN_STRINGS.SIDEBAR.NAV.BROADCAST, href: '/dashboard/admin/broadcast' },
  { icon: FileText,        label: ADMIN_STRINGS.SIDEBAR.NAV.AUDIT,    href: '/dashboard/admin/audit' },
];

export default function AdminSidebar({ pageTitle }: { pageTitle?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: profile, isLoading, error } = useSWR(`${API}/auth/me`, fetcher);

  useEffect(() => {
    // SECURITY: Ensure node is authorized for administrative console
    if (!isLoading && profile) {
      // SWR Cache Polarity Check: Identify normalized user role from varying response shapes
      const node = profile.data || profile.user || profile;
      const userRole = (node.role || profile.role)?.toLowerCase()?.trim();
      
      if (userRole !== 'admin') {
        toast.error(`Privileged Access Protocol: User node [${userRole || 'UNKNOWN'}] rejected`);
        
        // Context-aware fallback navigation
        if (userRole === 'farmer') router.push('/dashboard/farmer');
        else if (userRole === 'supplier') router.push('/dashboard/supplier');
        else router.push('/auth/login');
      }
    } else if (!isLoading && (error || !profile)) {
      // Not authenticated or profile fetch failed
      router.push('/auth/login');
    }
  }, [profile, isLoading, error, router]);




  async function logout() {
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
      toast.success('Admin session terminated');
      router.push('/auth/login');
    } catch {
      router.push('/auth/login');
    }
  }

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed bottom-8 right-8 z-[60] w-16 h-16 rounded-2xl bg-black border border-white/10 shadow-2xl flex items-center justify-center text-white active:scale-95 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-all duration-500
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-24 px-8 flex items-center gap-4 border-b border-white/5 relative overflow-hidden group">
          <div className="w-11 h-11 rounded-2xl bg-red-600 flex items-center justify-center shadow-xl shadow-red-900/20 relative z-10 group-hover:rotate-12 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white font-serif tracking-tighter relative z-10">{ADMIN_STRINGS.SIDEBAR.LOGO}</span>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
        </div>

        <div className="px-6 py-8">
           <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-lg font-bold">
                 {profile?.fullName?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="min-w-0 flex-1">
                 <p className="text-[13px] font-bold text-white font-serif truncate">{profile?.fullName ?? 'Platform Architect'}</p>
                 <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-bold uppercase tracking-widest mt-1">
                    <Zap className="w-2.5 h-2.5 animate-pulse" /> Supervisor
                 </div>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
           <p className="px-6 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 mt-2">{ADMIN_STRINGS.SIDEBAR.SECTOR_LABEL}</p>
           {NAV.map(item => {
             const isActive = pathname === item.href;
             return (
               <Link 
                 key={item.href} 
                 href={item.href}
                 onClick={() => setOpen(false)}
                 className={`
                   flex items-center gap-4 px-6 py-4 rounded-2xl text-[12px] font-bold uppercase tracking-wider transition-all relative overflow-hidden group
                   ${isActive ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'}
                 `}
               >
                 <item.icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-black' : 'text-white/40 group-hover:text-white'}`} />
                 <span className="flex-1 relative z-10">{item.label}</span>
                 {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                 )}
                 {isActive && <div className="w-1.5 h-1.5 rounded-full bg-red-600 relative z-10" />}
               </Link>
             );
           })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2 pb-8">
          <button 
            onClick={logout}
            className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {ADMIN_STRINGS.SIDEBAR.LOGOUT}
          </button>
        </div>
      </aside>

      <header className="lg:ml-72 h-24 flex items-center justify-between px-10 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-40">
         <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
               <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{ADMIN_STRINGS.SIDEBAR.STATUS_ONLINE}</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif tracking-tighter">{pageTitle ?? 'Supervisor Command'}</h1>
         </div>

         <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center bg-white/5 border border-white/10 rounded-xl px-5 py-3 w-80">
               <Search className="w-4 h-4 text-white/40" />
               <input placeholder="Search platform index..." className="bg-transparent border-none text-[11px] font-bold text-white focus:ring-0 ml-3 w-full placeholder:text-white/20" />
            </div>
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
               <button className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-600 rounded-full" />
               </button>
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
               </div>
            </div>
         </div>
      </header>
    </>
  );
}
