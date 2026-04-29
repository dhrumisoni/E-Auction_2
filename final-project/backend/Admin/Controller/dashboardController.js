// backend/Admin/Controller/dashboardController.js
import { Op, fn, col, literal, Sequelize } from "sequelize";
import Bid from "../../Admin/Models/Bid.js";
import BidsLog from "../../Admin/Models/BidsLog.js";
import Winner from "../../Admin/Models/Winner.js";
import User from "../../Admin/Models/User.js";
import Transaction from "../../Admin/Models/Transaction.js";
import Category from "../../Admin/Models/Category.js";
import sequelize from "../../Config/db.js"; // your sequelize instance

// Helper: last N days labels
const lastNDaysLabels = (n) => {
  const labels = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("en-GB")); // dd/mm/yyyy style
  }
  return labels;
};

export const getDashboardStats = async (req, res) => {
  try {
    // STATS
    const liveAuctions = await Bid.count({ where: { status: "Active" } });

    // active bidders = distinct users that placed bids (BidsLog)
    const activeBiddersResult = await BidsLog.findAll({
      attributes: [[fn("COUNT", fn("DISTINCT", col("user_id"))), "countDistinctUsers"]],
      raw: true,
    });
    const activeBidders = activeBiddersResult?.[0]?.countDistinctUsers ?? 0;

    const totalListings = await Bid.count();

    // completed sales = number of winners
    const completedSales = await Winner.count();

    // LIVE AUCTIONS LIST (limited, includes user + category)
    const liveAuctionsList = await Bid.findAll({
      where: { status: "Active" },
      attributes: ["id", "title", "start_date", "end_date", "price", "image1_url", "image2_url"],
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
      order: [["start_date", "DESC"]],
      limit: 10,
    });

    // RECENT WINNERS (join Winner -> User -> Bid -> Transaction if present)
    const recentWinners = await Winner.findAll({
      attributes: ["id", "bid_id", "user_id", "transaction_id"],
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        {
          model: Bid,
          as: "bid",
          attributes: ["id", "title"],
          include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
        },
        { model: Transaction, as: "transaction", attributes: ["id", "amount"] },
      ],
      order: [["id", "DESC"]], // fallback ordering by id desc
      limit: 6,
    });

    // TOP AUCTIONS (by number of bids) — group BidsLog by bid_id
    const topAuctionsRaw = await BidsLog.findAll({
      attributes: [
        "bid_id",
        [fn("COUNT", col("id")), "bidCount"],
        [fn("MAX", col("price")), "highestBid"],
      ],
      group: ["bid_id"],
      order: [[literal("bidCount"), "DESC"]],
      limit: 5,
      raw: true,
    });

    // attach bid title for each top auction
    const topAuctions = await Promise.all(
      topAuctionsRaw.map(async (r) => {
        const bid = await Bid.findByPk(r.bid_id, { attributes: ["id", "title"] });
        return {
          bid_id: r.bid_id,
          title: bid ? bid.title : `#${r.bid_id}`,
          bidCount: parseInt(r.bidCount, 10),
          highestBid: parseFloat(r.highestBid) || 0,
        };
      })
    );

    // BIDS OVER TIME (last 7 days) - attempt to query created date on bids_logs
    const days = 7;
    const labels = lastNDaysLabels(days);
    let countsByDay = new Array(days).fill(0);

    try {
      // Try a raw query grouping by date - works if bids_logs has a date column (createdAt or created_at)
      // This uses a generic COALESCE between common timestamp column names.
      const query = `
        SELECT date(dt) as day, COUNT(*)::int as cnt FROM (
          SELECT
            COALESCE(
              (CASE WHEN to_regclass('public.bids_logs') IS NOT NULL THEN (
                CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='bids_logs' AND column_name='createdAt') THEN createdAt
                     WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='bids_logs' AND column_name='created_at') THEN created_at
                     WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='bids_logs' AND column_name='created_at_time') THEN created_at_time
                     ELSE NULL END)
              ) END,
              NULL
            ) as dt
          FROM bids_logs
        ) t
        WHERE dt IS NOT NULL AND date(dt) >= date(now() - interval '${days - 1} day')
        GROUP BY date(dt)
        ORDER BY date(dt) ASC;
      `;

      // Raw query; may return empty if table doesn't have timestamps
      const [rows] = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT, raw: true });

      if (rows && rows.length) {
        // normalize into countsByDay
        // rows might be an array or single object depending on DB - handle both
        const rowsArr = Array.isArray(rows) ? rows : [rows];
        // convert to mapping day->cnt (day format depends on DB; we convert to Date)
        const map = {};
        rowsArr.forEach((r) => {
          const dayStr = new Date(r.day).toLocaleDateString("en-GB");
          map[dayStr] = parseInt(r.cnt, 10);
        });

        countsByDay = labels.map((l) => map[l] || 0);
      } else {
        // fallback: no timestamp columns — return zeros
        countsByDay = labels.map(() => 0);
      }
    } catch (err) {
      // If raw query fails, fallback to zeros
      countsByDay = labels.map(() => 0);
    }

    // PACK RESPONSE
    res.status(200).json({
      success: true,
      stats: {
        liveAuctions: parseInt(liveAuctions, 10),
        activeBidders: parseInt(activeBidders, 10),
        totalListings: parseInt(totalListings, 10),
        completedSales: parseInt(completedSales, 10),
      },
      liveAuctions: liveAuctionsList,
      recentWinners,
      topAuctions,
      bidsOverTime: { labels, data: countsByDay },
    });
  } catch (error) {
    console.error("Dashboard controller error:", error);
    res.status(500).json({ success: false, message: "Dashboard error", error: error.message });
  }
};
