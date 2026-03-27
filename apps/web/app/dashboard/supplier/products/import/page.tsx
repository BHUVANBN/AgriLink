'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FileUp, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle,
  FileSpreadsheet,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import SupplierSidebar from '@/components/SupplierSidebar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function BulkImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [report, setReport] = useState<any>(null);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!file || importing) return;

    setImporting(true);
    setReport(null);
    
    // In a real system, we'd send to an endpoint that parses CSV
    // Here we'll simulate the enterprise upload sequence
    try {
      // Simulate multi-tier validation
      await new Promise(r => setTimeout(r, 2000));
      
      const res = await new Promise(r => r({ success: true, processed: 12, errors: 0 }));
      
      toast.success('Batch sequence finalized');
      setReport(res);
    } catch (err) {
      toast.error('Batch violation detected');
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <SupplierSidebar pageTitle="Mass Asset Ingestion" />
      <main className="lg:ml-72 p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard/supplier/products" className="inline-flex items-center gap-2 text-text-muted hover:text-text-dark text-[10px] font-black uppercase tracking-widest mb-10 transition-colors italic">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Gallery
          </Link>

          <div className="bg-white rounded-[2.5rem] border border-[#eae6de] shadow-soft p-12 relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 bg-brand-green/10 rounded-[2rem] flex items-center justify-center text-brand-green">
                      <FileSpreadsheet className="w-8 h-8" />
                   </div>
                   <div>
                      <h2 className="text-4xl font-bold text-text-dark font-serif tracking-tighter italic">Bulk Vectoring</h2>
                      <p className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em] mt-1">High-density asset ingestion module</p>
                   </div>
                </div>

                <p className="text-text-muted text-sm italic leading-relaxed mb-10 max-w-xl">
                   Synchronize your entire warehouse portfolio in seconds. Download our standardized CSV configuration, populate your asset data, and upload for global marketplace indexing.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="p-8 bg-[#f8f7f4] rounded-[2rem] border border-[#eae6de] group hover:border-brand-green/30 transition-all">
                      <Download className="w-6 h-6 text-brand-green mb-4" />
                      <h3 className="text-sm font-black text-text-dark uppercase tracking-wide mb-2">Protocol Schema</h3>
                      <p className="text-[11px] text-text-muted font-medium italic mb-6 leading-relaxed">Standardized header definitions for SKU, Category, Pricing, and Stock Vectoring.</p>
                      <button className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:underline">Download Template (.csv)</button>
                   </div>

                   <form onSubmit={handleImport} className="p-8 bg-white rounded-[2rem] border border-[#eae6de] shadow-sm flex flex-col justify-center">
                      <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#eae6de] rounded-2xl py-8 cursor-pointer hover:bg-[#faf9f6] transition-all">
                         <FileUp className={`w-8 h-8 ${file ? 'text-brand-green' : 'text-slate-200'} mb-3`} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#929285]">{file ? file.name : 'Select Data Object'}</span>
                         <input type="file" className="hidden" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} />
                      </label>
                      <button 
                        type="submit" 
                        disabled={!file || importing}
                        className="w-full mt-6 py-4 bg-text-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                      >
                         {importing ? 'Processing Vector...' : 'Deploy Batch'}
                         {!importing && <Zap className="w-4 h-4 text-brand-orange fill-brand-orange" />}
                      </button>
                   </form>
                </div>

                {report && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center gap-8 shadow-sm">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                        <CheckCircle className="w-8 h-8" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold text-text-dark font-serif tracking-tight">Ingestion Success</h4>
                        <p className="text-[11px] font-medium text-emerald-800 uppercase tracking-widest mt-1">Processed {report.processed} Assets // 0 Conflict Violations</p>
                     </div>
                     <Link href="/dashboard/supplier/products" className="ml-auto text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:underline">View Gallery</Link>
                  </motion.div>
                )}
             </div>

             <div className="absolute top-0 right-0 w-80 h-80 bg-[#f8f7f4] rounded-full blur-[120px] -translate-y-40 translate-x-40 opacity-40" />
          </div>

          <div className="mt-12 p-8 bg-brand-orange/5 rounded-[2rem] border border-brand-orange/10 flex items-start gap-5">
             <AlertTriangle className="w-6 h-6 text-brand-orange flex-shrink-0" />
             <div>
                <p className="text-[10px] items-center font-black uppercase tracking-widest text-brand-orange mb-1 italic">Cluster Pre-validation Warning</p>
                <p className="text-[11px] text-text-muted leading-relaxed font-bold italic">CSV files must use UTF-8 encoding. Any SKU collisions will result in a sequence abort. Images should be provided as direct public URLs.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
