// backend/Helper/auctionCloser.js
// Scheduled job that auto-closes expired auctions, picks winners, and sends emails.

import { Op } from "sequelize";
import sequelize from "../Config/db.js";
import Bid from "../Admin/Models/Bid.js";
import BidsLog from "../Admin/Models/BidsLog.js";
import User from "../Admin/Models/User.js";
import Winner from "../Admin/Models/Winner.js";
import AutoBid from "../Models/AutoBids.js";
import { sendEmail } from "../Config/sendEmail.js";

/**
 * Ensures the `status` ENUM column in the `bids` table includes "Ended".
 * Safe to call repeatedly — it only alters if needed.
 */
async function ensureEndedEnum() {
  try {
    // MySQL syntax to modify the ENUM
    await sequelize.query(
      `ALTER TABLE bids MODIFY COLUMN status ENUM('Requested','Active','Rejected','Ended') NOT NULL`
    );
    console.log("✅ 'Ended' status added to bids ENUM (or already present)");
  } catch (err) {
    // If it fails (e.g. already has the value, or PostgreSQL), log and continue
    console.warn("⚠️  Could not alter bids ENUM (may already include 'Ended'):", err.message);
  }
}

/**
 * Ensures the 'winners' table allows NULL for transaction_id.
 * When an auction ends, we record the winner immediately, 
 * but the payment (transaction) happens later.
 */
async function ensureWinnerSchema() {
  try {
    // MySQL syntax to make column nullable
    await sequelize.query(
      `ALTER TABLE winners MODIFY COLUMN transaction_id INT NULL`
    );
    console.log("✅ 'winners' table updated: transaction_id is now nullable");
  } catch (err) {
    console.warn("⚠️  Could not alter winners table:", err.message);
  }
}

/**
 * Main function — finds all auctions where end_date has passed
 * but status is still "Active", then:
 *   1. Sets status → "Ended"
 *   2. Finds highest bidder from bids_logs
 *   3. Creates a Winner record
 *   4. Deactivates auto-bids for that auction
 *   5. Sends emails to winner & seller
 */
