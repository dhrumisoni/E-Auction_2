import Bid from "../Models/Bid.js";
import User from "../Models/User.js";
import Category from "../Models/Category.js";

// ✅ Get all active bids
export const getActiveBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { status: "Active" },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email", "number"] },
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Active bids fetched successfully",
      data: bids,
    });
  } catch (error) {
    console.error("❌ Error fetching active bids:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get single active bid by ID
export const getActiveBidById = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Bid.findByPk(id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email", "number"] },
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
    });

    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    res.status(200).json({
      success: true,
      message: "Bid fetched successfully",
      data: bid,
    });
  } catch (error) {
    console.error("❌ Error fetching bid by ID:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
