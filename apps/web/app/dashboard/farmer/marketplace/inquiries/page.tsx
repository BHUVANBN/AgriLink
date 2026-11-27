'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { MessageSquare, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json()).then((d) => d.data);

const STATUS: Record<string, { label: string; cls: string }> = {
  OPEN: { label: 'Waiting for supplier', cls: 'bg-amber-50 text-amber-700' },
  RESPONDED: { label: 'Supplier replied', cls: 'bg-brand-green/10 text-brand-green' },
  RESOLVED: { label: 'Resolved', cls: 'bg-blue-50 text-blue-700' },
  CLOSED: { label: 'Closed', cls: 'bg-slate-100 text-slate-500' },
};

function Thread({ id, onBack, onChanged }: { id: string; onBack: () => void; onChanged: () => void }) {
  const { data: thread, isLoading, mutate } = useSWR(`${API}/marketplace/inquiries/${id}`, fetcher, { refreshInterval: 30_000 });
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/marketplace/inquiries/${id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Could not send');
      setMessage('');
      mutate();
      onChanged();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  }

  async function resolve() {
    await fetch(`${API}/marketplace/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'RESOLVED' }),
    });
    mutate();
    onChanged();
  }

  if (isLoading || !thread) return <div className="h-64 bg-white rounded-3xl border border-[#eae6de] animate-pulse" />;

  const messages = [
    { id: 'first', senderRole: 'farmer', message: thread.body, createdAt: thread.createdAt },
    ...(thread.replies ?? []),
  ];
  const closed = thread.status === 'CLOSED';

  return (
    <div className="bg-white rounded-3xl border border-[#eae6de] flex flex-col min-h-[480px]">
      <div className="p-5 border-b border-[#f1eee8] flex items-center gap-3">
        <button onClick={onBack} className="md:hidden p-2 rounded-full hover:bg-[#f8f7f4]" aria-label="Back"><ArrowLeft className="w-4 h-4" /></button>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-dark truncate">{thread.subject}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS[thread.status]?.cls}`}>{STATUS[thread.status]?.label}</span>
        </div>
        {!closed && thread.status !== 'RESOLVED' && (
          <button onClick={resolve} className="text-xs font-bold text-brand-green flex items-center gap-1 hover:underline">
            <CheckCircle2 className="w-4 h-4" /> Mark resolved
          </button>
        )}
      </div>
      <ul className="flex-1 p-5 space-y-3 overflow-y-auto">
        {messages.map((m: any) => {
          const mine = m.senderRole === 'farmer';
          return (
            <li key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${mine ? 'bg-brand-green text-white rounded-br-sm' : 'bg-[#f8f7f4] text-text-dark rounded-bl-sm'}`}>
                <p className="whitespace-pre-wrap">{m.message}</p>
                <p className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-text-muted'}`}>
                  {mine ? 'You' : 'Supplier'} · {new Date(m.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      {closed ? (
        <p className="p-5 border-t border-[#f1eee8] text-sm text-text-muted text-center">This conversation is closed.</p>
      ) : (
        <form onSubmit={send} className="p-4 border-t border-[#f1eee8] flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={5000}
            placeholder="Write a reply…"
            className="flex-1 px-4 py-3 rounded-xl border border-[#eae6de] focus:border-brand-green outline-none text-sm"
            aria-label="Reply"
          />
          <button disabled={sending || !message.trim()} className="px-4 rounded-xl bg-brand-green text-white disabled:opacity-50" aria-label="Send">
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}

function InquiriesContent() {
  const params = useSearchParams();
  const router = useRouter();
  const selected = params.get('id');
  const { data, isLoading, mutate } = useSWR(`${API}/marketplace/inquiries`, fetcher);
  const list: any[] = data ?? [];

  const select = (id: string | null) => router.replace(id ? `?id=${id}` : '?', { scroll: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-dark">Messages</h1>
        <p className="text-sm text-text-muted">Questions you&apos;ve asked suppliers. Use “Ask the supplier” on any product page to start one.</p>
      </div>

      {isLoading ? (
        <div className="h-40 bg-white rounded-3xl border border-[#eae6de] animate-pulse" />
      ) : list.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#eae6de] p-16 text-center">
          <MessageSquare className="w-10 h-10 mx-auto text-text-muted mb-4" />
          <p className="font-bold text-text-dark">No conversations yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          <ul className={`space-y-2 ${selected ? 'hidden md:block' : ''}`}>
            {list.map((inq) => (
              <li key={inq.id}>
                <button
                  onClick={() => select(inq.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${selected === inq.id ? 'border-brand-green bg-brand-green/5' : 'border-[#eae6de] bg-white hover:border-brand-green/40'}`}
                >
                  <p className="font-bold text-sm text-text-dark truncate">{inq.subject}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS[inq.status]?.cls}`}>{STATUS[inq.status]?.label}</span>
                    <span className="text-[10px] text-text-muted">{new Date(inq.lastMessageAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className={selected ? '' : 'hidden md:block'}>
            {selected ? (
              <Thread id={selected} onBack={() => select(null)} onChanged={() => mutate()} />
            ) : (
              <div className="h-full min-h-[300px] rounded-3xl border border-dashed border-[#eae6de] flex items-center justify-center text-sm text-text-muted">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FarmerInquiriesPage() {
  return (
    <Suspense fallback={null}>
      <InquiriesContent />
    </Suspense>
  );
}
