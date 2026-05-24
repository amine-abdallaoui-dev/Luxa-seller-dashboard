import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuPackage, LuSearch, LuTrash2, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { delete_product, get_products, clearMessage } from "../store/Reducers/productReducer";

const statusColors = {
  active:   { bg: "rgba(34,197,94,0.12)",  text: "#22c55e", border: "rgba(34,197,94,0.25)"  },
  inactive: { bg: "rgba(239,68,68,0.12)",  text: "#ef4444", border: "rgba(239,68,68,0.25)"  },
  pending:  { bg: "rgba(234,179,8,0.12)",  text: "#eab308", border: "rgba(234,179,8,0.25)"  },
};

function StatusBadge({ status }) {
  const s = status?.toLowerCase() || "pending";
  const c = statusColors[s] || statusColors.pending;
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {status || "pending"}
    </span>
  );
}

function AllProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sellerInfo } = useSelector((state) => state.sellerAuth);
  const { products, totalItems, loader, successMessage, errorMessage } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) navigate("/seller/login");
  }, [navigate]);

  useEffect(() => {
    dispatch(get_products({ page: currentPage, perPage, search: searchValue }));
  }, [dispatch, currentPage, perPage, searchValue]);

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearMessage()); }
    if (errorMessage) { toast.error(errorMessage); dispatch(clearMessage()); }
  }, [successMessage, errorMessage, dispatch]);

  const totalPages = Math.ceil(totalItems / perPage);

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    backdropFilter: "blur(10px)",
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#4f8ef7,#7c3aed)" }}>
            <LuPackage className="text-white text-base" />
          </div>
          <h1 className="text-white text-xl font-bold">All Products</h1>
        </div>
        <p className="text-gray-500 text-sm ml-12">Manage your product catalogue</p>
      </div>

      {/* Table Card */}
      <div style={cardStyle}>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Show</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(+e.target.value); setCurrentPage(1); }}
              className="text-sm px-2 py-1.5 rounded-lg outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#d1d5db" }}
            >
              {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-gray-400 text-sm">entries</span>
          </div>
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); setCurrentPage(1); }}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none w-[220px]"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#d1d5db" }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(79,142,247,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["#", "Image", "Product Name", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr><td colSpan={7} className="text-center py-12">
                  <PulseLoader color="#4f8ef7" size={8} />
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">
                  No products found
                </td></tr>
              ) : (
                products.map((product, idx) => (
                  <tr key={product._id}
                    className="group transition-colors duration-150"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(79,142,247,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td className="px-5 py-4 text-gray-500 text-sm">{(currentPage - 1) * perPage + idx + 1}</td>
                    <td className="px-5 py-4">
                      <img
                        src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/80/80`}
                        alt={product.title}
                        className="w-12 h-12 rounded-xl object-cover"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-medium line-clamp-2 max-w-[200px]">{product.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{product.category}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white text-sm font-semibold">${product.price}</span>
                      {product.discount > 0 && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md"
                          style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                          -{product.discount}%
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-gray-300 text-sm">{product.stock}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => dispatch(delete_product(product._id))}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-white hover:bg-red-500 transition-all duration-200"
                        style={{ border: "1px solid rgba(239,68,68,0.3)" }}
                      >
                        <LuTrash2 className="text-sm" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-gray-500 text-sm">
            {totalItems > 0 ? `Showing ${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, totalItems)} of ${totalItems}` : "No results"}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: currentPage === 1 ? "rgba(255,255,255,0.03)" : "rgba(79,142,247,0.15)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: currentPage === 1 ? "#4b5563" : "#4f8ef7",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              <LuChevronLeft className="text-sm" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all"
                style={{
                  background: currentPage === i + 1 ? "linear-gradient(135deg,#4f8ef7,#7c3aed)" : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: currentPage === i + 1 ? "#fff" : "#9ca3af",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: currentPage === totalPages || totalPages === 0 ? "rgba(255,255,255,0.03)" : "rgba(79,142,247,0.15)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: currentPage === totalPages || totalPages === 0 ? "#4b5563" : "#4f8ef7",
                cursor: currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
              }}
            >
              <LuChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllProducts;
