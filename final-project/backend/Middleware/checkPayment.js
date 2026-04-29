// backend/middleware/checkPayment.js
import db from "../Config/db.js"

const checkPayment = () => async function (req, res, next) {
  try {
    const userId = req.user && req.user.id;
    const auctionId = req.params.bid_id || req.body.auctionId || req.params.auctionId || req.query.auctionId;

    if (!userId || !auctionId) return res.status(400).json({ error: "Missing user or auction id" });

    const [rows] = await db.query(
      "SELECT * FROM user_payments_for_bid WHERE user_id=? AND bid_id=? LIMIT 1",
      [userId, auctionId]
    );

    if (!rows || rows.length === 0) {
      return res.status(403).json({ error: "Please pay ₹500 to participate in bidding" });
    }

    next();
  } catch (err) {
    console.error("checkPayment middleware error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
export default checkPayment