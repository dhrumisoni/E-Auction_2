import Winner from "../Models/Winner.js";
import User from "../Models/User.js";
import Bid from "../Models/Bid.js";
import Transaction from "../Models/Transaction.js";

// ============================
//  GET ALL WINNERS
// ============================
export const getAllWinners = async (req, res) => {
try {
const winners = await Winner.findAll({
include: [
{ model: User, as: "user", attributes: ["id", "name", "email", "number"] },
{ model: Bid, as: "bid", attributes: ["id", "title", "price", "end_date", "image1_url", "image2_url", "image3_url", "image4_url"] },
{ model: Transaction, as: "transaction", attributes: ["id", "amount"] },
],
order: [["id", "DESC"]],
});


const formatted = winners.map((w) => {
const imageFields = [
w.bid?.image1_url,
w.bid?.image2_url,
w.bid?.image3_url,
w.bid?.image4_url,
].filter(Boolean);


const imageUrls = imageFields.map((img) => {
if (!img.startsWith("http")) {
img = img.replace(/^\/+/, "");
return `http://localhost:5000/photos/${img.split("/").pop()}`;
}
return img;
});


return {
id: w.id,
itemName: w.bid?.title || "N/A",
images: imageUrls,
winnerName: w.user?.name || "N/A",
winnerEmail: w.user?.email || "N/A",
winnerPhone: w.user?.number || "N/A",
winningAmount: w.transaction?.amount || w.bid?.price || 0,
currency: "INR",
endDate: w.bid?.end_date || null,
winDate: w.bid?.end_date || null,
invoiceUrl: `/invoices/${w.id}.pdf`,
};
});


res.status(200).json({ success: true, data: formatted });
} catch (error) {
console.error("Error fetching winners:", error);
res.status(500).json({ success: false, message: "Failed to fetch winner data.", error: error.message });
}
};



// ============================
//  GET SINGLE WINNER BY ID
// ============================
export const getWinnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const winner = await Winner.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "number"],
        },
        {
          model: Bid,
          as: "bid",
          attributes: [
            "id",
            "title",
            "price",
            "end_date",
            "image1_url",
            "image2_url",
            "image3_url",
            "image4_url",
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
      return res.status(404).json({ success: false, message: "Winner not found" });
    }

    const imageFields = [
      winner.bid?.image1_url,
      winner.bid?.image2_url,
      winner.bid?.image3_url,
      winner.bid?.image4_url,
    ].filter(Boolean);

    const imageUrls = imageFields.map((img) => {
      if (!img.startsWith("http")) {
        img = img.replace(/^\/+/, "");
        return `http://localhost:5000/photos/${img.split("/").pop()}`;
      }
      return img;
    });

    const formatted = {
      id: winner.id,
      itemName: winner.bid?.title || "N/A",
      images: imageUrls,
      winnerName: winner.user?.name || "N/A",
      winnerEmail: winner.user?.email || "N/A",
      winnerPhone: winner.user?.number || "N/A",
      winningAmount: winner.transaction?.amount || winner.bid?.price || 0,
      currency: "INR",
      endDate: winner.bid?.end_date || null,
      winDate: winner.bid?.end_date || null,
      invoiceUrl: `/invoices/${winner.id}.pdf`,
    };

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error fetching single winner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch winner details.",
      error: error.message,
    });
  }
};

// ============================
//  MARK WINNER AS PAID
// ============================
export const markWinnerPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const winner = await Winner.findOne({ where: { id } });
    if (!winner) {
      return res.status(404).json({ success: false, message: "Winner not found" });
    }

    // Update payment status
    winner.payment_status = "Paid";
    await winner.save();

    res.status(200).json({
      success: true,
      message: "Winner payment marked as Paid successfully",
    });
  } catch (error) {
    console.error("Error marking winner as paid:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
      error: error.message,
    });
  }
};

