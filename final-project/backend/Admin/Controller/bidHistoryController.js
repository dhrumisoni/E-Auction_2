import Winner from "../Models/Winner.js";
import User from "../Models/User.js";
import Bid from "../Models/Bid.js";
import Transaction from "../Models/Transaction.js";
import BidsLog from "../Models/BidsLog.js"; // make sure this model exists

// ✅ Get all completed bids (Winner history)
export const getCompletedBids = async (req, res) => {
  try {
    const winners = await Winner.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "surname", "email", "number"],
        },
        {
          model: Bid,
          as: "bid",
          attributes: [
            "id",
            "title",
            "description",
            "price",
            "image1_url",
            "status",
            "start_date",
            "end_date",
          ],
        },
        {
          model: Transaction,
          as: "transaction",
          attributes: ["id", "amount"],
        },
      ],
    });

    if (!winners.length) {
      return res.status(200).json({
        success: true,
        message: "No winner data found",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Winner history fetched successfully",
      data: winners,
    });
  } catch (error) {
    console.error("Error fetching winner history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching winner history",
      error: error.message,
    });
  }
};

// ✅ Get winner details for a particular bid
export const getBidLogsByBidId = async (req, res) => {
  try {
    const { bidId } = req.params;

    const winner = await Winner.findOne({
      where: { bid_id: bidId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "surname", "email", "number"],
        },
        {
          model: Bid,
          as: "bid",
          attributes: [
            "id",
            "title",
            "description",
            "price",
            "image1_url",
            "status",
            "start_date",
            "end_date",
          ],
        },
        {
          model: Transaction,
          as: "transaction",
          attributes: ["id", "amount"],
        },
      ],
    });

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: "No winner found for this bid",
      });
    }

    res.status(200).json({
      success: true,
      message: "Winner details fetched successfully",
      data: winner,
    });
  } catch (error) {
    console.error("Error fetching winner details by bidId:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching winner details",
      error: error.message,
    });
  }
};

// ✅ Get all bid logs (all participants)
export const getBidLogsWithUsers = async (req, res) => {
  try {
    const { bidId } = req.params;

    const logs = await BidsLog.findAll({
      where: { bid_id: bidId },
      order: [["price", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "surname", "email", "number"],
        },
        {
          model: Bid,
          as: "bid",
          attributes: ["id", "title", "start_date", "end_date"],
        },
      ],
    });

    if (!logs.length) {
      return res.status(404).json({
        success: false,
        message: "No bid logs found for this bid",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bid logs fetched successfully",
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching bid logs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bid logs",
      error: error.message,
    });
  }
};
