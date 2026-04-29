import UserPayment from "../Models/UserPayment.js";
import User from "../Models/User.js";
import Bid from "../Models/Bid.js";

// ✅ Fetch all products that have entry payments
export const getAllPaymentsByBid = async (req, res) => {
  try {
    const payments = await UserPayment.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "name", "surname", "email"] },
        { model: Bid, as: "bid", attributes: ["id", "title"] }
      ],
      order: [["bid_id", "ASC"]]
    });

    // Group payments by bid
    const grouped = {};
    payments.forEach(p => {
      const bidId = p.bid.id;
      if (!grouped[bidId]) {
        grouped[bidId] = {
          bidId,
          bidName: p.bid.title,
          users: []
        };
      }
      grouped[bidId].users.push({
        id: p.user.id,
        name: `${p.user.name} ${p.user.surname}`,
        email: p.user.email,
        amount: p.amount
      });
    });

    res.status(200).json({
      success: true,
      data: Object.values(grouped)
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, message: "Error fetching payments" });
  }
};
