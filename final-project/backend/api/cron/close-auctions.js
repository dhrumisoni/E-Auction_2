// backend/api/cron/close-auctions.js
// Vercel calls this endpoint on a schedule defined in vercel.json
// Replaces the setInterval-based startAuctionScheduler()

import { closeExpiredAuctions } from "../../Helper/auctionCloser.js";

export default async function handler(req, res) {
  // Protect the endpoint — only Vercel's cron runner (or you) can call it
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await closeExpiredAuctions();
    return res.status(200).json({ ok: true, ran: new Date().toISOString() });
  } catch (err) {
    console.error("Cron: closeExpiredAuctions failed:", err);
    return res.status(500).json({ error: err.message });
  }
}
