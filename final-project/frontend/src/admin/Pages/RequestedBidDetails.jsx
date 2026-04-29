import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RequestedBidDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bid, setBid] = useState(null);

  useEffect(() => {
    // Dummy data (later replace with API)
    const dummyBids = {
      1: {
        id: 1,
        item: "iPhone 15 Pro Max",
        seller: "Amit Sharma",
        email: "amit@example.com",
        proof: "ownership_doc.pdf",
        status: "Pending",
        image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone15promax",
        description: "Brand new iPhone 15 Pro Max, 256GB, space black.",
      },
      2: {
        id: 2,
        item: "Royal Enfield Classic 350",
        seller: "Rahul Mehta",
        email: "rahul@example.com",
        proof: "rc_book.jpg",
        status: "Pending",
        image: "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/classic-350/colors/classic350-color11.png",
        description: "Royal Enfield Classic 350, 2019 model, single owner.",
      },
    };

    setBid(dummyBids[id]);
  }, [id]);

  if (!bid)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  const handleApprove = () => {
    alert("✅ Bid approved! Please set auction dates next.");
  };

  const handleReject = () => {
    alert("❌ Bid rejected!");
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        ⬅️ Back to Requested Bids
      </button>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <img
          src={bid.image}
          alt={bid.item}
          className="h-64 w-full object-cover rounded-lg mb-4"
        />

        <h1 className="text-2xl font-bold mb-2">{bid.item}</h1>
        <p className="text-gray-700 mb-2">{bid.description}</p>
        <p>
          <b>Seller:</b> {bid.seller} ({bid.email})
        </p>
        <p>
          <b>Proof Document:</b> {bid.proof}
        </p>
        <p>
          <b>Status:</b>{" "}
          <span className="text-yellow-600 font-semibold">{bid.status}</span>
        </p>

        {/* Approve/Reject */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleApprove}
            className="flex-1 bg-green-600 text-white py-2 rounded-xl"
          >
            ✅ Approve
          </button>
          <button
            onClick={handleReject}
            className="flex-1 bg-red-600 text-white py-2 rounded-xl"
          >
            ❌ Reject`  `
          </button>
        </div>
      </div>
    </motion.div>
  );
}
