import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, getSeller, Login } from "../../store/Reducers/SellerAuthReducer";
import { LuMail, LuLock, LuShoppingCart } from "react-icons/lu";

export default function SellerLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage } = useSelector(s => s.sellerAuth);
  const [state, setState] = useState({ email: "", password: "" });

  const handleChange = (e) => setState(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); dispatch(Login(state)); };

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearMessage()); dispatch(getSeller()); navigate("/seller/dashboard"); }
    if (errorMessage)   { toast.error(errorMessage);   dispatch(clearMessage()); }
  }, [successMessage, errorMessage]);

  const inputStyle = {
    background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
    borderRadius: "12px", color: "#f3f4f6", padding: "12px 14px 12px 42px",
    outline: "none", width: "100%", fontSize: "14px", transition: "border-color .2s, background .2s",
  };
  const onFocus = (e) => { e.target.style.borderColor = "rgba(79,142,247,.5)"; e.target.style.background = "rgba(79,142,247,.08)"; };
  const onBlur  = (e) => { e.target.style.borderColor = "rgba(255,255,255,.1)"; e.target.style.background = "rgba(255,255,255,.06)"; };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#0f1117" }}>
      {/* Background glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle,#4f8ef7,transparent)" }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle,#7c3aed,transparent)" }} />

      <div className="w-full max-w-[420px] mx-4 relative z-10">
        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", backdropFilter: "blur(20px)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#7c3aed)", boxShadow: "0 8px 32px rgba(79,142,247,0.35)" }}>
              <LuShoppingCart className="text-white text-2xl" />
            </div>
            <h1 className="text-white text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your seller account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Email Address</label>
              <div className="relative">
                <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
                <input type="email" name="email" id="email" placeholder="you@example.com"
                  value={state.email} onChange={handleChange}
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Password</label>
              <div className="relative">
                <LuLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
                <input type="password" name="password" id="password" placeholder="••••••••"
                  value={state.password} onChange={handleChange}
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} required />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loader}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center"
              style={{ background: loader ? "rgba(79,142,247,.4)" : "linear-gradient(135deg,#4f8ef7,#7c3aed)", cursor: loader ? "not-allowed" : "pointer", boxShadow: loader ? "none" : "0 8px 24px rgba(79,142,247,0.3)", marginTop: "24px" }}>
              {loader ? <PulseLoader size={8} color="#fff" /> : "Sign In"}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/seller/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Create Account
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-5">Seller portal • Secure access</p>
      </div>
    </div>
  );
}
