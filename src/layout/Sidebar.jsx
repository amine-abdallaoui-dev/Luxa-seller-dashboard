import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuLayoutDashboard, LuPackage, LuShoppingCart, LuTag, LuClipboardList, LuWallet, LuUser, LuLogOut, LuX } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';

const navItems = [
  { path: '/seller/dashboard',        icon: LuLayoutDashboard, label: 'Dashboard'        },
  { path: '/seller/add-product',      icon: LuPackage,         label: 'Add Product'      },
  { path: '/seller/all-products',     icon: LuShoppingCart,    label: 'All Products'     },
  { path: '/seller/discounts',        icon: LuTag,             label: 'All Discounts'    },
  { path: '/seller/orders',           icon: LuClipboardList,   label: 'Orders'           },
  { path: '/seller/payment-requests', icon: LuWallet,          label: 'Payment Requests' },
];

export default function Sidebar({ showSideBar, setShowsideBar }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sellerInfo } = useSelector(state => state.sellerAuth);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/seller/login');
  };

  return (
    <aside
      className={`${showSideBar ? 'left-0' : '-left-[280px]'} lg:left-0 transition-all duration-300 w-[260px] h-screen fixed top-0 z-20 flex flex-col`}
      style={{
        background: 'linear-gradient(180deg, #0d1b2a 0%, #112240 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)' }}>
            <LuShoppingCart className="text-white text-lg" />
          </div>
          <span className="text-white font-bold text-base tracking-wide">SellerHub</span>
        </div>
        <button
          onClick={() => setShowsideBar(false)}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <LuX className="text-xl" />
        </button>
      </div>

      {/* Seller info */}
      {sellerInfo && sellerInfo !== '' && (
        <div className="mx-4 mb-4 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)' }}>
          <p className="text-white font-semibold text-sm truncate">{sellerInfo.name || 'Seller'}</p>
          <p className="text-gray-400 text-xs truncate">{sellerInfo.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: 'rgba(79,142,247,0.2)', color: '#4f8ef7' }}>
            Seller Account
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="mx-6 mb-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Nav items */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Menu</p>
        <ul className="space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setShowsideBar(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(79,142,247,0.25), rgba(124,58,237,0.18))',
                    border: '1px solid rgba(79,142,247,0.25)',
                  } : {}}
                >
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all
                    ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'}`}>
                    <Icon className="text-base" />
                  </span>
                  {label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 mt-4">
        <div className="h-px mx-3 mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-500">
            <LuLogOut className="text-base" />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}
