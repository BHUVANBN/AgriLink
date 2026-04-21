'use client';

import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { removeFromWishlist } from '@/lib/marketplace/wishlist';
import { addToCart } from '@/lib/marketplace/cart';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()).then(d => d.data);

export default function WishlistPage() {
  const { data: wishlist, mutate, isLoading } = useSWR(`${API}/marketplace/wishlist`, fetcher);

  const handleRemove = async (productId: string) => {
    try {
      const res = await removeFromWishlist(productId);
      if (res.success) {
        toast.success('Removed from wishlist');
        mutate();
      }
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  const handleMoveToCart = async (item: any) => {
    try {
      const res = await addToCart(item.productId, 1);
      if (res.success) {
        toast.success('Added to cart');
        await removeFromWishlist(item.productId);
        mutate();
      }
    } catch (err) {
      toast.error('Failed to move to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green" />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <Heart className="w-10 h-10 text-red-500 fill-red-500" />
          Saved for Later
        </h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2 ml-1">
          {wishlist?.length || 0} ITEMS IN YOUR WISHLIST
        </p>
      </div>

      {!wishlist || wishlist.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 border border-slate-200 text-center shadow-xl shadow-slate-200/20">
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200">
            <Heart className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">Your wishlist is empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">
            Save products you like to find them easily later and get notified about price drops.
          </p>
          <Link 
            href="/dashboard/farmer/marketplace"
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20"
          >
            Go Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {wishlist.map((item: any) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img 
                    src={item.snapshot.image || 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800'} 
                    alt={item.snapshot.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <button 
                    onClick={() => handleRemove(item.productId)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">{item.snapshot.category || 'Agricultural'}</span>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-brand-green transition-colors line-clamp-1">{item.snapshot.name}</h4>
                  </div>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-2xl font-black text-slate-900">₹{item.snapshot.price}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">/{item.snapshot.unit || 'unit'}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Move to Cart
                    </button>
                    <Link 
                      href={`/dashboard/farmer/marketplace/products/${item.productId}`}
                      className="w-full py-4 bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
