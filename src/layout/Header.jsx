import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { LuMenu, LuBell, LuSearch, LuStore } from "react-icons/lu";

export default function Header({ setShowsideBar, showSideBar }) {
  const { sellerInfo } = useSelector((state) => state.sellerAuth);
  const [searchFocus, setSearchFocus] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header
      className="w-full h-[70px] fixed top-0 left-0 z-30 flex items-center px-4 lg:px-6"
      style={{
        background: 'rgba(13,27,42,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={() => setShowsideBar(!showSideBar)}
        className="lg:hidden mr-4 flex items-center justify-center w-9 h-9 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <LuMenu className="text-xl" />
      </button>

      {/* Logo on mobile */}
      <div className="lg:hidden flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)' }}>
          <LuStore className="text-white text-sm" />
        </div>
        <span className="text-white font-bold text-sm">SellerHub</span>
      </div>

      {/* Search bar */}
      <div className="hidden md:flex flex-1 max-w-md ml-4 lg:ml-0">
        <div
          className="relative w-full flex items-center transition-all duration-200"
          style={{
            background: searchFocus ? 'rgba(79,142,247,0.08)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${searchFocus ? 'rgba(79,142,247,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '12px',
          }}
        >
          <LuSearch className="absolute left-3 text-gray-500 text-base" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-gray-300 placeholder-gray-600 text-sm outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <LuBell className="text-lg" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)' }}
          />
        </button>

        {/* Divider */}
        <div className="h-6 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {/* Seller profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 transition-all group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)' }}
          >
            {getInitials(sellerInfo?.name)}
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-white text-sm font-semibold leading-none">
              {sellerInfo?.name || 'Seller'}
            </span>
            <span className="text-gray-500 text-xs mt-0.5">Seller Account</span>
          </div>
        </div>
      </div>
    </header>
  );
}
