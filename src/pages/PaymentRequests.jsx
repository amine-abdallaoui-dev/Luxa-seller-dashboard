import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LuWallet, LuSend, LuChevronLeft, LuChevronRight, LuDollarSign, LuClock } from 'react-icons/lu';
import { FaCheckCircle } from "react-icons/fa";

import { PulseLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import {
  request_payment,
  get_payment_requests,
  get_payment_stats,
  clearMessage,
} from '../store/Reducers/paymentReducer';

const card = { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"16px" };

const statusColor = {
  pending:  { bg:"rgba(234,179,8,.12)",  text:"#eab308", border:"rgba(234,179,8,.25)"  },
  approved: { bg:"rgba(34,197,94,.12)",  text:"#22c55e", border:"rgba(34,197,94,.25)"  },
  rejected: { bg:"rgba(239,68,68,.12)",  text:"#ef4444", border:"rgba(239,68,68,.25)"  },
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="p-5 rounded-2xl flex items-center gap-4" style={card}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
        <Icon className="text-xl" style={{ color }} />
      </div>
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-wide">{label}</p>
        <h3 className="text-white text-xl font-bold mt-0.5">{value}</h3>
      </div>
    </div>
  );
}

function PaymentRequests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requests, totalItems, loader, stats, successMessage, errorMessage } = useSelector(s => s.payment);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [amount, setAmount] = useState('');
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  useEffect(() => { if (!localStorage.getItem('accessToken')) navigate('/seller/login'); }, []);
  useEffect(() => {
    dispatch(get_payment_requests({ page, perPage }));
    dispatch(get_payment_stats());
  }, [dispatch, page, perPage]);

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearMessage()); }
    if (errorMessage)   { toast.error(errorMessage);   dispatch(clearMessage()); }
  }, [successMessage, errorMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error('Please enter a valid amount'); return; }
    dispatch(request_payment({ amount: amt }));
    setAmount('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#4f8ef7,#7c3aed)" }}>
          <LuWallet className="text-white text-base" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">Payment Requests</h1>
          <p className="text-gray-500 text-xs">Request earnings withdrawal from your balance</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={LuDollarSign}   label="Total Requested" value={`$${stats.totalRequested.toFixed(2)}`} color="#4f8ef7" />
        <StatCard icon={FaCheckCircle}  label="Total Approved"  value={`$${stats.totalApproved.toFixed(2)}`}  color="#22c55e" />
        <StatCard icon={LuClock}        label="Pending Requests" value={stats.pendingCount}                    color="#eab308" />
      </div>

      {/* Request Form */}
      <div className="p-5 rounded-2xl" style={card}>
        <h3 className="text-white font-semibold mb-4">New Payment Request</h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1">
            <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter withdrawal amount..."
                className="w-full pl-7 pr-4 py-3 text-sm rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#f3f4f6" }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loader}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", opacity: loader ? 0.6 : 1 }}
          >
            {loader ? <PulseLoader color="#fff" size={6} /> : <><LuSend className="text-sm" /> Submit Request</>}
          </button>
        </form>
      </div>

      {/* Requests Table */}
      <div style={card}>
        <div className="px-5 pt-4 pb-3" style={{ borderBottom:"1px solid rgba(255,255,255,.06)" }}>
          <h3 className="text-white font-semibold">Request History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr style={{ background:"rgba(79,142,247,.06)", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                {['#','Amount','Status','Date','Note'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">No payment requests yet</td></tr>
              ) : requests.map((req, idx) => {
                const c = statusColor[req.status] || statusColor.pending;
                return (
                  <tr key={req._id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(79,142,247,.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td className="px-5 py-4 text-gray-500 text-sm">{(page - 1) * perPage + idx + 1}</td>
                    <td className="px-5 py-4"><span className="text-white font-bold text-sm">${req.amount}</span></td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize" style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}` }}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-4"><span className="text-gray-400 text-xs">{new Date(req.createdAt).toLocaleDateString()}</span></td>
                    <td className="px-5 py-4"><span className="text-gray-500 text-xs">{req.adminNote || '—'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <span className="text-gray-500 text-sm">{totalItems} request(s)</span>
          <div className="flex gap-2">
            <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:page===1?"#4b5563":"#4f8ef7" }}><LuChevronLeft /></button>
            {[...Array(totalPages)].map((_,i) => (
              <button key={i} onClick={() => setPage(i+1)} className="w-8 h-8 rounded-lg text-sm font-medium" style={{ background:page===i+1?"linear-gradient(135deg,#4f8ef7,#7c3aed)":"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:page===i+1?"#fff":"#9ca3af" }}>{i+1}</button>
            ))}
            <button disabled={page>=totalPages} onClick={() => setPage(p=>p+1)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:page>=totalPages?"#4b5563":"#4f8ef7" }}><LuChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentRequests;