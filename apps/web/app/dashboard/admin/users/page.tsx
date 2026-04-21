'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  Users, 
  Search, 
  MoreVertical, 
  ShieldAlert, 
  CheckCircle2, 
  Ban, 
  RotateCcw,
  Mail,
  Phone,
  Calendar,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function UserDirectoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, mutate, isLoading } = useSWR(`${API}/auth/admin/users?page=${page}&search=${search}`, fetcher);

  const toggleUserStatus = async (user: any) => {
    const action = user.isActive ? 'suspend' : 'reactivate';
    const reason = user.isActive ? 'Policy violation or suspicious activity' : '';
    
    try {
      const res = await fetch(`${API}/auth/admin/users/${user.id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success(`User ${action === 'suspend' ? 'suspended' : 'reactivated'} successfully`);
        mutate();
      } else {
        toast.error(resData.error || 'Failed to update user status');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Directory Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="relative flex-1 w-full max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search directory by name, email, or phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-slate-900/5 focus:bg-white outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
               <Filter className="w-4 h-4" /> Filter By Role
            </button>
         </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100" />
          ))
        ) : data?.users?.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-100">
             <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">No matching users found in the registry</p>
          </div>
        ) : (
          data.users.map((user: any) => (
            <motion.div 
              key={user.id}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-[2.5rem] border p-8 transition-all relative overflow-hidden ${!user.isActive ? 'border-red-100 bg-red-50/10' : 'border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'}`}
            >
              {!user.isActive && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                   Suspended
                </div>
              )}

              <div className="flex items-start justify-between mb-8">
                 <div className="flex gap-6">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black ${
                      user.role === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-brand-orange/10 text-brand-orange'
                    }`}>
                       {user.fullName?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">{user.fullName || 'Anonymous User'}</h3>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            user.role === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-brand-orange/10 text-brand-orange'
                          }`}>
                            {user.role}
                          </span>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{user.companyName || 'Individual Account'}</p>
                    </div>
                 </div>
                 <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                    <MoreVertical className="w-5 h-5" />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-4 h-4 opacity-40" />
                    <span className="text-xs font-bold truncate max-w-full">{user.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-4 h-4 opacity-40" />
                    <span className="text-xs font-bold">{user.phone || 'No phone'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-4 h-4 opacity-40" />
                    <span className="text-xs font-bold">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-600">
                    <ShieldAlert className="w-4 h-4 opacity-40" />
                    <span className={`text-xs font-bold uppercase ${
                      user.kycStatus === 'approved' ? 'text-green-500' : user.kycStatus === 'pending' ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      KYC: {user.kycStatus}
                    </span>
                 </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-slate-50">
                 <button className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                    View Full Profile
                 </button>
                 <button 
                   onClick={() => toggleUserStatus(user)}
                   className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     user.isActive 
                       ? 'border border-red-100 text-red-500 hover:bg-red-50' 
                       : 'bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600'
                   }`}
                 >
                    {user.isActive ? (
                      <div className="flex items-center justify-center gap-2">
                        <Ban className="w-4 h-4" /> Suspend
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Reactivate
                      </div>
                    )}
                 </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-2 py-8">
           {Array.from({ length: data.pagination.pages }).map((_, i) => (
             <button 
               key={i}
               onClick={() => setPage(i + 1)}
               className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                 page === i + 1 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
               }`}
             >
               {i + 1}
             </button>
           ))}
        </div>
      )}
    </div>
  );
}
