// backend/helpers/autoBidProcessor.js
import sequelize from "../Config/db.js"; // your sequelize instance
import Bid from "../Models/Bid.js";
import BidLogs from "../Models/BidsLogs.js";
import AutoBid from "../Models/AutoBids.js";
import { Op } from "sequelize";

export async function processAutoBids(bidId) {
  const MAX_ITER = 6;
  let iter = 0;

  while (iter++ < MAX_ITER) {
    const t = await sequelize.transaction();
    try {
      // lock auction row
      const auction = await Bid.findOne({
        where: { id: bidId },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      if (!auction) { await t.rollback(); return; }

      const currentPrice = Number(auction.current_price || auction.price || 0);
      const minInc = Number(auction.min_increment || 1);

      // fetch active autobids who can beat current price
      const autoRows = await AutoBid.findAll({
        where: { bid_id: bidId, active: true, max_bid: { [Op.gt]: currentPrice } },
        order: [["max_bid", "DESC"]],
        transaction: t,
        lock: t.LOCK.SHARE
      });

      if (!autoRows.length) { await t.commit(); return; }

      // ignore autobid from current highest bidder as top (we will let others challenge)
      // determine top and second top max
      const top = autoRows[0];
      const secondMax = autoRows.length > 1 ? Number(autoRows[1].max_bid) : currentPrice;

      // if top is already highest bidder, but second can outbid top's current price, allow second to be considered
      if (Number(auction.highest_bidder) === Number(top.user_id)) {
        if (secondMax <= currentPrice) { await t.commit(); return; }
        // swap so second becomes top for current iteration
        // this ensures competitor can auto-bid up
        // create a virtual top with max = secondMax and user = second.user_id
      }

      // compute next bid for top:
      const desired = Math.min(Number(top.max_bid), Math.max(currentPrice + minInc, Number(secondMax) + minInc));

      if (desired <= currentPrice) { await t.commit(); return; }

      // Insert bid log
      await BidLogs.create({
        bid_id: bidId,
        user_id: top.user_id,
        price: desired,
        created_at: new Date()
      }, { transaction: t });

      // Update auction current_price and highest_bidder
      auction.current_price = desired;
      auction.highest_bidder = top.user_id;
      await auction.save({ transaction: t });

      // update auto bid last info
      top.last_bid_amount = desired;
      top.last_bid_at = new Date();
      await top.save({ transaction: t });

      await t.commit();
      // loop continues to see if someone else can outbid
    } catch (err) {
      await t.rollback();
      console.error("processAutoBids error", err);
      return;
    }
  }
}
