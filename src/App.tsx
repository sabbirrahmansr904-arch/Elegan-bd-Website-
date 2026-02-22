/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Phone, 
  Facebook, 
  Instagram, 
  ChevronRight, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw,
  ArrowRight,
  MessageCircle,
  Trash2,
  Plus,
  Minus,
  User as UserIcon
} from 'lucide-react';
import { Product, CartItem, User, Order } from './types';

// --- Components ---

const Logo = ({ className = "", light = true }: { className?: string, light?: boolean }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="flex flex-col gap-[2px]">
      <div className={`w-5 h-1.5 ${light ? 'bg-white' : 'bg-black'} -skew-x-[25deg] ml-3`}></div>
      <div className={`w-5 h-1.5 ${light ? 'bg-white' : 'bg-black'} -skew-x-[25deg]`}></div>
      <div className={`w-5 h-1.5 ${light ? 'bg-white' : 'bg-black'} -skew-x-[25deg] ml-1.5`}></div>
    </div>
    <span className={`text-base font-serif font-bold tracking-tighter uppercase whitespace-nowrap ${light ? 'text-white' : 'text-black'}`}>
      Elegan BD
    </span>
  </div>
);

const Navbar = ({ cartCount, onOpenCart, onOpenUser, onNavigate, user }: { 
  cartCount: number, 
  onOpenCart: () => void, 
  onOpenUser: () => void,
  onNavigate: (page: string) => void,
  user: User | null
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Shop', id: 'shop' },
    { name: 'About Us', id: 'about' },
    { name: 'Size Guide', id: 'size-guide' },
    { name: 'Contact', id: 'contact' },
    { name: 'Admin', id: 'admin' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Menu Icon */}
          <div className="flex items-center">
            <button 
              className="p-2 text-white hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Desktop Nav Links */}
            <div className="hidden lg:flex ml-8 space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className="text-[10px] font-bold text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button 
              onClick={() => onNavigate('home')} 
              className="hover:opacity-80 transition-opacity"
            >
              <Logo />
            </button>
          </div>

          {/* Right: Cart & User */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={onOpenUser}
              className="p-2 text-white hover:text-white/70 transition-colors flex items-center gap-2"
            >
              <UserIcon size={20} />
              {user && <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">{user.name.split(' ')[0]}</span>}
            </button>
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-white/70 transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-white text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-zinc-900 border-r border-white/10 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 border-b border-white/5 mb-4">
              <Logo />
            </div>
            <div className="p-6 space-y-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-bold uppercase tracking-widest text-white hover:text-white/60 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const UserPanel = ({ isOpen, onClose, onLoginSuccess, user, onLogout }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onLoginSuccess: (user: User) => void,
  user: User | null,
  onLogout: () => void
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/register' : '/api/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        if (isRegister) {
          setIsRegister(false);
          setError('Registration successful! Please login.');
        } else {
          onLoginSuccess(data.user);
          onClose();
        }
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold">
                {user ? 'My Account' : (isRegister ? 'Create Account' : 'Login')}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {user ? (
                <div className="space-y-8">
                  <div className="bg-zinc-50 p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Welcome back,</p>
                    <h3 className="text-2xl font-serif font-bold">{user.name}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Phone</p>
                      <p className="text-sm font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Address</p>
                      <p className="text-sm font-medium">{user.address}</p>
                    </div>
                  </div>

                  <button 
                    onClick={onLogout}
                    className="w-full border border-red-200 text-red-500 py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <p className="text-xs text-red-500 bg-red-50 p-3">{error}</p>}
                  
                  {isRegister && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Full Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 transition-colors"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 transition-colors"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Password</label>
                    <input 
                      required
                      type="password" 
                      className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 transition-colors"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>

                  {isRegister && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Phone Number</label>
                        <input 
                          required
                          type="tel" 
                          className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 transition-colors"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Default Address</label>
                        <textarea 
                          required
                          className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 transition-colors resize-none"
                          rows={2}
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary py-4 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Login')}
                  </button>

                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={() => setIsRegister(!isRegister)}
                      className="text-xs text-zinc-500 hover:text-zinc-900 underline"
                    >
                      {isRegister ? 'Already have an account? Login' : 'New customer? Create an account'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Hero = ({ onShopNow }: { onShopNow: () => void }) => {
  return (
    <div className="pt-20">
      <section className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
        <img 
          src="https://i.imgur.com/QSAF3GM.jpeg" 
          alt="Hero Model" 
          className="w-full h-full object-cover object-top"
          referrerPolicy="no-referrer"
        />
      </section>
      
      <div className="bg-white py-12 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button onClick={onShopNow} className="btn-primary px-12">
              Shop Now
            </button>
            <button onClick={onShopNow} className="btn-secondary px-12">
              View Collection
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onSelect }: { product: Product, onSelect: (p: Product) => void, key?: React.Key }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {product.originalPrice > product.price && (
          <div className="absolute top-4 left-4 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
            Sale
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
          <button className="bg-white text-zinc-900 px-6 py-2 text-xs font-bold uppercase tracking-widest shadow-xl">
            Quick View
          </button>
        </div>
      </div>
      <h3 className="text-sm font-medium text-zinc-900 mb-1 uppercase tracking-tight">{product.name}</h3>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-zinc-900">৳{product.price}</span>
        {product.originalPrice > product.price && (
          <span className="text-xs text-zinc-400 line-through">৳{product.originalPrice}</span>
        )}
      </div>
    </motion.div>
  );
};

const ProductDetails = ({ product, onAddToCart, onBack }: { product: Product, onAddToCart: (p: Product, size: number) => void, onBack: () => void }) => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(product.image);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <button 
        onClick={onBack}
        className="flex items-center text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        <ArrowRight className="rotate-180 mr-2" size={16} />
        Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-zinc-100 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-zinc-900">
              <Star size={16} fill="currentColor" />
              <span className="ml-1 text-sm font-bold">{product.rating}</span>
            </div>
            <span className="text-zinc-400 text-sm">({product.reviews} Reviews)</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-bold text-zinc-900">৳{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-zinc-400 line-through">৳{product.originalPrice}</span>
            )}
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Select Size</h4>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm font-medium border ${selectedSize === size ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-900'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Fabric</h4>
              <p className="text-zinc-900 font-medium">{product.fabric}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Fit Type</h4>
              <p className="text-zinc-900 font-medium">{product.fit}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Description</h4>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              onClick={() => selectedSize && onAddToCart(product, selectedSize)}
              disabled={!selectedSize}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button className="flex-1 btn-secondary">
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-zinc-100">
            <div className="text-center">
              <Truck size={20} className="mx-auto mb-2 text-zinc-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Fast Delivery</span>
            </div>
            <div className="text-center">
              <ShieldCheck size={20} className="mx-auto mb-2 text-zinc-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
            </div>
            <div className="text-center">
              <RefreshCw size={20} className="mx-auto mb-2 text-zinc-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Easy Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose, items, onUpdateQty, onRemove, onCheckout }: { 
  isOpen: boolean, 
  onClose: () => void, 
  items: CartItem[], 
  onUpdateQty: (id: number, size: number, delta: number) => void,
  onRemove: (id: number, size: number) => void,
  onCheckout: () => void
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold">Your Cart ({items.length})</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                  <ShoppingBag size={64} strokeWidth={1} className="mb-4" />
                  <p className="text-lg">Your cart is empty</p>
                  <button onClick={onClose} className="mt-4 text-zinc-900 font-bold underline">Start Shopping</button>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-24 h-32 bg-zinc-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-bold text-zinc-900 uppercase">{item.name}</h3>
                        <button onClick={() => onRemove(item.id, item.selectedSize)} className="text-zinc-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Size: {item.selectedSize}</p>
                      <div className="mt-auto flex justify-between items-center">
                        <div className="flex items-center border border-zinc-200">
                          <button 
                            onClick={() => onUpdateQty(item.id, item.selectedSize, -1)}
                            className="p-1 hover:bg-zinc-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQty(item.id, item.selectedSize, 1)}
                            className="p-1 hover:bg-zinc-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-zinc-900">৳{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-100 bg-zinc-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Subtotal</span>
                  <span className="text-2xl font-serif font-bold text-zinc-900">৳{total}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full btn-primary py-4"
                >
                  Checkout
                </button>
                <p className="text-center text-[10px] text-zinc-400 mt-4 uppercase tracking-widest">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CheckoutPage = ({ items, onBack, onComplete }: { items: CartItem[], onBack: () => void, onComplete: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Dhaka',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 60;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          total_amount: total + shipping,
          items: items
        })
      });
      
      if (response.ok) {
        onComplete();
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-8">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full border-b border-zinc-200 py-3 focus:border-zinc-900 outline-none transition-colors"
                placeholder="Enter your name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Phone Number</label>
              <input 
                required
                type="tel" 
                className="w-full border-b border-zinc-200 py-3 focus:border-zinc-900 outline-none transition-colors"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Delivery Address</label>
              <textarea 
                required
                className="w-full border-b border-zinc-200 py-3 focus:border-zinc-900 outline-none transition-colors resize-none"
                placeholder="House, Road, Area..."
                rows={3}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
            
            <div className="pt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Payment Method</h3>
              <div className="p-4 border border-zinc-900 bg-zinc-50 flex items-center justify-between">
                <span className="font-medium">Cash on Delivery (COD)</span>
                <ShieldCheck className="text-zinc-900" size={20} />
              </div>
              <p className="text-xs text-zinc-400 mt-2 italic">Pay when you receive the product at your doorstep.</p>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full btn-primary py-4 mt-8 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Order'}
              {!isSubmitting && <ChevronRight size={18} />}
            </button>
          </form>
        </div>

        <div className="bg-zinc-50 p-8 h-fit sticky top-32">
          <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-8">
            {items.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                <span className="text-zinc-600">{item.name} (Size {item.selectedSize}) x {item.quantity}</span>
                <span className="font-bold">৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Subtotal</span>
              <span>৳{total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Shipping (Inside Dhaka)</span>
              <span>৳{shipping}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-4">
              <span>Total</span>
              <span>৳{total + shipping}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = ({ onBack }: { onBack: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'eleganbd.ltd@gmail.com' && password === 'eleganbd2026@@##') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect email or password');
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 max-w-md mx-auto px-4">
        <h2 className="text-2xl font-serif font-bold mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Admin Email" 
            className="w-full border-b border-zinc-200 py-3 outline-none focus:border-zinc-900"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Admin Password" 
            className="w-full border-b border-zinc-200 py-3 outline-none focus:border-zinc-900"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full btn-primary py-3">Login</button>
          <button type="button" onClick={onBack} className="w-full text-zinc-500 text-sm">Back to Home</button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold">Order Management</h2>
        <button onClick={onBack} className="text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900">Back</button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <th className="py-4 px-2">Order ID</th>
                <th className="py-4 px-2">Customer</th>
                <th className="py-4 px-2">Items</th>
                <th className="py-4 px-2">Total</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map(order => (
                <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="py-4 px-2 font-mono">#{order.id}</td>
                  <td className="py-4 px-2">
                    <p className="font-bold">{order.customer_name}</p>
                    <p className="text-xs text-zinc-500">{order.phone}</p>
                    <p className="text-xs text-zinc-500 max-w-[200px] truncate">{order.address}</p>
                  </td>
                  <td className="py-4 px-2">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-xs">{item.name} ({item.selectedSize}) x{item.quantity}</p>
                    ))}
                  </td>
                  <td className="py-4 px-2 font-bold">৳{order.total_amount}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-wrap gap-2">
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <>
                          <button 
                            onClick={() => updateStatus(order.id!, 'shipped')}
                            className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline"
                          >
                            Ship
                          </button>
                          <button 
                            onClick={() => updateStatus(order.id!, 'delivered')}
                            className="text-[10px] font-bold uppercase tracking-widest text-green-600 hover:underline"
                          >
                            Deliver
                          </button>
                          <button 
                            onClick={() => {
                              if(confirm('Are you sure you want to cancel this order?')) {
                                updateStatus(order.id!, 'cancelled')
                              }
                            }}
                            className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Logo className="mb-6" />
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Premium formal wear for the modern gentleman. Crafted with precision, designed for elegance.
            </p>
            <div className="space-y-2">
              <p className="text-zinc-400 text-sm">
                <span className="text-white font-bold uppercase tracking-widest text-[10px] block mb-1">Email</span>
                eleganbd.ltd@gmail.com
              </p>
              <p className="text-zinc-400 text-sm">
                <span className="text-white font-bold uppercase tracking-widest text-[10px] block mb-1">Phone</span>
                +8801619835133
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Shop All</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            © 2026 ELEGAN BD. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
    
    // Check local storage for user session
    const savedUser = localStorage.getItem('elegan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('elegan_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('elegan_user');
    setIsUserOpen(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedProduct(null);
    setOrderSuccess(false);
    window.scrollTo(0, 0);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product, size: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id: number, size: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number, size: number) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const handleCheckoutComplete = () => {
    setCart([]);
    setOrderSuccess(true);
    setCurrentPage('success');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenUser={() => setIsUserOpen(true)}
        onNavigate={handleNavigate}
        user={user}
      />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero onShopNow={() => handleNavigate('shop')} />
            
            {/* Featured Section */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-zinc-900">Explore Our Top Collections</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} onSelect={handleProductSelect} />
                  ))}
                </div>
                <div className="mt-16 text-center">
                  <button onClick={() => handleNavigate('shop')} className="btn-secondary">
                    View All Products
                  </button>
                </div>
              </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-zinc-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                      <ShieldCheck size={32} className="text-zinc-900" />
                    </div>
                    <h3 className="text-lg font-serif font-bold mb-3">Premium Quality</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">We use only the finest fabrics sourced for durability and comfort.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                      <Truck size={32} className="text-zinc-900" />
                    </div>
                    <h3 className="text-lg font-serif font-bold mb-3">Fast Delivery</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">Quick delivery across all 64 districts of Bangladesh.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                      <RefreshCw size={32} className="text-zinc-900" />
                    </div>
                    <h3 className="text-lg font-serif font-bold mb-3">Easy Exchange</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">Not the right fit? Exchange within 3 days with no hassle.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentPage === 'shop' && (
          <section className="pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-2">Formal Collection</h1>
                  <p className="text-zinc-500">Showing all {products.length} products</p>
                </div>
                <div className="flex gap-4">
                  <select className="bg-transparent border-b border-zinc-200 py-2 text-sm outline-none focus:border-zinc-900">
                    <option>Newest First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} onSelect={handleProductSelect} />
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === 'product-details' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct} 
            onAddToCart={addToCart} 
            onBack={() => handleNavigate('shop')} 
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage 
            items={cart} 
            onBack={() => setCurrentPage('shop')} 
            onComplete={handleCheckoutComplete}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPanel onBack={() => handleNavigate('home')} />
        )}

        {currentPage === 'success' && (
          <section className="pt-48 pb-32 text-center">
            <div className="max-w-md mx-auto px-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck size={40} />
              </div>
              <h1 className="text-3xl font-serif font-bold mb-4">Order Confirmed!</h1>
              <p className="text-zinc-600 mb-10">Thank you for shopping with ELEGAN BD. We've received your order and will contact you shortly for confirmation.</p>
              <button onClick={() => handleNavigate('home')} className="btn-primary w-full">
                Back to Home
              </button>
            </div>
          </section>
        )}

        {currentPage === 'about' && (
          <section className="pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-8 text-center">Our Story</h1>
              <div className="aspect-video bg-zinc-100 mb-12 overflow-hidden">
                <img src="https://picsum.photos/seed/elegan-about/1200/800?grayscale" alt="Workshop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="prose prose-zinc max-w-none">
                <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                  Founded in 2024, <strong>ELEGAN BD</strong> was born out of a simple necessity: the need for high-quality, perfectly fitted formal wear that doesn't break the bank. We noticed that the modern Bangladeshi professional often had to choose between overpriced international brands or low-quality local alternatives.
                </p>
                <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                  Our mission is to bridge that gap. We source premium fabrics that are breathable and durable, perfectly suited for the humid climate of Bangladesh. Each pair of pants is crafted with meticulous attention to detail, ensuring a fit that feels custom-made.
                </p>
                <h3 className="text-2xl font-serif font-bold text-zinc-900 mt-12 mb-4">Our Commitment</h3>
                <ul className="space-y-4 text-zinc-600">
                  <li className="flex gap-3">
                    <ChevronRight className="text-zinc-900 flex-shrink-0" size={20} />
                    <span><strong>Quality First:</strong> We never compromise on fabric or stitching quality.</span>
                  </li>
                  <li className="flex gap-3">
                    <ChevronRight className="text-zinc-900 flex-shrink-0" size={20} />
                    <span><strong>Fair Pricing:</strong> Premium formal wear at prices that make sense for Bangladeshi customers.</span>
                  </li>
                  <li className="flex gap-3">
                    <ChevronRight className="text-zinc-900 flex-shrink-0" size={20} />
                    <span><strong>Customer Trust:</strong> Your satisfaction is our priority. We offer easy exchanges and dedicated support.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'contact' && (
          <section className="pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-4">Get in Touch</h1>
                <p className="text-zinc-500">Have questions? We're here to help you find the perfect fit.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="bg-zinc-50 p-8 text-center">
                  <Phone className="mx-auto mb-4 text-zinc-900" size={24} />
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-2">Call Us</h3>
                  <p className="text-zinc-600">+880 1700 000 000</p>
                </div>
                <div className="bg-zinc-50 p-8 text-center">
                  <MessageCircle className="mx-auto mb-4 text-zinc-900" size={24} />
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-2">WhatsApp</h3>
                  <p className="text-zinc-600">+880 1700 000 000</p>
                </div>
                <div className="bg-zinc-50 p-8 text-center">
                  <Facebook className="mx-auto mb-4 text-zinc-900" size={24} />
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-2">Facebook</h3>
                  <p className="text-zinc-600">fb.com/eleganbd</p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto bg-white p-8 border border-zinc-100 shadow-sm">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Name</label>
                      <input type="text" className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Email</label>
                      <input type="email" className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Message</label>
                    <textarea rows={4} className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 resize-none"></textarea>
                  </div>
                  <button type="button" className="btn-primary w-full">Send Message</button>
                </form>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'size-guide' && (
          <section className="pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-8 text-center">Size Guide</h1>
              <p className="text-center text-zinc-600 mb-12">Find your perfect fit with our detailed size chart. All measurements are in inches.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900 text-white">
                      <th className="p-4 text-xs font-bold uppercase tracking-widest">Size (Waist)</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest">Length</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest">Thigh</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest">Leg Opening</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[28, 30, 32, 34, 36, 38].map((size, idx) => (
                      <tr key={size} className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                        <td className="p-4 font-bold">{size}</td>
                        <td className="p-4">39.5</td>
                        <td className="p-4">{11 + idx * 0.5}</td>
                        <td className="p-4">{6 + idx * 0.25}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-serif font-bold mb-4">How to Measure</h3>
                  <ul className="space-y-4 text-zinc-600 text-sm">
                    <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape slightly loose.</li>
                    <li><strong>Length:</strong> Measure from the top of the waistband down to the ankle.</li>
                    <li><strong>Thigh:</strong> Measure the widest part of your thigh.</li>
                  </ul>
                </div>
                <div className="bg-zinc-50 p-6">
                  <h3 className="text-lg font-serif font-bold mb-2">Need Help?</h3>
                  <p className="text-sm text-zinc-500 mb-4">If you're between sizes, we recommend going for the larger size for a more comfortable fit.</p>
                  <button onClick={() => handleNavigate('contact')} className="text-zinc-900 font-bold underline text-sm">Contact Support</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentPage('checkout');
        }}
      />

      <UserPanel 
        isOpen={isUserOpen}
        onClose={() => setIsUserOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}
