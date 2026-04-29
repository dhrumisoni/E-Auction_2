import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Search, User, Mail, Phone, Lock, Eye, EyeOff, MapPin, Camera, X, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SignUpPage = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    number: "",
    email: "",
    password: "",
    confirmPassword: "",
    city_id: "",
    document_type: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await fetch(`${import.meta.env.VITE_API_URL}/auth/cities`);
        const jsonData = await data.json();
        setCities(jsonData);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    fetchCities();
  }, []);

  const getCityDisplayById = (id) => {
    const c = cities.find((city) => city.city_id === parseInt(id));
    if (!c) return "Select City";
    return `${c.city_name}, ${c.state_name}`;
  };

  const filteredCities = cities.filter((city) =>
    `${city.city_name} ${city.state_name}`
      .toLowerCase()
      .includes(citySearch.toLowerCase())
  );

  const groupedFilteredCities = filteredCities.reduce((acc, city) => {
    if (!acc[city.country_name]) acc[city.country_name] = [];
    acc[city.country_name].push(city);
    return acc;
  }, {});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "document_type") {
      setFormData((prev) => ({ ...prev, document_type: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhoneBlur = () => {
    if (formData.number && !/^\d{10}$/.test(formData.number)) {
      setErrors(prev => ({ ...prev, number: "Please enter a valid 10-digit number" }));
    } else {
      setErrors(prev => ({ ...prev, number: null }));
    }
  };

  const clearDoc = () => setFormData((prev) => ({ ...prev, document_type: null }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "First name is required";
    if (!formData.number || !/^\d{10}$/.test(formData.number)) newErrors.number = "10-digit phone number is required";
    if (!formData.city_id) newErrors.city_id = "Please select your city";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) if (formData[key] !== null) data.append(key, formData[key]);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, { method: "POST", body: data });
      const result = await res.json();
      alert(result.message);
      if (result.message !== "User already exist") navigate("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f5] p-6 neural-grid custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Form */}
        <div className="flex-[1.5] p-8 md:p-12 glass-premium relative overflow-hidden">
          <div className="neural-corner corner-tl opacity-20"></div>
          <div className="neural-corner corner-br opacity-20"></div>
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#056973] mb-2 text-center tracking-tighter">Create a New Account</h1>
            <p className="text-slate-400 text-center text-sm">Join our community and start bidding today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`w-full px-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-medium ${errors.name ? 'border-rose-200' : ''}`}
                  required
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Surname"
                  className="w-full px-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  onBlur={handlePhoneBlur}
                  placeholder="Phone Number"
                  className={`w-full px-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-medium ${errors.number ? 'border-rose-200' : ''}`}
                  required
                />
                {errors.number && <p className="text-[10px] text-rose-500 font-bold ml-4 mt-1">{errors.number}</p>}
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                required
              />
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#056973]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`w-full px-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-[#056973]/20 outline-none transition-all placeholder:text-slate-400 font-medium ${errors.confirmPassword ? 'border-rose-200' : ''}`}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#056973]">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold ml-4 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* City and Image Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City Dropdown */}
              <div className="relative">
                <div 
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  className={`w-full px-6 py-4 rounded-full bg-slate-100/80 focus:bg-white border-2 border-transparent outline-none cursor-pointer flex justify-between items-center text-slate-500 font-medium transition-all ${cityDropdownOpen ? "border-[#056973]/20 bg-white" : ""} ${errors.city_id ? 'border-rose-200' : ''}`}
                >
                  <span className={formData.city_id ? "text-slate-800" : "text-slate-400"}>
                    {formData.city_id ? getCityDisplayById(formData.city_id) : "Select City"}
                  </span>
                  <ArrowRight size={16} className={`transition-transform duration-300 ${cityDropdownOpen ? "rotate-90 text-[#056973]" : "rotate-90"}`} />
                </div>

                <AnimatePresence>
                  {cityDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 mt-2 w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                      <div className="p-3 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                        <Search size={14} className="text-slate-400" />
                        <input autoFocus type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Search city..." className="w-full bg-transparent outline-none text-xs font-medium text-slate-700" />
                      </div>
                      <div className="max-h-48 overflow-y-auto p-2 custom-scrollbar">
                        {Object.keys(groupedFilteredCities).length === 0 ? (
                          <div className="p-4 text-center text-slate-300 text-xs font-medium">No results</div>
                        ) : (
                          Object.keys(groupedFilteredCities).sort().map((country) => (
                            <div key={country} className="mb-2 last:mb-0">
                              <div className="px-3 py-1 text-[8px] font-bold text-[#056973] uppercase tracking-wider bg-[#056973]/5 rounded-lg mb-1">{country}</div>
                              {groupedFilteredCities[country].sort((a, b) => a.city_name.localeCompare(b.city_name)).map((city) => (
                                <div key={city.city_id} onClick={() => { setFormData(p => ({ ...p, city_id: city.city_id })); setCityDropdownOpen(false); setCitySearch(""); }} className={`px-4 py-2 text-xs font-medium rounded-xl cursor-pointer transition-colors ${parseInt(formData.city_id) === city.city_id ? "bg-[#056973] text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                                  {city.city_name}
                                </div>
                              ))}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.city_id && <p className="text-[10px] text-rose-500 font-bold ml-4 mt-1">{errors.city_id}</p>}
              </div>

              {/* Profile Image Upload */}
              <div className="relative group">
                <label className={`w-full px-6 py-4 rounded-full bg-slate-100/80 hover:bg-slate-200/60 cursor-pointer flex items-center justify-between transition-all border-2 border-transparent ${formData.document_type ? 'border-[#056973]/20 bg-white' : ''}`}>
                  <div className="flex items-center gap-3 truncate">
                    <Camera size={18} className={formData.document_type ? "text-[#056973]" : "text-slate-400"} />
                    <span className={`text-sm truncate font-medium ${formData.document_type ? "text-slate-800" : "text-slate-400"}`}>
                      {formData.document_type ? formData.document_type.name : "Profile Image"}
                    </span>
                  </div>
                  <input type="file" name="document_type" onChange={handleChange} className="hidden" accept="image/*" />
                  {formData.document_type && (
                    <button type="button" onClick={(e) => { e.preventDefault(); clearDoc(); }} className="p-1 hover:bg-rose-50 text-rose-500 rounded-full">
                      <X size={14} />
                    </button>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#056973] text-white rounded-full font-bold text-lg shadow-lg shadow-[#056973]/20 hover:bg-[#04565e] hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Sign Up
            </button>
          </form>

          {/* Mobile Footer */}
          <div className="mt-8 text-center md:hidden">
            <p className="text-slate-400 text-sm">Already have an account? <button onClick={onSwitch} className="text-[#056973] font-bold">Log In</button></p>
          </div>
        </div>

        {/* Right Side: Welcome Section */}
        <div className="flex-1 bg-gradient-to-br from-[#056973] to-[#0fc9db] p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="scan-line opacity-20"></div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 shadow-2xl border border-white/30 neon-glow-pulse"
          >
            <User size={48} />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-glow">Welcome Back!</h2>
          <p className="text-white/80 mb-10 leading-relaxed font-medium">
            To keep connected with us please login with your personal info
          </p>
          <button
            onClick={onSwitch}
            className="px-10 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-[#056973] transition-all"
          >
            Sign In
          </button>
          <div className="mt-12">
            <a href="/" className="text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <ArrowLeft size={14} /> Back To Home
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
