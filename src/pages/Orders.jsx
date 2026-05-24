import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LuClipboardList, LuSearch, LuEye, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { PulseLoader } from 'react-spinners';
import { get_orders } from '../store/Reducers/orderReducer';

const pColors = { paid:{bg:"rgba(34,197,94,.12)",text:"#22c55e",border:"rgba(34,197,94,.25)"}, unpaid:{bg:"rgba(239,68,68,.12)",text:"#ef4444",border:"rgba(239,68,68,.25)"}, pending:{bg:"rgba(234,179,8,.12)",text:"#eab308",border:"rgba(234,179,8,.25)"} };
const dColors = { delivered:{bg:"rgba(34,197,94,.12)",text:"#22c55e",border:"rgba(34,197,94,.25)"}, processing:{bg:"rgba(79,142,247,.12)",text:"#4f8ef7",border:"rgba(79,142,247,.25)"}, shipped:{bg:"rgba(168,85,247,.12)",text:"#a855f7",border:"rgba(168,85,247,.25)"}, pending:{bg:"rgba(234,179,8,.12)",text:"#eab308",border:"rgba(234,179,8,.25)"}, cancelled:{bg:"rgba(239,68,68,.12)",text:"#ef4444",border:"rgba(239,68,68,.25)"} };

const Badge = ({ status, map }) => {
  const k = status?.toLowerCase() || 'pending';
  const c = map[k] || map.pending;
  return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize" style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}` }}>{status || 'pending'}</span>;
};

const card = { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"16px" };

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, totalItems, loader } = useSelector(s => s.order);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  useEffect(() => { if (!localStorage.getItem('accessToken')) navigate('/seller/login'); }, []);
  useEffect(() => { dispatch(get_orders({ page, perPage, search })); }, [dispatch, page, perPage, search]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#4f8ef7,#7c3aed)" }}>
          <LuClipboardList className="text-white text-base" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">Orders</h1>
          <p className="text-gray-500 text-xs">Track and manage customer orders</p>
        </div>
      </div>

      <div style={card}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5" style={{ borderBottom:"1px solid rgba(255,255,255,.06)" }}>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Show</span>
            <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }} className="text-sm px-2 py-1.5 rounded-lg outline-none" style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", color:"#d1d5db" }}>
              {[5,10,25].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search orders..." className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none w-52" style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", color:"#d1d5db" }} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ background:"rgba(79,142,247,.06)", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                {['Order ID','Customer','Total','Payment','Delivery','Date',''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr><td colSpan={7} className="text-center py-12"><PulseLoader color="#4f8ef7" size={8} /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">No orders found</td></tr>
              ) : orders.map(order => (
                <tr key={order._id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(79,142,247,.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-5 py-4"><span className="text-blue-400 text-sm font-mono">#{String(order._id).slice(-6).toUpperCase()}</span></td>
                  <td className="px-5 py-4">
                    <p className="text-white text-sm">{order.customerName || '—'}</p>
                    <p className="text-gray-500 text-xs">{order.customerEmail || ''}</p>
                  </td>
                  <td className="px-5 py-4"><span className="text-white font-semibold text-sm">${order.price || order.totalPrice || 0}</span></td>
                  <td className="px-5 py-4"><Badge status={order.paymentStatus} map={pColors} /></td>
                  <td className="px-5 py-4"><Badge status={order.deliveryStatus} map={dColors} /></td>
                  <td className="px-5 py-4"><span className="text-gray-400 text-xs">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</span></td>
                  <td className="px-5 py-4">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400" style={{ background:"rgba(79,142,247,.12)", border:"1px solid rgba(79,142,247,.25)" }}>
                      <LuEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <span className="text-gray-500 text-sm">{totalItems > 0 ? `${(page-1)*perPage+1}–${Math.min(page*perPage,totalItems)} of ${totalItems}` : 'No results'}</span>
          <div className="flex gap-2">
            <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:page===1?"#4b5563":"#4f8ef7" }}><LuChevronLeft /></button>
            {[...Array(totalPages)].map((_,i) => (
              <button key={i} onClick={() => setPage(i+1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium" style={{ background:page===i+1?"linear-gradient(135deg,#4f8ef7,#7c3aed)":"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:page===i+1?"#fff":"#9ca3af" }}>{i+1}</button>
            ))}
            <button disabled={page>=totalPages} onClick={() => setPage(p=>p+1)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:page>=totalPages?"#4b5563":"#4f8ef7" }}><LuChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
