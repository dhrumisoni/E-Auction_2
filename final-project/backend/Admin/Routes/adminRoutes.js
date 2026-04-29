import express from "express";
import db from "../../Config/db.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ----------------------------- ADMIN CONTROLLERS ----------------------------- */
import {
  addAdmin,
  getAllAdmins,
  updateAdminProfile,
  getAdminProfile,
  updateAdmin,
  getAdminById,
  deleteAdmin
} from "../Controller/adminController.js";

import { loginAdmin } from "../Controller/authController.js";

/* ----------------------------- USER CONTROLLERS ------------------------------ */
import {
  getAllUsers,
  getUserById,
  getRequestedUsers,
  updateUserStatus,
  getApprovedUsers,
  blockUser
} from "../Controller/userController.js";

/* ----------------------------- BID CONTROLLERS ------------------------------- */
import {
  getRequestedBids,
  approveBid,
  rejectBid,
  getBidDetailsWithBidders,
} from "../Controller/bidController.js";

import {
  getActiveBids,
  getActiveBidById,
} from "../Controller/activeBidController.js";

/* --------------------------- WINNER CONTROLLERS ------------------------------ */
import {
  getAllWinners,
  getWinnerById,
  markWinnerPaid,
} from "../Controller/winnerController.js";

/* ------------------------- BID HISTORY CONTROLLERS --------------------------- */
import {
  getCompletedBids,
  getBidLogsByBidId,
  getBidLogsWithUsers
} from "../Controller/bidHistoryController.js";

/* --------------------------- PAYMENT CONTROLLERS ----------------------------- */
import { getAllPaymentsByBid } from "../Controller/paymentController.js";

/* -------------------------- DASHBOARD CONTROLLERS ---------------------------- */
import { getDashboardStats } from "../Controller/dashboardController.js";

/* ----------------------- BROKER PAYMENT (FETCH ONLY) ------------------------- */
import {
  getAllBrokerPayments,
  getBrokerPaymentById,
  approveBrokerPayment
} from "../Controller/brokerPaymentController.js";


/* --------------------------------------------------------------------------- */

const router = express.Router();

/* -------------------------------- ADMIN -------------------------------- */
router.post("/add-admin", addAdmin);
router.post("/login", loginAdmin);
router.get("/get-all-admins", getAllAdmins);
router.get("/profile/:id", getAdminProfile);
router.put("/update-admin/:id", updateAdminProfile);
router.get("/admin/:id", getAdminById);
router.put("/admin/update/:id", updateAdmin);
router.delete("/delete-admin/:id", deleteAdmin);
router.put("/user/block/:id", blockUser);

/* -------------------------------- USERS -------------------------------- */
router.get("/requested-users", getRequestedUsers);
router.put("/user/status/:id", updateUserStatus);
router.get("/user/all", getAllUsers);
router.get("/user/:id", getUserById);
router.get("/approved-users", getApprovedUsers);

/* -------------------------------- BIDS -------------------------------- */
router.get("/requested-bids", getRequestedBids);
router.put("/approve-bid/:id", approveBid);
router.put("/reject-bid/:id", rejectBid);

/* ------------------------------ ACTIVE BIDS ---------------------------- */
router.get("/active-bids", getActiveBids);
router.get("/active-bids/:id", getActiveBidById);

/* ------------------------------- DETAILS -------------------------------- */
router.get("/bids/:id", getBidDetailsWithBidders);

/* ------------------------------- WINNERS -------------------------------- */
router.get("/winner-bids", getAllWinners);
router.get("/winner-bids/:id", getWinnerById);
router.post("/winner-bids/:id/mark-paid", markWinnerPaid);

/* --------------------------- BID HISTORY -------------------------------- */
router.get("/bid-history", getCompletedBids);
router.get("/bid-history/:bidId", getBidLogsByBidId);
router.get("/bid-history/:bidId/logs", getBidLogsWithUsers);

/* ---------------------- DELETE COMPLETED BID ----------------------------- */
router.delete("/delete-bid/:id", async (req, res) => {
  const { id } = req.params;
  const t = await db.transaction();
  try {
    // Delete related records first (foreign key order)
    await db.query("DELETE FROM winners WHERE bid_id = ?", { replacements: [id], transaction: t });
    await db.query("DELETE FROM bids_logs WHERE bid_id = ?", { replacements: [id], transaction: t });
    await db.query("DELETE FROM auto_bids WHERE bid_id = ?", { replacements: [id], transaction: t });
    await db.query("DELETE FROM bids WHERE id = ?", { replacements: [id], transaction: t });

    await t.commit();
    console.log(`🗑️ Bid #${id} and all related records deleted by admin`);
    res.json({ success: true, message: "Bid and all related data deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error("❌ Error deleting bid:", err);
    res.status(500).json({ success: false, message: "Failed to delete bid", error: err.message });
  }
});

/* ------------------------------ PAYMENTS -------------------------------- */
router.get("/entry-payments", getAllPaymentsByBid);

/* ------------------------------ DASHBOARD ------------------------------- */
router.get("/dashboard-stats", getDashboardStats);

/* ----------------------------- CONTACT MESSAGES ------------------------- */
router.get("/contact-messages", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'unread',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [messages] = await db.query(
      "SELECT id, name, email, message, status, created_at FROM contact_messages ORDER BY created_at DESC"
    );
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    res.status(500).json({ success: false, message: "Failed to load contact messages." });
  }
});

router.put("/contact-messages/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE contact_messages SET status = 'read' WHERE id = ?", {
      replacements: [id],
    });
    res.json({ success: true, message: "Message marked as read." });
  } catch (error) {
    console.error("Failed to update message status:", error);
    res.status(500).json({ success: false, message: "Failed to update status." });
  }
});

router.delete("/contact-messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM contact_messages WHERE id = ?", {
      replacements: [id],
    });
    res.json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("Failed to delete message:", error);
    res.status(500).json({ success: false, message: "Failed to delete message." });
  }
});

router.post("/contact-messages/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    const [results] = await db.query("SELECT email, name FROM contact_messages WHERE id = ?", {
      replacements: [id],
    });

    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const originalMsg = results[0];

    const mailOptions = {
      from: `"Neural eAuction Support" <${process.env.EMAIL_USER}>`,
      to: originalMsg.email,
      subject: `Re: Your Inquiry - Neural eAuction`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #056973; text-align: center;">Support Response</h2>
          <p>Hello <strong>${originalMsg.name}</strong>,</p>
          <p>Thank you for contacting us. Here is our response to your inquiry:</p>
          <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #056973; margin: 20px 0; border-radius: 4px;">
            <p style="font-style: italic; color: #64748b; font-size: 14px;">"${replyMessage}"</p>
          </div>
          <p>Best regards,<br>The Neural eAuction Team</p>
          <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 10px; font-size: 11px; color: #94a3b8; text-align: center;">
            This is a secure response from Neural eAuction Support.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    await db.query("UPDATE contact_messages SET status = 'replied' WHERE id = ?", { replacements: [id] });

    res.json({ success: true, message: "Secure reply dispatched successfully." });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({ success: false, message: "Failed to dispatch reply." });
  }
});


/* ------------------------- BROKER PAYMENTS (FETCH) ----------------------- */
// ✔ Only fetch, no insert/update, no mark-paid
router.get("/broker-payments", getAllBrokerPayments);
router.get("/broker-payments/:id", getBrokerPaymentById);

/* ------------------------------------------------------------------------ */
router.post("/broker-payments/:bidId/approve", approveBrokerPayment);

export default router;
