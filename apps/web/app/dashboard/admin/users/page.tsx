'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { Search, User, CheckCircle, XCircle, ShieldOff, RotateCcw, BarChart3, Shield, ShoppingBag, LogOut, Leaf, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());

function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const NAV = [
    { icon: BarChart3,    label: 'Overview',  href: '/dashboard/admin' },
    { icon: Shield,       label: 'KYC Queue', href: '/dashboard/admin/kyc' },
    { icon: Users,        label: 'User Mgmt', href: '/dashboard/admin/users' },
    { icon: ShoppingBag,  label: 'Orders',    href: '/dashboard/admin/orders' },
  ];

  async function logout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    router.push('/auth/login');
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#0d1526]/95 backdrop-blur border-r border-white/8 hidden lg:flex">
        <div className="p-6 border-b border-white/8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center"><Leaf className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-white">AgriLink</span>
            <span className="badge-red text-[10px] ml-1">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-link ${pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href)) ? 'active' : ''}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/8">
          <button onClick={logout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <header className="lg:ml-64 h-16 flex items-center gap-4 px-6 border-b border-white/8 bg-[#0d1526]/80 backdrop-blur sticky top-0 z-30">
        <h1 className="text-white font-bold flex-1">User Management</h1>
      </header>
    </>
  );
}

const KYC_BADGE: Record<string, string> = {
  pending:  'badge-amber',
  approved: 'badge-green',
  rejected: 'badge-red',
  not_started: 'badge-slate',
};

function UsersContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState<any | null>(null);

  const params = new URLSearchParams({ page: String(page), limit: '20' });
  if (role) params.set('role', role);
  if (search) params.set('search', search);

  const { data, isLoading, mutate } = useSWR(`${API}/auth/admin/users?${params}`, fetcher);
  const users: any[] = data?.data?.users ?? [];
  const pagination = data?.data?.pagination;

  async function suspend(userId: string, reason: string) {
    setSuspendingId(userId);
    try {
      const res = await fetch(`${API}/auth/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      mutate();
      toast.success('User suspended');
      setShowSuspendModal(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSuspendingId(null);
    }
  }

  async function reactivate(userId: string) {
    try {
      const res = await fetch(`${API}/auth/admin/users/${userId}/reactivate`, { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error((await res.json()).error);
      mutate();
      toast.success('User reactivated');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="p-6 max-w-6xl">
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSuspendModal(null)}>
          <div className="glass-card p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold mb-4">Suspend User</h3>
            <p className="text-slate-400 text-sm mb-4">{showSuspendModal.email}</p>
            <textarea className="input-field w-full min-h-20 resize-none mb-4" placeholder="Reason for suspension..." value={suspendReason} onChange={e => setSuspendReason(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => setShowSuspendModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button disabled={!suspendReason} onClick={() => suspend(showSuspendModal.id, suspendReason)} className="flex-1 py-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 font-medium text-sm disabled:opacity-40">
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white">User Management</h2>
          <p className="text-slate-400 text-sm mt-1">{pagination?.total ?? 0} total users</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input className="input-field pl-10 w-full" placeholder="Search by email or name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="input-field min-w-36" value={role} onChange={e => { setRole(e.target.value); setPage(1); }}>
            <option value="" className="bg-slate-900">All Roles</option>
            <option value="farmer" className="bg-slate-900">Farmers</option>
            <option value="supplier" className="bg-slate-900">Suppliers</option>
            <option value="admin" className="bg-slate-900">Admins</option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}
          </div>
        ) : (
          <>
            <div className="glass-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left text-slate-400 px-5 py-3 font-medium">User</th>
                    <th className="text-left text-slate-400 px-5 py-3 font-medium">Role</th>
                    <th className="text-left text-slate-400 px-5 py-3 font-medium">KYC</th>
                    <th className="text-left text-slate-400 px-5 py-3 font-medium">Status</th>
                    <th className="text-left text-slate-400 px-5 py-3 font-medium">Joined</th>
                    <th className="text-right text-slate-400 px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any, i: number) => (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/3">
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-white font-medium">{user.fullName ?? user.companyName ?? '—'}</p>
                          <p className="text-slate-500 text-xs">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3"><span className="badge-slate text-xs capitalize">{user.role}</span></td>
                      <td className="px-5 py-3"><span className={`${KYC_BADGE[user.kycStatus ?? 'not_started']} text-xs capitalize`}>{user.kycStatus ?? 'Not started'}</span></td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {user.role !== 'admin' && (
                          user.isActive ? (
                            <button onClick={() => { setShowSuspendModal(user); setSuspendReason(''); }}
                              className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 ml-auto">
                              <ShieldOff className="w-3 h-3" /> Suspend
                            </button>
                          ) : (
                            <button onClick={() => reactivate(user.id)}
                              className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1 ml-auto">
                              <RotateCcw className="w-3 h-3" /> Reactivate
                            </button>
                          )
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-12">
                  <User className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No users found</p>
                </div>
              )}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm disabled:opacity-40">Previous</button>
                <span className="text-slate-400 text-sm px-4">Page {pagination.page} of {pagination.pages}</span>
                <button disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm disabled:opacity-40">Next</button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-16">
        <Suspense fallback={<div className="p-6"><div className="h-40 skeleton rounded-2xl" /></div>}>
          <UsersContent />
        </Suspense>
      </main>
    </div>
  );
}
