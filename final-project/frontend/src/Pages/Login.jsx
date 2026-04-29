import React, { useContext, useState } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, LogIn, X, ShieldCheck, KeyRound, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const LoginPage = ({ onSwitch }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password States
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotData, setForgotData] = useState({ email: "", otp: "", newPassword: "" });
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const loadingToast = toast.loading("Verifying credentials...");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.message === "Login successful") {
        toast.success("Login Successful!", { id: loadingToast });
        navigate("/", { replace: true });
        login(data.user);
      } else {
        const errorMsg = data.message || "Invalid credentials. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error) {
      console.log("Login Error: ", error);
      const serverErr = "Server connection failed. Please try again later.";
      setError(serverErr);
      toast.error(serverErr, { id: loadingToast });
    }
  };

  const handleForgotAction = async (e) => {
    e.preventDefault();
    setIsForgotLoading(true);

    const loadMessages = {
      1: "Scanning neural registry...",
      2: "Verifying OTP code...",
      3: "Updating security credentials...",
    };
    const loadId = toast.loading(loadMessages[forgotStep]);

    try {
      const urls = {
        1: `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        2: `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        3: `${import.meta.env.VITE_API_URL}/auth/reset-password`,
      };

      const payloads = {
        1: { email: forgotData.email },
        2: { email: forgotData.email, otp: forgotData.otp },
        3: { email: forgotData.email, otp: forgotData.otp, newPassword: forgotData.newPassword },
      };

      const res = await fetch(urls[forgotStep], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloads[forgotStep]),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message, { id: loadId });
        if (forgotStep < 3) {
          setForgotStep((s) => s + 1);
        } else {
          setShowForgot(false);
          setForgotStep(1);
          setForgotData({ email: "", otp: "", newPassword: "" });
        }
      } else {
        toast.error(data.message, { id: loadId });
      }
    } catch (error) {
      toast.error("Protocol Error. Try again.", { id: loadId });
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#fdf8f5] items-center justify-center p-6 selection:bg-[#056973]/20 neural-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row h-[650px] relative"
      >
        {/* Left Side: Welcome Section */}
        <div className="flex-1 bg-gradient-to-br from-[#056973] to-[#0fc9db] p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="scan-line opacity-20"></div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 shadow-2xl border border-white/30 neon-glow-pulse"
          >
            <LogIn size={48} />
          </motion.div>
          <h2 className="text-4xl font-bold mb-4 text-glow">New Here?</h2>
          <p className="text-white/80 mb-10 leading-relaxed font-medium">
            Create your account and discover the world's most exclusive auctions today!
          </p>
          <button
            onClick={onSwitch}
            className="px-10 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-[#056973] transition-all"
          >
            Sign Up
          </button>
          <div className="mt-12">
            <a href="/" className="text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <ArrowLeft size={14} /> Back To Home
            </a>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-[1.5] p-8 md:p-16 flex flex-col justify-center glass-premium relative">
          <div className="neural-corner corner-tr opacity-20"></div>
          <div className="neural-corner corner-bl opacity-20"></div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[#056973] mb-3 text-center tracking-tighter">Welcome Back</h1>
            <p className="text-slate-400 text-center text-base font-medium">Enter your credentials to access your account.</p>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl flex items-center gap-3 text-sm font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <LogIn size={16} />
              </div>
              {message}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center gap-3 text-sm font-bold"
            >
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <X size={16} />
              </div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#056973] transition-all" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-14 pr-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#056973] transition-all" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-14 pr-16 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#056973]">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end px-4">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[#056973] text-sm font-bold hover:underline opacity-80"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#056973] text-white rounded-full font-bold text-lg shadow-lg shadow-[#056973]/20 hover:bg-[#04565e] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
            >
              Log In <ArrowRight size={20} />
            </button>
          </form>

          {/* Mobile Switcher */}
          <div className="mt-10 text-center md:hidden">
            <p className="text-slate-400 text-sm">New to the platform? <button onClick={onSwitch} className="text-[#056973] font-bold">Sign Up</button></p>
          </div>
        </div>

        {/* Neural Forgot Password Overlay — 3-step OTP flow */}
        <AnimatePresence>
          {showForgot && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 md:p-16 overflow-y-auto"
            >
              <button
                onClick={() => { setShowForgot(false); setForgotStep(1); setForgotData({ email: "", otp: "", newPassword: "" }); }}
                className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-full max-w-md">

                {/* Step Icons */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  {[{ icon: Mail, label: "Email" }, { icon: ShieldCheck, label: "OTP" }, { icon: KeyRound, label: "Reset" }].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        forgotStep === i + 1
                          ? "bg-[#056973] text-white shadow-lg shadow-[#056973]/30 scale-110"
                          : forgotStep > i + 1
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}>
                        <Icon size={18} />
                      </div>
                      {i < 2 && <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${forgotStep > i + 1 ? "bg-emerald-400" : "bg-slate-200"}`} />}
                    </div>
                  ))}
                </div>

                {/* Heading */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={forgotStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center mb-8"
                  >
                    <h2 className="text-3xl font-black text-[#056973] mb-2">
                      {forgotStep === 1 && "Security Recovery"}
                      {forgotStep === 2 && "Enter Your OTP"}
                      {forgotStep === 3 && "Set New Password"}
                    </h2>
                    <p className="text-slate-400 font-medium text-sm">
                      {forgotStep === 1 && "Enter your registered email to receive a one-time code."}
                      {forgotStep === 2 && `A 6-digit OTP was sent to ${forgotData.email}. Enter it below.`}
                      {forgotStep === 3 && "OTP verified! Now define your new security credentials."}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <form onSubmit={handleForgotAction} className="space-y-5">

                  {/* Step 1: Email */}
                  {forgotStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#056973] transition-all" size={20} />
                      <input
                        type="email"
                        required
                        value={forgotData.email}
                        onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                        placeholder="Registered Email Address"
                        className="w-full pl-14 pr-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-bold"
                      />
                    </motion.div>
                  )}

                  {/* Step 2: OTP */}
                  {forgotStep === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="relative group">
                        <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#056973] transition-all" size={20} />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={forgotData.otp}
                          onChange={(e) => setForgotData({ ...forgotData, otp: e.target.value.replace(/\D/g, "") })}
                          placeholder="6-Digit OTP Code"
                          className="w-full pl-14 pr-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-black text-center tracking-[0.5em] text-xl"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const loadId = toast.loading("Resending OTP...");
                          try {
                            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email: forgotData.email }),
                            });
                            const data = await res.json();
                            data.success ? toast.success("New OTP sent!", { id: loadId }) : toast.error(data.message, { id: loadId });
                          } catch { toast.error("Failed to resend.", { id: loadId }); }
                        }}
                        className="text-[#056973] text-xs font-bold w-full text-center hover:underline opacity-70"
                      >
                        Didn't receive it? Resend OTP
                      </button>
                    </motion.div>
                  )}

                  {/* Step 3: New Password */}
                  {forgotStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative group">
                      <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#056973] transition-all" size={20} />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={forgotData.newPassword}
                        onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                        placeholder="New Password (min. 6 chars)"
                        className="w-full pl-14 pr-14 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-bold"
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#056973]">
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full py-4 bg-[#056973] text-white rounded-full font-black uppercase tracking-widest shadow-xl hover:bg-[#04565e] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isForgotLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {forgotStep === 1 && <><Mail size={16} /> Send OTP</>}
                        {forgotStep === 2 && <><ShieldCheck size={16} /> Verify OTP</>}
                        {forgotStep === 3 && <><KeyRound size={16} /> Reset Password</>}
                      </>
                    )}
                  </button>
                </form>

                <button
                  onClick={() => { setShowForgot(false); setForgotStep(1); setForgotData({ email: "", otp: "", newPassword: "" }); }}
                  className="w-full mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ← Return to standard login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginPage;
