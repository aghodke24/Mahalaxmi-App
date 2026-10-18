import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const location = useLocation();

  // Parse query parameters from URL (e.g., ?search=pump or ?category=AC+Parts)
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const categoryQuery = queryParams.get('category') || 'All';

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        }
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const category = p.category || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryQuery === 'All' || category === categoryQuery;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-amber-950 text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center border border-amber-500/30">
        <div className="space-y-3 max-w-xl">
          <span className="bg-amber-400 text-slate-900 text-xs font-black uppercase px-3 py-1 rounded-md tracking-wider">
            Mahalaxmi Assurance
          </span>
          <h1 className="text-2xl md:text-4xl font-black">Genuine Spare Parts & Expert Appliance Service</h1>
          <p className="text-slate-300 text-sm">
            Get authentic replacement components for ACs, Fridges, Washing Machines, and Water Purifiers delivered or ready for store pickup.
          </p>
        </div>
        <div className="mt-6 md:mt-0 bg-white/10 p-4 rounded-xl border border-white/10 text-center">
          <p className="text-xs text-amber-400 font-bold uppercase">Need Technician Help?</p>
          <p className="text-lg font-black mt-1">Call: +91 98765 43210</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <Link 
            key={cat}
            to={cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              categoryQuery === cat 
                ? 'bg-amber-500 text-slate-900 shadow-md' 
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const price = typeof product.price === 'number' ? product.price : 0;
          return (
            <div key={product._id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-xl transition flex flex-col justify-between group">
              <div>
                <Link to={`/product/${product._id}`}>
                  <div className="overflow-hidden rounded-xl mb-3 bg-slate-100 h-48">
                   <img 
                    src={product.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'} 
                    alt={product.name} 
                    onError={(e) => {
                        // If the image fails to load, fallback to a generic appliance placeholder image
                        e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500';
                    }}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  </div>
                </Link>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500 font-semibold">{product.category || 'General'}</span>
                  <span className="text-amber-500 font-bold">★★★★★ (4.8)</span>
                </div>
                <Link to={`/product/${product._id}`}>
                  <h2 className="font-bold text-base text-slate-900 line-clamp-2 hover:text-amber-600 transition">
                    {product.name || 'Unnamed Product'}
                  </h2>
                </Link>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xl font-black text-slate-900">${price.toFixed(2)}</span>
                  <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <button 
                  disabled={product.stock <= 0}
                  onClick={() => addToCart(product)}
                  className="w-full bg-slate-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-amber-500 hover:text-slate-900 transition shadow-sm disabled:bg-slate-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <p className="text-lg font-bold text-slate-700">No products found matching your search or category.</p>
          <Link to="/" className="inline-block mt-4 text-amber-600 font-bold hover:underline">View All Products</Link>
        </div>
      )}
    </div>
  );
}