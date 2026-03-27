'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  User, 
  Send, 
  Clock, 
  Package, 
  CheckCircle,
  Inbox,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function SupplierInquiriesPage() {
  const { data: inquiries, isLoading, mutate } = useSWR(`${API}/marketplace/inquiries`, fetcher);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: activeThread, isLoading: loadingThread } = useSWR(selectedId ? `${API}/marketplace/inquiries/${selectedId}` : null, fetcher);
  
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  const inquiryList: any[] = Array.isArray(inquiries) ? inquiries : [];
  const filteredInquiries = search ? inquiryList.filter(i => 
    i.subject.toLowerCase().includes(search.toLowerCase()) || 
    i.body.toLowerCase().includes(search.toLowerCase())
  ) : inquiryList;

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || sending || !selectedId) return;

    setSending(true);
    try {
      const res = await fetch(`${API}/marketplace/inquiries/${selectedId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: replyText })
      });
      if (!res.ok) throw new Error('Failed to transmit reply');
      setReplyText('');
      mutate(); // Global list sync
      toast.success('Response deployed');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  }

  const STATUS_CFG: any = {
    OPEN:      { label: 'Attention Required', cls: 'bg-amber-50 text-amber-600 border-amber-100' },
    RESPONDED: { label: 'Awaiting Farmer', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    RESOLVED:  { label: 'Case Satisfied',   cls: 'bg-blue-50 text-blue-600 border-blue-100' },
    CLOSED:    { label: 'Archived',        cls: 'bg-slate-50 text-slate-400 border-slate-100' },
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Inquiry Control" />
      <main className="lg:ml-72 p-6 lg:p-12 h-screen overflow-hidden flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
             
             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 flex-shrink-0">
                <div>
                   <h2 className="text-4xl font-bold text-text-dark font-serif tracking-tighter italic">Inquiry Matrix</h2>
                   <p className="text-text-muted font-bold text-[10px] uppercase tracking-widest mt-1 italic">Pre-sale Farmer Engagement Vector // 2.0 Stable</p>
                </div>
                <div className="bg-white p-2 rounded-2xl border border-[#eae6de] shadow-sm flex items-center min-w-[320px]">
                   <Search className="w-4 h-4 text-text-muted ml-3" />
                   <input 
                     className="flex-1 bg-transparent border-none outline-none text-[11px] font-bold text-text-dark p-3" 
                     placeholder="Filter by subject or content..." 
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                   />
                </div>
             </div>

             <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                
                {/* Inquiry Threads List */}
                <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft overflow-hidden flex flex-col min-h-0">
                   <div className="p-8 border-b border-[#f8f7f4]">
                      <h3 className="text-sm font-black text-text-dark uppercase tracking-widest flex items-center gap-2 italic">
                         <Inbox className="w-4 h-4 text-brand-orange" /> Active Threads
                      </h3>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                      {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-[#f8f7f4] rounded-2xl animate-pulse" />)
                      ) : filteredInquiries.length === 0 ? (
                        <div className="text-center py-12">
                           <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                           <p className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted italic leading-relaxed px-8">Operational quiescence — no farmer inquiries currently active in your sector.</p>
                        </div>
                      ) : (
                        filteredInquiries.map((inq: any) => {
                          const cfg = STATUS_CFG[inq.status];
                          const active = selectedId === inq.id;
                          return (
                            <button 
                              key={inq.id}
                              onClick={() => setSelectedId(inq.id)}
                              className={`w-full text-left p-6 rounded-[2rem] border transition-all relative overflow-hidden group ${active ? 'bg-text-dark border-text-dark shadow-xl' : 'bg-white border-[#eae6de] hover:border-[#eae6de] hover:bg-[#f8f7f4]'}`}
                            >
                               <div className="flex items-start justify-between mb-3 relative z-10">
                                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${active ? 'bg-white/10 text-white border-white/20' : cfg.cls}`}>
                                     {cfg.label}
                                  </span>
                                  <span className={`text-[9px] font-bold italic ${active ? 'text-white/40' : 'text-slate-300'}`}>
                                     {new Date(inq.createdAt).toLocaleDateString()}
                                  </span>
                               </div>
                               <h4 className={`text-sm font-black leading-tight mb-1 truncate relative z-10 ${active ? 'text-white' : 'text-text-dark'}`}>{inq.subject}</h4>
                               <p className={`text-[10px] font-medium italic line-clamp-2 relative z-10 ${active ? 'text-white/60' : 'text-text-muted'}`}>{inq.body}</p>
                               <div className={`absolute top-0 right-0 w-16 h-16 bg-[#f8f7f4] rounded-full blur-2xl -translate-y-8 translate-x-8 opacity-50 group-hover:scale-125 transition-transform ${active ? 'hidden' : ''}`} />
                            </button>
                          );
                        })
                      )}
                   </div>
                </div>

                {/* Response Matrix (Thread Detail) */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft flex flex-col min-h-0 relative overflow-hidden">
                   {!selectedId ? (
                     <div className="flex-1 flex flex-col items-center justify-center p-24 text-center">
                        <div className="w-24 h-24 bg-[#f8f7f4] rounded-[2.5rem] flex items-center justify-center mb-8">
                           <ShieldCheck className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-bold text-text-dark font-serif tracking-tight mb-4 italic">Secure Engagement Matrix</h3>
                        <p className="text-text-muted text-[13px] leading-relaxed max-w-sm italic">Select a pre-sale vector from the list to initiate high-fidelity discussion with verified farmers.</p>
                     </div>
                   ) : loadingThread ? (
                     <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
                        <div className="w-3 h-3 bg-brand-green rounded-full animate-bounce mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-green italic">Syncing Vector...</span>
                     </div>
                   ) : (
                     <>
                        {/* Thread Header */}
                        <div className="p-10 border-b border-[#f8f7f4] bg-white relative z-10">
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="text-3xl font-bold text-text-dark font-serif tracking-tighter italic">{activeThread.subject}</h3>
                              <div className="flex items-center gap-3">
                                 <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-text-dark tracking-widest leading-none mb-1 italic">Farmer Identity</p>
                                    <p className="text-xs font-bold text-text-muted">UID: {activeThread.farmerId.slice(-8)}</p>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_CFG[activeThread.status].cls}`}>
                                 {STATUS_CFG[activeThread.status].label}
                              </span>
                              {activeThread.productId && (
                                <div className="flex items-center gap-2 bg-[#f8f7f4] px-4 py-1.5 rounded-full border border-[#eae6de]">
                                   <Package className="w-3 h-3 text-brand-green" />
                                   <span className="text-[9px] font-black uppercase tracking-widest text-text-dark italic">Context: Asset Linked</span>
                                </div>
                              )}
                           </div>
                        </div>

                        {/* Correspondence Feed */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8 bg-[#faf9f6]/30">
                           {/* Initial Inquiry */}
                           <div className="flex gap-6 max-w-[90%]">
                              <div className="w-12 h-12 bg-white rounded-2xl border border-[#eae6de] flex items-center justify-center flex-shrink-0 shadow-sm">
                                 <User className="w-6 h-6 text-text-muted" />
                              </div>
                              <div className="space-y-4">
                                 <div className="bg-white p-8 rounded-[2rem] rounded-tl-none border border-[#eae6de] shadow-soft relative">
                                    <p className="text-[13px] font-medium text-text-dark leading-relaxed italic italic">"{activeThread.body}"</p>
                                    <div className="absolute top-0 left-0 w-8 h-8 bg-white rotate-45 -translate-x-4 translate-y-4 border-l border-b border-[#eae6de] -z-10" />
                                 </div>
                                 <p className="text-[9px] font-bold uppercase tracking-widest text-[#929285] pl-2">{new Date(activeThread.createdAt).toLocaleTimeString()} // Farmer Vector</p>
                              </div>
                           </div>

                           {/* Replies */}
                           {activeThread.replies?.map((msg: any) => {
                             const isMe = msg.senderRole === 'supplier';
                             return (
                               <motion.div 
                                 key={msg.id}
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className={`flex gap-6 max-w-[90%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                               >
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border ${isMe ? 'bg-text-dark border-text-dark text-white' : 'bg-white border-[#eae6de] text-text-muted'}`}>
                                     {isMe ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                  </div>
                                  <div className={`space-y-4 ${isMe ? 'text-right' : ''}`}>
                                     <div className={`p-8 rounded-[2rem] border shadow-soft ${isMe ? 'bg-brand-green text-white border-brand-green rounded-tr-none' : 'bg-white text-text-dark border-[#eae6de] rounded-tl-none'}`}>
                                        <p className="text-[13px] font-medium leading-relaxed italic">"{msg.message}"</p>
                                     </div>
                                     <p className="text-[9px] font-bold uppercase tracking-widest text-[#929285] px-2">
                                        {new Date(msg.createdAt).toLocaleTimeString()} // {isMe ? 'Strategy Response' : 'Farmer Clarification'}
                                     </p>
                                  </div>
                               </motion.div>
                             );
                           })}
                        </div>

                        {/* Response Input Overlay */}
                        <div className="p-8 border-t border-[#f8f7f4] bg-white relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
                           <form onSubmit={handleReply} className="flex items-center gap-4">
                              <div className="flex-1 relative">
                                 <textarea 
                                   className="w-full bg-[#f8f7f4] border border-[#eae6de] rounded-[1.5rem] py-5 px-8 text-[11px] font-bold text-text-dark placeholder:text-slate-300 resize-none min-h-[64px] max-h-32 transition-all focus:border-brand-green outline-none"
                                   placeholder="Initiating response sequence..."
                                   value={replyText}
                                   onChange={e => setReplyText(e.target.value)}
                                   onKeyDown={e => {
                                     if (e.key === 'Enter' && !e.shiftKey) {
                                       e.preventDefault();
                                       handleReply(e as any);
                                     }
                                   }}
                                 />
                                 <div className="absolute right-4 bottom-4 flex items-center gap-2">
                                    <span className="text-[8px] font-black text-slate-200 uppercase tracking-widest">EOL Protected</span>
                                 </div>
                              </div>
                              <button 
                                type="submit"
                                disabled={sending || !replyText.trim()}
                                className="w-16 h-16 bg-brand-green text-white rounded-2xl flex items-center justify-center hover:bg-brand-green-hover transition-all shadow-xl shadow-brand-green/20 disabled:opacity-20 flex-shrink-0"
                              >
                                 <Send className="w-6 h-6" />
                              </button>
                           </form>
                        </div>
                     </>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-br from-[#f8f7f4]/20 to-transparent pointer-events-none" />
                </div>
             </div>
          </div>
      </main>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eae6de; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dcd9d0; }
      `}</style>
    </div>
  );
}
