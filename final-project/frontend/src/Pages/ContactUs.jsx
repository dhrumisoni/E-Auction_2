import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { 
  Mail, Phone, MapPin, Send, ArrowLeft, User, MessageSquare, Globe, Clock 
} from "lucide-react";

export default function ContactUs() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    if (!name || !email || !message) {
      setStatus("Please fill in all fields before sending your message.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Your message has been sent successfully! We'll get back to you soon.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Unable to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] pb-12 font-sans">
      {/* Header Section */}
      <div className="bg-[#056973] text-white pt-12 pb-32 px-6 md:px-12 shadow-lg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/10 blur-3xl"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-all mb-8 group bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 w-fit"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Back
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">Get in Touch</h1>
          <p className="text-teal-100 mt-4 text-lg font-medium max-w-2xl">
            Have questions about eAuction or need assistance with your account? 
            Our dedicated team is here to help you every step of the way.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 bg-[#056973] p-8 md:p-12 text-white">
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              <p className="text-teal-100 mb-10">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <Phone size={24} className="text-teal-200" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-200 font-bold uppercase tracking-wider">Call Us</p>
                    <a href="tel:+1234567890" className="text-lg font-medium hover:text-teal-200 transition-colors tracking-wide">+1 234 567 890</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <Mail size={24} className="text-teal-200" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-200 font-bold uppercase tracking-wider">Email Us</p>
                    <a href="mailto:support@eauction.com" className="text-lg font-medium hover:text-teal-200 transition-colors tracking-wide">support@eauction.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <MapPin size={24} className="text-teal-200" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-200 font-bold uppercase tracking-wider">Visit Us</p>
                    <p className="text-lg font-medium tracking-wide">Ahmedabad, Gujarat, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <Clock size={24} className="text-teal-200" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-200 font-bold uppercase tracking-wider">Working Hours</p>
                    <div className="text-lg font-medium space-y-1">
                      <p>Mon - Sat: 09:00 AM - 06:00 PM</p>
                      <p className="text-sm text-teal-300/80 italic">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social or additional info */}
              <div className="mt-16 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 text-teal-200 italic">
                  <Globe size={18} />
                  <span>Always online for you.</span>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="lg:col-span-3 p-8 md:p-12">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 group-focus-within:text-[#056973] transition-colors">
                      <User size={18} className="text-[#056973] opacity-80" /> Full Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white transition-all duration-300 outline-none text-gray-800 font-medium focus:border-[#056973] focus:shadow-[0_0_0_4px_rgba(5,105,115,0.1)]"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 group-focus-within:text-[#056973] transition-colors">
                      <Mail size={18} className="text-[#056973] opacity-80" /> Email Address
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white transition-all duration-300 outline-none text-gray-800 font-medium focus:border-[#056973] focus:shadow-[0_0_0_4px_rgba(5,105,115,0.1)]"
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 group-focus-within:text-[#056973] transition-colors">
                    <MessageSquare size={18} className="text-[#056973] opacity-80" /> Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="5"
                    placeholder="Tell us how we can help..."
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white transition-all duration-300 outline-none text-gray-800 font-medium focus:border-[#056973] focus:shadow-[0_0_0_4px_rgba(5,105,115,0.1)] resize-none"
                    required
                  ></textarea>
                </div>

                {status && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${status.includes("successfully") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                    {status}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#056973] to-[#088b99] hover:from-[#04555d] hover:to-[#056973] text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

