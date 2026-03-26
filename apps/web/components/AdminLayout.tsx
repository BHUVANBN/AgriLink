'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Shield, 
  Users, 
  ShoppingBag, 
  LogOut, 
  Leaf, 
  FileCheck,
  Settings,
  Bell,
  Menu,
  X,
  ShieldCheck,
  Search,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function AdminLayout({ children, pageTitle }: { children: React.ReactNode; pageTitle: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const NAV = [
    { icon: BarChart3, label: 'Control Center',      href: '/dashboard/admin' },
    { icon: Shield,    label: 'KYC Operations',     href: '/dashboard/admin/kyc' },
    { icon: FileCheck, label: 'Scheme Management',   href: '/dashboard/admin/schemes' },
    { icon: Users,     label: 'Identity Hub',        href: '/dashboard/admin/users' },
    { icon: ShoppingBag, label: 'Order Oversight',    href: '/dashboard/admin/orders' },
  ];

  async function logout() {
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
      toast.success('Admin session terminated');
      router.push('/auth/login');
    } catch (err) {
      router.push('/auth/login');
    }
  }

  const sidebar = (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 flex flex-col transition-all duration-300 ease-out
      ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
        <div className="h-20 px-8 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-xl font-bold text-white block leading-none font-heading">AgriLink</span>
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mt-1 block">Root Console</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto font-body">
          <p className="px-5 text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mb-6">System Modules</p>
          {NAV.map(item => {
            const isActive = pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all group
                  ${isActive 
                    ? 'bg-white/10 text-white shadow-xl shadow-black/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4 font-body">
           <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/10">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">System Load</p>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[24%]" />
              </div>
              <p className="text-slate-500 text-[9px] mt-2 italic font-medium">Nodes operating at peak efficiency</p>
           </div>
           
           <button 
             onClick={logout} 
             className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl bg-slate-800 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-black/40"
           >
             <LogOut className="w-4 h-4" /> Secure Logout
           </button>
        </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50/30 flex font-body">
      {sidebar}
      
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
          <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-all">
            <div className="flex items-center gap-4">
               <button onClick={() => setOpen(!open)} className="lg:hidden text-slate-400 hover:text-slate-900 w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all">
                  {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
               </button>
               <h1 className="text-slate-900 font-black text-xl font-heading tracking-tight">{pageTitle}</h1>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex relative items-center group">
                   <Search className="w-4 h-4 text-slate-400 absolute left-4 group-focus-within:text-emerald-500 transition-colors" />
                   <input 
                     className="bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all w-80" 
                     placeholder="Search records, users, transactions..." 
                   />
                </div>
                
                <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                  <button className="w-11 h-11 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-emerald-600 transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
                  </button>
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-200">
                    A
                  </div>
                </div>
            </div>
          </header>
          
          <div className="p-8 max-w-7xl mx-auto w-full">
             {children}
          </div>
      </main>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
