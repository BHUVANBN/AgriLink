'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, ArrowRight, Filter, SlidersHorizontal, Heart, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { addToWishlist, removeFromWishlist, getWishlist } from '@/lib/marketplace/wishlist';
import { addToCart as addToCartUtil } from '@/lib/marketplace/cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/marketplace/products/public`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      if (res.success) {
        setWishlistIds(new Set(res.data.map((item: any) => item.productId)));
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  const toggleWishlist = async (product: any) => {
    const isSaved = wishlistIds.has(product.id);
    try {
      if (isSaved) {
        const res = await removeFromWishlist(product.id);
        if (res.success) {
          toast.success('Removed from wishlist');
          setWishlistIds(prev => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
        }
      } else {
        const res = await addToWishlist(product);
        if (res.success) {
          toast.success('Saved to wishlist');
          setWishlistIds(prev => new Set([...prev, product.id]));
        }
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const addToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      const res = await addToCartUtil(productId, 1);
      if (res.success) {
        toast.success('Added to cart');
      } else {
        toast.error(res.error || 'Failed to add to cart');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-[#eae6de] p-4 animate-pulse">
            <div className="aspect-square bg-[#f8f7f4] rounded-2xl mb-4" />
            <div className="h-4 bg-[#f8f7f4] rounded w-3/4 mb-2" />
            <div className="h-3 bg-[#f8f7f4] rounded w-1/2 mb-4" />
            <div className="h-8 bg-[#f8f7f4] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-brand-green h-[400px] flex items-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="relative z-10 px-12 max-w-2xl">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6">
            Seasonal Offers
          </span>
          <h1 className="text-5xl font-serif font-bold text-white leading-tight mb-6">
            Boost Your Yield with Premium Inputs
          </h1>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Get exclusive access to certified seeds and fertilizers from trusted suppliers in Karnataka.
          </p>
          <button className="px-8 py-4 bg-white text-brand-green rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:bg-brand-orange hover:text-white transition-all flex items-center gap-3">
            Shop Top Deals <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-text-dark mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-2">
              {['Seeds', 'Fertilizers', 'Tools', 'Machinery'].map((cat) => (
                <label key={cat} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white border border-transparent hover:border-[#eae6de] cursor-pointer transition-all group">
                  <input type="checkbox" className="w-4 h-4 rounded-md border-[#eae6de] text-brand-green focus:ring-brand-green/20" />
                  <span className="text-sm text-text-muted group-hover:text-text-dark transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-text-dark">All Products</h2>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-dark transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Sort By: Recommended
            </button>
          </div>

          {products.length === 0 ? (
             <div className="bg-white rounded-3xl border border-[#eae6de] border-dashed p-20 text-center">
                <div className="w-20 h-20 bg-[#f8f7f4] rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-serif font-bold text-text-dark mb-2">No products found</h3>
                <p className="text-text-muted max-w-xs mx-auto">We couldn't find any products matching your current filters.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-[2rem] border border-[#eae6de] overflow-hidden hover:border-brand-green/30 hover:shadow-2xl hover:shadow-brand-green/5 transition-all flex flex-col"
                >
                  <div className="block aspect-[4/3] relative bg-[#f8f7f4] overflow-hidden">
                    <Link href={`/dashboard/farmer/marketplace/products/${p.id}`}>
                      {p.images?.[0] ? (
                        <Image 
                          src={p.images[0]} 
                          alt={p.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                    </Link>
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-green">
                         {p.category}
                       </span>
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md ${
                        wishlistIds.has(p.id) 
                          ? 'bg-red-500 text-white scale-110' 
                          : 'bg-white/90 text-slate-400 hover:text-red-500 hover:scale-110'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${wishlistIds.has(p.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/dashboard/farmer/marketplace/products/${p.id}`}>
                        <h4 className="font-serif font-bold text-lg text-text-dark group-hover:text-brand-green transition-colors line-clamp-1">{p.name}</h4>
                      </Link>
                      <div className="flex items-center gap-1 text-brand-orange">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-black">4.8</span>
                      </div>
                    </div>
                    <p className="text-text-muted text-xs line-clamp-2 mb-6 h-8">{p.description}</p>
                    
                    <div className="mt-auto pt-6 border-t border-[#f8f7f4] flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Price</p>
                        <p className="text-xl font-bold text-text-dark">₹{p.price / 100}</p>
                      </div>
                      <button
                        onClick={() => addToCart(p.id)}
                        disabled={addingToCart === p.id}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          addingToCart === p.id 
                            ? 'bg-[#f8f7f4] text-text-muted' 
                            : 'bg-brand-green text-white hover:bg-brand-orange shadow-lg shadow-brand-green/20'
                        }`}
                      >
                        {addingToCart === p.id ? (
                          <div className="w-5 h-5 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShoppingCart className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
