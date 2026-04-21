'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, Store, Info, Package, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { addToCart as apiAddToCart } from '@/lib/marketplace/cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/supplier/products/public/${id}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await apiAddToCart(product.id, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return null;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/farmer/marketplace"
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted hover:text-brand-green transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-[#f8f7f4] rounded-[2.5rem] border border-[#eae6de] overflow-hidden">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-300">
                <Package className="w-20 h-20" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img: string, idx: number) => (
              <div key={idx} className="aspect-square bg-white rounded-2xl border border-[#eae6de] overflow-hidden cursor-pointer hover:border-brand-green transition-all">
                <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-brand-green/10 text-brand-green rounded-lg text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-brand-orange">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-black">4.9 (124 Reviews)</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-text-dark leading-tight">{product.name}</h1>
            <p className="text-text-muted leading-relaxed">{product.description}</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#eae6de] flex items-center justify-between shadow-xl shadow-black/5">
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Price</p>
              <p className="text-3xl font-bold text-brand-green">₹{product.price / 100}</p>
              <p className="text-[10px] text-text-muted">Inclusive of all taxes (GST 18%)</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">In Stock</p>
              <p className="text-sm font-bold text-text-dark">{product.stockQuantity} {product.unit}s</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-1 bg-[#f8f7f4] rounded-2xl p-1 border border-[#eae6de]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white text-text-dark transition-all"
              >
                -
              </button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white text-text-dark transition-all"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 py-4 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-brand-green/20 hover:bg-brand-orange transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            >
              {adding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Add to Cart <ShoppingCart className="w-4 h-4" /></>
              )}
              
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    exit={{ y: -50 }}
                    className="absolute inset-0 bg-brand-orange flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Added!
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#f8f7f4] rounded-2xl border border-[#eae6de] flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-green shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-dark uppercase tracking-widest">Fast Delivery</p>
                <p className="text-[10px] text-text-muted">Within 2-3 business days</p>
              </div>
            </div>
            <div className="p-4 bg-[#f8f7f4] rounded-2xl border border-[#eae6de] flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-green shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-dark uppercase tracking-widest">Quality Assured</p>
                <p className="text-[10px] text-text-muted">100% Genuine products</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#eae6de] space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#f8f7f4] rounded-full overflow-hidden relative">
                  <Store className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Sold By</p>
                  <h4 className="font-serif font-bold text-lg text-text-dark">{product.supplier?.companyName || 'Verified Supplier'}</h4>
               </div>
               <Link href={`/dashboard/farmer/marketplace/seller/${product.supplierId}`} className="ml-auto text-[10px] font-black uppercase tracking-widest text-brand-green hover:text-brand-orange transition-colors">
                  View Store
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
