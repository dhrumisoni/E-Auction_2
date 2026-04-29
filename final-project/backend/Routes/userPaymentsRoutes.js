// backend/Routes/userPaymentsRoutes.js
import express from "express";
import fetch from "node-fetch";
import db from "../Config/db.js";
import { QueryTypes } from "sequelize";
const router = express.Router();

function getCreds() {
  return {
    client: process.env.PAYPAL_CLIENT_ID,
    secret: process.env.PAYPAL_SECRET
  };
}

const BASE_URL = process.env.PAYPAL_API || "https://api-m.sandbox.paypal.com";

function resolveUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.query && req.query.userId) return req.query.userId;
  if (req.body && req.body.userId) return req.body.userId;
  return null;
}

// Generate Access Token
async function generateAccessToken() {
    const { client, secret } = getCreds();

  if (!client || !secret) {
    throw new Error("Missing PayPal credentials");
  }
  const auth = Buffer.from(`${client}:${secret}`).toString("base64");

  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  if (data.error) throw new Error(JSON.stringify(data));
  return data.access_token;
}

// CREATE ORDER (no DB insert here)
router.post("/create-order", async (req, res) => {
  try {
    const { auctionId } = req.body;
    if (!auctionId) return res.status(400).json({ error: "Missing auctionId" });

    const accessToken = await generateAccessToken();

    const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: "6.00" } // use INR 500
          }
        ],
      }),
    });

    const order = await response.json();
    return res.json(order);
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ error: err.message || err });
  }
});

// CAPTURE PAYMENT (insert paid record)

router.post("/capture-order", async (req, res) => {
  try {
    const { orderID, auctionId } = req.body;
    const userId = resolveUserId(req);

    if (!orderID || !auctionId || !userId)
      return res.status(400).json({ error: "Missing orderID, auctionId, or user" });

    const accessToken = await generateAccessToken();

    const response = await fetch(`${BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const capture = await response.json();
    const status =
      capture.status ||
      (capture.purchase_units && capture.purchase_units[0]?.payments?.captures?.[0]?.status);

    if (status === "COMPLETED") {
      // idempotency check (order_id or capture_id)
      const captureObj = capture.purchase_units?.[0]?.payments?.captures?.[0] || null;
      const captureId = captureObj?.id || null;

      const existing = await db.query(
        `SELECT id FROM user_payments_for_bid WHERE order_id = :orderID OR capture_id = :captureId LIMIT 1`,
        { replacements: { orderID, captureId }, type: QueryTypes.SELECT }
      );

      if (existing && existing.length) {
        return res.json({ success: true, alreadyRecorded: true, capture });
      }

      const insertSql = `
        INSERT INTO user_payments_for_bid (user_id, bid_id, amount, currency)
        VALUES (:userId, :auctionId, :amount)
      `;
      await db.query(insertSql, {
        replacements: {
          userId,
          auctionId,
          amount:500
        },
        type: QueryTypes.INSERT,
      });

      return res.json({ success: true, capture });
    }

    return res.status(400).json({ success: false, capture });
  } catch (err) {
    console.error("capture-order error:", err);
    return res.status(500).json({ error: err.message || err });
  }
});

// STATUS
router.get("/status", async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const auctionId = req.query.auctionId;
    if (!userId || !auctionId) return res.json({ paid: false });

    const rows = await db.query(
      `SELECT 1 FROM user_payments_for_bid WHERE user_id = :userId AND bid_id = :auctionId LIMIT 1`,
      { replacements: { userId, auctionId }, type: QueryTypes.SELECT }
    );

    return res.json({ paid: !!(rows && rows.length) });
  } catch (err) {
    console.error("status error:", err);
    return res.status(500).json({ paid: false });
  }
});

export default router;
