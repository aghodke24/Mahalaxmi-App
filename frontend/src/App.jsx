import axios from 'axios';
import {
  ArrowUp,
  CheckCircle2,
  Clock,
  CreditCard,
  Droplets,
  Filter,
  LogOut,
  Mail,
  MapPin,
  MapPinned,
  Minus,
  PhoneCall,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Trash2,
  Tv,
  Users,
  Wind,
  Wrench,
  X,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

//const API_URL = 'http://localhost:5000/api';
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

const DEFAULT_PRODUCTS = [
  {
    _id: "1",
    id: 1,
    title: "Inverter AC Gas Charging & Leakage Repair Doorstep Service",
    category: "Repair Service",
    type: "service",
    price: 1899,
    originalPrice: 2500,
    discount: "24% OFF",
    rating: 4.8,
    reviews: 840,
    icon: "ac",
    badge: "90 Days Service Guarantee",
    desc: "Complete pressure testing, nitrogen leak detection, vacuuming, and R32/R410 gas top-up."
  },
  {
    _id: "2",
    id: 2,
    title: "Samsung 236L 3 Star Double Door Refrigerator (Inverter Compressor)",
    category: "Refrigerator",
    type: "appliance",
    price: 24990,
    originalPrice: 31990,
    discount: "22% OFF",
    rating: 4.7,
    reviews: 320,
    icon: "fridge",
    badge: "1 Year Product",
    desc: "Digital Inverter Compressor, convertible freezer modes, toughened glass shelves."
  },
  {
    _id: "3",
    id: 3,
    title: "Copper Pipe 1/4 + 3/8 for 1.5 Ton Split AC (3 Meters Set)",
    category: "AC Spare Parts",
    type: "spare",
    price: 1850,
    originalPrice: 2600,
    discount: "29% OFF",
    rating: 4.8,
    reviews: 43,
    icon: "tools",
    badge: "Direct Replacement",
    desc: "Pure thick-gauge insulated copper tubing for split air conditioner installation."
  },
  {
    _id: "4",
    id: 4,
    title: "Kent/Aquaguard RO Sediment + Carbon Filter Maintenance Kit",
    category: "Water Filter / RO",
    type: "spare",
    price: 799,
    originalPrice: 1499,
    discount: "47% OFF",
    rating: 4.7,
    reviews: 210,
    icon: "ro",
    badge: "Tested Quality",
    desc: "Universal inline sediment filter, carbon block, and post-carbon filter set."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real User State
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  
  // Service Modal States
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [serviceAppliance, setServiceAppliance] = useState('Inverter AC Gas Charging & Leakage Repair');
  const [serviceName, setServiceName] = useState('');
  const [servicePhone, setServicePhone] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const formatPrice = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0' : num.toLocaleString('en-IN');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('mahalaxmi_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('mahalaxmi_user');
      }
    }
    axios.get(`${API_URL}/products`)
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0 && res.data[0].price > 0) {
          setProducts(res.data);
        }
      })
      .catch(() => console.log("Using default store catalog"));
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/register`, {
        name: authName,
        email: authEmail,
        password: authPassword
      });
      setUser(res.data);
      localStorage.setItem('mahalaxmi_user', JSON.stringify(res.data));
      showToast("Account created successfully!");
      setIsAuthOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email: authEmail,
        password: authPassword
      });
      setUser(res.data);
      localStorage.setItem('mahalaxmi_user', JSON.stringify(res.data));
      showToast(`Welcome back, ${res.data.name || 'Customer'}!`);
      setIsAuthOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mahalaxmi_user');
    setAuthMode('login');  
    setIsAuthOpen(true);   
    showToast("Signed out. Please sign in or register to continue.");
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/bookings`, {
        applianceType: serviceAppliance,
        customerName: serviceName || (user ? user.name : 'Guest Customer'),
        phone: servicePhone,
        address: serviceAddress,
        userId: user ? user._id : null
      });
      showToast("Service appointment booked & saved to database!");
      setIsServiceOpen(false);
      setServiceName('');
      setServicePhone('');
      setServiceAddress('');
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to book service. Try again.");
    }
  };

  const addToCart = (product) => {
    const pId = product._id || product.id;
    setCart(prev => {
      const existing = prev.find(item => (item._id || item.id) === pId);
      if (existing) {
        return prev.map(item => (item._id || item.id) === pId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast("Added item to cart!");
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      const itemId = item._id || item.id;
      if (itemId === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => (item._id || item.id) !== id));
    showToast("Item removed from cart");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartTotal = cart.reduce((acc, item) => acc + ((Number(item.price) || 0) * item.qty), 0);
  const tax = Math.round(cartTotal * 0.18);
  const finalTotal = Math.max(0, cartTotal + tax - discount);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'MAHALAXMI10') {
      const disc = Math.round(cartTotal * 0.10);
      setDiscount(disc);
      showToast("Coupon MAHALAXMI10 applied! (10% OFF)");
    } else {
      showToast("Invalid Coupon Code. Try MAHALAXMI10");
    }
  };

  const filteredProducts = products.filter(p => {
    const cat = String(p?.category || '');
    const title = String(p?.title || p?.name || '');
    const matchesCat = selectedCategory === 'All' || cat.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || cat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const renderProductGraphic = (product) => {
    if (product.image && typeof product.image === 'string' && product.image.startsWith('http')) {
      return (
        <img 
          src={product.image} 
          alt={product.title || product.name} 
          className="w-full h-44 object-cover rounded-md mb-3" 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      );
    }
    return (
      <div className="w-full h-44 bg-gradient-to-br from-rose-950 via-rose-900 to-amber-600 rounded-md mb-3 flex flex-col items-center justify-center text-white p-4 shadow-inner">
        {product.icon === 'ac' && <Wind className="w-12 h-12 text-amber-400 mb-2 animate-pulse" />}
        {product.icon === 'fridge' && <Tv className="w-12 h-12 text-amber-400 mb-2" />}
        {product.icon === 'ro' && <Droplets className="w-12 h-12 text-amber-400 mb-2" />}
        {(!product.icon || product.icon === 'tools') && <Wrench className="w-12 h-12 text-amber-400 mb-2" />}
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 text-center">
          {product.category || 'Appliance'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col justify-between">
      <div>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-rose-950 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center space-x-3 border border-amber-500 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        <div className="bg-amber-400 text-slate-950 text-xs py-1.5 px-4 font-bold flex justify-between items-center shadow-inner">
          <div className="flex items-center gap-2 mx-auto">
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Authorized Sales & Service Center for Washing Machines, Refrigerators, ACs & RO Purifiers</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-slate-900">
            <PhoneCall className="w-3.5 h-3.5" /> Need Instant Repair? Call Expert Engineer: <strong>+91 9881192021</strong> (Doorstep in 2 Hours)
          </div>
        </div>

        <header className="bg-[#4a0e17] text-white sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
            <div onClick={() => setActiveTab('home')} className="cursor-pointer flex items-center gap-2 group">
              <div className="bg-amber-500 p-2 rounded-lg text-slate-950">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm md:text-base tracking-tight text-white leading-none">SHRI MAHALAXMI</h1>
                <p className="text-[9px] text-amber-400 tracking-wider font-medium">HOME APPLIANCES SALES & SERVICES</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center text-xs space-x-1 cursor-pointer hover:border border-rose-800 p-1 rounded">
              <MapPin className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-rose-200 text-[10px]">Deliver to {user ? user.name : 'Customer'}</p>
                <p className="font-bold">Mumbai 400001</p>
              </div>
            </div>

            <div className="flex-1 max-w-2xl flex items-center">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-200 text-slate-800 text-xs px-2 py-2.5 rounded-l-md border-r border-slate-300 focus:outline-none cursor-pointer hidden sm:block"
              >
                <option value="All">All Categories</option>
                <option value="Washing Machine">Washing Machine</option>
                <option value="Water Filter">Water Purifier</option>
                <option value="AC">AC & Parts</option>
                <option value="Refrigerator">Refrigerator</option>
              </select>
              <input 
                type="text" 
                placeholder="Search spare parts, motors, filters, washing machine..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-slate-900 px-3 py-2 text-xs md:text-sm focus:outline-none rounded-l-md sm:rounded-none"
              />
              <button 
                onClick={() => setActiveTab('shop')} 
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-r-md transition flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <button onClick={() => setIsServiceOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs hidden sm:flex items-center gap-1 transition">
                <Wrench className="w-3.5 h-3.5" /> Book Repair Visit
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-start p-1">
                    <span className="text-[10px] text-rose-200">Hello, {user.name || 'User'}</span>
                    <span className="font-bold text-xs text-amber-400">Account & Service ▾</span>
                  </div>
                  <button onClick={handleLogout} title="Sign Out" className="text-rose-200 hover:text-white p-1">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="flex flex-col items-start hover:border border-rose-800 p-1 rounded">
                  <span className="text-[10px] text-rose-200">Hello, Sign In</span>
                  <span className="font-bold text-xs">Account & Service ▾</span>
                </button>
              )}

              <button onClick={() => setActiveTab('cart')} className="relative flex items-center space-x-1 hover:border border-rose-800 p-1 rounded">
                <div className="relative">
                  <ShoppingCart className="w-7 h-7 text-white" />
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((a, c) => a + c.qty, 0)}
                  </span>
                </div>
                <span className="hidden md:inline font-bold text-xs mt-1">Cart</span>
              </button>
            </div>
          </div>

          <nav className="bg-[#360910] text-rose-100 text-xs px-4 py-2 overflow-x-auto flex items-center space-x-6 font-medium whitespace-nowrap border-t border-rose-900">
            <button onClick={() => setIsServiceOpen(true)} className="bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" /> Book Technician Visit (₹299)
            </button>
            <button onClick={() => { setSelectedCategory('All'); setActiveTab('shop'); }} className="hover:text-amber-400 bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold">All</button>
            <button onClick={() => { setSelectedCategory('Spare Parts'); setActiveTab('shop'); }} className="hover:text-amber-400">Spare Parts</button>
            <button onClick={() => { setSelectedCategory('Appliance'); setActiveTab('shop'); }} className="hover:text-amber-400">New Appliance</button>
            <button onClick={() => { setSelectedCategory('Repair Service'); setActiveTab('shop'); }} className="hover:text-amber-400">Repair Service</button>
            <button onClick={() => { setSelectedCategory('Washing Machine'); setActiveTab('shop'); }} className="hover:text-amber-400">Washing Machine</button>
            <button onClick={() => { setSelectedCategory('Water Filter'); setActiveTab('shop'); }} className="hover:text-amber-400">RO Filters</button>
            <button onClick={() => { setSelectedCategory('Refrigerator'); setActiveTab('shop'); }} className="hover:text-amber-400">Refrigerator</button>
            <button onClick={() => { setSelectedCategory('AC'); setActiveTab('shop'); }} className="hover:text-amber-400">AC Gas Charging</button>
          </nav>
        </header>

        {activeTab === 'home' && (
          <main className="pb-12">
            <div className="bg-[#4a0e17] text-white py-12 px-6 border-b border-rose-900">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="max-w-xl space-y-4">
                  <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Authorized Multi-Brand Repair & Spares Store
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                    Genuine Factory Spare Parts & Expert Home Technician Visit
                  </h2>
                  <p className="text-rose-100 text-xs md:text-sm leading-relaxed">
                    Buy 100% authentic replacement parts or book certified technicians for Washing Machines, Fridges, ACs, and RO Water Purifiers.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button onClick={() => setActiveTab('shop')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded text-xs transition flex items-center gap-1 shadow-lg">
                      Explore Spare Parts →
                    </button>
                    <button onClick={() => setIsServiceOpen(true)} className="border border-rose-700 hover:bg-rose-900 text-white font-bold px-5 py-2.5 rounded text-xs transition flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" /> Book Doorstep Repair Visit
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                  <div className="bg-rose-950/80 border border-rose-800 p-4 rounded-xl text-center flex flex-col items-center">
                    <Zap className="w-6 h-6 text-amber-400 mb-1" />
                    <h4 className="font-bold text-xs text-white">2 Hour Doorstep</h4>
                    <p className="text-[10px] text-rose-200">Fast Repair Service</p>
                  </div>
                  <div className="bg-rose-950/80 border border-rose-800 p-4 rounded-xl text-center flex flex-col items-center">
                    <ShieldCheck className="w-6 h-6 text-sky-400 mb-1" />
                    <h4 className="font-bold text-xs text-white">100% Original</h4>
                    <p className="text-[10px] text-rose-200">OEM Spare Parts</p>
                  </div>
                  <div className="bg-rose-950/80 border border-rose-800 p-4 rounded-xl text-center flex flex-col items-center">
                    <Users className="w-6 h-6 text-emerald-400 mb-1" />
                    <h4 className="font-bold text-xs text-white">Verified Experts</h4>
                    <p className="text-[10px] text-rose-200">Certified Engineers</p>
                  </div>
                  <div className="bg-rose-950/80 border border-rose-800 p-4 rounded-xl text-center flex flex-col items-center">
                    <CreditCard className="w-6 h-6 text-amber-300 mb-1" />
                    <h4 className="font-bold text-xs text-white">Cash / UPI</h4>
                    <p className="text-[10px] text-rose-200">Pay After Repair</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Featured Products & Repairs</h3>
                  <p className="text-xs text-slate-500">Showing items for {selectedCategory}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedCategory('All')} className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded text-xs">All</button>
                  <button onClick={() => setSelectedCategory('Spare Parts')} className="bg-white border text-slate-700 font-semibold px-3 py-1 rounded text-xs hover:bg-slate-50">Spare Parts</button>
                  <button onClick={() => setSelectedCategory('Appliance')} className="bg-white border text-slate-700 font-semibold px-3 py-1 rounded text-xs hover:bg-slate-50">New Appliance</button>
                  <button onClick={() => setSelectedCategory('Repair Service')} className="bg-white border text-slate-700 font-semibold px-3 py-1 rounded text-xs hover:bg-slate-50">Repair Service</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => {
                  const pId = product._id || product.id || Math.random();
                  const title = product.title || product.name || 'Appliance Product';
                  const pPrice = Number(product.price) || 0;
                  return (
                    <div key={pId} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-xl transition relative group">
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-rose-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10">
                          {product.badge}
                        </span>
                      )}
                      <div>
                        {renderProductGraphic(product)}
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{title}</h4>
                        <div className="flex items-center space-x-1 my-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold">{product.rating || 4.8}</span>
                          <span className="text-[11px] text-slate-500">({product.reviews || 120} reviews)</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-baseline space-x-2 mb-3">
                          <span className="text-lg font-extrabold text-slate-900">₹{formatPrice(pPrice)}</span>
                          {product.originalPrice && <span className="text-xs text-slate-400 line-through">₹{formatPrice(product.originalPrice)}</span>}
                          {product.discount && <span className="text-xs font-bold text-emerald-600">{product.discount}</span>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => addToCart(product)} className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded text-xs transition shadow">
                            Add to Cart
                          </button>
                          <button onClick={() => setSelectedProduct(product)} className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 rounded text-xs transition">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-amber-400 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-lg text-slate-950">
                <div className="space-y-2 mb-4 md:mb-0">
                  <span className="bg-[#4a0e17] text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    SAME DAY REPAIR GUARANTEE
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Is Your Washing Machine, AC or Fridge Not Working?</h3>
                  <p className="text-xs md:text-sm text-slate-900 font-medium">Book an authorized technician doorstep visit in 2 minutes. Fixed inspection charge ₹299 only.</p>
                </div>
                <button 
                  onClick={() => setIsServiceOpen(true)}
                  className="bg-[#4a0e17] hover:bg-rose-900 text-amber-400 font-bold px-6 py-3.5 rounded-xl text-sm transition shadow-xl flex items-center gap-2 whitespace-nowrap"
                >
                  <Wrench className="w-4 h-4" /> Book Technician Visit Now
                </button>
              </div>
            </div>
          </main>
        )}

        {activeTab === 'shop' && (
          <main className="max-w-7xl mx-auto px-4 mt-6 pb-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 bg-white p-5 rounded-xl shadow-sm border border-slate-200 h-fit space-y-4">
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2"><Filter className="w-4 h-4" /> Category Filter</h4>
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  {['All', 'Spare Parts', 'Appliance', 'Repair Service', 'Washing Machine', 'Water Filter', 'Refrigerator', 'AC'].map(cat => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer hover:text-rose-900">
                      <input type="radio" name="cat" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="text-rose-900" />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 flex justify-between items-center text-xs">
                  <span>Showing <strong>{filteredProducts.length}</strong> items for <strong>{selectedCategory}</strong></span>
                  <span className="text-slate-500">Sorted by: Relevance</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => {
                    const pId = product._id || product.id || Math.random();
                    const title = product.title || product.name;
                    return (
                      <div key={pId} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition">
                        <div>
                          {renderProductGraphic(product)}
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{product.description || product.desc || ''}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-extrabold text-slate-900">₹{formatPrice(product.price)}</span>
                            <p className="text-[10px] text-emerald-600 font-semibold">In Stock</p>
                          </div>
                          <button onClick={() => addToCart(product)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded text-xs transition">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        )}

        {activeTab === 'cart' && (
          <main className="max-w-5xl mx-auto px-4 mt-6 pb-12">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Shopping Cart ({cart.length} items)</h2>
            {cart.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm">
                <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-bold text-slate-700">Your Cart is Empty</p>
                <button onClick={() => setActiveTab('shop')} className="mt-4 bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-amber-400 transition">
                  Browse Products & Spares
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => {
                    const itemId = item._id || item.id;
                    const itemPrice = Number(item.price) || 0;
                    const title = item.title || item.name;
                    return (
                      <div key={itemId} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 items-center">
                        <div className="w-16 h-16 bg-rose-950 rounded flex items-center justify-center text-amber-400">
                          <Wrench className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-slate-900">{title}</h4>
                          <p className="text-xs text-slate-500">Unit Price: ₹{formatPrice(itemPrice)}</p>
                          <div className="flex items-center space-x-3 mt-3">
                            <div className="flex items-center border border-slate-300 rounded-md">
                              <button onClick={() => updateQty(itemId, -1)} className="p-1 text-slate-600"><Minus className="w-3.5 h-3.5" /></button>
                              <span className="px-3 text-xs font-bold">{item.qty}</span>
                              <button onClick={() => updateQty(itemId, 1)} className="p-1 text-slate-600"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                            <button onClick={() => removeFromCart(itemId)} className="text-red-500 text-xs font-bold flex items-center gap-1">
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                        <span className="font-extrabold text-base">₹{formatPrice(itemPrice * item.qty)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg border-b pb-2">Order Summary</h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between"><span>Items Total:</span><span>₹{formatPrice(cartTotal)}</span></div>
                    <div className="flex justify-between"><span>GST (18%):</span><span>₹{formatPrice(tax)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>Discount:</span><span>-₹{formatPrice(discount)}</span></div>}
                    <div className="flex justify-between font-extrabold text-base text-slate-900 pt-2 border-t">
                      <span>Total Amount:</span><span>₹{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Coupon Code</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="e.g. MAHALAXMI10" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full text-xs p-2 border rounded border-slate-300 uppercase" />
                      <button onClick={applyCoupon} className="bg-rose-900 text-white text-xs font-bold px-3 rounded">Apply</button>
                    </div>
                  </div>
                  <button onClick={() => { 
                    if (!user) {
                      showToast("Please sign in to place your order.");
                      setIsAuthOpen(true);
                      return;
                    }
                    alert("Order Placed Successfully!"); 
                    setCart([]); 
                  }} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg text-sm transition shadow-lg mt-4">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </main>
        )}
      </div>

      <footer className="bg-[#4a0e17] text-white text-xs mt-12 border-t border-rose-900">
        <button onClick={scrollToTop} className="w-full bg-[#360910] hover:bg-[#2b070d] py-3 text-center text-xs font-semibold text-rose-100 transition flex items-center justify-center gap-1">
          <ArrowUp className="w-3.5 h-3.5" /> Back to top
        </button>

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-sm mb-3 text-amber-400">Shri Mahalaxmi Store</h4>
            <p className="text-rose-100 leading-relaxed text-[11px]">
              Your trusted partner for home appliance sales, authentic factory spare parts, and doorstep repair services.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-white">Repair Services</h4>
            <ul className="space-y-2 text-rose-100">
              <li><button onClick={() => setIsServiceOpen(true)} className="hover:underline text-left">Washing Machine Repair</button></li>
              <li><button onClick={() => setIsServiceOpen(true)} className="hover:underline text-left">RO Filter Service & Membrane</button></li>
              <li><button onClick={() => setIsServiceOpen(true)} className="hover:underline text-left">AC Gas Refilling & Servicing</button></li>
              <li><button onClick={() => setIsServiceOpen(true)} className="hover:underline text-left">Refrigerator Compressor Check</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-white">Customer Support</h4>
            <ul className="space-y-2 text-rose-100">
              <li className="flex items-center gap-1.5"><MapPinned className="w-3.5 h-3.5 text-amber-400" /> Shop No 12, Main Market Road</li>
              <li className="flex items-center gap-1.5"><PhoneCall className="w-3.5 h-3.5 text-amber-400" /> Helpline: +91 9881192021</li>
              <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> support@shrimahalaxmi.com</li>
              <li className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> Open All Days: 9:00 AM - 9:00 PM</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-white">Coupons & Discounts</h4>
            <p className="text-rose-100 text-[11px] mb-2">Use code <strong className="text-amber-400">MAHALAXMI10</strong> for 10% instant discount on checkout!</p>
            <div className="bg-rose-950 p-3 rounded-lg border border-rose-800 text-center">
              <span className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Verified Authentic Center
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#24060b] py-4 border-t border-rose-900 text-center text-rose-300 text-[11px]">
          <p>© 2026 Shri Mahalaxmi Home Appliances Sales & Services. All rights reserved.</p>
        </div>
      </footer>

      {/* Authentication Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 relative shadow-2xl">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold mb-4 text-slate-900">
              {authMode === 'login' ? 'Sign In to Shri Mahalaxmi' : 'Create Customer Account'}
            </h3>
            
            <form onSubmit={authMode === 'login' ? handleLogin : handleSignup} className="space-y-3 text-xs">
              {authMode === 'signup' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={authName} 
                    onChange={(e) => setAuthName(e.target.value)} 
                    placeholder="Rajesh Sharma" 
                    required 
                    className="w-full border p-2.5 rounded-lg" 
                  />
                </div>
              )}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={authEmail} 
                  onChange={(e) => setAuthEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  required 
                  className="w-full border p-2.5 rounded-lg" 
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Password</label>
                <input 
                  type="password" 
                  value={authPassword} 
                  onChange={(e) => setAuthPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  className="w-full border p-2.5 rounded-lg" 
                />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg text-sm shadow">
                {authMode === 'login' ? 'Sign In' : 'Register Account'}
              </button>
            </form>

            <div className="mt-4 text-center text-xs">
              {authMode === 'login' ? (
                <p className="text-slate-600">
                  New customer?{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-rose-900 font-bold hover:underline">
                    Create your account
                  </button>
                </p>
              ) : (
                <p className="text-slate-600">
                  Already have an account?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-rose-900 font-bold hover:underline">
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Service Booking Modal */}
      {isServiceOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setIsServiceOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-bold text-slate-900">Book Doorstep Technician Service</h3>
            </div>
            <form onSubmit={handleServiceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Appliance / Service</label>
                <select 
                  value={serviceAppliance} 
                  onChange={(e) => setServiceAppliance(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-slate-800"
                >
                  <option>Inverter AC Gas Charging & Leakage Repair</option>
                  <option>Washing Machine Repair & Maintenance</option>
                  <option>RO Water Purifier Service / Filter Change</option>
                  <option>Refrigerator Gas Filling & Compressor Check</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                <input 
                  type="text" 
                  value={serviceName} 
                  onChange={(e) => setServiceName(e.target.value)} 
                  defaultValue={user ? user.name : ''} 
                  placeholder="Rajesh Sharma" 
                  required 
                  className="w-full border p-2.5 rounded-lg" 
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  value={servicePhone} 
                  onChange={(e) => setServicePhone(e.target.value)} 
                  placeholder="+91 9881192021" 
                  required 
                  className="w-full border p-2.5 rounded-lg" 
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doorstep Address & Pincode</label>
                <textarea 
                  rows="2" 
                  value={serviceAddress} 
                  onChange={(e) => setServiceAddress(e.target.value)} 
                  placeholder="Full address in Mumbai" 
                  required 
                  className="w-full border p-2.5 rounded-lg"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg text-sm shadow">
                Confirm Service Booking (₹299 Inspection Fee)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}