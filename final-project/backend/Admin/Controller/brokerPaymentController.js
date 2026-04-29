// backend/Admin/Controller/brokerPaymentController.js

import BidsLog from "../Models/BidsLog.js";
import Bid from "../Models/Bid.js";
import User from "../Models/User.js";
import City from "../Models/City.js";
import Transaction from "../Models/Transaction.js";
import BrokerPayment from "../Models/BrokerPayment.js";
import sendEmail from "../../Config/sendEmail.js";
import { Op } from "sequelize";

/* ===============================================
   GET ALL BROKER PAYMENTS
================================================ */
export const getAllBrokerPayments = async (req, res) => {
  try {
    const now = new Date();

    const paidPayments = await BrokerPayment.findAll({
      attributes: ["bid_id"]
    });

    const paidBidIds = paidPayments.map((p) => p.bid_id);

    const completedBids = await Bid.findAll({
      where: {
        end_date: { [Op.lte]: now },
        status: "Completed",
        id: { [Op.notIn]: paidBidIds },
      },
      attributes: ["id", "title", "price", "user_id"],
    });

    if (!completedBids.length) {
      return res.json({ success: true, data: [] });
    }

    const results = [];

    for (const bid of completedBids) {
      const topBid = await BidsLog.findOne({
        where: { bid_id: bid.id },
        order: [["price", "DESC"]],
        include: [
          {
            model: User,
            as: "user",
            include: [{ model: City, as: "city" }],
          },
        ],
      });

      if (!topBid) continue;

      const finalPrice = Number(topBid.price);
      const commissionRate = finalPrice <= 1000000 ? 1 : 0.5;
      const commissionAmount = (finalPrice * commissionRate) / 100;

      const seller = await User.findOne({
        where: { id: bid.user_id },
        include: [{ model: City, as: "city" }],
      });

      results.push({
        bidId: bid.id,
        bidTitle: bid.title,
        finalPrice,
        commissionAmount,
        commissionRate,
        winner: topBid.user,
        seller,
      });
    }

    return res.json({ success: true, data: results });
  } catch (error) {
    console.error("getAllBrokerPayments Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ===============================================
    GET SINGLE PAYMENT DETAILS + SEND REMINDER EMAIL
================================================ */
export const getBrokerPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const bid = await Bid.findOne({
      where: { id },
      attributes: ["id", "title", "price", "user_id"],
    });

    if (!bid)
      return res.status(404).json({ success: false, message: "Bid not found" });

    const topBid = await BidsLog.findOne({
      where: { bid_id: id },
      order: [["price", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          include: [{ model: City, as: "city" }],
        },
      ],
    });

    const seller = await User.findOne({
      where: { id: bid.user_id },
      include: [{ model: City, as: "city" }],
    });

    const finalPrice = Number(topBid.price);
    const commissionRate = finalPrice <= 1000000 ? 1 : 0.5;
    const commissionAmount = (finalPrice * commissionRate) / 100;

    // ⭐⭐⭐ ADDED REMINDER EMAIL HERE ⭐⭐⭐
    await sendEmail(
      topBid.user.email,
      "Payment Reminder - You Won the Auction!",
      `
        <h2>Congratulations!</h2>
        <p>You have won the auction for <b>${bid.title}</b>.</p>

        <h3>⚠ Payment Reminder</h3>
        <p>You must complete the commission payment within the next <b>3 days</b>.</p>

        <p><b>Final Price:</b> ₹${finalPrice.toLocaleString()}</p>
        <p><b>Commission Payable:</b> ₹${commissionAmount.toLocaleString()}</p>

        <br/>
        <p>Thank you,<br/><b>E-Auction Team</b></p>
      `
    );

    return res.json({
      success: true,
      data: {
        bidId: bid.id,
        bidTitle: bid.title,
        finalPrice,
        commissionRate,
        commissionAmount,
        winner: topBid.user,
        seller,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ===============================================
    APPROVE PAYMENT
================================================ */
export const approveBrokerPayment = async (req, res) => {
  try {
    const { bidId } = req.params;

    const topBid = await BidsLog.findOne({
      where: { bid_id: bidId },
      order: [["price", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          include: [{ model: City, as: "city" }],
        },
      ],
    });

    if (!topBid)
      return res.status(404).json({ success: false, message: "Top bid not found" });

    const bid = await Bid.findOne({ where: { id: bidId } });

    const seller = await User.findOne({
      where: { id: bid.user_id },
      include: [{ model: City, as: "city" }],
    });

    const finalPrice = Number(topBid.price);
    const commissionRate = finalPrice <= 1000000 ? 1 : 0.5;
    const commissionAmount = (finalPrice * commissionRate) / 100;

    await Transaction.create({
      bid_id: bidId,
      user_id: topBid.user_id,
      amount: finalPrice,
    });

    await BrokerPayment.create({
      bid_id: bidId,
      user_id: topBid.user_id,
      final_price: finalPrice,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      status: "Paid",
    });

    await sendEmail(
      seller.email,
      "Your Auction Item Has Been Sold!",
      `
      <h2>Congratulations!</h2>
      <p>Your auction item <b>${bid.title}</b> has been purchased.</p>

      <h3>Buyer Details</h3>
      <p>Name: ${topBid.user.name}</p>
      <p>Email: ${topBid.user.email}</p>
      <p>Phone: ${topBid.user.phone}</p>
      <p>City: ${topBid.user.city?.name}</p>

      <h3>Payment</h3>
      <p>Final Price: ₹${finalPrice.toLocaleString()}</p>
      <p>Commission Paid: ₹${commissionAmount.toLocaleString()}</p>
    `
    );

    await sendEmail(
      topBid.user.email,
      "Purchase Confirmed - Auction Winner",
      `
      <h2>Purchase Successful!</h2>
      <p>You won <b>${bid.title}</b>.</p>

      <h3>Seller Details</h3>
      <p>Name: ${seller.name}</p>
      <p>Email: ${seller.email}</p>
      <p>Phone: ${seller.phone}</p>
      <p>City: ${seller.city?.name}</p>

      <h3>Payment Summary</h3>
      <p>Final Price: ₹${finalPrice.toLocaleString()}</p>
      <p>Commission Paid: ₹${commissionAmount.toLocaleString()}</p>
    `
    );

    return res.json({
      success: true,
      message: "Payment approved, stored, and emails sent!",
    });
  } catch (error) {
    console.error("approveBrokerPayment Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