export async function closeExpiredAuctions() {
  const now = new Date();

  try {
    // Find all expired-but-still-active auctions
    const expiredBids = await Bid.findAll({
      where: {
        status: "Active",
        end_date: { [Op.lt]: now },
      },
    });

    if (expiredBids.length === 0) return; // nothing to do

    console.log(`⏰ Found ${expiredBids.length} expired auction(s) to close...`);

    for (const bid of expiredBids) {
      const t = await sequelize.transaction();

      try {
        // 1️⃣ Update status to "Ended"
        bid.status = "Ended";
        await bid.save({ transaction: t });

        // 2️⃣ Find the highest bid from bids_logs
        const highestBidLog = await BidsLog.findOne({
          where: { bid_id: bid.id },
          order: [["price", "DESC"]],
          transaction: t,
        });

        // 3️⃣ Deactivate all auto-bids for this auction
        await AutoBid.update(
          { active: false },
          { where: { bid_id: bid.id }, transaction: t }
        );

        if (highestBidLog) {
          // 4️⃣ Check if a winner record already exists for this bid
          const existingWinner = await Winner.findOne({
            where: { bid_id: bid.id },
            transaction: t,
          });

          if (!existingWinner) {
            // 5️⃣ Create winner record
            await Winner.create(
              {
                bid_id: bid.id,
                user_id: highestBidLog.user_id,
                transaction_id: null, // payment comes later
              },
              { transaction: t }
            );
          }

          // 6️⃣ Send email to the winner
          try {
            const winner = await User.findByPk(highestBidLog.user_id, { transaction: t });
            if (winner && winner.email) {
              const winnerSubject = `🎉 Congratulations! You won the auction for "${bid.title}"`;
              const winnerHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #056973, #0a8f9c); padding: 30px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0;">🏆 You Won!</h1>
                  </div>
                  <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 12px 12px;">
                    <h2 style="color: #1f2937;">Hello ${winner.name},</h2>
                    <p style="color: #4b5563;">Congratulations! You are the <strong>highest bidder</strong> and have won the auction.</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                      <h3 style="color: #056973; margin-top: 0;">📌 Auction Details</h3>
                      <p><strong>Item:</strong> ${bid.title}</p>
                      <p><strong>Your Winning Bid:</strong> ₹${Number(highestBidLog.price).toLocaleString("en-IN")}</p>
                      <p><strong>Auction Ended:</strong> ${new Date(bid.end_date).toLocaleString("en-IN")}</p>
                    </div>

                    <p style="color: #4b5563;">Our team will contact you shortly regarding payment and delivery.</p>
                    <br>
                    <p style="color: #6b7280;">Regards,<br><strong>E-Auction Team</strong></p>
                  </div>
                </div>
              `;
              await sendEmail(winner.email, winnerSubject, winnerHtml);
              console.log(`📩 Winner email sent to ${winner.email} for bid #${bid.id}`);
            }
          } catch (emailErr) {
            console.error(`⚠️  Failed to send winner email for bid #${bid.id}:`, emailErr.message);
          }
        }

        // 7️⃣ Send email to the seller (bid creator)
        try {
          const seller = await User.findByPk(bid.user_id, { transaction: t });
          if (seller && seller.email) {
            const hasWinner = !!highestBidLog;
            const sellerSubject = `📢 Your auction "${bid.title}" has ended`;
            const sellerHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #056973, #0a8f9c); padding: 30px; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0;">Auction Ended</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 12px 12px;">
                  <h2 style="color: #1f2937;">Hello ${seller.name},</h2>
                  <p style="color: #4b5563;">Your auction for <strong>${bid.title}</strong> has ended.</p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                    <h3 style="color: #056973; margin-top: 0;">📌 Results</h3>
                    ${hasWinner
                      ? `<p><strong>Winning Bid:</strong> ₹${Number(highestBidLog.price).toLocaleString("en-IN")}</p>
                         <p><strong>Status:</strong> <span style="color: green;">Winner Found ✅</span></p>`
                      : `<p><strong>Status:</strong> <span style="color: #dc2626;">No bids were placed ❌</span></p>`
                    }
                    <p><strong>Auction Ended:</strong> ${new Date(bid.end_date).toLocaleString("en-IN")}</p>
                  </div>

                  ${hasWinner
                    ? `<p style="color: #4b5563;">The winner will be contacted for payment. You will receive your payout after confirmation.</p>`
                    : `<p style="color: #4b5563;">You may choose to relist this item for a future auction.</p>`
                  }
                  <br>
                  <p style="color: #6b7280;">Regards,<br><strong>E-Auction Team</strong></p>
                </div>
              </div>
            `;
            await sendEmail(seller.email, sellerSubject, sellerHtml);
            console.log(`📩 Seller email sent to ${seller.email} for bid #${bid.id}`);
          }
        } catch (emailErr) {
          console.error(`⚠️  Failed to send seller email for bid #${bid.id}:`, emailErr.message);
        }

        await t.commit();
        console.log(`✅ Auction #${bid.id} ("${bid.title}") closed successfully${highestBidLog ? ` — Winner: user #${highestBidLog.user_id}` : " — No bids placed"}`);

      } catch (err) {
        await t.rollback();
        console.error(`❌ Failed to close auction #${bid.id}:`, err.message);
      }
    }
  } catch (err) {
    console.error("❌ closeExpiredAuctions error:", err.message);
  }
}

/**
 * Initialize the auction closer:
 *  - Ensure "Ended" ENUM exists
 *  - Run once immediately
 *  - Then run every 60 seconds
 */
export async function startAuctionScheduler() {
  console.log("🚀 Starting auction auto-close scheduler...");

  // Ensure the DB ENUM supports "Ended"
  await ensureEndedEnum();

  // Ensure winners table allows null transaction_id
  await ensureWinnerSchema();

  // Run once on startup
  await closeExpiredAuctions();

  // Then every 60 seconds
  setInterval(closeExpiredAuctions, 60 * 1000);

  console.log("✅ Auction scheduler running (checks every 60 seconds)");
}
