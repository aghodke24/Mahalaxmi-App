import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Main Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col flex-shrink-0">
          <span className="text-xl font-black tracking-tight text-amber-400">Mahalaxmi</span>
          <span className="text-[10px] text-slate-300 tracking-widest uppercase">Appliances & Services</span>
        </Link>

        {/* Amazon-style Search Bar in Header */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl flex">
          <input 
            type="text" 
            placeholder="Search appliances, AC parts, washing machine pumps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-l-xl text-slate-900 bg-white focus:outline-none text-sm"
          />
          <button type="submit" className="bg-amber-500 text-slate-900 px-6 rounded-r-xl font-bold hover:bg-amber-400 transition">
            🔍
          </button>
        </form>

        {/* Right Nav Actions */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          {userInfo ? (
            <div className="text-xs">
              <p className="text-slate-400">Hello,</p>
              <p className="font-bold text-amber-400">{userInfo.name}</p>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold hover:text-amber-400">
              Sign In
            </Link>
          )}

          <Link to="/cart" className="relative flex items-center space-x-1 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 hover:border-amber-400 transition">
            <span className="text-xl">🛒</span>
            <span className="font-bold text-amber-400">{totalItems}</span>
          </Link>
        </div>
      </div>

      {/* Sub-Navbar / Department Categories Bar */}
      <div className="bg-slate-800 text-slate-200 px-4 py-2 text-xs md:text-sm flex space-x-6 overflow-x-auto border-t border-slate-700">
        <Link to="/" className="hover:text-amber-400 font-semibold whitespace-nowrap">⚡ All Products</Link>
        <Link to="/?category=Washing+Machine+Parts" className="hover:text-amber-400 whitespace-nowrap">Washing Machine Parts</Link>
        <Link to="/?category=AC+Parts" className="hover:text-amber-400 whitespace-nowrap">AC Spare Parts</Link>
        <Link to="/?category=Water+Filter+Parts" className="hover:text-amber-400 whitespace-nowrap">Water Filter / RO</Link>
        <Link to="/?category=Home+Appliances" className="hover:text-amber-400 whitespace-nowrap">Home Appliances</Link>
        <Link to="/?category=Refrigerator+Parts" className="hover:text-amber-400 whitespace-nowrap">Refrigerator Parts</Link>
      </div>
    </header>
  );
}