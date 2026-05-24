import React, { useEffect, useState } from 'react';
import { IoImagesOutline } from "react-icons/io5";
import { LuX, LuPackagePlus, LuLoader } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { add_product, clearMessage } from "../store/Reducers/productReducer";
import { getPublicCategories } from "../store/Reducers/categoryReducer";

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#f3f4f6",
  outline: "none",
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  transition: "border-color 0.2s",
};
const labelStyle = { color: "#9ca3af", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" };
const card = { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"20px", padding:"28px" };

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, errorMessage, successMessage } = useSelector(s => s.product);
  const { categories } = useSelector(s => s.category);
  const { sellerInfo } = useSelector(s => s.sellerAuth);

  const [product, setProduct] = useState({ title:"", brands:"", category:"", price:"", description:"", discount:"", stock:"" });
  const [images, setImages] = useState([]);
  const [showImages, setShowImages] = useState([]);

  useEffect(() => { if (!localStorage.getItem('accessToken')) navigate('/seller/login'); }, []);
  useEffect(() => { dispatch(getPublicCategories()); }, [dispatch]);
  useEffect(() => {
    if (errorMessage)   { toast.error(errorMessage);   dispatch(clearMessage()); }
    if (successMessage) { toast.success(successMessage); dispatch(clearMessage()); setProduct({ title:"", brands:"", category:"", price:"", description:"", discount:"", stock:"" }); setImages([]); setShowImages([]); }
  }, [errorMessage, successMessage, dispatch]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setShowImages(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };
  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setShowImages(prev => prev.filter((_, i) => i !== idx));
  };
  const set = (key) => (e) => setProduct(p => ({ ...p, [key]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.title || !product.category) { toast.error("Title and category are required"); return; }
    dispatch(add_product({ ...product, images, sellerId: sellerInfo?._id }));
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#4f8ef7,#7c3aed)" }}>
          <LuPackagePlus className="text-white text-base" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">Add Product</h1>
          <p className="text-gray-500 text-xs">Add a new product to your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-5">
            <div style={card}>
              <h3 className="text-white font-semibold mb-5">Product Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Product Title *</label>
                  <input value={product.title} onChange={set('title')} placeholder="e.g. Premium Wireless Headphones" style={inputStyle}
                    onFocus={e => e.target.style.borderColor="rgba(79,142,247,0.5)"}
                    onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>
                <div>
                  <label style={labelStyle}>Brand</label>
                  <input value={product.brands} onChange={set('brands')} placeholder="e.g. Sony" style={inputStyle}
                    onFocus={e => e.target.style.borderColor="rgba(79,142,247,0.5)"}
                    onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select value={product.category} onChange={set('category')} style={{ ...inputStyle, appearance:"none" }}>
                    <option value="" style={{ background:"#1a2235" }}>Select category...</option>
                    {categories.map(cat => <option key={cat._id} value={cat.name} style={{ background:"#1a2235" }}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Stock</label>
                  <input value={product.stock} onChange={set('stock')} type="number" placeholder="e.g. 100" style={inputStyle}
                    onFocus={e => e.target.style.borderColor="rgba(79,142,247,0.5)"}
                    onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>
                <div>
                  <label style={labelStyle}>Price ($)</label>
                  <input value={product.price} onChange={set('price')} type="number" placeholder="e.g. 49.99" style={inputStyle}
                    onFocus={e => e.target.style.borderColor="rgba(79,142,247,0.5)"}
                    onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>
                <div>
                  <label style={labelStyle}>Discount (%)</label>
                  <input value={product.discount} onChange={set('discount')} type="number" min="0" max="100" placeholder="e.g. 15" style={inputStyle}
                    onFocus={e => e.target.style.borderColor="rgba(79,142,247,0.5)"}
                    onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>
                <div className="sm:col-span-2">
                  <label style={labelStyle}>Description</label>
                  <textarea value={product.description} onChange={set('description')} rows={5} placeholder="Describe your product in detail..." style={{ ...inputStyle, resize:"vertical" }}
                    onFocus={e => e.target.style.borderColor="rgba(79,142,247,0.5)"}
                    onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>
              </div>
            </div>
          </div>

          {/* Images Panel */}
          <div className="space-y-5">
            <div style={card}>
              <h3 className="text-white font-semibold mb-5">Product Images</h3>
              {/* Upload area */}
              <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-36 rounded-xl cursor-pointer transition-all"
                style={{ border:"2px dashed rgba(79,142,247,0.3)", background:"rgba(79,142,247,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(79,142,247,0.6)"; e.currentTarget.style.background="rgba(79,142,247,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(79,142,247,0.3)"; e.currentTarget.style.background="rgba(79,142,247,0.04)"; }}>
                <IoImagesOutline className="text-3xl text-blue-400 mb-2" />
                <span className="text-blue-400 text-sm font-medium">Click to upload</span>
                <span className="text-gray-500 text-xs mt-1">PNG, JPG, WEBP</span>
              </label>
              <input onChange={handleImages} className="hidden" type="file" multiple id="images" accept="image/*" />

              {/* Preview grid */}
              {showImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {showImages.map((url, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden aspect-square group"
                      style={{ border:"1px solid rgba(255,255,255,0.08)" }}>
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background:"rgba(239,68,68,0.9)" }}>
                        <LuX className="text-white text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loader}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: loader ? "rgba(79,142,247,0.4)" : "linear-gradient(135deg,#4f8ef7,#7c3aed)", cursor: loader ? "not-allowed" : "pointer" }}>
              {loader ? <><LuLoader className="animate-spin" /> Adding Product...</> : <><LuPackagePlus /> Add Product</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;