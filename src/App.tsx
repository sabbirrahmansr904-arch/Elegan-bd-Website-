/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Phone, 
  Facebook, 
  Instagram, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw,
  ArrowRight,
  MessageCircle,
  Mail,
  Trash2,
  Plus,
  Minus,
  Edit,
  User as UserIcon,
  LayoutDashboard,
  CreditCard,
  Users,
  Ticket,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Product, CartItem, User, Order, Banner, Coupon, Review } from './types';
import { db, auth } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, setDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// --- Components ---

const Logo = ({ className = "", light = true }: { className?: string, light?: boolean }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <img 
      src="https://i.postimg.cc/csPJTT4H/1000047673-removebg-preview.png" 
      alt="Elegan BD Logo" 
      className="w-14 h-14 object-contain"
      referrerPolicy="no-referrer"
    />
    <span className={`text-xl font-serif font-bold tracking-tighter uppercase whitespace-nowrap ${light ? 'text-white' : 'text-black'}`}>
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Shop', id: 'shop' },
    { name: 'About Elegan BD', id: 'about' },
    { name: 'Returns & Exchange', id: 'returns-policy' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-2' : 'bg-black py-4'} border-b border-white/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Left: Menu Icon (Mobile) */}
          <div className="flex items-center lg:hidden">
            <button 
              className="p-2 text-white hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop Nav Links (Left) */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.slice(0, 3).map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="text-[10px] font-bold text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                {link.name}
              </button>
            ))}
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

          {/* Right: Icons & Desktop Nav (Right) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden lg:flex items-center space-x-8 mr-8">
              {navLinks.slice(3).map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className="text-[10px] font-bold text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1 md:space-x-2">
              <button 
                onClick={onOpenUser}
                className="p-2 text-white hover:text-white/70 transition-colors flex items-center gap-2"
              >
                <UserIcon size={20} />
                {user && user.name && (
                  <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </button>
              <button 
                onClick={onOpenCart}
                className="relative p-2 text-white hover:text-white/70 transition-colors"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
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

    try {
      if (isRegister) {
        // Simple mock registration for now
        setIsRegister(false);
        setError('Registration successful! Please login.');
      } else {
        // Simple mock login for now
        onLoginSuccess({ id: 1, name: formData.name || 'User', email: formData.email, role: 'customer' });
        onClose();
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

const ReviewsPage = ({ onBack }: { onBack: () => void }) => {
  const reviews = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: ["Sabbir Ahmed", "Rahat Khan", "Tanvir Hossain", "Arifur Rahman", "Mahbub Alam", "Sakib Al Hasan", "Mushfiqur Rahim", "Tamim Iqbal", "Mahmudullah Riyad", "Mustafizur Rahman"][i % 10],
    rating: 5 - (i % 2),
    comment: [
      "The quality of the fabric is outstanding. Perfect fit for formal office wear.",
      "I bought the Sky Blue one. The color is exactly as shown in the pictures. Highly recommended!",
      "Very comfortable for long hours. The stitching is very professional.",
      "Best formal shirt I've ever bought. The fabric feels premium and soft.",
      "The formal pant fits perfectly. The material is durable and looks very sharp.",
      "Excellent customer service and fast delivery. The product quality is top-notch.",
      "I'm very satisfied with my purchase. The size guide was very helpful.",
      "The color doesn't fade after washing. Very good quality cotton.",
      "Perfect for office and formal events. I'll definitely buy more.",
      "Great value for money. The premium feel is definitely there."
    ][i % 10],
    date: `${(i % 30) + 1} days ago`,
    category: i % 2 === 0 ? "Formal Shirt" : "Formal Pant"
  }));

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <button 
        onClick={onBack}
        className="flex items-center text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        <ArrowRight className="rotate-180 mr-2" size={16} />
        Back to Home
      </button>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-4">Customer Reviews</h1>
        <p className="text-zinc-500">What our 100+ customers say about our products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-1 text-yellow-400">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-2 py-1 bg-zinc-50 rounded">
                {review.category}
              </span>
            </div>
            <p className="text-zinc-600 text-sm mb-6 italic">"{review.comment}"</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest">{review.name}</span>
              <span className="text-[10px] text-zinc-400 uppercase">{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero = ({ onShopNow, promoImage }: { onShopNow: () => void, promoImage?: string }) => {
  return (
    <div className="pt-20">
      <section className="relative w-full overflow-hidden bg-zinc-50 flex items-center justify-center">
        <img 
          src="https://i.imgur.com/Vriu71z.png" 
          alt="Hero Model" 
          className="w-full h-auto max-h-[85vh] object-contain"
          referrerPolicy="no-referrer"
        />
      </section>
    </div>
  );
};

const BannerCarousel = ({ banners }: { banners: Banner[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden bg-zinc-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src={banners[currentIndex].image}
            alt={banners[currentIndex].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-3xl md:text-6xl font-serif font-bold mb-4 tracking-tight"
            >
              {banners[currentIndex].title}
            </motion.h2>
            {banners[currentIndex].subtitle && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 text-sm md:text-xl mb-8 max-w-2xl font-light"
              >
                {banners[currentIndex].subtitle}
              </motion.p>
            )}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => banners[currentIndex].link && (window.location.href = banners[currentIndex].link)}
              className="bg-white text-black px-8 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors shadow-lg"
            >
              {banners[currentIndex].buttonText || 'Shop Now'}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProductCard = ({ product, onSelect }: { 
  product: Product, 
  onSelect: (p: Product) => void, 
  key?: React.Key 
}) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <div className="relative overflow-hidden bg-white mb-4 rounded-xl md:rounded-2xl border border-zinc-100 shadow-sm group-hover:shadow-md transition-all duration-300">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'; }}
        />
        {product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-zinc-900 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
            Sale
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-end justify-center pb-4 md:pb-6 opacity-0 group-hover:opacity-100">
          <button className="bg-white text-zinc-900 px-4 md:px-6 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Quick View
          </button>
        </div>
      </div>
      <div className="px-1 text-center md:text-left">
        <h3 className="text-base md:text-xl font-bold text-zinc-900 mb-1 uppercase tracking-tight truncate">{product.name}</h3>
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="text-base md:text-xl font-bold text-zinc-900">৳{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm md:text-base text-zinc-400 line-through">৳{product.originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProductDetails = ({ product, onAddToCart, onBack, onBuyNow, user }: { 
  product: Product, 
  onAddToCart: (p: Product, size: any) => void, 
  onBack: () => void,
  onBuyNow: (p: Product, size: any) => void,
  user: User | null
}) => {
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(product.image);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const getImages = (images: any) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [images];
      } catch (e) {
        return [images];
      }
    }
    return [];
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), where('product_id', '==', product.id.toString()));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data as any);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.user_name || !newReview.comment) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData = {
        product_id: product.id.toString(),
        user_name: newReview.user_name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString()
      };
      await addDoc(collection(db, 'reviews'), reviewData);
      setReviews([reviewData as any, ...reviews]);
      setNewReview({ user_name: '', rating: 5, comment: '' });
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y });
  };

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
          <div 
            className="bg-white overflow-hidden relative cursor-zoom-in rounded-2xl border border-zinc-100"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              className={`w-full h-auto object-cover transition-transform duration-200 ${isZoomed ? 'scale-[2]' : 'scale-100'}`}
              style={{
                transformOrigin: isZoomed ? `${zoomPos.x}% ${zoomPos.y}%` : 'center'
              }}
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'; }}
            />
          </div>
          
          {getImages(product.images).length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {getImages(product.images).map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square border-2 overflow-hidden transition-all ${activeImage === img ? 'border-zinc-900' : 'border-transparent hover:border-zinc-200'}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'; }} />
                </button>
              ))}
            </div>
          )}
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
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === 'string' ? (product.sizes as string).split(',').map(s => s.trim()).filter(Boolean) : [])).map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm font-medium border transition-all ${selectedSize === size ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-900'}`}
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
            <button 
              onClick={() => selectedSize && onBuyNow(product, selectedSize)}
              disabled={!selectedSize}
              className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
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

      {/* Reviews Section */}
      <div className="mt-24 border-t border-zinc-100 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Review Stats & Form */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-6">Customer Reviews</h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl font-bold text-zinc-900">{product.rating}</div>
              <div>
                <div className="flex text-zinc-900 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-sm text-zinc-500">Based on {reviews.length} reviews</p>
              </div>
            </div>

            {/* Review Form */}
            <div className="bg-zinc-50 p-6 rounded-2xl">
              <h3 className="font-bold uppercase tracking-widest text-xs mb-4">Write a Review</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`p-1 transition-colors ${newReview.rating >= star ? 'text-zinc-900' : 'text-zinc-300'}`}
                        >
                          <Star size={20} fill={newReview.rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Comment</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-900 min-h-[100px]"
                      placeholder="Share your thoughts about this product..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full btn-primary py-3 text-xs"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-zinc-600 mb-4">Please login to share your experience with this product.</p>
                </div>
              )}
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-zinc-100 pb-8 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-zinc-900">{review.user_name}</h4>
                        <div className="flex text-zinc-900 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-zinc-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-zinc-50 rounded-2xl">
                  <MessageCircle size={40} className="mx-auto mb-4 text-zinc-300" />
                  <p className="text-zinc-500">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
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
  onUpdateQty: (id: number | string, size: any, delta: number) => void,
  onRemove: (id: number | string, size: any) => void,
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
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'; }} />
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
    location: 'inside', // 'inside' or 'outside'
    paymentMethod: 'COD',
    transactionId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = formData.location === 'inside' ? 70 : 130;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((formData.paymentMethod === 'bKash' || formData.paymentMethod === 'Nagad') && !formData.transactionId) {
      alert('Please enter the Transaction ID');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        totalAmount: total + shipping,
        items: JSON.stringify(items),
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'orders'), orderData);
      onComplete();
    } catch (error) {
      console.error("Checkout error:", error);
      alert('Failed to place order. Please try again.');
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Delivery Area</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, location: 'inside'})}
                  className={`p-4 border text-center transition-all rounded-xl ${formData.location === 'inside' ? 'border-zinc-900 bg-zinc-50 font-bold' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'}`}
                >
                  <p className="text-sm">Inside Dhaka</p>
                  <p className="text-xs mt-1">৳70</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, location: 'outside'})}
                  className={`p-4 border text-center transition-all rounded-xl ${formData.location === 'outside' ? 'border-zinc-900 bg-zinc-50 font-bold' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'}`}
                >
                  <p className="text-sm">Outside Dhaka</p>
                  <p className="text-xs mt-1">৳130</p>
                </button>
              </div>
            </div>
            
            <div className="pt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Payment Method</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'COD'})}
                  className={`w-full p-4 border flex items-center justify-between transition-all ${formData.paymentMethod === 'COD' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400'}`}
                >
                  <span className="font-medium">Cash on Delivery (COD)</span>
                  {formData.paymentMethod === 'COD' && <ShieldCheck className="text-zinc-900" size={20} />}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'bKash'})}
                  className={`w-full p-4 border flex items-center justify-between transition-all ${formData.paymentMethod === 'bKash' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400'}`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://i.postimg.cc/FNktNhrf/1656234782bkash-app-logo.png" 
                      alt="bKash" 
                      className="w-8 h-8 object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-medium">bKash Send Money</span>
                  </div>
                  {formData.paymentMethod === 'bKash' && <ShieldCheck className="text-zinc-900" size={20} />}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'Nagad'})}
                  className={`w-full p-4 border flex items-center justify-between transition-all ${formData.paymentMethod === 'Nagad' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400'}`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://i.postimg.cc/Dv0j6cmq/images.png" 
                      alt="Nagad" 
                      className="w-8 h-8 object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-medium">Nagad Send Money</span>
                  </div>
                  {formData.paymentMethod === 'Nagad' && <ShieldCheck className="text-zinc-900" size={20} />}
                </button>
              </div>

              {formData.paymentMethod === 'COD' ? (
                <p className="text-xs text-zinc-400 mt-2 italic">Pay when you receive the product at your doorstep.</p>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-zinc-900 text-white rounded-xl space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-sm text-white/60">Send Money to:</span>
                    <span className="text-lg font-bold tracking-wider">01619835133</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-white/60 leading-relaxed">
                      Please send <span className="text-white font-bold">৳{total + shipping}</span> to the number above using {formData.paymentMethod} "Send Money" option. After sending, enter the Transaction ID below.
                    </p>
                    <input 
                      required
                      type="text"
                      placeholder="Enter Transaction ID"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/40 transition-all"
                      value={formData.transactionId}
                      onChange={e => setFormData({...formData, transactionId: e.target.value})}
                    />
                  </div>
                </motion.div>
              )}
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
              <span className="text-zinc-500">Shipping ({formData.location === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
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

const AdminPanel = ({ onBack, onRefreshProducts, onRefreshBanners, onRefreshPromoImage }: { onBack: () => void, onRefreshProducts: () => void, onRefreshBanners: () => void, onRefreshPromoImage: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [promoImage, setPromoImage] = useState('');
  const [categories, setCategories] = useState<string[]>(['Formal Pant', 'Office Wear', 'Premium Collection', 'Best Seller']);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [email, setEmail] = useState('info@eleganbd.com');
  const [password, setPassword] = useState('eleganbd2026@#@#ssn');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'info@eleganbd.com') {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);
  
  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Formal Pant',
    price: 0,
    originalPrice: 0,
    image: '',
    fabric: 'Woven Cotton',
    fit: 'Slim Fit',
    description: '',
    sizes: '30, 32, 34, 36, 38',
    colors: 'Black, Navy, Grey',
    stock: 100,
    stockStatus: 'In Stock' as 'In Stock' | 'Out of Stock' | 'Low Stock'
  });

  // Banner Form State
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [bannerFormData, setBannerFormData] = useState({
    image: '',
    title: '',
    subtitle: '',
    button_text: 'Shop Now',
    link: ''
  });

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_purchase: 0,
    expiry_date: ''
  });

    useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      if (activeTab === 'orders') {
        getDocs(collection(db, 'orders')).then(snapshot => {
          setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      } else if (activeTab === 'products') {
        getDocs(collection(db, 'products')).then(snapshot => {
          setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      } else if (activeTab === 'banners') {
        getDocs(collection(db, 'banners')).then(snapshot => {
          setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      } else if (activeTab === 'customers') {
        getDocs(collection(db, 'customers')).then(snapshot => {
          setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      } else if (activeTab === 'coupons') {
        getDocs(collection(db, 'coupons')).then(snapshot => {
          setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      } else if (activeTab === 'customization') {
        getDoc(doc(db, 'settings', 'promo_image_hero')).then(docSnap => {
          if (docSnap.exists()) {
            setPromoImage(docSnap.data().value);
          }
          setLoading(false);
        });
      }
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === 'info@eleganbd.com' || result.user.email === 'sabbirrahmansr904@gmail.com') {
        setIsAuthenticated(true);
      } else {
        alert('Unauthorized access. Only admins can log in.');
        await signOut(auth);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number | string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId.toString()), { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...productFormData,
        sizes: typeof productFormData.sizes === 'string' 
          ? productFormData.sizes.split(',').map(s => s.trim()).filter(Boolean) 
          : productFormData.sizes,
        colors: typeof productFormData.colors === 'string'
          ? productFormData.colors.split(',').map(c => c.trim()).filter(Boolean)
          : productFormData.colors
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id.toString()), dataToSave);
      } else {
        await addDoc(collection(db, 'products'), {
          ...dataToSave,
          rating: 5.0,
          reviews: 0
        });
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductFormData({ 
        name: '', 
        price: 0, 
        originalPrice: 0, 
        image: '', 
        fabric: '', 
        fit: '', 
        description: '', 
        sizes: '30, 32, 34, 36, 38',
        colors: 'Black, Navy, Grey',
        stock: 100,
        stockStatus: 'In Stock',
        category: 'Formal Pant' 
      } as any);
      getDocs(collection(db, 'products')).then(snapshot => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any));
      onRefreshProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const deleteProduct = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id.toString()));
      setProducts(prev => prev.filter(p => p.id !== id));
      onRefreshProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      category: product.category || 'Formal Pant',
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      fabric: product.fabric,
      fit: product.fit,
      description: product.description,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes,
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
      stock: product.stock || 0,
      stockStatus: product.stockStatus || 'In Stock'
    });
    setShowProductForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'banner' | 'promo' = 'product') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('./firebase');
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (type === 'product') {
        setProductFormData({ ...productFormData, image: url });
      } else if (type === 'banner') {
        setBannerFormData({ ...bannerFormData, image: url });
      } else if (type === 'promo') {
        setPromoImage(url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'banners'), bannerFormData);
      setShowBannerForm(false);
      setBannerFormData({ image: '', title: '', subtitle: '', button_text: 'Shop Now', link: '' });
      getDocs(collection(db, 'banners')).then(snapshot => setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
      onRefreshBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const deleteBanner = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await deleteDoc(doc(db, 'banners', id.toString()));
      setBanners(prev => prev.filter(b => b.id !== id));
      onRefreshBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'coupons'), couponFormData);
      setShowCouponForm(false);
      setCouponFormData({ code: '', discount_percentage: 0, is_active: 1, expiry_date: '' });
      getDocs(collection(db, 'coupons')).then(snapshot => setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const deleteCoupon = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id.toString()));
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromoImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'promo_image_hero'), { value: promoImage });
      alert('Promo image updated successfully');
      onRefreshPromoImage();
    } catch (error) {
      console.error('Error saving promo image:', error);
    }
  };

  const handleDeletePromoImage = async () => {
    if (confirm('Are you sure you want to delete the promo image?')) {
      try {
        await setDoc(doc(db, 'settings', 'promo_image_hero'), { value: '' });
        setPromoImage('');
        onRefreshPromoImage();
      } catch (error) {
        console.error('Error deleting promo image:', error);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-zinc-100 w-full max-w-md">
          <div className="text-center mb-10">
            <Logo light={false} className="mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold">Admin Login</h2>
            <p className="text-zinc-500 text-sm mt-2">Access the Elegan BD management center</p>
          </div>
          <div className="space-y-6">
            <button 
              onClick={handleLogin} 
              disabled={loading} 
              className="w-full bg-white border border-zinc-200 text-zinc-900 py-4 flex items-center justify-center gap-3 rounded-xl shadow-sm hover:bg-zinc-50 transition-all font-bold uppercase tracking-widest text-xs"
            >
              {loading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              )}
              {loading ? 'Authenticating...' : 'Sign in with Google'}
            </button>
            <button type="button" onClick={onBack} className="w-full text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-900 transition-colors">
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'products', name: 'Product', icon: <Package size={20} /> },
    { id: 'categories', name: 'Categories', icon: <Ticket size={20} /> },
    { id: 'orders', name: 'Order', icon: <ShoppingBag size={20} /> },
    { id: 'payments', name: 'Payment', icon: <CreditCard size={20} /> },
    { id: 'customers', name: 'Customer', icon: <Users size={20} /> },
    { id: 'delivery', name: 'Delivery', icon: <Truck size={20} /> },
    { id: 'coupons', name: 'Coupon System', icon: <Ticket size={20} /> },
    { id: 'customization', name: 'Customization', icon: <Edit size={20} /> },
    { id: 'banners', name: 'Banners', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar Toggle (Mobile) */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-zinc-900 text-white p-4 rounded-full shadow-2xl"
      >
        {isSidebarOpen ? <X size={24} /> : <LayoutDashboard size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? (window.innerWidth < 1024 ? '100%' : 280) : 0, 
          opacity: isSidebarOpen ? 1 : 0,
          x: isSidebarOpen ? 0 : -280
        }}
        className="bg-white border-r border-zinc-200 overflow-hidden fixed h-full z-50 lg:z-40"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <Logo light={false} />
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2">
              <X size={20} />
            </button>
          </div>
          <nav className="space-y-1 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors rounded-lg ${
                  activeTab === item.id 
                    ? 'bg-zinc-900 text-white' 
                    : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
          <div className="mt-10 pt-10 border-t border-zinc-100">
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[280px]' : 'ml-0'}`}>
        <header className="bg-white border-b border-zinc-200 h-20 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-serif font-bold uppercase tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.name}
            </h2>
          </div>
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900">
            Exit Admin
          </button>
        </header>

        <div className="p-8">

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.filter(i => i.id !== 'overview').map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-900 mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-serif font-bold mb-2">{item.name}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Manage {item.name.toLowerCase()}</p>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Revenue</p>
                    <CreditCard size={16} className="text-zinc-300" />
                  </div>
                  <h3 className="text-3xl font-bold">৳{orders.reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}</h3>
                  <p className="text-xs text-green-600 mt-2 font-medium">Lifetime earnings</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Today Sales</p>
                    <ShoppingBag size={16} className="text-zinc-300" />
                  </div>
                  <h3 className="text-3xl font-bold">
                    ৳{orders
                      .filter(o => new Date(o.created_at || '').toDateString() === new Date().toDateString())
                      .reduce((acc, o) => acc + o.total_amount, 0)
                      .toLocaleString()}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 font-medium">Sales from today</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pending Orders</p>
                    <RefreshCw size={16} className="text-amber-400" />
                  </div>
                  <h3 className="text-3xl font-bold">{orders.filter(o => o.status?.toLowerCase() === 'pending').length}</h3>
                  <p className="text-xs text-amber-600 mt-2 font-medium">Awaiting confirmation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Orders</p>
                    <Package size={16} className="text-zinc-300" />
                  </div>
                  <h3 className="text-3xl font-bold">{orders.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Customers</p>
                    <Users size={16} className="text-zinc-300" />
                  </div>
                  <h3 className="text-3xl font-bold">{customers.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Products</p>
                    <Package size={16} className="text-zinc-300" />
                  </div>
                  <h3 className="text-3xl font-bold">{products.length}</h3>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="max-w-md">
              <h3 className="text-xl font-serif font-bold mb-6">Product Categories</h3>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const newCat = (e.target as any).category.value;
                  if (newCat && !categories.includes(newCat)) {
                    setCategories([...categories, newCat]);
                    (e.target as any).category.value = '';
                  }
                }} className="flex gap-4 mb-8">
                  <input name="category" placeholder="New Category Name" className="flex-grow border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" />
                  <button type="submit" className="btn-primary px-6 py-2 text-xs">Add</button>
                </form>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat} className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
                      <span className="text-sm font-medium">{cat}</span>
                      <button onClick={() => setCategories(categories.filter(c => c !== cat))} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'orders' && (
            loading ? <p>Loading orders...</p> : (
              <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <th className="py-4 px-6">Order ID</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Payment</th>
                        <th className="py-4 px-6">Total</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                          <td className="py-4 px-6 font-mono">#{order.id}</td>
                          <td className="py-4 px-6">
                            <p className="font-bold">{order.customer_name}</p>
                            <p className="text-xs text-zinc-500">{order.phone}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                              order.payment_method === 'bKash' ? 'bg-[#D12053] text-white' : 
                              order.payment_method === 'Nagad' ? 'bg-[#F7941D] text-white' : 
                              'bg-zinc-100 text-zinc-700'
                            }`}>
                              {order.payment_method || 'COD'}
                            </span>
                            {order.transaction_id && (
                              <p className="text-[10px] text-zinc-400 mt-1 font-mono">TXID: {order.transaction_id}</p>
                            )}
                          </td>
                          <td className="py-4 px-6 font-bold">৳{order.total_amount}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                              order.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 
                              order.status === 'Processing' ? 'bg-purple-100 text-purple-700' : 
                              order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' : 
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <select 
                                className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 border-none outline-none py-1 px-2 rounded cursor-pointer"
                                value={order.status || 'Pending'}
                                onChange={(e) => updateStatus(order.id!, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold">Product Catalog</h3>
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setProductFormData({
                      name: '',
                      category: 'Formal Pant',
                      price: 0,
                      originalPrice: 0,
                      image: '',
                      fabric: 'Woven Cotton',
                      fit: 'Slim Fit',
                      description: '',
                      sizes: '30, 32, 34, 36, 38'
                    });
                    setShowProductForm(true);
                  }}
                  className="btn-primary py-2 px-6 flex items-center gap-2 text-xs"
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {showProductForm && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-serif font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                      <button onClick={() => setShowProductForm(false)}><X size={24} /></button>
                    </div>
                    <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Product Name</label>
                        <input required className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={productFormData.name} onChange={e => setProductFormData({...productFormData, name: e.target.value})} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Category</label>
                        <select className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 bg-transparent" value={productFormData.category} onChange={e => setProductFormData({...productFormData, category: e.target.value})}>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Price (৳)</label>
                        <input required type="number" className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={productFormData.price} onChange={e => setProductFormData({...productFormData, price: parseInt(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Discount Price (৳)</label>
                        <input required type="number" className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={productFormData.originalPrice} onChange={e => setProductFormData({...productFormData, originalPrice: parseInt(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Stock Quantity</label>
                        <input required type="number" className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={productFormData.stock} onChange={e => setProductFormData({...productFormData, stock: parseInt(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Stock Status</label>
                        <select className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 bg-transparent" value={productFormData.stockStatus} onChange={e => setProductFormData({...productFormData, stockStatus: e.target.value as any})}>
                          <option value="In Stock">In Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                          <option value="Low Stock">Low Stock</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Colors (comma separated)</label>
                        <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={productFormData.colors} onChange={e => setProductFormData({...productFormData, colors: e.target.value})} placeholder="Black, Navy, Grey" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Product Image</label>
                        <div className="flex gap-4 items-center">
                          {productFormData.image && <img src={productFormData.image} alt="Preview" className="w-20 h-20 object-cover rounded border border-zinc-200" referrerPolicy="no-referrer" />}
                          <div className="flex-grow">
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'product')} className="hidden" id="product-image-upload" />
                            <label htmlFor="product-image-upload" className="inline-block px-6 py-2 border border-zinc-200 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-zinc-50 transition-colors">
                              {isUploading ? 'Uploading...' : 'Upload from Device'}
                            </label>
                            <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 text-sm mt-2" value={productFormData.image} onChange={e => setProductFormData({...productFormData, image: e.target.value})} placeholder="https://..." />
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Description</label>
                        <textarea className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={productFormData.description} onChange={e => setProductFormData({...productFormData, description: e.target.value})} rows={3} placeholder="Product description..." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Fabric</label>
                        <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={productFormData.fabric} onChange={e => setProductFormData({...productFormData, fabric: e.target.value})} placeholder="Woven Cotton" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Fit</label>
                        <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={productFormData.fit} onChange={e => setProductFormData({...productFormData, fit: e.target.value})} placeholder="Slim Fit" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Sizes (comma separated)</label>
                        <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={productFormData.sizes} onChange={e => setProductFormData({...productFormData, sizes: e.target.value})} placeholder="30, 32, 34, 36, 38" />
                      </div>
                      <div className="md:col-span-2 pt-4 flex gap-4">
                        <button type="submit" className="flex-grow btn-primary py-3">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                        {editingProduct && (
                          <button 
                            type="button" 
                            onClick={() => {
                              deleteProduct(editingProduct.id);
                              setShowProductForm(false);
                            }} 
                            className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors rounded-lg flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white border border-zinc-100 p-4 flex gap-4 items-center shadow-sm rounded-xl">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm truncate max-w-[150px]">{product.name}</h4>
                      <p className="text-xs text-zinc-500">৳{product.price}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          product.stockStatus === 'In Stock' ? 'bg-green-500' :
                          product.stockStatus === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          {product.stockStatus || 'In Stock'} ({product.stock || 0})
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => startEdit(product)} className="px-3 py-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="px-3 py-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'banners' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold">Banner Management</h3>
                <button 
                  onClick={() => {
                    setBannerFormData({ image: '', title: '', subtitle: '', button_text: 'Shop Now', link: '' });
                    setShowBannerForm(true);
                  }}
                  className="btn-primary py-2 px-6 flex items-center gap-2 text-xs"
                >
                  <Plus size={16} /> Add Banner
                </button>
              </div>

              {showBannerForm && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-md p-8 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-serif font-bold">Add New Banner</h3>
                      <button onClick={() => setShowBannerForm(false)}><X size={24} /></button>
                    </div>
                    <form onSubmit={handleBannerSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Banner Image</label>
                        <div className="flex gap-4 items-center">
                          {bannerFormData.image && <img src={bannerFormData.image} alt="Preview" className="w-20 h-20 object-cover rounded border border-zinc-200" referrerPolicy="no-referrer" />}
                          <div className="flex-grow">
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} className="hidden" id="banner-image-upload" />
                            <label htmlFor="banner-image-upload" className="inline-block px-6 py-2 border border-zinc-200 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-zinc-50 transition-colors">
                              {isUploading ? 'Uploading...' : 'Upload'}
                            </label>
                            <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 text-sm mt-2" value={bannerFormData.image} onChange={e => setBannerFormData({...bannerFormData, image: e.target.value})} placeholder="https://..." />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Title</label>
                        <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={bannerFormData.title} onChange={e => setBannerFormData({...bannerFormData, title: e.target.value})} placeholder="EID SPECIAL COLLECTION" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Subtitle</label>
                        <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={bannerFormData.subtitle} onChange={e => setBannerFormData({...bannerFormData, subtitle: e.target.value})} placeholder="Up to 40% Off" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Button Text</label>
                        <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={bannerFormData.button_text} onChange={e => setBannerFormData({...bannerFormData, button_text: e.target.value})} placeholder="Shop Now" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Link (Optional)</label>
                        <input className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={bannerFormData.link} onChange={e => setBannerFormData({...bannerFormData, link: e.target.value})} placeholder="/category/formal-pant" />
                      </div>
                      <button type="submit" className="w-full btn-primary py-3">Add Banner</button>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map(banner => (
                  <div key={banner.id} className="bg-white border border-zinc-100 p-4 rounded-xl shadow-sm group">
                    <div className="relative aspect-[1536/1024] overflow-hidden rounded-lg mb-4">
                      <img src={banner.image} alt="Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button onClick={() => deleteBanner(banner.id!)} className="absolute top-2 right-2 p-2 bg-white/90 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Trash2 size={18} /></button>
                    </div>
                    {banner.link && <p className="text-xs text-zinc-500">Link: {banner.link}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Contact</th>
                      <th className="py-4 px-6">Address</th>
                      <th className="py-4 px-6">Total Orders</th>
                      <th className="py-4 px-6">Join Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {customers.map(customer => {
                      const customerOrders = orders.filter(o => o.phone === customer.phone || o.customer_name === customer.name);
                      return (
                        <tr key={customer.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold">{customer.name}</p>
                            <p className="text-xs text-zinc-400">{customer.email}</p>
                          </td>
                          <td className="py-4 px-6">{customer.phone || 'N/A'}</td>
                          <td className="py-4 px-6 text-xs max-w-xs truncate">{customer.address || 'N/A'}</td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-1 bg-zinc-100 rounded-full text-xs font-bold">{customerOrders.length}</span>
                          </td>
                          <td className="py-4 px-6 text-zinc-500">{new Date(customer.created_at || '').toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold">Coupon System</h3>
                <button onClick={() => setShowCouponForm(true)} className="btn-primary py-2 px-6 flex items-center gap-2 text-xs">
                  <Plus size={16} /> Create Coupon
                </button>
              </div>

              {showCouponForm && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-md p-8 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-serif font-bold">New Coupon</h3>
                      <button onClick={() => setShowCouponForm(false)}><X size={24} /></button>
                    </div>
                    <form onSubmit={handleCouponSubmit} className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Coupon Code</label>
                        <input required className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 uppercase" value={couponFormData.code} onChange={e => setCouponFormData({...couponFormData, code: e.target.value.toUpperCase()})} placeholder="SAVE20" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Type</label>
                          <select className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 bg-transparent" value={couponFormData.discount_type} onChange={e => setCouponFormData({...couponFormData, discount_type: e.target.value as any})}>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Value</label>
                          <input required type="number" className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={couponFormData.discount_value} onChange={e => setCouponFormData({...couponFormData, discount_value: parseInt(e.target.value)})} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Min Purchase (৳)</label>
                        <input required type="number" className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={couponFormData.min_purchase} onChange={e => setCouponFormData({...couponFormData, min_purchase: parseInt(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Expiry Date</label>
                        <input required type="date" className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900" value={couponFormData.expiry_date} onChange={e => setCouponFormData({...couponFormData, expiry_date: e.target.value})} />
                      </div>
                      <button type="submit" className="w-full btn-primary py-3">Create Coupon</button>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <th className="py-4 px-6">Code</th>
                        <th className="py-4 px-6">Discount</th>
                        <th className="py-4 px-6">Min Purchase</th>
                        <th className="py-4 px-6">Expiry</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {coupons.map(coupon => (
                        <tr key={coupon.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold">{coupon.code}</td>
                          <td className="py-4 px-6">{coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `৳${coupon.discount_value}`}</td>
                          <td className="py-4 px-6">৳{coupon.min_purchase}</td>
                          <td className="py-4 px-6">{coupon.expiry_date}</td>
                          <td className="py-4 px-6 text-right">
                            <button onClick={() => deleteCoupon(coupon.id!)} className="text-red-600 hover:underline text-xs font-bold uppercase tracking-widest">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white p-12 rounded-xl border border-dashed border-zinc-200 text-center">
              <CreditCard className="mx-auto mb-4 text-zinc-300" size={48} />
              <h3 className="text-lg font-serif font-bold mb-2">Payment Settings</h3>
              <p className="text-zinc-500 text-sm max-w-md mx-auto">Configure your payment gateways and view transaction history. This section is coming soon.</p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="bg-white p-12 rounded-xl border border-dashed border-zinc-200 text-center">
              <Truck className="mx-auto mb-4 text-zinc-300" size={48} />
              <h3 className="text-lg font-serif font-bold mb-2">Delivery Management</h3>
              <p className="text-zinc-500 text-sm max-w-md mx-auto">Manage delivery zones, shipping rates, and carrier integrations. This section is coming soon.</p>
            </div>
          )}

          {activeTab === 'customization' && (
            <div className="max-w-2xl">
              <h3 className="text-xl font-serif font-bold mb-6">Site Customization</h3>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-100">
                <form onSubmit={handlePromoImageSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Hero Promo Image (Below View Collection)</label>
                    <div className="space-y-4">
                      {promoImage && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200">
                          <img src={promoImage} alt="Promo Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="flex gap-4 items-center">
                        <div className="flex-grow">
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'promo')} className="hidden" id="promo-image-upload" />
                          <label htmlFor="promo-image-upload" className="inline-block px-6 py-2 border border-zinc-200 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-zinc-50 transition-colors">
                            {isUploading ? 'Uploading...' : 'Upload New Image'}
                          </label>
                          <input 
                            className="w-full border-b border-zinc-200 py-2 outline-none focus:border-zinc-900 text-sm mt-4" 
                            value={promoImage} 
                            onChange={e => setPromoImage(e.target.value)} 
                            placeholder="Or enter image URL..." 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary py-3 px-12">Save Changes</button>
                  {promoImage && (
                    <button 
                      type="button" 
                      onClick={handleDeletePromoImage}
                      className="ml-4 px-12 py-3 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
                    >
                      Delete Image
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <footer className="bg-zinc-900 text-white pt-16 md:pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <Logo className="mb-6" />
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs">
              Premium formal wear for the modern gentleman. Crafted with precision, designed for elegance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Phone size={18} />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-white/50">Quick Links</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">Shop All</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">New Arrivals</button></li>
              <li><button onClick={() => onNavigate('returns-policy')} className="hover:text-white transition-colors">Returns & Exchange</button></li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-white/50">Customer Care</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Elegan BD</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
              <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-white transition-colors">Terms & Conditions</button></li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-white/50">Contact Info</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail size={16} className="text-zinc-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Us</p>
                  <p className="text-sm text-zinc-300">info@eleganbd.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Phone size={16} className="text-zinc-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Call Us</p>
                  <p className="text-sm text-zinc-300">+8801619835133</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              © 2026 ELEGAN BD. All Rights Reserved.
            </p>
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600 mt-1">
              Developed by Sabbir Rahman
            </p>
          </div>
          <button 
            onClick={() => onNavigate('admin')} 
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 hover:text-zinc-400 transition-colors"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('elegan_page') || 'home');
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promoImageHero, setPromoImageHero] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('elegan_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBanners = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'banners'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBanners(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPromoImage = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'promo_image_hero'));
      if (docSnap.exists()) {
        setPromoImageHero(docSnap.data().value);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBanners();
    fetchPromoImage();

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    // Check local storage for user session
    try {
      const savedUser = localStorage.getItem('elegan_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('User session error:', err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('elegan_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('elegan_page', currentPage);
  }, [currentPage]);

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

  const handleBuyNow = (product: Product, size: any) => {
    addToCart(product, size);
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product, size: any) => {
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

  const updateCartQty = (id: number, size: any, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number, size: any) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const handleCheckoutComplete = () => {
    setCart([]);
    setOrderSuccess(true);
    setCurrentPage('success');
  };

  if (currentPage === 'admin') {
    return (
      <AdminPanel 
        onBack={() => handleNavigate('home')} 
        onRefreshProducts={fetchProducts}
        onRefreshBanners={fetchBanners}
        onRefreshPromoImage={fetchPromoImage}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <img 
                src="https://i.postimg.cc/csPJTT4H/1000047673-removebg-preview.png" 
                alt="Elegan BD Logo" 
                className="w-32 h-32 md:w-48 md:h-48 object-contain"
                referrerPolicy="no-referrer"
              />
              <motion.div 
                className="absolute -inset-4 border-2 border-white/20 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <h1 className="text-white text-2xl md:text-4xl font-serif font-bold tracking-[0.3em] uppercase">Elegan BD</h1>
              <div className="mt-4 flex gap-1 justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <Hero 
              onShopNow={() => handleNavigate('shop')} 
              promoImage={promoImageHero}
            />
            
            {/* Featured Section */}
            <section className="py-16 md:py-32 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-20">
                  <h2 className="text-3xl md:text-6xl font-serif font-bold text-zinc-900 mb-6 tracking-tight">Explore Our Top Collections</h2>
                  <p className="max-w-2xl mx-auto text-zinc-500 text-sm md:text-lg leading-relaxed">
                    আপনার প্রতিদিনের অফিস ও ফরমাল লুককে আরও স্টাইলিশ করতে আমাদের প্রিমিয়াম ফরমাল প্যান্ট কালেকশন। নিখুঁত ফিটিং, আরামদায়ক ফেব্রিক ও এলিগেন্ট কালার—সব একসাথে।
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-10 max-w-md mx-auto">
                  {products
                    .filter(p => !p.category || p.category === 'Formal Pant')
                    .map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onSelect={handleProductSelect} 
                      />
                    ))
                  }
                </div>
              </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 md:py-32 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                      <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-4">Premium Quality</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">We use only the finest fabrics sourced for durability and comfort.</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                      <Truck size={32} />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-4">Fast Delivery</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">Quick delivery across all 64 districts of Bangladesh.</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                      <RefreshCw size={32} />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-4">Easy Exchange</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">Not the right fit? Exchange within 3 days with no hassle.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentPage === 'shop' && (
          <section className="pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-4">Collection</h1>
                <p className="text-zinc-500">Showing {products.filter(p => !selectedCategory || p.category === selectedCategory).length} products</p>
              </div>

              <div className="flex flex-wrap justify-center gap-8 mb-12 border-b border-zinc-100 pb-8">
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Category</label>
                  <select 
                    className="bg-transparent border-b border-zinc-200 py-2 text-sm outline-none focus:border-zinc-900"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Formal Pant">Formal Pant</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sort By</label>
                  <select className="bg-transparent border-b border-zinc-200 py-2 text-sm outline-none focus:border-zinc-900">
                    <option>Newest First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-10 max-w-md mx-auto">
                {products
                  .filter(product => (!selectedCategory || product.category === selectedCategory) && (product.category === 'Formal Pant' || !product.category))
                  .map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onSelect={handleProductSelect} 
                    />
                  ))
                }
              </div>
            </div>
          </section>
        )}

        {currentPage === 'product-details' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct} 
            onAddToCart={addToCart} 
            onBack={() => handleNavigate('shop')} 
            onBuyNow={handleBuyNow}
            user={user}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage 
            items={cart} 
            onBack={() => setCurrentPage('shop')} 
            onComplete={handleCheckoutComplete}
          />
        )}

        {currentPage === 'reviews' && (
          <ReviewsPage onBack={() => handleNavigate('home')} />
        )}

        {currentPage === 'admin' && (
          <AdminPanel 
            onBack={() => handleNavigate('home')} 
            onRefreshProducts={fetchProducts}
            onRefreshBanners={fetchBanners}
            onRefreshPromoImage={fetchPromoImage}
          />
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
              <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-8 text-center">About Elegan BD</h1>
              <div className="aspect-video bg-zinc-100 mb-12 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1594932224456-75a779401e28?q=80&w=2000&auto=format&fit=crop" alt="Formal Trousers Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="prose prose-zinc max-w-none text-center">
                <p className="text-xl text-zinc-800 leading-relaxed mb-6 font-medium">
                  “Elegan BD brings premium men's formal wear designed for comfort, durability, and timeless style.”
                </p>
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
                  <p className="text-zinc-600">+8801619835133</p>
                </div>
                <div className="bg-zinc-50 p-8 text-center">
                  <Mail className="mx-auto mb-4 text-zinc-900" size={24} />
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-2">Email</h3>
                  <p className="text-zinc-600">info@eleganbd.com</p>
                </div>
                <div className="bg-zinc-50 p-8 text-center">
                  <MessageCircle className="mx-auto mb-4 text-zinc-900" size={24} />
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-2">WhatsApp</h3>
                  <p className="text-zinc-600">+8801619835133</p>
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

        {currentPage === 'returns-policy' && (
          <section className="pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-8 text-center">Returns & Exchange Policy</h1>
              
              <div className="prose prose-zinc max-w-none space-y-8 text-zinc-600">
                <div className="bg-zinc-50 p-8 rounded-xl border border-zinc-100">
                  <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">3-Day Exchange Policy</h3>
                  <p className="text-sm leading-relaxed">
                    We want you to be completely satisfied with your purchase. If the size doesn't fit or you're not happy with the product, you can exchange it within 3 days of receiving your order.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-zinc-900">Conditions for Exchange</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Product must be unused and unwashed.</li>
                      <li>Original tags and packaging must be intact.</li>
                      <li>Proof of purchase (invoice/order ID) is required.</li>
                      <li>Exchange is subject to stock availability.</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-zinc-900">Non-Returnable Items</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Items on clearance or flash sale.</li>
                      <li>Products with visible signs of wear or damage.</li>
                      <li>Customized or altered garments.</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-8">
                  <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">How to Initiate a Return</h3>
                  <p className="text-sm leading-relaxed mb-4">
                    To start an exchange or return process, please contact our customer support team via WhatsApp or Phone within 72 hours of delivery.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="tel:+8801700000000" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors">
                      <Phone size={16} /> Call Support
                    </a>
                    <a href="https://wa.me/8801700000000" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-green-700 transition-colors">
                      <MessageCircle size={16} /> WhatsApp Us
                    </a>
                  </div>
                </div>

                <div className="bg-zinc-900 text-white p-8 rounded-xl">
                  <h3 className="text-xl font-serif font-bold mb-4">Refund Policy</h3>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Refunds are only processed if the product is found to have a manufacturing defect and a replacement is not available. Refunds will be issued to the original payment method within 7-10 working days.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

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
