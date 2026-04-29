import express from "express";
import Bid from "../Models/Bid.js";
import BidLogs from "../Models/BidsLogs.js";
import upload from "../Middleware/bidMulter.js";
import multer, { MulterError } from "multer";
import checkPayment from "../Middleware/checkPayment.js";
import auth from "../Middleware/authMiddleware.js";
import BidsLog from "../Admin/Models/BidsLog.js";
import { processAutoBids } from "../Helper/autoBidProcessor.js";
import AutoBid from "../Models/AutoBids.js";
const router = express.Router();

// ====================
// GET ALL BIDS
// ====================
router.get("/", async (req, res) => {
  try {
    const data = await Bid.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { status: "Active" },
      order: [["id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching bids:", error);
    return res.status(500).json({ message: "Failed to fetch bids" });
  }
});

// ====================
// CREATE NEW BID
// ====================
router.post(
  "/create",
  upload.fields([
    { name: "document_type", maxCount: 10 },
    { name: "imageOne", maxCount: 1 },
    { name: "imageTwo", maxCount: 1 },
    { name: "imageThree", maxCount: 1 },
    { name: "imageFour", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        start_date,
        end_date,
        category_id,
        user_id,
        price,
      } = req.body;
      const files = req.files || {};

      // Collect all filenames
      const documentFiles =
        files["document_type"]?.map((f) => f.filename) || [];
      const imageOne = files["imageOne"]?.[0]?.filename || "";
      const imageTwo = files["imageTwo"]?.[0]?.filename || "";
      const imageThree = files["imageThree"]?.[0]?.filename || "";
      const imageFour = files["imageFour"]?.[0]?.filename || "";

      // Create new bid entry
      await Bid.create({
        title,
        description,
        status: "Requested",
        start_date,
        end_date,
        category_id,
        user_id,
        image1_url: files["imageOne"]?.[0]?.filename || "",
        image2_url: files["imageTwo"]?.[0]?.filename || "",
        image3_url: files["imageThree"]?.[0]?.filename || "",
        image4_url: files["imageFour"]?.[0]?.filename || "",
        price,
        docs: JSON.stringify(documentFiles),
      });

      return res.status(201).json({ message: "Bid created successfully!" });
    } catch (error) {
      console.error("Error creating bid:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
);

// ====================
// MULTER ERROR HANDLER
// ====================
router.use((err, req, res, next) => {
  if (
    err instanceof MulterError ||
    (err.message && err.message.includes("Only"))
  ) {
    console.error("Multer error:", err.message);
    return res.status(400).json({ message: err.message });
  }

  console.error("Unhandled error:", err);
  return res
    .status(500)
    .json({ message: "Unexpected server error", error: err.message });
});

router.post("/placeBid", async (req, res) => {
  try {
    const { bid_id, user_id,price } = req.body;

    // ✅ Server-side guard: reject bids on ended auctions
    const auction = await Bid.findByPk(bid_id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    if (auction.status === "Ended" || new Date(auction.end_date) < new Date()) {
      return res.status(400).json({ message: "This auction has ended. Bids are no longer accepted." });
    }

    await BidLogs.create({
      bid_id,
      user_id,
      price: price,
    });
   await processAutoBids(bid_id);
    return res
      .status(200)
      .json({
        message: "Bid placed successfully!",
        currentPrice: price,
      });
  } catch (error) {
    console.error("Error placing bid:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

router.get("/highestBid/:id", async(req, res)=>{
  const bidId = req.params.id;

  try{
    const data = await BidsLog.max("price",{
      where:{bid_id: bidId}  })
      console.log(data)
    res.json({price: data})
  }catch(error){
    console.log(error)
  }
})

router.get("/fetchAllBidsLogs/:id", async (req, res) => {
  const bidId = req.params.id;

  try {
    const data = await BidLogs.findAll({
      where: { bid_id: bidId },
      order: [["price", "DESC"]], // optional: latest first
    });
    console.log('yes')
    res.json(data);
  } catch (err) {
    console.error("Error fetching bid logs:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Create or update auto-bid (toggle)
router.post("/auto-bids", async (req, res) => {
  // req.user must exist from auth middleware
  try {
    const userId = req.user?.id || req.body.user_id;
    const {bid_id, max_bid, active, min_increment, current_bid } = req.body;
    if (!userId || !bid_id || !max_bid) return res.status(400).json({ message: "Missing fields" });
    console.log(userId, bid_id, max_bid, active, min_increment)
    // upsert
    const data = await AutoBid.findOrCreate({
      where: { user_id: userId, bid_id },
      defaults: { max_bid, active: active ?? true, last_bid_amount: min_increment+current_bid, min_increment: min_increment }
    });

    // if (!created) {
    //   record.max_bid = max_bid;
    //   record.active = typeof active === "boolean" ? active : record.active;
    //   await record.save();
    // }

    return res.json({ success: true, data: data });
  } catch (err) {
    console.error("auto-bid create error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get current user's autobids
router.get("/my-auto-bids/:userid/:bidid", async (req, res) => {
  try {
    const userId = req.params.userid;
    const bidId = req.params.bidid;
    const data = await AutoBid.findAll({ where: { user_id: userId, bid_id:bidId } });
    return res.json(data);
  } catch (err) {
    console.error("my-auto-bids error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// disable/delete
router.delete("/auto-bids/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const rec = await AutoBid.findByPk(id);
    if (!rec) return res.status(404).json({ message: "Not found" });
    await rec.destroy();
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;
