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
import { parseCsv, toCsv } from '@/lib/csv';

const COLUMNS = ['name', 'category', 'description', 'price', 'mrp', 'unit', 'stockQuantity', 'reorderThreshold', 'tags'];

function downloadTemplate() {
  const csv = toCsv([
    COLUMNS,
    ['Neem coated urea 45kg', 'fertilizers', 'Government-approved neem coated urea for all crops', 266.5, 270, 'bag', 100, 10, 'urea;nitrogen'],
    ['Hybrid ragi seeds MR-6 (2kg)', 'seeds', 'High-yield finger millet seed suitable for Karnataka', 450, 500, 'packet', 40, 5, 'ragi;millet'],
  ]);
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agrilink-products-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

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
    
    try {
      const rows = parseCsv(await file.text());
      if (rows.length === 0) throw new Error('The file has no product rows');
      const missing = ['name', 'category', 'description', 'price', 'unit'].filter((c) => !(c in rows[0]));
      if (missing.length) throw new Error(`Missing column(s): ${missing.join(', ')}. Use the template.`);

      const res = await fetch(`${API}/supplier/products/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rows }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Import failed');
      setReport(json.data);
      json.data.errors.length
        ? toast(`${json.data.created} imported, ${json.data.errors.length} need fixing`)
        : toast.success(`${json.data.created} products imported as drafts`);
    } catch (err: any) {
      toast.error(err.message);
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
                      <h2 className="text-4xl font-bold text-text-dark font-serif tracking-tighter">Bulk import</h2>
                      <p className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em] mt-1">Add many products from a spreadsheet</p>
                   </div>
                </div>

                <p className="text-text-muted text-sm italic leading-relaxed mb-10 max-w-xl">
                   Fill in the template in Excel or Google Sheets, save as CSV, and upload it. Products are added as drafts so you can add photos and publish them from your Products page.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="p-8 bg-[#f8f7f4] rounded-[2rem] border border-[#eae6de] group hover:border-brand-green/30 transition-all">
                      <Download className="w-6 h-6 text-brand-green mb-4" />
                      <h3 className="text-sm font-black text-text-dark uppercase tracking-wide mb-2">1. Get the template</h3>
                      <p className="text-[11px] text-text-muted font-medium mb-6 leading-relaxed">Columns: {COLUMNS.join(', ')}. Prices in rupees; category is one of seeds, fertilizers, pesticides, tools, equipment, feed, other; separate tags with “;”.</p>
                      <button type="button" onClick={downloadTemplate} className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:underline">Download template (.csv)</button>
                   </div>

                   <form onSubmit={handleImport} className="p-8 bg-white rounded-[2rem] border border-[#eae6de] shadow-sm flex flex-col justify-center">
                      <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#eae6de] rounded-2xl py-8 cursor-pointer hover:bg-[#faf9f6] transition-all">
                         <FileUp className={`w-8 h-8 ${file ? 'text-brand-green' : 'text-slate-200'} mb-3`} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#929285]">{file ? file.name : 'Choose CSV file'}</span>
                         <input type="file" className="hidden" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} />
                      </label>
                      <button 
                        type="submit" 
                        disabled={!file || importing}
                        className="w-full mt-6 py-4 bg-text-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                      >
                         {importing ? 'Importing…' : 'Import products'}
                         {!importing && <Zap className="w-4 h-4 text-brand-orange fill-brand-orange" />}
                      </button>
                   </form>
                </div>

                {report && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                    <div className={`p-8 rounded-[2rem] border flex items-center gap-6 ${report.errors.length ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                      {report.errors.length ? <AlertTriangle className="w-8 h-8 text-amber-600" /> : <CheckCircle className="w-8 h-8 text-emerald-600" />}
                      <div>
                        <h4 className="text-xl font-bold text-text-dark font-serif">{report.created} of {report.processed} rows imported</h4>
                        <p className="text-sm text-text-muted">New products are saved as drafts.</p>
                      </div>
                      <Link href="/dashboard/supplier/products?status=draft" className="ml-auto text-[10px] font-black uppercase tracking-widest text-brand-green hover:underline">Review drafts</Link>
                    </div>
                    {report.errors.length > 0 && (
                      <div className="rounded-[2rem] border border-[#eae6de] overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-[#f8f7f4] text-left text-[10px] uppercase tracking-widest text-text-muted"><tr><th className="p-3 w-20">Row</th><th className="p-3">Problem</th></tr></thead>
                          <tbody className="divide-y divide-[#f1eee8]">
                            {report.errors.map((e: any) => <tr key={e.row}><td className="p-3 font-bold">{e.row + 1}</td><td className="p-3 text-red-700">{e.error}</td></tr>)}
                          </tbody>
                        </table>
                        <p className="p-3 text-[11px] text-text-muted">Row numbers match your spreadsheet (row 1 is the header). Fix these rows and import them again.</p>
                      </div>
                    )}
                  </motion.div>
                )}
             </div>

             <div className="absolute top-0 right-0 w-80 h-80 bg-[#f8f7f4] rounded-full blur-[120px] -translate-y-40 translate-x-40 opacity-40" />
          </div>

          <div className="mt-12 p-8 bg-brand-orange/5 rounded-[2rem] border border-brand-orange/10 flex items-start gap-5">
             <AlertTriangle className="w-6 h-6 text-brand-orange flex-shrink-0" />
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-1">Tips</p>
                <p className="text-[11px] text-text-muted leading-relaxed font-bold">Up to 500 rows per file. Save as “CSV UTF-8” so Kannada text is kept. Add photos to each product after import. Valid rows are imported even if other rows have errors.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
