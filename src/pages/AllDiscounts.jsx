import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LuTag, LuSearch, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { PulseLoader } from 'react-spinners';
import { get_products } from '../store/Reducers/productReducer';

const card = { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"16px" };

function AllDiscounts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, totalItems, loader } = useSelector(s => s.product);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);

  useEffect(() => { if (!localStorage.getItem('accessToken')) navigate('/seller/login'); }, []);
  useEffect(() => { dispatch(get_products({ page, perPage, search })); }, [dispatch, page, perPage, search]);

  // Filter only products with a discount
  const discounted = products.filter(p => p.discount > 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  const getDiscountColor = (d) => {
    if (d >= 50) return { bg:"rgba(239,68,68,.12)", text:"#ef4444", border:"rgba(239,68,68,.25)" };
    if (d >= 25) return { bg:"rgba(234,179,8,.12)", text:"#eab308", border:"rgba(234,179,8,.25)" };
    return { bg:"rgba(34,197,94,.12)", text:"#22c55e", border:"rgba(34,197,94,.25)" };
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#4f8ef7,#7c3aed)" }}>
          <LuTag className="text-white text-base" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">All Discounts</h1>
          <p className="text-gray-500 text-xs">Products with active discount rates</p>
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
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none w-52" style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", color:"#d1d5db" }} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr style={{ background:"rgba(79,142,247,.06)", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                {['Image','Product Name','Category','Original Price','Discount','Sale Price'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr><td colSpan={6} className="text-center py-12"><PulseLoader color="#4f8ef7" size={8} /></td></tr>
              ) : discounted.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No discounted products found</td></tr>
              ) : discounted.map(product => {
                const c = getDiscountColor(product.discount);
                const salePrice = (product.price * (1 - product.discount / 100)).toFixed(2);
                return (
                  <tr key={product._id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(79,142,247,.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td className="px-5 py-4">
                      <img src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/80/80`} alt="" className="w-12 h-12 rounded-xl object-cover" style={{ border:"1px solid rgba(255,255,255,.08)" }} />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-medium line-clamp-2 max-w-[180px]">{product.title}</p>
                    </td>
                    <td className="px-5 py-4"><span className="text-gray-400 text-sm">{product.category}</span></td>
                    <td className="px-5 py-4"><span className="text-gray-400 text-sm line-through">${product.price}</span></td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}` }}>
                        -{product.discount}%
                      </span>
                    </td>
                    <td className="px-5 py-4"><span className="text-white font-bold text-sm">${salePrice}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <span className="text-gray-500 text-sm">{discounted.length} discounted product(s)</span>
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

export default AllDiscounts;
