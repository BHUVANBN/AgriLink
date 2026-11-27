'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { MessageSquare, X } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

/** "Ask the supplier" button + modal for a product page. */
export default function AskSupplier({ productId, productName }: { productId: string; productName: string }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(`Question about ${productName}`.slice(0, 200));
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API}/marketplace/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, subject, body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Could not send your question');
      setSentId(json.data.id);
      toast.success('Question sent to the supplier');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  }

  const input = 'w-full px-4 py-3 rounded-xl border border-[#eae6de] focus:border-brand-green outline-none text-sm';
  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setSentId(null); }}
        className="w-full py-3 rounded-2xl border border-[#eae6de] bg-white text-text-dark text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-brand-green"
      >
        <MessageSquare className="w-4 h-4" /> Ask the supplier
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-serif font-bold text-text-dark">Ask about {productName}</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 rounded-full hover:bg-[#f8f7f4]"><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            {sentId ? (
              <div className="space-y-4">
                <p className="text-sm text-text-muted">Your question was sent. You&apos;ll get a notification when the supplier replies.</p>
                <Link href={`/dashboard/farmer/marketplace/inquiries?id=${sentId}`} className="block w-full py-3 rounded-xl bg-brand-green text-white font-bold text-sm text-center">
                  View conversation
                </Link>
              </div>
            ) : (
              <form onSubmit={send} className="space-y-3">
                <input required minLength={3} maxLength={200} value={subject} onChange={(e) => setSubject(e.target.value)} className={input} aria-label="Subject" />
                <textarea
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="e.g. Is this suitable for paddy? Do you deliver to Mandya?"
                  className={`${input} resize-none`}
                  aria-label="Question"
                />
                <button disabled={sending} className="w-full py-3 rounded-xl bg-brand-green text-white font-bold text-sm disabled:opacity-60">
                  {sending ? 'Sending…' : 'Send question'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
