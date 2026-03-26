'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import {
  Search, 
  ShoppingCart, 
  Filter, 
  Star, 
  Leaf, 
  ChevronRight,
  Package, 
  TrendingUp, 
  Shield, 
  SlidersHorizontal, 
  X, 
  ArrowRight,
  Zap,
  Truck,
  Award,
  Verified,
  ChevronLeft,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());

const CATEGORIES = [
  { id: 'all', label: 'All Catalogue', icon: Package },
  { id: 'seeds', label: 'Hybrid Seeds', icon: Leaf },
  { id: 'fertilizers', label: 'Soil Health', icon: Star },
  { id: 'pesticides', label: 'Plant Protection', icon: Shield },
  { id: 'tools', label: 'Hand Tools', icon: SlidersHorizontal },
  { id: 'equipment', label: 'Agri Machinery', icon: TrendingUp },
  { id: 'feed', label: 'Animal Feed', icon: Award },
];

function ProductCard({ product, onAddToCart }: { product: any; onAddToCart: (p: any) => void }) {
  const [adding, setAdding] = useState(false);
  const priceRs = (product.price / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 });
  const mrpRs = (product.mrp / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 });
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    setAdding(true);
    await onAddToCart(product);
    setAdding(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#eae6de] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all group overflow-hidden flex flex-col h-full font-sans">
      <Link href={`/marketplace/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#f8f7f4]">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-[#d6d3cb]" />
          </div>
        )}
        
        <AnimatePresence>
          {discount > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-4 px-3 py-1.5 bg-brand-orange text-white text-[10px] font-bold rounded-lg shadow-lg shadow-brand-orange/20 uppercase tracking-wider z-10"
            >
              -{discount}%
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-brand-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
           <div className="bg-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-brand-green shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
              Quick View
           </div>
        </div>
      </Link>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
           <span className="text-[11px] text-[#69665f] uppercase font-bold tracking-wider">{product.category}</span>
           <div className="flex items-center gap-1 bg-[#f6f3eb] px-2 py-1 rounded-md">
              <Star className="w-3 h-3 text-brand-orange fill-brand-orange" />
              <span className="text-[10px] text-brand-orange font-bold">4.8</span>
           </div>
        </div>
        
        <h3 className="text-text-dark font-semibold text-base leading-snug mb-4 line-clamp-2 h-12 font-serif group-hover:text-brand-green transition-colors">{product.name}</h3>
        
        <div className="mt-auto">
           <div className="flex items-baseline gap-2 mb-6">
              <span className="text-2xl font-bold text-text-dark font-serif">₹{priceRs}</span>
              {discount > 0 && <span className="text-[#b5b2aa] text-sm line-through">₹{mrpRs}</span>}
              <span className="text-[11px] text-[#69665f] font-medium ml-1">/ {product.unit}</span>
           </div>
           
           <button
             onClick={handleAdd}
             disabled={adding || product.stockQuantity === 0}
             className={`w-full py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
               product.stockQuantity === 0
                 ? 'bg-[#f6f3eb] text-[#b5b2aa] border border-[#eae6de] cursor-not-allowed'
                 : 'bg-brand-green text-white shadow-lg shadow-brand-green/10 hover:bg-brand-green-hover active:scale-95'
             }`}
           >
             {adding ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : (
               <>Add to Basket <ShoppingCart className="w-4 h-4" /></>
             )}
           </button>
        </div>
      </div>
    </div>
  );
}

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [category, setCategory] = useState(searchParams.get('category') ?? 'all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const params = new URLSearchParams();
  if (debouncedSearch) params.set('search', debouncedSearch);
  if (category !== 'all') params.set('category', category);
  params.set('page', String(page));
  params.set('limit', '12');

  const { data: authRes } = useSWR(`${API}/auth/me`, fetcher);
  const { data: cartData, mutate: mutateCart } = useSWR(`${API}/marketplace/cart`, fetcher);
  const cartCount = cartData?.data?.length ?? 0;

  const { data, isLoading } = useSWR(`${API}/marketplace/products?${params}`, fetcher);
  const products: any[] = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  async function addToCart(product: any) {
    try {
      const res = await fetch(`${API}/marketplace/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product.id,
          supplierId: product.supplierId,
          quantity: 1,
          snapshot: { name: product.name, price: product.price, mrp: product.mrp, unit: product.unit, image: product.images?.[0] },
        }),
      });
      if (!res.ok) {
        if (res.status === 401) { toast.error('Account authentication required'); router.push('/auth/login'); return; }
        const j = await res.json();
        throw new Error(j.error ?? 'Failed to add item');
      }
      mutateCart();
      toast.success('Added to Basket');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      {/* Search Header */}
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-xl border-b border-[#eae6de]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
             <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center shadow-lg shadow-brand-green/20">
                <Leaf className="w-5 h-5 text-white" />
             </div>
             <div className="hidden sm:block">
                <p className="text-text-dark font-bold text-lg font-serif tracking-tight leading-none">AgriLink</p>
                <p className="text-brand-green text-[10px] font-bold uppercase tracking-wider mt-1">Marketplace</p>
             </div>
          </Link>

          <div className="flex-1 relative max-w-2xl mx-auto">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#69665f]" />
             <input
               className="w-full bg-[#f8f7f4] border border-[#eae6de] rounded-xl pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-brand-green/10 focus:bg-white focus:border-brand-green/20 shadow-sm outline-none transition-all placeholder:text-[#69665f]"
               placeholder="Search seeds, nutrients, tools..."
               value={search}
               onChange={e => { setSearch(e.target.value); setPage(1); }}
             />
          </div>

          <div className="flex items-center gap-4">
             <Link href="/marketplace/cart" className="relative w-12 h-12 flex items-center justify-center bg-white border border-[#eae6de] rounded-xl hover:bg-[#f8f7f4] hover:shadow-md transition-all">
                <ShoppingCart className="w-5 h-5 text-text-muted" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] flex items-center justify-center font-bold shadow-lg border-2 border-white">
                    {cartCount}
                  </span>
                )}
             </Link>
             
             {authRes?.data ? (
               <Link href={`/dashboard/${authRes.data.role === 'supplier' ? 'supplier' : 'farmer'}`} className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-xl bg-text-dark text-white hover:bg-[#1a1a1a] transition-all text-[11px] font-bold uppercase tracking-wider shadow-xl">
                  Dashboard <ArrowRight className="w-4 h-4" />
               </Link>
             ) : (
               <Link href="/auth/login" className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-white hover:bg-brand-green-hover transition-all text-[11px] font-bold uppercase tracking-wider shadow-xl">
                  Log In <User className="w-4 h-4" />
               </Link>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Market Promo */}
        <div className="mb-20 relative overflow-hidden rounded-3xl bg-brand-green p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-brand-green/10">
           <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#FFB444_0,transparent_50%)]" />
           </div>
           
           <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-2 mb-6 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/10">
                 <Zap className="w-4 h-4 text-brand-orange fill-brand-orange" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-wider">Village Rewards Enabled</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-[0.9] font-serif tracking-tight">
                 High Quality <br /> Farm Inputs.
              </h1>
              <p className="text-white/80 mt-6 text-base lg:text-lg font-medium leading-relaxed max-w-md">
                 Direct factory access for seeds, nutrients and machinery with verified cluster delivery.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                 <button className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-2xl shadow-brand-orange/20 hover:scale-105 transition-all active:scale-95">Explore Catalogue</button>
                 <button className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-white/10 transition-all">Support Center</button>
              </div>
           </div>
           
           <div className="relative z-10 grid grid-cols-2 gap-4 w-full lg:w-auto">
              {[
                { icon: Shield, label: 'Verified' },
                { icon: Truck, label: 'Fast Drop' },
                { icon: Award, label: 'Premium' },
                { icon: Verified, label: 'Trusted' },
              ].map((icon, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-center gap-3 backdrop-blur-md group hover:bg-white/10 transition-colors">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <icon.icon className="w-6 h-6 text-white" />
                   </div>
                   <span className="text-[10px] font-bold uppercase text-white/80 tracking-wider">{icon.label}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
             <div className="sticky top-36 space-y-8">
                <div>
                   <h3 className="text-[11px] text-text-muted uppercase font-bold tracking-wider mb-6 px-4">Product Categories</h3>
                   <div className="flex flex-wrap lg:flex-col gap-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setCategory(cat.id); setPage(1); }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all group ${
                            category === cat.id
                              ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20'
                              : 'bg-white text-text-muted hover:bg-[#f8f7f4] hover:text-brand-green border border-[#eae6de] shadow-sm'
                          }`}
                        >
                          <cat.icon className={`w-4 h-4 ${category === cat.id ? 'text-white' : 'text-text-muted group-hover:text-brand-green'}`} />
                          {cat.label}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="bg-[#f8f7f4] rounded-2xl p-6 border border-[#eae6de] relative overflow-hidden">
                   <div className="absolute -top-4 -right-4 w-20 h-20 bg-brand-green/5 rounded-full blur-2xl" />
                   <div className="relative z-10">
                      <p className="text-brand-green font-bold text-sm mb-3 font-serif uppercase tracking-wider">Bulk Program</p>
                      <p className="text-text-muted/80 text-xs leading-relaxed mb-6 font-medium">Contact our village cluster managers for wholesale pricing and direct logistics.</p>
                      <button className="w-full py-3 bg-white text-brand-green rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all">Connect with Expert</button>
                   </div>
                </div>
             </div>
          </aside>

          {/* Catalogue */}
          <div className="flex-1 min-w-0">
             {/* Catalogue Header */}
             <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12 pb-8 border-b border-[#eae6de]">
                <div>
                   <h2 className="text-3xl md:text-4xl font-bold text-text-dark font-serif tracking-tight capitalize">
                      {category === 'all' ? 'Featured Selection' : category}
                   </h2>
                   <p className="text-text-muted text-sm font-medium mt-2">
                      Showing {pagination?.total || 0} agricultural solutions for your district
                   </p>
                </div>
                
                <div className="flex items-center gap-4">
                   <select className="bg-white border border-[#eae6de] rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted outline-none focus:ring-2 focus:ring-brand-green/10 shadow-sm cursor-pointer">
                      <option>Featured First</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Highest Rated</option>
                   </select>
                </div>
             </div>

             {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                 {Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="bg-white aspect-[3/4] rounded-2xl animate-pulse border border-[#eae6de] shadow-sm" />
                 ))}
               </div>
             ) : products.length === 0 ? (
               <div className="bg-white py-24 rounded-3xl border border-[#eae6de] text-center shadow-sm">
                  <div className="w-20 h-20 rounded-2xl bg-[#f8f7f4] flex items-center justify-center mx-auto mb-8">
                    <Package className="w-10 h-10 text-[#d6d3cb]" />
                  </div>
                  <h3 className="text-text-dark font-bold text-2xl font-serif">No Products Found</h3>
                  <p className="text-text-muted text-base mt-3 max-w-xs mx-auto font-medium leading-relaxed">Try broadening your search or switching filter categories.</p>
                  <button onClick={() => { setSearch(''); setCategory('all'); }} className="mt-8 px-8 py-3 bg-text-dark text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-xl">Reset All Filters</button>
               </div>
             ) : (
               <>
                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                   {products.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <ProductCard product={product} onAddToCart={addToCart} />
                      </motion.div>
                   ))}
                 </div>

                 {/* Pagination */}
                 {pagination && pagination.pages > 1 && (
                   <div className="flex items-center justify-center gap-4 mt-20">
                      <button 
                        disabled={!pagination.hasPrev} 
                        onClick={() => setPage(p => p - 1)}
                        className="w-12 h-12 rounded-xl bg-white border border-[#eae6de] flex items-center justify-center text-text-muted hover:text-brand-green hover:border-brand-green/30 transition-all shadow-sm hover:shadow-md disabled:opacity-30 disabled:hover:text-text-muted"
                      >
                         <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-2">
                         {Array.from({ length: pagination.pages }).map((_, i) => (
                           <button
                             key={i}
                             onClick={() => setPage(i + 1)}
                             className={`w-12 h-12 rounded-xl text-[11px] font-bold uppercase transition-all ${
                               pagination.page === i + 1 
                                ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20 px-4' 
                                : 'bg-white text-text-muted border border-[#eae6de] hover:bg-[#f8f7f4] w-12'
                             }`}
                           >
                             {i + 1}
                           </button>
                         ))}
                      </div>
                      <button 
                        disabled={!pagination.hasNext} 
                        onClick={() => setPage(p => p + 1)}
                        className="w-12 h-12 rounded-xl bg-white border border-[#eae6de] flex items-center justify-center text-text-muted hover:text-brand-green hover:border-brand-green/30 transition-all shadow-sm hover:shadow-md disabled:opacity-30 disabled:hover:text-text-muted"
                      >
                         <ChevronRight className="w-5 h-5" />
                      </button>
                   </div>
                 )}
               </>
             )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white py-20 border-t border-[#eae6de]">
         <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center shadow-lg shadow-brand-green/20 mb-8">
               <Leaf className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-text-dark font-serif tracking-tight mb-6 uppercase">agrilink platform</h2>
            <p className="text-text-muted text-base max-w-2xl leading-relaxed font-medium px-4">
               Optimizing agricultural value chain through verified factory access, blockchain security, and cluster-based smart logistics. Empowering modern Indian farmer.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 mt-16 text-left w-full max-w-5xl border-t border-[#eae6de] pt-16">
               <div className="space-y-4">
                  <p className="text-[11px] font-bold text-text-dark uppercase tracking-wider mb-6">Supply Chain</p>
                  <Link href="/marketplace" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Hybrid Seeds</Link>
                  <Link href="/marketplace" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Soil Nutrition</Link>
                  <Link href="/marketplace" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Crop Protection</Link>
               </div>
               <div className="space-y-4">
                  <p className="text-[11px] font-bold text-text-dark uppercase tracking-wider mb-6">Partner Program</p>
                  <Link href="/register" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Supplier Onboarding</Link>
                  <Link href="/auth/login" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Fulfilment Center</Link>
                  <Link href="/terms" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Quality Control</Link>
               </div>
               <div className="space-y-4">
                  <p className="text-[11px] font-bold text-text-dark uppercase tracking-wider mb-6">Trust Center</p>
                  <Link href="/terms" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Terms of Service</Link>
                  <Link href="/privacy" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Privacy Policy</Link>
                  <Link href="/verification" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">KYC Verification</Link>
               </div>
               <div className="space-y-4">
                  <p className="text-[11px] font-bold text-text-dark uppercase tracking-wider mb-6">Initiatives</p>
                  <Link href="/" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Rural Digitalization</Link>
                  <Link href="/" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Impact Analytics</Link>
                  <Link href="/" className="block text-text-muted hover:text-brand-green text-sm font-semibold transition-colors">Sustainability</Link>
               </div>
            </div>
            <div className="mt-16 pt-8 border-t border-[#eae6de] w-full flex flex-col md:flex-row items-center justify-between gap-8 px-2">
               <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider"> 2026 agrilink intelligence pvt ltd</p>
               <div className="flex items-center gap-6">
                  <span className="text-[10px] font-bold text-text-dark uppercase tracking-wider">v2.5 Enterprise Stable</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-main)]" />}>
      <MarketplaceContent />
    </Suspense>
  );
}
