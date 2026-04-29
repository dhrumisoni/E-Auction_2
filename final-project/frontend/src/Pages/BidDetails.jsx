import { useState, useEffect } from "react";
import api from "../api";
import {
  Gavel,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  IndianRupee,
} from "lucide-react";
import Header from "../Components/Header";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.item;

  if (!product) return <p className="text-center mt-10">No product found</p>;

  const [autoBid, setAutoBid] = useState({ maxBudget: "", minIncrement: "" });
  const [manualBid, setManualBid] = useState({ bidAmount: "" });
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBid, setCurrentBid] = useState(product.price);
  const [bidHistory, setBidHistory] = useState([]);
  const [paid, setPaid] = useState(false);
  const [myAutoBid, setMyAutoBid] = useState(null);

  const fetchMyAutoBid = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user.id
      const bid_id = product.id
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bid/my-auto-bids/${user_id}/${bid_id}`, { credentials: "include" });
      if (!res.ok) return;
      const arr = await res.json();
      const rec = arr.find(r => Number(r.bid_id) === Number(product.id));
      setMyAutoBid(rec || null);
      if (rec) setAutoBid(prev => ({ ...prev, maxBudget: rec.max_bid, isActive: rec.active }));
    } catch (err) {
      console.error("fetchMyAutoBid err", err);
    }
  };
  const getTimeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      const diffMs = start - now;
      const d = Math.floor(diffMs / 864e5);
      const h = Math.floor((diffMs % 864e5) / 36e5);
      const m = Math.floor((diffMs % 36e5) / 6e4);
      if (d === 0 && h < 6) return { text: `Starts in ${h}h ${m}m`, isEnded: false, isLive: false };
      return { text: `Starts in ${d}d ${h}h`, isEnded: false, isLive: false };
    }

    if (now >= start && now < end) {
      const diffMs = end - now;
      const d = Math.floor(diffMs / 864e5);
      const h = Math.floor((diffMs % 864e5) / 36e5);
      const m = Math.floor((diffMs % 36e5) / 6e4);
      if (d === 0 && h < 24) return { text: `${h}h ${m}m left`, isEnded: false, isLive: true };
      return { text: `${d}d ${h}h left`, isEnded: false, isLive: true };
    }

    return { text: "Auction Ended", isEnded: true, isLive: false };
  };

  useEffect(() => {
    fetchMyAutoBid();
  }, []);

  const timeStatus = getTimeStatus(product.start_date, product.end_date);

  // put once near top of file
  function loadPayPalSdk(clientId, currency = "USD") {
    return new Promise((resolve, reject) => {
      if (window.paypal) return resolve(window.paypal);
      const existing = document.querySelector('script[data-paypal-sdk="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.paypal));
        existing.addEventListener("error", (e) => reject(e));
        return;
      }
      const s = document.createElement("script");
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
      s.async = true;
      s.setAttribute("data-paypal-sdk", "true");
      s.onload = () => resolve(window.paypal);
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  // replace your existing startPayment with this
  async function startPayment() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login", { state: { message: "Please login to continue" } });
      return;
    }

    // create order on server
    let createRes;
    try {
      createRes = await fetch(`${import.meta.env.VITE_API_URL}/userPaymentsForBid/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ auctionId: product.id, userId: user.id })
      });
    } catch (err) {
      console.error("Network/create-order failed", err);
      return alert("Unable to start payment. Check console.");
    }
    if (!createRes.ok) {
      const text = await createRes.text().catch(() => "<no-body>");
      console.error("create-order failed", createRes.status, text);
      return alert("Unable to create payment order.");
    }
    const createJson = await createRes.json();
    const orderId = createJson.id;
    if (!orderId) { console.error("no order id", createJson); return alert("Payment init failed"); }

    // load SDK (replace client id with your sandbox id if different)
    const PAYPAL_SANDBOX_CLIENT_ID = "AbzoELoGpFSv-D_QKDNY58bYmlcTyE5M3iJAS3Ih1XVcXNiThLypSkchR4Riy5yHstBsMqD70bfIwMSZ";
    try {
      await loadPayPalSdk(PAYPAL_SANDBOX_CLIENT_ID, "USD"); // or "INR"
    } catch (err) {
      console.error("Failed loading PayPal SDK", err);
      return alert("Payment unavailable (SDK load failed).");
    }

    const container = document.getElementById("paypal-buttons");
    if (container) container.innerHTML = "";

    window.paypal.Buttons({
      createOrder: () => orderId,
      onApprove: async (data) => {
        try {
          const capRes = await fetch(`${import.meta.env.VITE_API_URL}/userPaymentsForBid/capture-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ orderID: data.orderID, auctionId: product.id, userId: user.id })
          });
          if (!capRes.ok) {
            const body = await capRes.text().catch(() => "<no-body>");
            console.error("capture-order failed", capRes.status, body);
            return alert("Payment verification failed. Check console.");
          }
          const capJson = await capRes.json();
          if (capJson.status === "COMPLETED" || capJson.success) {
            setPaid(true);
            alert("Payment completed. You can now place bids.");
          } else {
            console.warn("capture result:", capJson);
            alert("Payment not completed.");
          }
        } catch (err) {
          console.error("capture flow error", err);
          alert("Payment failed during capture.");
        }
      },
      onError: (err) => {
        console.error("PayPal Buttons error:", err);
        alert("Payment failed. Try again later.");
      }
    }).render("#paypal-buttons");
  }
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${import.meta.env.VITE_API_URL}/bid/highestBid/${product.id}`)
        .then(r => r.json())
        .then(data => {
          setCurrentBid(data.price);  // updates current price, highest bidder 
        });

    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, [product.id]);

  // Optional: check if user already paid after loading user info
  useEffect(() => {
    async function check() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/userPaymentsForBid/status?userId=${user.id}&auctionId=${product.id}`, {
          method: "GET",
          headers: { "Accept": "application/json" },
          credentials: "include"
        }
        );
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok) {
          const text = await res.text();
          console.error("status check failed", res.status, text);
          return;
        }
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Expected JSON but got:", text);
          return;
        }
        const json = await res.json();
        if (json.paid) setPaid(true);
      } catch (err) {
        console.error("status check failed", err);
      }
    }
    check();
  }, []);

  // === Fetch Bid History ===
  const fetchBidHistory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bid/fetchAllBidsLogs/${product.id}`
      );
      const data = await res.json();
      if (res.ok) setBidHistory(data);
      else console.error("Failed to fetch bid history:", data.message);
    } catch (err) {
      console.error("Error fetching bid history:", err);
    }
  };

  useEffect(() => {
    fetchBidHistory();
  }, [currentBid]);

  // === Auto-bid functions ===
  const handleAutoBidChange = (e) => {
    setAutoBid((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAutoBidSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please login to set auto-bid");

    const maxBudget = autoBid.maxBudget;
    if (!maxBudget || maxBudget <= 0) return alert("Enter valid max budget");
    const minIncrement = autoBid.minIncrement;
    if (!maxBudget || maxBudget <= 0) return alert("Enter valid max budget");

    try {
      console.log(user.id, maxBudget, minIncrement, currentBid)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bid/auto-bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_id: user.id, bid_id: product.id, max_bid: maxBudget, active: true, min_increment: minIncrement, current_bid: currentBid })
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("auto-bid error", json);
        return alert(json.message || "Failed to set auto-bid");
      }
      alert(`Auto-bid set up to ₹${maxBudget}`);
      // show active state locally
      setAutoBid(prev => ({ ...prev, isActive: true }));
      fetchMyAutoBid(); // refresh server-side record
    } catch (err) {
      console.error(err);
      alert("Network error setting auto-bid");
    }
  };


  // === Image Handling ===
  const images = [
    product.image1_url,
    product.image2_url,
    product.image3_url,
    product.image4_url,
  ].filter(Boolean);

  const displayImage = images.length ? images[currentImage] : "fallback.jpg";

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  // === Place a Bid ===
  const handlePlaceBid = async (e) => {
    e.preventDefault();

    const bidAmount = parseFloat(manualBid.bidAmount);
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;

    if (!user_id) {
      navigate("/login", { state: { message: "Please login to continue" } });
      return;
    }

    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    if (bidAmount <= currentBid) {
      alert(`Your bid must be higher than the current bid ₹${currentBid}`);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bid/placeBid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bid_id: product.id,
          user_id,
          price: bidAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          `✅ Bid placed successfully for ₹${bidAmount.toLocaleString("en-IN")}`
        );
        const newHighest = Number(data.highestBid || data.current_price || bidAmount);
        setCurrentBid(newHighest);
        setManualBid({ bidAmount: "" });
        fetchBidHistory(); // refresh bid history
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error placing bid:", err);
      alert("Something went wrong while placing your bid.");
    }
  };

  return (
    <>
      <Header />
      <div className="p-3 olive-dark">
        <a href="/auctions">Back</a>
      </div>
      <div className="min-h-screen px-4 py-10 space-y-10">
        {/* === Product / Bid Details Card === */}
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden mx-auto">
          <div className="grid md:grid-cols-2">
            {/* Carousel */}
            <div className="relative bg-gray-100 flex items-center justify-center p-6">
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              <img
                src={displayImage && displayImage !== "fallback.jpg" ? `${import.meta.env.VITE_API_URL}/photos/bidsphotos/${displayImage}` : "https://placehold.co/800x600?text=No+Image+Available"}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600?text=No+Image+Available"; }}
                alt={product.title}
                onClick={() => images.length && setIsModalOpen(true)}
                className="rounded-xl w-full h-[400px] object-cover object-top shadow-md cursor-pointer"
              />
            </div>

            {/* Info Section */}
            <div className="p-8 flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800">
                {product.title}
              </h1>
              <p className="mt-2 text-gray-500 text-sm">
                This is a premium collectible item available for auction. Place
                your bid before time runs out!
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <div className={`flex items-center gap-2 text-sm font-medium ${timeStatus.isEnded ? 'text-red-500' : 'text-gray-600'}`}>
                  <Clock size={18} className={timeStatus.isEnded ? 'text-red-500' : 'olive-dark'} />
                  <span>{timeStatus.text}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Users size={18} className="olive-dark" />
                  <span>{product.status} Bidders</span>
                </div>
                <div className="flex items-center justify-between w-full h-10">
                  <div className="text-lg font-semibold olive-dark">
                    Actual Price: ₹{product.price.toLocaleString("en-IN")}/-
                  </div>
                  <div className="text-lg font-semibold olive-dark">
                    {currentBid == null
                      ? `₹${product.price.toLocaleString("en-IN")}/-`
                      : `₹${currentBid.toLocaleString("en-IN")}/-`
                    }
                  </div>
                </div>
              </div>

              {/* Payment for bid */}
              {!timeStatus.isEnded && !paid ? (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-700">Participation Fee</h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Pay ₹500 to unlock bidding for this auction.
                  </p>

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={startPayment}
                      className="bid-btn px-4 py-2"
                    >
                      Pay ₹500 To Bid
                    </button>
                  </div>

                  {/* PayPal renders buttons here after startPayment() */}
                  <div id="paypal-buttons" style={{ marginTop: 12 }}></div>
                </div>
              ) : null}

              {/* === Place Your Bid Form === */}
              {timeStatus.isLive && paid ? (
                <form
                  onSubmit={handlePlaceBid}
                  className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-4"
                >
                  <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Gavel size={18} className="olive-dark" />
                    Place Your Bid
                  </h2>

                  <div className="flex flex-col gap-3">
                    <input
                      type="number"
                      name="bidAmount"
                      value={manualBid.bidAmount}
                      onChange={(e) =>
                        setManualBid({ ...manualBid, bidAmount: e.target.value })
                      }
                      placeholder="Enter your bid (₹)"
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bid-btn w-full flex items-center justify-center gap-2"
                  >
                    Place Bid
                  </button>
                </form>
              ) : null}

              {/* Auto-Bid Section */}
              {timeStatus.isLive && paid ? (
                <form
                  onSubmit={handleAutoBidSubmit}
                  className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-4"
                >
                  <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <IndianRupee size={18} className="olive-dark" />
                    Auto-Bid Settings
                  </h2>

                  <div className="flex flex-col gap-3">
                    <input
                      type="number"
                      name="maxBudget"
                      value={autoBid.maxBudget}
                      onChange={handleAutoBidChange}
                      placeholder="Enter max budget (₹)"
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="number"
                      name="minIncrement"
                      value={autoBid.minIncrement}
                      onChange={handleAutoBidChange}
                      placeholder="Enter min increment (₹)"
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bid-btn w-full flex items-center justify-center gap-2"
                  >
                    Enable Auto-Bid
                  </button>
                </form>
              ) : null}

              {/* Upcoming Auction Message */}
              {!timeStatus.isLive && !timeStatus.isEnded && (
                <div className="mt-6 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 text-blue-700">
                  <Clock size={24} className="animate-pulse" />
                  <div>
                    <p className="font-bold">Auction Upcoming</p>
                    <p className="text-sm opacity-80">Bidding will open automatically when the auction goes live.</p>
                  </div>
                </div>
              )}

              {myAutoBid && paid ? (
                <div className="mb-2 text-sm">
                  Auto-bid active — Max: ₹{Number(myAutoBid.max_bid).toLocaleString("en-IN")}
                </div>
              ) : null}

            </div>
          </div>
        </div>

        {/* === Bid History Card === */}
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden mx-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Bid History
          </h2>

          {bidHistory.length === 0 ? (
            <p className="text-gray-500">No bids placed yet.</p>
          ) : (
            <div className="space-y-3">
              {bidHistory.map((bid) => (
                <div
                  key={bid.id}
                  className="flex justify-between border-b border-gray-200 py-2"
                >
                  <div>
                    <span className="font-semibold">{bid.user_id}</span> bid
                  </div>
                  <div className="font-medium">
                    ₹{bid.price.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* === Modal === */}
        {isModalOpen && images.length > 0 && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-white"
            >
              <X size={28} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-10 text-white bg-black/40 p-3 rounded-full"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-10 text-white bg-black/40 p-3 rounded-full"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
            <img
              src={displayImage && displayImage !== "fallback.jpg" ? `${import.meta.env.VITE_API_URL}/photos/bidsphotos/${displayImage}` : "https://placehold.co/800x600?text=No+Image+Available"}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600?text=No+Image+Available"; }}
              alt="enlarged"
              className="max-h-[80vh] rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </>
  );
}
