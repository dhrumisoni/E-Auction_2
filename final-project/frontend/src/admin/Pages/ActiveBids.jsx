// src/admin/Pages/ActiveBids.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../../../api";

export default function ActiveBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const BASE_URL = `${import.meta.env.VITE_API_URL}/admin/active-bids`;

  // 🔹 Fetch active bids
  useEffect(() => {
    const fetchActiveBids = async () => {
      try {
        const res = await axios.get(BASE_URL, { withCredentials: true });
        if (res.data.success) setBids(res.data.data);
      } catch (error) {
        console.error("❌ Error fetching active bids:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveBids();
  }, []);

  // 🔹 Auto-scroll images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const updated = { ...prev };
        bids.forEach((bid) => {
          const images = [
            bid.image1_url,
            bid.image2_url,
            bid.image3_url,
            bid.image4_url,
          ].filter(Boolean);
          if (images.length > 0) {
            updated[bid.id] = ((prev[bid.id] || 0) + 1) % images.length;
          }
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [bids]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Active Bids</h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {bids.map((bid) => {
          const images = [
            bid.image1_url,
            bid.image2_url,
            bid.image3_url,
            bid.image4_url,
          ].filter(Boolean);
          const current = currentImageIndex[bid.id] || 0;
          const currentImage = images[current];

          return (
            <div
              key={bid.id}
              className="bg-white rounded-xl shadow-md p-4 border hover:shadow-xl transition"
            >
              {/* 🔹 Image Auto-Scroll Section */}
              <div className="relative w-full h-52 overflow-hidden rounded-lg mb-3 bg-gray-100 flex items-center justify-center">
                {currentImage ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/photos/bidsphotos/${currentImage}`}
                    alt={`${bid.title} - ${current + 1}`}
                    className="w-full h-full object-contain transition-all duration-700 ease-in-out"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>
                )}

                {/* 🔹 Image Dots Indicator */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${
                          i === current ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      ></div>
                    ))}
                  </div>
                )}
              </div>

              {/* 🔹 Bid Info */}
              <h2 className="text-lg font-semibold">{bid.title}</h2>
              <p className="text-gray-600 text-sm mb-1">
                Category: {bid.category?.name || "N/A"}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                Seller: {bid.user?.name || "Unknown"}
              </p>
              <p className="text-green-700 font-semibold mb-2">
                ₹{bid.price?.toLocaleString() || 0}
              </p>

              <Link
                to={`/admin/active-bids/${bid.id}`}
                className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
