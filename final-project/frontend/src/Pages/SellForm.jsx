import { useState, useEffect, useContext } from "react";
import api from "../../api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  ArrowLeft, 
  Tag, 
  FileText, 
  Calendar, 
  DollarSign, 
  Image as ImageIcon, 
  FileUp,
  Package
} from "lucide-react";

const BidForm = () => {

  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/login", { replace: true, state: { message: "Please login to continue" } });
    }
  }, [isLoggedIn, isLoading, navigate]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    category_id: "",
    price: "",
    images: [],
  });

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  }

  // Minimum start date
  const getMinStartDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return formatDate(today)
  }

  // Maximum end date
  const getMaxEndDate = (startDate) => {
    if (!startDate) return "";
    const date = new Date(startDate)
    date.setDate(date.getDate() + 7)
    return formatDate(date)
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files).slice(0, 4), // limit to 4
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      const user = localStorage.getItem("user")
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("start_date", formData.start_date)
      data.append("end_date", formData.end_date)
      data.append("category_id", formData.category_id)
      data.append("price", formData.price)
      data.append("user_id", JSON.parse(user).id)

      const imageInputs = ["imageOne", "imageTwo", "imageThree", "imageFour"]
      imageInputs.forEach((field) => {
        const fileInput = document.querySelector(`input[name="${field}"]`)

        if (fileInput && fileInput.files[0]) {
          data.append(field, fileInput.files[0])
        }
      })

      // Append multiple documents (correct field name!)
      const docInput = document.querySelector(`input[name="docs"]`);
      if (docInput && docInput.files.length > 0) {
        Array.from(docInput.files).forEach((file) => {
          data.append("document_type", file);
        });
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bid/create`, {
        method: 'post',
        credentials: 'include',
        body: data
      })

      if (res.ok) {
        alert('Your bid has been sent successfully!')
        navigate('/auctions')
      }
      else {
        const err = await res.json();
        console.error("Server error:", err.message)
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf8] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#056973]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 text-[#056973] hover:text-[#04525a] font-medium transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900">List Your Item</h1>
            <p className="text-gray-500 mt-1">Fill in the details to start your auction</p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-10 border border-white/20 space-y-8"
        >
          {/* Basic Information Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Package size={20} className="text-[#056973]" />
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Tag size={16} className="text-gray-400" />
                  Item Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Vintage 1960s Rolex Submariner"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#056973]/20 focus:border-[#056973] transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FileText size={16} className="text-gray-400" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your item in detail. Include condition, history, and any unique features..."
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#056973]/20 focus:border-[#056973] transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Auction Details Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Calendar size={20} className="text-[#056973]" />
              <h2 className="text-xl font-semibold text-gray-800">Auction Details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Starting Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#056973]/20 focus:border-[#056973] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#056973]/20 focus:border-[#056973] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="1">Car</option>
                  <option value="2">Bike</option>
                  <option value="3">Art</option>
                  <option value="4">Jewellery</option>
                  <option value="5">Electronics</option>
                  <option value="6">Furniture</option>
                  <option value="7">Collectibles</option>
                  <option value="8">Real Estate</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  min={getMinStartDate()}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#056973]/20 focus:border-[#056973] transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  min={formData.start_date}
                  max={getMaxEndDate(formData.start_date)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#056973]/20 focus:border-[#056973] transition-all"
                />
              </div>
            </div>
          </section>

          {/* Media Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <ImageIcon size={20} className="text-[#056973]" />
              <h2 className="text-xl font-semibold text-gray-800">Media & Documents</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">Upload up to 4 high-quality images of your item</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((num) => {
                  const fieldName = `image${num === 1 ? 'One' : num === 2 ? 'Two' : num === 3 ? 'Three' : 'Four'}`;
                  return (
                    <div key={num} className="relative group">
                      <input
                        type="file"
                        name={fieldName}
                        className="hidden"
                        id={`file-${num}`}
                        accept="image/*"
                      />
                      <label
                        htmlFor={`file-${num}`}
                        className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#056973] hover:bg-[#056973]/5 transition-all group-hover:scale-95 active:scale-90"
                      >
                        <PlusCircle size={24} className="text-gray-400 group-hover:text-[#056973]" />
                        <span className="text-xs text-gray-500 mt-2">Image {num}</span>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <FileUp size={16} className="text-gray-400" />
                  Supporting Documents
                </label>
                <div className="w-full">
                  <input
                    type="file"
                    name="docs"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#056973] file:text-white hover:file:bg-[#04525a] transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-[#056973] text-white font-bold text-lg rounded-2xl shadow-xl shadow-[#056973]/20 hover:bg-[#04525a] transition-all flex items-center justify-center gap-2 group"
          >
            <PlusCircle size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            Launch Auction
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default BidForm;