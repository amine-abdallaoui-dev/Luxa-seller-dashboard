import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, Register } from '../../store/Reducers/SellerAuthReducer';
import { BeatLoader } from "react-spinners";
import { LuShoppingCart, LuUser, LuMail, LuLock, LuStore, LuMapPin, LuPhone, LuArrowRight, LuArrowLeft, LuCheck } from 'react-icons/lu';

const inputStyle = {
  background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
  borderRadius: "12px", color: "#f3f4f6", padding: "11px 14px 11px 42px",
  outline: "none", width: "100%", fontSize: "14px", transition: "border-color .2s, background .2s",
};
const onFocus = (e) => { e.target.style.borderColor = "rgba(79,142,247,.5)"; e.target.style.background = "rgba(79,142,247,.08)"; };
const onBlur  = (e) => { e.target.style.borderColor = "rgba(255,255,255,.1)"; e.target.style.background = "rgba(255,255,255,.06)"; };
const Label = ({ children }) => <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">{children}</label>;
const IconInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
    <input {...props} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
  </div>
);

export default function SellerRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage } = useSelector(s => s.sellerAuth);
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [state, setState] = useState({
    name:"", email:"", password:"", shopName:"", shopEmail:"", country:"", city:"", phone:"",
  });
  const set = (e) => setState(p => ({ ...p, [e.target.name]: e.target.value }));

  const nextStep = () => {
    if (!state.name || !state.email || !state.password) { toast.error("Please fill all fields"); return; }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.shopName || !state.country || !state.city || !state.phone) { toast.error("Please fill all shop details"); return; }
    if (!agreed) { toast.error("Please accept the terms"); return; }
    dispatch(Register(state));
  };

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearMessage()); navigate("/"); }
    if (errorMessage)   { toast.error(errorMessage);   dispatch(clearMessage()); }
  }, [successMessage, errorMessage]);

  return (
    <div className="w-screen min-h-screen flex items-center justify-center relative overflow-hidden py-10" style={{ background: "#0f1117" }}>
      {/* Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle,#4f8ef7,transparent)" }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle,#7c3aed,transparent)" }} />

      <div className="w-full max-w-[480px] mx-4 relative z-10">
        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", backdropFilter: "blur(20px)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#7c3aed)", boxShadow: "0 8px 32px rgba(79,142,247,0.35)" }}>
              <LuShoppingCart className="text-white text-2xl" />
            </div>
            <h1 className="text-white text-2xl font-bold">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join SellerHub and start selling today</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-7">
            {[1,2].map(s => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{ background: step >= s ? "linear-gradient(135deg,#4f8ef7,#7c3aed)" : "rgba(255,255,255,.08)", color: step >= s ? "#fff" : "#6b7280" }}>
                    {step > s ? <LuCheck className="text-xs" /> : s}
                  </div>
                  <span className="text-xs font-medium" style={{ color: step >= s ? "#d1d5db" : "#6b7280" }}>
                    {s === 1 ? "Personal Info" : "Shop Details"}
                  </span>
                </div>
                {s < 2 && <div className="flex-1 h-px" style={{ background: step > 1 ? "rgba(79,142,247,.5)" : "rgba(255,255,255,.08)" }} />}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <Label>Full Name</Label>
                  <IconInput icon={LuUser} type="text" name="name" placeholder="Your full name" value={state.name} onChange={set} required />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <IconInput icon={LuMail} type="email" name="email" placeholder="you@example.com" value={state.email} onChange={set} required />
                </div>
                <div>
                  <Label>Password</Label>
                  <IconInput icon={LuLock} type="password" name="password" placeholder="••••••••" value={state.password} onChange={set} required />
                </div>
                <button type="button" onClick={nextStep}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2"
                  style={{ background: "linear-gradient(135deg,#4f8ef7,#7c3aed)", boxShadow: "0 8px 24px rgba(79,142,247,0.3)", marginTop: "24px" }}>
                  Next Step <LuArrowRight />
                </button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label>Shop Name</Label>
                    <IconInput icon={LuStore} type="text" name="shopName" placeholder="My Awesome Shop" value={state.shopName} onChange={set} required />
                  </div>
                  <div className="col-span-2">
                    <Label>Shop Email</Label>
                    <IconInput icon={LuMail} type="email" name="shopEmail" placeholder="shop@example.com" value={state.shopEmail} onChange={set} />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <IconInput icon={LuMapPin} type="text" name="country" placeholder="Country" value={state.country} onChange={set} required />
                  </div>
                  <div>
                    <Label>City</Label>
                    <IconInput icon={LuMapPin} type="text" name="city" placeholder="City" value={state.city} onChange={set} required />
                  </div>
                  <div className="col-span-2">
                    <Label>Phone Number</Label>
                    <IconInput icon={LuPhone} type="text" name="phone" placeholder="+1 234 567 8900" value={state.phone} onChange={set} required />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer mt-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="hidden" />
                    <div className="w-4 h-4 rounded flex items-center justify-center transition-all"
                      style={{ background: agreed ? "linear-gradient(135deg,#4f8ef7,#7c3aed)" : "rgba(255,255,255,.08)", border: agreed ? "none" : "1px solid rgba(255,255,255,.2)" }}>
                      {agreed && <LuCheck className="text-white text-[10px]" />}
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs leading-relaxed">
                    I agree to the <span className="text-blue-400 cursor-pointer">privacy policy</span> & <span className="text-blue-400 cursor-pointer">terms of service</span>
                  </span>
                </label>

                <div className="flex gap-3 mt-2" style={{ paddingTop: "8px" }}>
                  <button type="button" onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-gray-400"
                    style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>
                    <LuArrowLeft className="text-xs" /> Back
                  </button>
                  <button type="submit" disabled={loader}
                    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: loader ? "rgba(79,142,247,.4)" : "linear-gradient(135deg,#4f8ef7,#7c3aed)", cursor: loader ? "not-allowed" : "pointer", boxShadow: loader ? "none" : "0 8px 24px rgba(79,142,247,0.3)" }}>
                    {loader ? <BeatLoader size={8} color="#fff" /> : "Create Account"}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/seller/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Sign In</Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-5">Seller portal • Secure registration</p>
      </div>
    </div>
  );
}
