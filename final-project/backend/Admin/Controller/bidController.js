import Bid from "../Models/Bid.js";
import User from "../Models/User.js";
import Category from "../Models/Category.js";

import BidsLog from "../Models/BidsLog.js";
import { sendEmail } from "../../Config/sendEmail.js";

// Get all requested bids
export const getRequestedBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { status: "Requested" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "number"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"], // ✅ fetch category name
        },
      ],
    });

    res.status(200).json({ success: true, data: bids });
  } catch (error) {
    console.error("Error fetching requested bids:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Approve Bid
export const approveBid = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Fetch bid with user + category
    const bid = await Bid.findOne({
      where: { id },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Category, as: "category", attributes: ["id", "name"] }
      ]
    });

    if (!bid)
      return res.status(404).json({ success: false, message: "Bid not found" });

    // 2️⃣ Update status
    bid.status = "Active";
    await bid.save();

    // 3️⃣ Send APPROVAL EMAIL to user who posted the bid
    const subject = `🎉 Your Bid Request for ${bid.category.name} is Approved!`;

    const html = `
      <h2>Hello ${bid.user.name},</h2>

      <p>Your request to list the item <b>${bid.category.name}</b> on E-Auction has been 
      <span style="color:green"><b>Approved</b></span>.</p>

      <h3>📌 Bid Details</h3>
      <p><b>Product:</b> ${bid.category.name}</p>
      <p><b>Start Date:</b> ${bid.start_date}</p>
      <p><b>End Date:</b> ${bid.end_date}</p>
      <p><b>Status:</b> Active</p>

      <br>
      <p>You can now view your live auction in your seller dashboard.</p>
      <p>We wish you all the best for your sale! 🚀</p>

      <br>
      <p>Regards,<br><b>E-Auction Team</b></p>
    `;

    await sendEmail(bid.user.email, subject, html);

    res.json({ success: true, message: "Bid approved successfully & email sent", bid });

  } catch (error) {
    console.error("❌ Error approving bid:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ❌ Reject Bid
export const rejectBid = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Bid.findByPk(id);
    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    bid.status = "Rejected";
    await bid.save();

    res.json({ success: true, message: "Bid rejected successfully", bid });
  } catch (error) {
    console.error("Error rejecting bid:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ✅ Get all users who placed bids on a particular product (bid)
export const getBidDetailsWithBidders = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find the Bid
    const bid = await Bid.findOne({
      where: { id },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email", "number"] },
        { model: Category, as: "category", attributes: ["id", "name"] }
      ]
    });

    if (!bid)
      return res.status(404).json({ success: false, message: "Bid not found" });

    // 2️⃣ Find all Bidders from bids_logs table
    const bidders = await BidsLog.findAll({
      where: { bid_id: id },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email", "number"] }
      ],
      order: [["price", "DESC"]] // sort by highest bid first
    });

    // 3️⃣ Send Response
    res.status(200).json({
      success: true,
      bid,
      bidders
    });
  } catch (error) {
    console.error("Error fetching bid details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};